import { Request, Response } from "express";
import Leave from "../models/Leave";

export const applyLeave = async (
  req: Request,
  res: Response
) => {
  try {
    const leave = await Leave.create(req.body);

    res.status(201).json(leave);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

export const getLeaves = async (
  req: Request,
  res: Response
) => {
  const leaves = await Leave.find()
    .populate("employee");

  res.json(leaves);
};

export const updateLeaveStatus = async (
  req: Request,
  res: Response
) => {
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    },
    {
      new: true
    }
  );

  res.json(leave);
};