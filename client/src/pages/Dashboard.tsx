import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export default function Dashboard() {
  const { data: deptStats, isLoading, error } = useQuery({
    queryKey: ['departmentStats'],
    queryFn: api.getDepartmentStats,
    // If the API returns an error, don't break the whole page
    retry: 1,
  });

  // Safely calculate totals – handle cases where data might not be an array
  const totalEmployees = Array.isArray(deptStats)
    ? deptStats.reduce((sum: number, d: any) => sum + (d.count || 0), 0)
    : 0;

  const departmentCount = Array.isArray(deptStats) ? deptStats.length : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Total Employees</div>
          <div className="text-4xl font-bold mt-2">{totalEmployees}</div>
        </div>

        <div className="bg-white p-6 rounded shadow border border-gray-200">
          <div className="text-gray-500 text-sm font-medium">Departments</div>
          <div className="text-4xl font-bold mt-2">{departmentCount}</div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Failed to load dashboard data. Please refresh the page.
        </div>
      )}
    </div>
  );
}