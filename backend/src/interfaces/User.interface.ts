import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    role: "user" | "admin" | "superadmin";
    isApproved: boolean;

    comparePassword(candidatePassword: string): Promise<boolean>;
}
