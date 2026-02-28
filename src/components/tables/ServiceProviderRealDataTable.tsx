import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/Table";
import { ServiceProviderProfile, UserRole } from '@/types/types';
import { useToast } from '@/contexts/ToastContext';

const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode }> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${className}`}>
    {children}
  </button>
);

const TableActions: React.FC<{ 
  serviceProvider: ServiceProviderProfile;
  role: UserRole; 
  onAction: (action: string, serviceProviderId: string) => void;
}> = ({ serviceProvider, role, onAction }) => {

  const handleAction = (action: string) => {
    onAction(action, serviceProvider.id);
  };

  if (role === UserRole.ADMIN || role === UserRole.SYSTEM_ADMIN_LIVE) {
    return (
        <div className="space-x-2">
          <ActionButton onClick={() => handleAction('edit')} className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/40">Edit</ActionButton>
          <ActionButton onClick={() => handleAction('delete')} className="bg-red-500/20 text-red-300 hover:bg-red-500/40">Delete</ActionButton>
        </div>
      );
  }
  
  return null;
};

const ServiceProviderRealDataTable = ({ currentUserRole }: { currentUserRole: UserRole }) => {
  const [serviceProviders, setServiceProviders] = useState<ServiceProviderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/service-providers.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch service providers: ${response.statusText}`);
        }
        const data: ServiceProviderProfile[] = await response.json();
        setServiceProviders(data);
      } catch (e: any) {
        setError(e.message);
        notify(e.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  const handleAction = (action: string, serviceProviderId: string) => {
    notify(`Action '${action}' triggered for service provider '${serviceProviderId}'.`, 'info');
    if (action === 'delete') {
      setServiceProviders(currentProviders => currentProviders.filter(p => p.id !== serviceProviderId));
      notify(`Service Provider ${serviceProviderId} was successfully deleted.`, 'success');
    }
  };

  if (isLoading) return <div className="text-center p-8 text-kala-400">Loading service provider data...</div>;
  if (error) return <div className="text-center p-8 text-red-500 bg-red-500/10 rounded-lg">Error: {error}</div>;

  return (
    <Table className="bg-kala-900 text-white rounded-lg p-6">
      <TableCaption>Real-time service provider data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {serviceProviders.map((serviceProvider) => (
          <TableRow key={serviceProvider.id}>
            <TableCell>{serviceProvider.user?.name || 'N/A'}</TableCell>
            <TableCell>{serviceProvider.service}</TableCell>
            <TableCell>{serviceProvider.rating}</TableCell>
            <TableCell className="text-right">
                <TableActions serviceProvider={serviceProvider} role={currentUserRole} onAction={handleAction} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ServiceProviderRealDataTable;
