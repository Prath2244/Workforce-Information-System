import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Leaves() {
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'admin' || user?.role === 'hr';
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Annual',
    from: '',
    to: '',
    days: 1,
    reason: '',
  });

  const { data: leaves, isLoading, error } = useQuery({
    queryKey: ['leaves', isAdminOrHR ? 'all' : 'my'],
    queryFn: isAdminOrHR ? api.getAllLeaves : api.getMyLeaves,
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: api.createLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      setShowForm(false);
      setFormData({ type: 'Annual', from: '', to: '', days: 1, reason: '' });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateLeaveStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
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
        Failed to load leaves. Please refresh the page.
      </div>
    );
  }

  const leaveList = Array.isArray(leaves) ? leaves : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leave Management</h1>

      {!isAdminOrHR && (
        <button
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 mb-4"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Request Leave'}
        </button>
      )}

      {showForm && !isAdminOrHR && (
        <div className="bg-white p-4 rounded shadow border border-gray-200 mb-6">
          <h2 className="font-semibold mb-2">New Leave Request</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option>Annual</option>
                <option>Sick</option>
                <option>Personal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Days</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">From</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">To</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm mb-1">Reason</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded"
                rows={2}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {isAdminOrHR && <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Employee</th>}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">From</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">To</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Days</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reason</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              {isAdminOrHR && <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaveList.map((leave: any) => (
              <tr key={leave._id} className="border-t border-gray-200 hover:bg-gray-50">
                {isAdminOrHR && (
                  <td className="px-4 py-3">{leave.employeeId?.name || 'Unknown'}</td>
                )}
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    leave.type === 'Sick' ? 'bg-red-100 text-red-800' :
                    leave.type === 'Annual' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {leave.type}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(leave.from).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(leave.to).toLocaleDateString()}</td>
                <td className="px-4 py-3">{leave.days}</td>
                <td className="px-4 py-3 text-gray-600">{leave.reason}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                    leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {leave.status}
                  </span>
                </td>
                {isAdminOrHR && (
                  <td className="px-4 py-3">
                    {leave.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          className="text-green-600 hover:underline text-sm"
                          onClick={() =>
                            updateStatusMutation.mutate({ id: leave._id, status: 'approved' })
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() =>
                            updateStatusMutation.mutate({ id: leave._id, status: 'rejected' })
                          }
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {leaveList.length === 0 && (
              <tr>
                <td colSpan={isAdminOrHR ? 8 : 7} className="text-center py-8 text-gray-500">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}