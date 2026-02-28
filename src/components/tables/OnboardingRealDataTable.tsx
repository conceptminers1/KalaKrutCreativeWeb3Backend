import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/Table";
import { Button } from '@/components/ui/Button';
import { OnboardingRequest } from '@/types';
import { CheckCircle, XCircle, Clock, Search, ShieldCheck, ChevronDown, Calendar, FileText } from 'lucide-react';

const StatusBadge = ({ status }: { status: 'Pending' | 'Approved' | 'Denied' }) => {
    const config = {
        Pending: { icon: Clock, classes: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' },
        Approved: { icon: CheckCircle, classes: 'bg-green-500/10 text-green-300 border-green-500/20' },
        Denied: { icon: XCircle, classes: 'bg-red-500/10 text-red-300 border-red-500/20' },
    };
    const { icon: Icon, classes } = config[status];

    return (
        <span className={`inline-flex items-center gap-1.5 justify-center font-medium px-3 py-1.5 text-xs rounded-full border ${classes}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
        </span>
    );
};

interface OnboardingRealDataTableProps {
  requests: OnboardingRequest[];
  onStatusChange: (id: string, newStatus: 'Approved' | 'Denied') => void;
}

const OnboardingRealDataTable: React.FC<OnboardingRealDataTableProps> = ({ requests, onStatusChange }) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows(current => 
      current.includes(id) ? current.filter(rowId => rowId !== id) : [...current, id]
    );
  };

  return (
    <div className="bg-kala-900/40 border border-kala-700 rounded-xl p-6 text-white">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="text-kala-secondary"/>Onboarding Requests</h2>
      <div className="overflow-x-auto">
        <Table className="bg-kala-900 text-white rounded-lg p-6">
          <TableCaption>A list of real-time user onboarding requests. Click a row to see more details.</TableCaption>
          <TableHeader>
            <TableRow className="border-kala-700 hover:bg-transparent">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="text-kala-300">User</TableHead>
              <TableHead className="text-kala-300">Request Type</TableHead>
              <TableHead className="text-kala-300">Requested Role</TableHead>
              <TableHead className="text-kala-300">Status</TableHead>
              <TableHead className="text-kala-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => {
                const isExpanded = expandedRows.includes(request.id);
                return (
                  <React.Fragment key={request.id}>
                    <TableRow onClick={() => toggleRow(request.id)} className="border-kala-800 hover:bg-kala-800/50 cursor-pointer">
                      <TableCell className="px-2">
                        <ChevronDown className={`w-5 h-5 text-kala-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </TableCell>
                      <TableCell className="font-medium">
                          <div className="text-white">{request.name}</div>
                          <div className="text-xs text-kala-400">{request.email}</div>
                      </TableCell>
                      <TableCell>
                          <span className={`font-medium ${request.type === 'Lead' ? 'text-cyan-300' : 'text-purple-300'}`}>
                              {request.type}
                          </span>
                      </TableCell>
                      <TableCell className="text-kala-200">{request.requestedRole}</TableCell>
                      <TableCell><StatusBadge status={request.status} /></TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        {request.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-2">
                                <Button onClick={() => onStatusChange(request.id, 'Approved')} className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-300 text-xs font-bold rounded-md transition">Approve</Button>
                                <Button onClick={() => onStatusChange(request.id, 'Denied')} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold rounded-md transition">Deny</Button>
                            </div>
                        ) : (
                          <span className='text-xs text-kala-500 px-3'>Actioned</span>
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="border-x border-x-kala-700 bg-kala-900/50">
                        <TableCell colSpan={6} className="p-0">
                          <div className="p-4 grid grid-cols-2 gap-4 bg-kala-800/50 m-2 rounded-lg border border-kala-700">
                            <div className="flex flex-col gap-2">
                              <h4 className="font-bold text-sm flex items-center gap-2 text-kala-300"><Calendar size={16}/>Request Date</h4>
                              <p className="text-sm text-kala-200">{new Date(request.date).toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <h4 className="font-bold text-sm flex items-center gap-2 text-kala-300"><FileText size={16}/>Notes</h4>
                              <p className="text-sm text-kala-400 italic">{request.notes || "No notes provided."}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                )
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Search className="w-12 h-12 text-kala-600"/>
                    <h3 className="text-lg font-bold text-kala-300">No Matching Requests</h3>
                    <p className="text-sm text-kala-400">No onboarding requests were found for the selected filter.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OnboardingRealDataTable;
