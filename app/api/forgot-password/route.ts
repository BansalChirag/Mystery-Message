
import dbConnect from '@/db/dbConnect';
import User from '@/models';
import { sendResetPasswordEmail } from '@/sendResetPasswordEmail';
import { NextRequest, NextResponse } from 'next/server'



export const POST = async (request: NextRequest) => {
  await dbConnect()
  try{

    const {email} = await request.json();
    
    const isUser = await User.findOne({email});
    
    if(!isUser){
        return NextResponse.json({success:false,message:"User with this email id not found"})
    }
    await sendResetPasswordEmail({email, userId: isUser._id.toString()})
    return NextResponse.json({success:true,message:"Link sent on your email."});
  }catch(err:any){
    return NextResponse.json({success:false,message:err.message})
  }
}

