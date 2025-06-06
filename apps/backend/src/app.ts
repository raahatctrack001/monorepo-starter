import express from 'express';
import { Request, Response, NextFunction} from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import ApiError from './utils/apiError';
import ApiResponse from './utils/apiResponse';

const app = express();

app
    .use(express.json({limit:'16kb'}))
    .use(express.urlencoded({extended:true, limit:"16kb"}))
    .use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }))
    .use(cookieParser())
    .use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    })
    .get("/", (req, res)=>{
        res.status(200).json({message:"its home route and everything is working fine till now and will work really great in future as well"})
    })

import authRouter from './routes/auth.route';
import OtpRouter from './routes/otp.route';

app
    .use('/api/v1/auth', authRouter)
    .use('/api/v1/otp', OtpRouter)

app.use((err: ApiError, req: Request, res: Response, next: NextFunction)=>{
        res
        .status(err.statusCode || 500)
        .json(
            new ApiResponse(err.statusCode || 400, err.message || "something went wrong", err)
        );
    })

export default app;