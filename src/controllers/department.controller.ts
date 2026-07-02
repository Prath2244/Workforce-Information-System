import { Request, Response } from "express";
import Department from "../models/Department";

export const createDepartment = async (
  req: Request,
  res: Response
) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json(department);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const getDepartments = async (
  req: Request,
  res: Response
) => {
  const departments = await Department.find();

  res.json(departments);
};

export const updateDepartment = async (
  req: Request,
  res: Response
) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true
    }
  );

  res.json(department);
};

export const deleteDepartment = async (
  req: Request,
  res: Response
) => {
  await Department.findByIdAndDelete(req.params.id);

  res.json({
    message: "Department deleted successfully"
  });
};