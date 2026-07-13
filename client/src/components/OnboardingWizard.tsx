import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = ['Personal Info', 'Employment', 'Compensation', 'Review'];
const departments = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'];

export default function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: departments[0],
    position: '',
    salary: 60000,
    benefits: { health: true, dental: true, retirement: true },
  });

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: api.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onClose();
      setStep(0);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        department: departments[0],
        position: '',
        salary: 60000,
        benefits: { health: true, dental: true, retirement: true },
      });
    },
  });

  const next = () => {
    if (step === 0 && (!formData.name || !formData.email || !formData.password)) {
      alert('Please fill in all personal info fields.');
      return;
    }
    if (step === 1 && (!formData.department || !formData.position)) {
      alert('Please fill in all employment fields.');
      return;
    }
    if (step === 2 && (!formData.salary || formData.salary <= 0)) {
      alert('Please enter a valid salary.');
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const prev = () => { if (step > 0) setStep(step - 1); };

  const submit = () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      joinDate: new Date().toISOString().split('T')[0], // auto set today
      salary: formData.salary,
    };
    createMutation.mutate(payload);
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 mt-2">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i < step
                    ? 'bg-green-500 text-white'
                    : i === step
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    i < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">{steps[step]}</h2>

        {/* Step content */}
        {step === 0 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              className="w-full px-4 py-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email *"
              className="w-full px-4 py-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password *"
              className="w-full px-4 py-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-full px-4 py-2 border rounded"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <select
                className="w-full px-4 py-2 border rounded"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Position *"
              className="w-full px-4 py-2 border rounded"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Annual Salary *"
              className="w-full px-4 py-2 border rounded"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
            />
            <div className="space-y-2">
              <p className="font-medium">Benefits Package</p>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.benefits.health}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...formData.benefits, health: e.target.checked },
                    })
                  }
                />
                Health Insurance
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.benefits.dental}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...formData.benefits, dental: e.target.checked },
                    })
                  }
                />
                Dental Coverage
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.benefits.retirement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      benefits: { ...formData.benefits, retirement: e.target.checked },
                    })
                  }
                />
                401(k) Retirement Plan
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-semibold mb-2">Review Information</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="text-gray-500">Name</span>
                <span>{formData.name}</span>
                <span className="text-gray-500">Email</span>
                <span>{formData.email}</span>
                <span className="text-gray-500">Phone</span>
                <span>{formData.phone || '—'}</span>
                <span className="text-gray-500">Department</span>
                <span>{formData.department}</span>
                <span className="text-gray-500">Position</span>
                <span>{formData.position}</span>
                <span className="text-gray-500">Salary</span>
                <span>${formData.salary.toLocaleString()}</span>
                <span className="text-gray-500">Benefits</span>
                <span>
                  {Object.entries(formData.benefits)
                    .filter(([, v]) => v)
                    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                    .join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button
            onClick={prev}
            className={`px-4 py-2 rounded ${
              step === 0 ? 'text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            disabled={step === 0}
          >
            Previous
          </button>
          {step < 3 ? (
            <button
              onClick={next}
              className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>

        {createMutation.isError && (
          <p className="text-red-600 text-sm mt-2">
            Error: {createMutation.error?.message || 'Failed to create employee.'}
          </p>
        )}
      </div>
    </div>
  );
}