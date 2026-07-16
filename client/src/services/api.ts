const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Helper to handle API responses with better error messages
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  // ===========================
  // Auth
  // ===========================

  login: (email: string, password: string) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse),

  register: (data: any) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // ===========================
  // Employees
  // ===========================

  getEmployees: () =>
    fetch(`${API_BASE}/employees`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createEmployee: (data: any) =>
    fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateEmployee: (id: string, data: any) =>
    fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteEmployee: (id: string) =>
    fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  // ===========================
  // Leaves
  // ===========================

  getMyLeaves: () =>
    fetch(`${API_BASE}/leaves/my`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getAllLeaves: () =>
    fetch(`${API_BASE}/leaves/all`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createLeave: (data: any) =>
    fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  updateLeaveStatus: (id: string, status: string) =>
    fetch(`${API_BASE}/leaves/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    }).then(handleResponse),

  // ===========================
  // Payroll
  // ===========================

  getMyPayroll: (month: string) =>
    fetch(`${API_BASE}/payroll/my?month=${month}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  getAllPayroll: (month: string) =>
    fetch(`${API_BASE}/payroll/all?month=${month}`, {
      headers: getHeaders(),
    }).then(handleResponse),

  createPayroll: (data: any) =>
    fetch(`${API_BASE}/payroll`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  deletePayroll: (id: string) =>
    fetch(`${API_BASE}/payroll/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),

  downloadPayroll: async (id: string) => {
    const response = await fetch(`${API_BASE}/payroll/${id}/pdf`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to download PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;

    const contentDisposition = response.headers.get('Content-Disposition');
    const filename =
      contentDisposition?.split('filename=')[1] || 'payslip.pdf';

    a.download = filename;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  },

  // ===========================
  // Dashboard Stats
  // ===========================

  getDepartmentStats: async () => {
    try {
      const response = await fetch(`${API_BASE}/stats/departments`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.warn('Department stats API returned', response.status);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('getDepartmentStats error:', err);
      return [];
    }
  },

  getPendingLeaves: async () => {
    try {
      const response = await fetch(`${API_BASE}/stats/pending-leaves`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.warn('Pending leaves API returned', response.status);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('getPendingLeaves error:', err);
      return [];
    }
  },
};