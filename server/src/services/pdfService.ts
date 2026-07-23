import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};

const printer = new PdfPrinter(fonts);

export function generatePayslipPDF(data: {
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  month: string;
  baseSalary: number;
  adjustmentPercent: number;
  bonus: number;
  deduction: number;
  net: number;
}): Promise<Buffer> {
  const { employeeName, employeeEmail, department, position, month, baseSalary, adjustmentPercent, bonus, deduction, net } = data;

  const docDefinition: TDocumentDefinitions = {
    content: [
      { text: 'ENTERPRISE HRMS', style: 'header', alignment: 'center', fontSize: 22, bold: true },
      { text: 'PAYSLIP', style: 'subheader', alignment: 'center', fontSize: 16, margin: [0, 5, 0, 20] },
      { text: `Period: ${month}`, alignment: 'right', fontSize: 10, margin: [0, 0, 0, 10] },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [{ text: 'Employee', bold: true }, { text: employeeName }],
            [{ text: 'Email', bold: true }, { text: employeeEmail }],
            [{ text: 'Department', bold: true }, { text: department }],
            [{ text: 'Position', bold: true }, { text: position }],
          ],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Base Salary', bold: true, alignment: 'center' },
              { text: 'Adjustment', bold: true, alignment: 'center' },
              { text: 'Net Pay', bold: true, alignment: 'center' },
            ],
            [
              { text: `$${baseSalary.toFixed(2)}`, alignment: 'center' },
              { text: `${adjustmentPercent >= 0 ? '+' : ''}${adjustmentPercent}%`, alignment: 'center' },
              { text: `$${net.toFixed(2)}`, alignment: 'center', bold: true, color: '#d97706' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10, 0, 10],
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [{ text: 'Bonus', bold: true }, { text: `$${bonus.toFixed(2)}` }],
            [{ text: 'Deduction', bold: true }, { text: `$${deduction.toFixed(2)}` }],
          ],
        },
        layout: 'noBorders',
        margin: [0, 10, 0, 0],
      },
      {
        text: 'This is a system-generated payslip. No signature required.',
        fontSize: 8,
        color: '#6b7280',
        margin: [0, 20, 0, 0],
        alignment: 'center',
      },
      {
        text: `Generated: ${new Date().toISOString()}`,
        fontSize: 8,
        color: '#6b7280',
        alignment: 'center',
      },
    ],
    styles: {
      header: { fontSize: 22, bold: true, color: '#d97706' },
      subheader: { fontSize: 16, bold: true, color: '#374151' },
    },
    defaultStyle: { font: 'Roboto' },
  };

  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}