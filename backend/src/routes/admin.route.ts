import express, { Request, Response, NextFunction } from 'express';
import { getUsers, approveUser } from '../controllers/admin.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { AuthRequest } from '../interfaces/Auth.interface.js';

const router = express.Router();

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

router.use(protect);
router.use(isAdmin);

router.get('/users', getUsers);
router.put('/users/:id/approve', approveUser);

export default router;
