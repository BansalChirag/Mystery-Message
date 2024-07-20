import User from '@/models'
import {NextAuthOptions} from 'next-auth'
import CredentialsProvider  from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/dbConnect'
import { NextResponse } from 'next/server'

export const authOptions: NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try{
                    const isUser = await User.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })
                    if(!isUser){
                        throw new Error("Invalid Credentials.")
                        // return NextResponse.json({success:"false",message:"No user found."})
                    }
                    if(!isUser.isVerified){
                        throw new Error("Please verify your account before login.")
                        // return NextResponse.json({success:"false",message:"Account not verified yet."})
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password,isUser.password);

                    if(isPasswordCorrect){
                        return isUser;
                    }else{
                        // return NextResponse.json({success:"false",message:"Invalid Credentials"})
                        throw new Error('Invalid Credentials')
                    }
                }catch(err:any){
                    throw new Error(err)
                    // return NextResponse.json({success:"false",message:err})
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            
            return token;
        },
        async session({session,token,user}){
            
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session;
        },
    
    },
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
      },
}