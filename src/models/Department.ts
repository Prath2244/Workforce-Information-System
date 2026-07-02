import { Schema, model, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description: string;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model<IDepartment>(
  "Department",
  departmentSchema
);