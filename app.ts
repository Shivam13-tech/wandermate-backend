import express from 'express';
import authRouter from './Routes/authRoutes';
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors());

app.use('/api',authRouter)



export default app;
