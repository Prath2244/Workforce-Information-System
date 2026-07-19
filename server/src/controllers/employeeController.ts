import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { User } from '../models/User';
import { hashPassword } from '../utils/auth';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().populate('userId', 'name email role');
    res.json(employees);
  } catch (error) {
    console.error('getEmployees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate('userId', 'name email role');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    console.error('getEmployee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, password, department, position, salary, joinDate, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role: 'employee' });
    const employee = await Employee.create({
      userId: user.id,
      department,
      position,
      salary,
      joinDate: joinDate || new Date(),
      phone
    });
    res.status(201).json(employee);
  } catch (error) {
    console.error('createEmployee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Employee ID is required' });

    const { name, email, department, position, salary, phone, role } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (department !== undefined) employee.department = department;
    if (position !== undefined) employee.position = position;
    if (salary !== undefined) employee.salary = salary;
    if (phone !== undefined) employee.phone = phone;

    const user = await User.findById(employee.userId);
    if (user) {
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (role !== undefined) user.role = role;
      await user.save();
    }

    await employee.save();
    const updatedEmployee = await Employee.findById(id).populate('userId', 'name email role');
    res.json(updatedEmployee);
  } catch (error) {
    console.error('updateEmployee error:', error);
    res.status(500).json({ message: 'Server error: ' + (error as Error).message });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Employee ID is required' });

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    await User.findByIdAndDelete(employee.userId);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    console.error('deleteEmployee error:', error);
    res.status(500).json({ message: 'Server error: ' + (error as Error).message });
  }
};