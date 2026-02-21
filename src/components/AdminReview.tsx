
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { ArtistProfile, ApprovalStatus } from '../types';
import AdminJoinRequests from './AdminJoinRequests'; // Import the new component

const AdminReview: React.FC = () => {
  const { leads, updateUser, addNotification } = useData();
  const { showToast } = useToast();
  const [currentTab, setCurrentTab] = useState('leads'); // State to manage tabs

  const handleApprove = (lead: ArtistProfile) => {
    updateUser({ ...lead, status: ApprovalStatus.APPROVED });
    addNotification({
      userId: lead.id,
      message: `Congratulations, ${lead.name}! Your application is approved. Welcome!`,
      type: 'success',
    });
    showToast(`Approved ${lead.name}. They are now a roster member.`, 'success');
    
    console.log('--- SIMULATED WELCOME EMAIL ---');
    console.log(`To: ${lead.email}`);
    console.log(`Subject: Your KalaKrut Application has been Approved!`);
    console.log(`Body: Welcome aboard! Your account is active. Please log in to your dashboard.`);
    console.log('-----------------------------');
  };

  const handleDeny = (lead: ArtistProfile) => {
    if (window.confirm(`Are you sure you want to deny the application for ${lead.name}?`)) {
      updateUser({ ...lead, status: ApprovalStatus.REJECTED });
      addNotification({
        userId: lead.id, 
        message: `We regret to inform you that your application as '${lead.name}' will not be moving forward at this time.`,
        type: 'error',
      });
      showToast(`Denied application for ${lead.name}.`, 'warning');
      
      console.log('--- SIMULATED REJECTION EMAIL ---');
      console.log(`To: ${lead.email}`);
      console.log(`Subject: An Update on Your KalaKrut Application`);
      console.log(`Body: Thank you for your interest. After careful review, we've decided not to move forward with your application at this time.`);
      console.log('-------------------------------');
    }
  };

  const getStatusBadge = (status: 'New' | 'Contacted' | 'Closed' | undefined) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/20 text-blue-300';
      case 'Contacted':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'Closed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const LeadsView = () => (
    <>
     {leads.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-kala-800 text-kala-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-kala-700 hover:bg-kala-800/40">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{lead.name}</td>
                  <td className="px-6 py-4 text-kala-300">{lead.email}</td>
                  <td className="px-6 py-4 text-kala-300">{lead.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(lead.leadStatus)}`}>
                      {lead.leadStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleApprove(lead)}
                      className="bg-green-500/20 hover:bg-green-500/40 text-green-300 px-3 py-1 rounded-md text-xs font-bold transition-colors mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeny(lead)}
                      className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 px-6">
            <h4 className="text-white font-bold text-lg">No new applications</h4>
            <p className="text-kala-400 mt-1">When a new artist submits a join request, it will appear here for your review.</p>
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
                      Leads
                  </button>
                  <button 
                      onClick={() => setCurrentTab('requests')} 
                      className={`px-3 py-1 text-sm font-bold rounded-md ${currentTab === 'requests' ? 'bg-kala-secondary text-kala-900' : 'text-kala-300 hover:bg-kala-700'}`}>
                      Join Requests
                  </button>
              </div>
          </div>
      </div>
      <div className="overflow-x-auto">
        {currentTab === 'leads' ? <LeadsView /> : <AdminJoinRequests />}
      </div>
    </div>
  );
};

export default AdminReview;
