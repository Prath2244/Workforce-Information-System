import { Schema, model, Document, Types } from "mongoose";

export interface IPayroll extends Document {
  employee: Types.ObjectId;
  month: string;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
}

const payrollSchema = new Schema<IPayroll>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    month: {
      type: String,
      required: true
    },

    basicSalary: {
      type: Number,
      required: true
    },

    bonus: {
      type: Number,
      default: 0
    },

    deductions: {
      type: Number,
      default: 0
    },

    netSalary: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model<IPayroll>(
  "Payroll",
  payrollSchema
);