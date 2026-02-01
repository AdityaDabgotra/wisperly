import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Enter your Username" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any):Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    });
                    if(!user){
                        throw new Error("No user found with the given credentials");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your email to login");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error("Incorrect password");
                    }
                } catch (error:any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks:{
        async jwt({ token, user }) {
            if(user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages; 
            }

            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
            }
            return session
        }
    },
    pages: {
        signIn: "/signIn",
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}