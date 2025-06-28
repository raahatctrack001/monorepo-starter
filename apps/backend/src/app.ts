import express from 'express';
import { Request, Response, NextFunction} from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import ApiError from './utils/apiError';
import ApiResponse from './utils/apiResponse';

const app = express();
const allowedOrigins = ["https://social-desk-web.vercel.app", "http://localhost:3001"];
app
    .use(express.json({limit:'16kb'}))
    .use(express.urlencoded({extended:true, limit:"16kb"}))
    .use(cors({
        origin: (origin, callback) => {
            console.log("Received origin:", origin);
            console.log("Allowed origins:", allowedOrigins);
            
            console.log("Includes check:", allowedOrigins.includes(origin || "undefined"));
            
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                console.log("✅ CORS allowed");
            } else {
                callback(new Error("Unidentified Origin!"));
                console.log("❌ CORS rejected");
            }
        },
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
import userRouter from './routes/user.routes'
import otpRouter from './routes/otp.route';
import conversationRouter from './routes/communication/conversation.routes';
import groupRouter from './routes/communication/group.routes';
import messageRouter from './routes/communication/message.routes';

app
    .use('/api/v1/auth', authRouter)
    .use('/api/v1/user', userRouter)
    .use('/api/v1/otp', otpRouter)
    .use('/api/v1/conversation', conversationRouter)
    .use('/api/v1/group', groupRouter)
    .use('/api/v1/message', messageRouter)

app.use((err: ApiError, req: Request, res: Response, next: NextFunction)=>{
        res
        .status(err.statusCode || 500)
        .json(
            new ApiResponse(err.statusCode || 400, err.message || "something went wrong", err)
        );
    })

export default app;
