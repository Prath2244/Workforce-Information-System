import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  userId: mongoose.Types.ObjectId;
  department: string;
  position: string;
  salary: number;
  joinDate: Date;
  phone?: string;
}

const EmployeeSchema = new Schema<IEmployee>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  joinDate: { type: Date, required: true },
  phone: { type: String }
}, { timestamps: true });

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);