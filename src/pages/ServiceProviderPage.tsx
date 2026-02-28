import React from 'react';
import ServiceProviderRealDataTable from '@/components/tables/ServiceProviderRealDataTable';
import { UserRole } from '@/types/types';

interface ServiceProviderPageProps {
  onNavigate: (view: string) => void;
  currentUserRole: UserRole;
}

const ServiceProviderPage: React.FC<ServiceProviderPageProps> = ({ onNavigate, currentUserRole }) => {
  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Service Provider Dashboard</h1>
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-kala-secondary hover:bg-cyan-400 text-kala-900 font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
      <div id="service-provider-tables" className="grid grid-cols-1 gap-8 mt-8">
        <ServiceProviderRealDataTable currentUserRole={currentUserRole} />
      </div>
    </div>
  );
};

export default ServiceProviderPage;