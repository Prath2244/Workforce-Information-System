import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  month: string;
  baseSalary: number;
  adjustmentPercent: number;
  bonus: number;
  deduction: number;
  net: number;
}

const PayrollSchema = new Schema<IPayroll>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  adjustmentPercent: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  deduction: { type: Number, default: 0 },
  net: { type: Number, required: true }
}, { timestamps: true });

export const Payroll = mongoose.model<IPayroll>('Payroll', PayrollSchema);