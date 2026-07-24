import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};