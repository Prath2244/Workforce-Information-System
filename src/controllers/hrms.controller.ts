import { Request, Response } from "express";
import Employee from "../models/Employee";

export const getEmployeeDetails = async (
  req: Request,
  res: Response
) => {
  const employees = await Employee.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department"
      }
    },
    {
      $lookup: {
        from: "payrolls",
        localField: "_id",
        foreignField: "employee",
        as: "payroll"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $unwind: "$department"
    }
  ]);

  res.json(employees);
};