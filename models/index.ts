import mongoose, { Schema } from "mongoose";

export interface Message {
  content: string;
  createdAt: Date;
}

export interface UserInterface {
  username: string;
  email: string;
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  messages: Message[];
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const userSchema: Schema<UserInterface> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
  },

  verifyCodeExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [messageSchema],
});

const User =
  (mongoose.models.User as mongoose.Model<UserInterface>) ||
  mongoose.model<UserInterface>("User", userSchema);

export default User;
