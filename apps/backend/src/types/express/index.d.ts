import { IUser } from '@repo/database';
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  _id: IUser["_id"];
  fullName: string;
  username: string;
}


declare global {
  namespace Express {
    interface Request {
      user?: UserPayload & JwtPayload;
    }
  }
}
