import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { Leave } from '../models/Leave';

export const getDepartmentStats = async (req: Request, res: Response) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          totalSalary: { $sum: '$salary' }
        }
      },
      { $project: { department: '$_id', count: 1, totalSalary: 1, _id: 0 } }
    ]);
    // Always return an array, even if empty
    res.json(stats || []);
  } catch (error) {
    console.error('Error in getDepartmentStats:', error);
    res.status(500).json({ error: 'Failed to fetch department stats' });
  }
};

export const getPendingLeaves = async (req: Request, res: Response) => {
  try {
    const pending = await Leave.aggregate([
      { $match: { status: 'pending' } },
      {
        $lookup: {
          from: 'users',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          type: 1,
          from: 1,
          to: 1,
          days: 1,
          reason: 1,
          'employee.name': 1,
          'employee.email': 1
        }
      }
    ]);
    res.json(pending || []);
  } catch (error) {
    console.error('Error in getPendingLeaves:', error);
    res.status(500).json({ error: 'Failed to fetch pending leaves' });
  }
};