import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(session.user._id).select("messages");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Always succeed for an existing user; just return an empty array if no messages yet
    return Response.json(
      {
        success: true,
        message: user.messages ?? [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get messages error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}