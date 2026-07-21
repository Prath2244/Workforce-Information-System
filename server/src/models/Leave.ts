import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  employeeId: mongoose.Types.ObjectId;
  type: 'Annual' | 'Sick' | 'Personal';
  from: Date;
  to: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: Date;
}

const LeaveSchema = new Schema<ILeave>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Annual', 'Sick', 'Personal'], required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  days: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedOn: { type: Date, default: Date.now }
}, { timestamps: true });

export const Leave = mongoose.model<ILeave>('Leave', LeaveSchema);