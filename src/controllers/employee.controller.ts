import { Request, Response } from "express";
import Employee from "../models/Employee";

export const createEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json(employee);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const getEmployees = async (
  req: Request,
  res: Response
) => {
  const employees = await Employee.find()
    .populate("user")
    .populate("department");

  res.json(employees);
};

export const getEmployeeById = async (
  req: Request,
  res: Response
) => {
  const employee = await Employee.findById(req.params.id)
    .populate("user")
    .populate("department");

  res.json(employee);
};

export const updateEmployee = async (
  req: Request,
  res: Response
) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true
    }
  );

  res.json(employee);
};

export const deleteEmployee = async (
  req: Request,
  res: Response
) => {
  await Employee.findByIdAndDelete(req.params.id);

  res.json({
    message: "Employee deleted successfully"
  });
};