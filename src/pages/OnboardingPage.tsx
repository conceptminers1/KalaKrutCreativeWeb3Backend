
import React, { useState, useMemo } from 'react';
import { OnboardingRequest } from '@/types/types';
import { Check, X, Filter, Users, Mail, Clock, Shield } from 'lucide-react';

interface OnboardingPageProps {
  requests: OnboardingRequest[];
  onStatusChange: (id: string, newStatus: 'Approved' | 'Denied') => void;
  initialFilter?: 'all' | 'Lead' | 'Join Request';
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ requests, onStatusChange, initialFilter = 'all' }) => {
  const [filter, setFilter] = useState<'all' | 'Lead' | 'Join Request'>(initialFilter);

  const filteredRequests = useMemo(() => {
    if (filter === 'all') return requests;
    return requests.filter(req => req.type === filter);
  }, [requests, filter]);

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Approved</span>;
      case 'denied':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Denied</span>;
      case 'pending':
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="bg-kala-900 text-white p-8 rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="text-kala-secondary" />
          User Onboarding
        </h1>
        <div className="flex items-center gap-2">
          <Filter className="text-kala-400" />
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value as any)}
            className="bg-kala-800 border border-kala-700 rounded-lg px-3 py-2 text-white outline-none focus:border-kala-secondary"
          >
            <option value="all">All Requests</option>
            <option value="Lead">Leads</option>
            <option value="Join Request">Join Requests</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-kala-800 border-b border-kala-700">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr key={req.id} className="border-b border-kala-800 hover:bg-kala-800/50">
                <td className="p-4 flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${req.type === 'Lead' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                    {req.name}
                </td>
                <td className="p-4 text-kala-400"><Mail className="inline w-4 h-4 mr-2"/>{req.email}</td>
                <td className="p-4">
                    <span className={`font-bold ${req.type === 'Lead' ? 'text-blue-400' : 'text-purple-400'}`}>
                        {req.type}
                    </span>
                </td>
                <td className="p-4 text-kala-400"><Clock className="inline w-4 h-4 mr-2"/>{new Date(req.date).toLocaleDateString()}</td>
                <td className="p-4 text-center">{getStatusChip(req.status)}</td>
                <td className="p-4">
                  {req.status.toLowerCase() === 'pending' && (
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => onStatusChange(req.id, 'Approved')} 
                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-full transition-colors"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onStatusChange(req.id, 'Denied')} 
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                        title="Deny"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
             {filteredRequests.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-12 text-kala-500">
                        <Shield className="mx-auto w-12 h-12 mb-4"/>
                        <p className="font-bold">No {filter !== 'all' ? filter + 's' : 'requests'} found.</p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OnboardingPage;
