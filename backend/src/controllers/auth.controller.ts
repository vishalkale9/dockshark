import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const responseData = await AuthService.signup(req.body);
        res.status(201).json(responseData);
    } catch (error: any) {
        // Simple error message mapping for common expected errors
        if (error.message === "Please provide all required fields" || 
            error.message === "User already exists" ||
            error.message === "Invalid user data") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message || 'Server error during signup' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const responseData = await AuthService.login(req.body);
        res.json(responseData);
    } catch (error: any) {
        if (error.message === "Please provide email and password" || 
            error.message === "Invalid email or password") {
            res.status(401).json({ message: error.message }); // 401 for unauthorized/bad credentials
        } else {
            res.status(500).json({ message: error.message || 'Server error during login' });
        }
    }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;
        const responseData = await AuthService.googleLogin(token);
        res.json(responseData);
    } catch (error: any) {
        if (error.message === "Please provide a Google token" ||
            error.message === "Invalid Google token payload" ||
            error.message === "Email or name not provided by Google") {
            res.status(400).json({ message: error.message });
        } else {
            console.error("Google login error:", error);
            res.status(500).json({ message: "Failed to authenticate with Google" });
        }
    }
};
