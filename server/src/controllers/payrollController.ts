import { Request, Response } from 'express';
import { Payroll } from '../models/Payroll';
import { User } from '../models/User';

export const createOrUpdatePayroll = async (req: Request, res: Response) => {
  try {
    const { employeeId, month, baseSalary, adjustmentPercent } = req.body;

    const user = await User.findById(employeeId);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const bonus = adjustmentPercent >= 0 ? (baseSalary * adjustmentPercent / 100) : 0;
    const deduction = adjustmentPercent < 0 ? (baseSalary * Math.abs(adjustmentPercent) / 100) : 0;
    const net = baseSalary + bonus - deduction;

    const payroll = await Payroll.findOneAndUpdate(
      { employeeId, month },
      { baseSalary, adjustmentPercent, bonus, deduction, net },
      { new: true, upsert: true }
    );

    const populated = await Payroll.findById(payroll._id).populate('employeeId', 'name email');
    res.json(populated);
  } catch (error) {
    console.error('createOrUpdatePayroll error:', error);
    res.status(500).json({ message: 'Server error: ' + (error as Error).message });
  }
};

export const getMyPayroll = async (req: Request, res: Response) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ message: 'Month is required' });
    const payroll = await Payroll.findOne({ employeeId: req.user?.id, month }).populate('employeeId', 'name email');
    res.json(payroll || {});
  } catch (error) {
    console.error('getMyPayroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllPayroll = async (req: Request, res: Response) => {
  try {
    const { month } = req.query;
    if (!month) return res.status(400).json({ message: 'Month is required' });
    const records = await Payroll.find({ month }).populate('employeeId', 'name email');
    res.json(records);
  } catch (error) {
    console.error('getAllPayroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePayroll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Payroll.findByIdAndDelete(id);
    res.json({ message: 'Payroll deleted' });
  } catch (error) {
    console.error('deletePayroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const generatePayslipPDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await Payroll.findById(id).populate('employeeId', 'name email');
    if (!record) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    const user = record.employeeId as any;
    const net = record.baseSalary + record.bonus - record.deduction;

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip_${user.name.replace(/\s/g, '_')}_${record.month}.pdf`);

    doc.pipe(res);

    // --- Header ---
    doc.fillColor('#d97706').fontSize(22).font('Helvetica-Bold').text('ENTERPRISE HRMS', 50, 50);
    doc.fillColor('#6b7280').fontSize(10).font('Helvetica').text('Enterprise Human Resource Management System', 50, 75);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text('PAYSLIP', 450, 50, { align: 'right' });
    doc.fillColor('#6b7280').fontSize(9).font('Helvetica').text(`Period: ${record.month}`, 450, 70, { align: 'right' });
    doc.moveDown(1);

    // --- Employee info ---
    doc.rect(50, 110, 500, 40).fill('#f3f4f6').stroke('#e5e7eb');
    doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold').text(user.name, 60, 120);
    doc.fillColor('#6b7280').fontSize(9).font('Helvetica').text(`${user.email}  |  Employee ID: ${user._id}`, 60, 138);
    doc.fillColor('#6b7280').fontSize(9).text(`Date: ${new Date().toLocaleDateString()}`, 450, 120, { align: 'right' });

    doc.moveDown(2);

    // --- Earnings ---
    doc.fillColor('#d97706').fontSize(12).font('Helvetica-Bold').text('EARNINGS', 50, 180);
    doc.moveDown(0.5);
    let yPos = 200;
    const earnings = [
      ['Base Salary', `${record.baseSalary.toFixed(2)}`],
      ['Bonus', `${record.bonus.toFixed(2)}`],
    ];
    earnings.forEach(([label, value]) => {
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica').text(label, 50, yPos);
      doc.fillColor('#111827').font('Helvetica-Bold').text(`$${value}`, 250, yPos, { align: 'right', width: 200 });
      yPos += 20;
    });
    doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold').text('Gross Earnings', 50, yPos);
    doc.fillColor('#059669').text(`$${(record.baseSalary + record.bonus).toFixed(2)}`, 250, yPos, { align: 'right', width: 200 });
    yPos += 30;

    // --- Deductions ---
    doc.fillColor('#dc2626').fontSize(12).font('Helvetica-Bold').text('DEDUCTIONS', 50, yPos);
    yPos += 20;
    const deductions = [
      ['Deduction', `${record.deduction.toFixed(2)}`],
    ];
    deductions.forEach(([label, value]) => {
      doc.fillColor('#6b7280').fontSize(10).font('Helvetica').text(label, 50, yPos);
      doc.fillColor('#dc2626').font('Helvetica-Bold').text(`-$${value}`, 250, yPos, { align: 'right', width: 200 });
      yPos += 20;
    });
    doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold').text('Total Deductions', 50, yPos);
    doc.fillColor('#dc2626').text(`-$${record.deduction.toFixed(2)}`, 250, yPos, { align: 'right', width: 200 });
    yPos += 30;

    // --- Net Pay – amount inside the box ---
    const boxX = 50;
    const boxWidth = 500;
    const boxY = yPos;
    doc.rect(boxX, boxY, boxWidth, 30).fill('#d97706').stroke('#d97706');

    // Left label
    doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text('NET PAY', boxX + 10, boxY + 8);

    // Right amount – fixed x coordinate inside the box, align right
    const amount = `$${net.toFixed(2)}`;
    const amountX = 380; // well inside the box; align right will place it at the right edge of this x
    doc.fillColor('#ffffff')
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(amount, amountX, boxY + 7, { align: 'right', width: 120 });

    // --- Footer ---
    const footerY = 750;
    doc.fillColor('#6b7280').fontSize(7).font('Helvetica').text(
      'This is a system-generated payslip from Enterprise HRMS. No signature required.',
      50, footerY
    );
    doc.text('Confidential – Contains PII protected under company data security policy.', 50, footerY + 12);
    doc.text(`Generated: ${new Date().toISOString()}`, 450, footerY, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};