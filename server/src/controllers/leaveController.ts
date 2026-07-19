import { Request, Response } from 'express';
import { Leave } from '../models/Leave';

export const createLeave = async (req: Request, res: Response) => {
  try {
    const { type, from, to, days, reason } = req.body;
    const employeeId = req.user?.id;
    const leave = await Leave.create({ employeeId, type, from, to, days, reason, status: 'pending' });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user?.id });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find().populate('employeeId', 'name email');
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};