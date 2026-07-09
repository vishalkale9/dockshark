import { Request } from 'express';
import { IUser } from './User.interface.js';

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    token: string;
}

export interface AuthRequest extends Request {
    user?: IUser;
}
