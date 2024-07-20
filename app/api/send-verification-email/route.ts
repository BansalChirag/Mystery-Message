import dbConnect from "@/db/dbConnect";
import User from "@/models";
import { sendVerificationEmail } from "@/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(request: NextRequest)=>{
    await dbConnect();
    try {
        const {email,username} = await request.json();
        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json({success:false,message: "No user found"})
        }
        let verifyCode = Math.floor(1000 + Math.random()*9000).toString()
        user.verifyCode = verifyCode
        user?.save()
        const response = await sendVerificationEmail({email,username,verifyCode})  
        if(response?.success){
            return NextResponse.json(
                { success: true, message: 'Verification email sent successfully.' }
            )
        }  else{
            return NextResponse.json(
                { success: false, message: `Error in sending email to ${email}.` }
            )
        }
    } catch (error) {
        console.error("Something went wrong!", error);
        return NextResponse.json({ success: false, message: "Something went wrong!" });
    }
    
}