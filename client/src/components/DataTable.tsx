import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import DataTable from '../components/DataTable';

export default function Dashboard() {
  const { data: deptStats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['departmentStats'],
    queryFn: api.getDepartmentStats,
  });
  const { data: pendingLeaves, isLoading: leavesLoading, error: leavesError } = useQuery({
    queryKey: ['pendingLeaves'],
    queryFn: api.getPendingLeaves,
  });

  const totalEmployees = deptStats?.reduce((sum: number, d: any) => sum + d.count, 0) || 0;
  const pendingCount = pendingLeaves?.length || 0;

  const columns = [
    { key: 'employee.name', header: 'Employee' },
    { key: 'type', header: 'Type' },
    { key: 'days', header: 'Days' },
    { key: 'reason', header: 'Reason' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow border border-gray-200">
          <div className="text-gray-500 text-sm">Total Employees</div>
          <div className="text-3xl font-bold">{totalEmployees}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-200">
          <div className="text-gray-500 text-sm">Pending Leaves</div>
          <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border border-gray-200">
          <div className="text-gray-500 text-sm">Departments</div>
          <div className="text-3xl font-bold">{deptStats?.length || 0}</div>
        </div>
      </div>

      {/* Pending leaves table */}
      <div className="bg-white rounded shadow border border-gray-200 p-4">
        <h2 className="font-bold text-lg mb-4">Pending Leave Requests</h2>
        <DataTable
          columns={columns}
          data={pendingLeaves || []}
          keyExtractor={(item) => item._id}
          isLoading={leavesLoading}
          error={leavesError}
          emptyMessage="No pending requests."
          actions={(leave) => (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
          )}
        />
      </div>
    </div>
  );
}