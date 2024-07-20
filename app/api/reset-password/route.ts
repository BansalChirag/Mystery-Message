import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import User from "@/models";



export async function POST(request: NextRequest){
    try{
        const {newPassword,confirmNewPassword,token} = await request.json();
        if(!token){
            return NextResponse.json({success:false,message:"Missing Token!"});
        }
        const user = await User.findOne({forgotPasswordToken:token, forgotPasswordTokenExpiry: {$gt:Date.now()}})
        
        if (!user) {
            return NextResponse.json({success:false, message: "Invalid Token." });
        }

        if(newPassword!==confirmNewPassword){
            return NextResponse.json({success:false,message:"Passwords don't match"});
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        const isUpdated = await User.findByIdAndUpdate(user._id,{
            $set:{
                password: hashedPassword
            }
        })
        if(isUpdated){
            await User.findByIdAndUpdate(user._id,{
                $unset: {
                    forgotPasswordToken: "",
                    forgotPasswordTokenExpiry: ""
                }
            })
            await user.save()
            return NextResponse.json({success:true, message:"Password Reset Successfully."});
        }else{
            return NextResponse.json({success:false, message:"Something went wrong"});
        }

    }catch(error:any){
        return NextResponse.json({success:false,message:error.message})
    }
}