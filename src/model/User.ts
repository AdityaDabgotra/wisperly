import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required :true,
        default: Date.now
    }
})


export interface User extends Document{
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true,"Username is Required"],
        trim:true,
        unique: true
    },
    email: {
        type: String,
        required: [true,"Email is Required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"Please use a valid Email address"]
    },
    password: {
        type: String,
        required: [true,"Password is Required"]
    },
    verifyCode: {
        type: String,
        required: [true,"Verify Code is Required"]
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,"Verify code Expiry is Required"]
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel;