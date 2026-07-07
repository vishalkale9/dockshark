import { Request } from 'express';
import { IUser } from './User.interface.js';

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

export interface AuthRequest extends Request {
    user?: IUser;
}
