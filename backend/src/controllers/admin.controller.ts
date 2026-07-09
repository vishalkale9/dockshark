import { Request, Response } from 'express';
import { User } from '../models/User.js';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error while fetching users' });
    }
};

export const approveUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        user.isApproved = isApproved;
        await user.save();

        res.json({ message: `User ${isApproved ? 'approved' : 'revoked'} successfully`, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server error while updating user approval' });
    }
};
