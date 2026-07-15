import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import OnboardingWizard from '../components/OnboardingWizard';
import EditEmployeeModal from '../components/EditEmployeeModal';

export default function Employees() {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';
  const [showWizard, setShowWizard] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: api.getEmployees,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (err: any) => {
      alert('Failed to delete employee: ' + (err.message || 'Unknown error'));
    },
  });

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
        Failed to load employees. Please refresh the page.
      </div>
    );
  }

  // Regular employee view
  if (!isAdminOrHR) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Employee Directory</h1>
        <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(employees) && employees.map((emp: any) => (
                <tr key={emp._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{emp.userId?.name || 'N/A'}</td>
                  <td className="px-4 py-3">{emp.userId?.email || 'N/A'}</td>
                  <td className="px-4 py-3">{emp.department || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{emp.userId?.role || 'employee'}</span>
                  </td>
                </tr>
              ))}
              {(!employees || employees.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Admin/HR view
  const handleDelete = (emp: any) => {
    if (window.confirm(`Delete ${emp.userId?.name || 'this employee'}?`)) {
      // emp._id is the Employee document ID
      deleteMutation.mutate(emp._id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <button
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          onClick={() => setShowWizard(true)}
        >
          <i className="fas fa-plus mr-2"></i> Add Employee
        </button>
      </div>

      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Department</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Position</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Salary</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(employees) && employees.map((emp: any) => (
              <tr key={emp._id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{emp.userId?.name || 'N/A'}</td>
                <td className="px-4 py-3">{emp.userId?.email || 'N/A'}</td>
                <td className="px-4 py-3">{emp.department || 'N/A'}</td>
                <td className="px-4 py-3">{emp.position || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs capitalize ${
                    emp.userId?.role === 'admin' ? 'bg-red-100 text-red-800' :
                    emp.userId?.role === 'hr' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {emp.userId?.role || 'employee'}
                  </span>
                </td>
                <td className="px-4 py-3">${emp.salary?.toLocaleString() || '0'}</td>
                <td className="px-4 py-3">
                  <button
                    className="text-blue-600 hover:underline text-sm mr-2"
                    onClick={() => setEditingEmployee(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleDelete(emp)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {(!employees || employees.length === 0) && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OnboardingWizard isOpen={showWizard} onClose={() => setShowWizard(false)} />
      <EditEmployeeModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
      />
    </div>
  );
}