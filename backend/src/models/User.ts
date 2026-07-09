import mongoose, { Schema, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/User.interface.js";

// 2. Define the Mongoose Schema
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, // Prevents duplicate emails in the DB
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            // 'select: false' means when you do User.find(), it won't accidentally 
            // send the password back to the frontend!
            select: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null/undefined values
        },
        role: {
            type: String,
            enum: ["user", "admin", "superadmin"],
            default: "user",
        },
        isApproved: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
);

// 3. Pre-Save Hook (Hashes the password before saving to the database)
// Notice: We removed 'next' from the arguments!
UserSchema.pre("save", async function (this: HydratedDocument<IUser>) {
    // If the user didn't modify their password, just return (which acts like next())
    if (!this.isModified("password") || !this.password) {
        return;
    }
    // We don't need a try/catch block here because Mongoose automatically 
    // catches errors thrown inside async pre-hooks!
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 4. Instance Method (Checks if the password is correct during login)
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;

    // Compares the plain-text string to the hashed password in the DB
    return await bcrypt.compare(candidatePassword, this.password);
};

// 5. Export the Model
export const User = mongoose.model<IUser>("User", UserSchema);
