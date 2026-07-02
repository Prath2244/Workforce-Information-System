import { Request, Response } from "express";
import Payroll from "../models/Payroll";

export const createPayroll = async (
  req: Request,
  res: Response
) => {
  try {
    const payroll = await Payroll.create(req.body);

    res.status(201).json(payroll);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const getPayrolls = async (
  req: Request,
  res: Response
) => {
  const payrolls = await Payroll.find()
    .populate("employee");

  res.json(payrolls);
};