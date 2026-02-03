import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUp";


const querySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request){
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username") || ""
        }
        //validate with zod
        const result = querySchema.safeParse(queryParam);
        if(!result.success){
            const nameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:nameErrors.join(", ")
            }, {status:400});
        }
        const {username} = result.data;
        
        const existingVerifiedUser = await UserModel.findOne({userName:username,isVerified:true});
        
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            }, {status:200});
        }
        return Response.json({
            success:true,
            message:"Username is available"
        }, {status:200});
    }
    catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({
            success:false,
            message:"Error checking username uniqueness"
        }, {status:500});
        
    }
}