import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUp";



export async function POST(req:Request) {
    await dbConnect();
    try {
        const {username,code} = await req.json();
        const user = await UserModel.findOne({userName: username});

        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            }, {status:200});
        }
        const isCodeVerified = user.verifyCode === code;
        const isCodeExpired = user.verifyCodeExpiry < new Date();
        if(!isCodeVerified){
            return Response.json({
                success:false,
                message:"Invalid verification code"
            }, {status:200});
        }
        if(isCodeExpired){
            return Response.json({
                success:false,
                message:"Verification code has expired please Sign up again to get a new code"
            }, {status:200});

        }
        user.isVerified = true;
        await user.save();
        return Response.json({
            success:true,
            message:"User verified successfully"
        }, {status:200});

    } catch (error) {
        console.error("Error verifying code:", error);
        return Response.json({
            success:false,
            message:"Error verifying user"
        }, {status:500});
    }

}