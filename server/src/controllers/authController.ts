import { Request, Response } from 'express';
import { User } from '../models/User';
import { Employee } from '../models/Employee';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, department, position, joinDate, phone } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role: 'employee' });
    const employee = await Employee.create({
      userId: user.id,
      department,
      position,
      salary: 60000,
      joinDate: joinDate || new Date(),
      phone
    });
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, name, email, role: user.role }, employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    const employee = await Employee.findOne({ userId: user.id });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }, employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};