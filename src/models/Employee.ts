import { Schema, model, Document, Types } from "mongoose";

export interface IEmployee extends Document {
  employeeId: string;
  user: Types.ObjectId;
  department: Types.ObjectId;
  designation: string;
  salary: number;
  joiningDate: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    designation: {
      type: String,
      required: true
    },

    salary: {
      type: Number,
      required: true
    },

    joiningDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default model<IEmployee>(
  "Employee",
  employeeSchema
);