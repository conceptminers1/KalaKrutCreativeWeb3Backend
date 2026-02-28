import React, { useState } from 'react';
import { Contract, ContractStatus, User, ContractType } from '../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/tables/Table";

interface ServiceContractsProps {
  currentUser: User;
  contracts: Contract[];
}

const ServiceContracts: React.FC<ServiceContractsProps> = ({ currentUser, contracts }) => {
  const [completionNotes, setCompletionNotes] = useState<{ [contractId: string]: string }>({});

  const handleNoteChange = (contractId: string, note: string) => {
    setCompletionNotes(prev => ({ ...prev, [contractId]: note }));
  };

  const handleMarkAsComplete = (contractId: string) => {
    const note = completionNotes[contractId] || '';
    // In a real app, you'd call an API to update the contract status and note
    console.log(`Marking contract ${contractId} as complete with note: ${note}`);
  };

  const servicesProvided = contracts.filter(c => c.initiatorId === currentUser.id && c.contractType === ContractType.SERVICE);
  const servicesReceived = contracts.filter(c => c.parties.some(p => p.id === currentUser.id) && c.initiatorId !== currentUser.id && c.contractType === ContractType.SERVICE);

  const renderContractRow = (contract: Contract) => (
    <TableRow key={contract.id}>
      <TableCell>{contract.title}</TableCell>
      <TableCell>{contract.status}</TableCell>
      <TableCell>
        {contract.status !== ContractStatus.FULFILLED && (
          <input
            type="text"
            placeholder="Add completion note..."
            className="bg-kala-800 text-white p-2 rounded"
            onChange={e => handleNoteChange(contract.id, e.target.value)}
          />
        )}
        {contract.completionNote}
      </TableCell>
      <TableCell>
        {contract.status !== ContractStatus.FULFILLED && (
          <button
            onClick={() => handleMarkAsComplete(contract.id)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Mark as Complete
          </button>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Services I'm Providing</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completion Note</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicesProvided.length > 0 ? (
              servicesProvided.map(renderContractRow)
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">You are not providing any services.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Services I'm Receiving</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completion Note</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicesReceived.length > 0 ? (
              servicesReceived.map(renderContractRow)
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">You are not receiving any services.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ServiceContracts;
