import { IUser } from '@repo/database';
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  _id: IUser["_id"];
  fullName: string;
  username: string;
}

interface DevicePayload {
  userAgent: string;
  ip: string;
  details: {
    os: string;
    browser: string;
    platform: string;
  };
  isKnownDevice: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload & JwtPayload;
      device?: DevicePayload;
    }
  }
}
