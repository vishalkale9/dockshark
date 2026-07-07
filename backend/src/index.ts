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

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

//health check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: "Dockshark API is running!🚀" })
});


app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}✅`);
})

