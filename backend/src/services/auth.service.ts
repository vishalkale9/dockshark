import { User } from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/jwt.util.js';
import { AuthResponse } from '../interfaces/Auth.interface.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
    static async signup(data: any): Promise<AuthResponse> {
        const { name, email, password, role } = data;

        if (!name || !email || !password) {
            throw new Error("Please provide all required fields");
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new Error("User already exists");
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        if (!user) {
            throw new Error("Invalid user data");
        }

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        };
    }

    static async login(data: any): Promise<AuthResponse> {
        const { email, password } = data;

        if (!email || !password) {
            throw new Error("Please provide email and password");
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
             throw new Error("Invalid email or password");
        }

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        };
    }

    static async googleLogin(token: string): Promise<AuthResponse> {
        if (!token) {
            throw new Error("Please provide a Google token");
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        if (!payload) {
             throw new Error("Invalid Google token payload");
        }

        const { sub, email, name, picture } = payload;
        
        if (!email || !name) {
             throw new Error("Email or name not provided by Google");
        }

        let user = await User.findOne({ email });

        if (user) {
            // User exists, update googleId if not present
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId: sub,
            });
        }

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        };
    }
}
