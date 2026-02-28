
import React from 'react';
import { Button } from '@/components/ui/Button';
import RosterAnalyticsRealDataTable from '@/components/tables/RosterAnalyticsRealDataTable';

interface RosterAnalyticsPageProps {
  onNavigate: (view: string) => void;
}

const RosterAnalyticsPage: React.FC<RosterAnalyticsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white mb-1">Roster Analytics</h1>
        <Button onClick={() => onNavigate('roster')}>Back to Roster</Button>
      </div>
      <RosterAnalyticsRealDataTable />
    </div>
  );
};

export default RosterAnalyticsPage;
