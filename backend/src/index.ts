import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import batchRoutes from './routes/batch.routes.js';
import anchorRoutes from './routes/anchor.routes.js';
import verifyRoutes from './routes/verify.routes.js';
import adminRoutes from './routes/admin.route.js';

app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL || ''
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/anchor', anchorRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/admin', adminRoutes);

//health check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: "Dockshark API is running!🚀" })
});


app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}✅`);
})

