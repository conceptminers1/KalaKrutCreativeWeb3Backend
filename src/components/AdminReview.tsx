
import React, { useState, useMemo } from 'react';
import { OnboardingRequest } from '../types/types';
import { Check, X, Shield } from 'lucide-react';

interface AdminReviewProps {
  requests: OnboardingRequest[];
  onStatusChange: (id: string, newStatus: 'Approved' | 'Denied') => void;
}

const AdminReview: React.FC<AdminReviewProps> = ({ requests, onStatusChange }) => {
  const [currentTab, setCurrentTab] = useState('leads');

  const { leads, joinRequests } = useMemo(() => ({
    leads: requests.filter(req => req.type === 'Lead'),
    joinRequests: requests.filter(req => req.type === 'Join Request'),
  }), [requests]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-300';
      case 'denied':
        return 'bg-red-500/20 text-red-400';
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const OnboardingTable: React.FC<{ data: OnboardingRequest[], type: string }> = ({ data, type }) => (
    <>
     {data.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-kala-800 text-kala-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} className="border-b border-kala-700 hover:bg-kala-800/40">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-kala-300">{item.email}</td>
                  <td className="px-6 py-4 text-kala-300">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                  {item.status.toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => onStatusChange(item.id, 'Approved')}
                        className="bg-green-500/20 hover:bg-green-500/40 text-green-300 px-3 py-1 rounded-md text-xs font-bold transition-colors mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusChange(item.id, 'Denied')}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                      >
                        Deny
                      </button>
                    </>
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 px-6">
              <Shield className="mx-auto w-12 h-12 mb-4 text-kala-500"/>
              <h4 className="text-white font-bold text-lg">No new {type}</h4>
              <p className="text-kala-400 mt-1">When a new {type === 'leads' ? 'lead is generated' : 'user submits a request'}, it will appear here.</p>
          </div>
        )}
    </>
  );

  return (
    <div className="bg-kala-800/50 border border-kala-700 rounded-xl overflow-hidden">
      <div className="p-4 bg-kala-900/50 border-b border-kala-700">
          <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Artist Onboarding</h3>
              <div className="flex items-center space-x-2 bg-kala-800 p-1 rounded-lg">
                  <button 
                      onClick={() => setCurrentTab('leads')} 
                      className={`px-3 py-1 text-sm font-bold rounded-md ${currentTab === 'leads' ? 'bg-kala-secondary text-kala-900' : 'text-kala-300 hover:bg-kala-700'}`}>
                      Leads ({leads.length})
                  </button>
                  <button 
                      onClick={() => setCurrentTab('requests')} 
                      className={`px-3 py-1 text-sm font-bold rounded-md ${currentTab === 'requests' ? 'bg-kala-secondary text-kala-900' : 'text-kala-300 hover:bg-kala-700'}`}>
                      Join Requests ({joinRequests.length})
                  </button>
              </div>
          </div>
      </div>
      <div className="overflow-x-auto">
        {currentTab === 'leads' ? (
            <OnboardingTable data={leads} type="leads" />
        ) : (
            <OnboardingTable data={joinRequests} type="join requests" />
        )}
      </div>
    </div>
  );
};

export default AdminReview;
