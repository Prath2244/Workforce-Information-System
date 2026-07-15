import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Payroll() {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';
  const queryClient = useQueryClient();
  const month = '2025-01';
  const [formData, setFormData] = useState({
    employeeId: '',
    month: month,
    baseSalary: 0,
    adjustmentPercent: 0,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: api.getEmployees,
    enabled: isAdminOrHR,
    retry: 1,
  });

  const { data: payrollData, isLoading, error } = useQuery({
    queryKey: ['payroll', month, isAdminOrHR ? 'all' : 'my'],
    queryFn: () => (isAdminOrHR ? api.getAllPayroll(month) : api.getMyPayroll(month)),
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deletePayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: api.createPayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      setFormData({ employeeId: '', month, baseSalary: 0, adjustmentPercent: 0 });
      alert('Payroll record saved successfully!');
    },
    onError: (err: any) => {
      alert('Failed to save: ' + (err.message || 'Unknown error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId) {
      alert('Please select an employee.');
      return;
    }
    if (formData.baseSalary <= 0) {
      alert('Please enter a valid base salary.');
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleDownload = (id: string) => {
    api.downloadPayroll(id).catch(err => {
      alert('Failed to download PDF: ' + err.message);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded border border-red-200">
        <i className="fas fa-exclamation-circle mr-2"></i>
        Failed to load payroll data. Please refresh the page.
      </div>
    );
  }

  // Employee view
  if (!isAdminOrHR) {
    const record = payrollData;
    if (!record || !record.employeeId) {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-6">My Payroll</h1>
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            No payroll record found for this month.
          </div>
        </div>
      );
    }
    const net = record.baseSalary + (record.baseSalary * (record.adjustmentPercent || 0) / 100);
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Payroll</h1>
        <div className="bg-white p-6 rounded shadow border border-gray-200 max-w-md">
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-500">Base Salary</span>
            <span>${record.baseSalary?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="text-gray-500">Adjustment</span>
            <span className={record.adjustmentPercent >= 0 ? 'text-green-600' : 'text-red-600'}>
              {record.adjustmentPercent >= 0 ? '+' : ''}{record.adjustmentPercent || 0}%
            </span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>Net Payout</span>
            <span className="text-amber-600">${net?.toFixed(2) || '0.00'}</span>
          </div>
          <button
            className="mt-4 bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 w-full"
            onClick={() => handleDownload(record._id)}
          >
            <i className="fas fa-download mr-2"></i> Download PDF
          </button>
        </div>
      </div>
    );
  }

  // Admin/HR view
  const records = Array.isArray(payrollData) ? payrollData : [];
  const employeeOptions = Array.isArray(employees) ? employees : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        <span className="text-sm text-gray-500">Month: {month}</span>
      </div>

      {/* Add Payroll Form */}
      <div className="bg-white p-4 rounded shadow border border-gray-200 mb-6">
        <h2 className="font-semibold mb-4">Add Payroll Record</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            >
              <option value="">Select employee</option>
              {employeeOptions.map((emp: any) => {
                // emp.userId is the populated User object with _id
                const userId = emp.userId?._id || emp.userId?.id || '';
                const displayName = emp.userId?.name || 'Unknown';
                if (!userId) return null; // skip if no ID
                return (
                  <option key={userId} value={userId}>
                    {displayName} ({emp.department})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
            <input
              type="number"
              placeholder="e.g. 120000"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={formData.baseSalary}
              onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment %</label>
            <input
              type="number"
              placeholder="e.g. 10 for bonus, -5 for deduction"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={formData.adjustmentPercent}
              onChange={(e) => setFormData({ ...formData, adjustmentPercent: Number(e.target.value) })}
              min="-100"
              max="100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Positive = bonus, Negative = deduction</p>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <span className="font-medium">Payroll Records - {month}</span>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Employee</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Base Salary</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Adjustment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Net</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record: any) => {
              const net = record.baseSalary + (record.baseSalary * (record.adjustmentPercent || 0) / 100);
              return (
                <tr key={record._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{record.employeeId?.name || 'N/A'}</td>
                  <td className="px-4 py-3">${record.baseSalary?.toFixed(2) || '0.00'}</td>
                  <td className={`px-4 py-3 ${record.adjustmentPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {record.adjustmentPercent >= 0 ? '+' : ''}{record.adjustmentPercent || 0}%
                  </td>
                  <td className="px-4 py-3 font-semibold">${net?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => {
                        setFormData({
                          employeeId: record.employeeId?._id || '',
                          month: record.month,
                          baseSalary: record.baseSalary,
                          adjustmentPercent: record.adjustmentPercent,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => {
                        if (window.confirm('Delete this record?')) deleteMutation.mutate(record._id);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="text-amber-600 hover:underline text-sm"
                      onClick={() => handleDownload(record._id)}
                    >
                      <i className="fas fa-file-pdf mr-1"></i> PDF
                    </button>
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No payroll records found for {month}.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}