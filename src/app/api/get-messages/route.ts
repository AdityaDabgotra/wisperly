import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    const userId = new mongoose.Types.ObjectId(session?.user._id);

    if (!session || !session.user || !userId) {
        return  Response.json({ 
            success: false,
            message: "Not Authenticated" 
        }),
        { status: 401 };
    }

    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id',messages: {$push: '$messages'}}}
        ])

        if(!user || user.length === 0){
            return  Response.json({
                success: false,
                message: "User not found",
            }),
            { status: 404 };
        }
        return Response.json({
            success: true,
            message: user[0].messages,
        }),
        { status: 200 };
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal Server Error",
            }),
            { status: 500 }
        );
        
    }
}