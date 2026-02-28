import React from 'react';
import { Button } from '@/components/ui/Button';
import { Users, UserPlus, FileText } from 'lucide-react';

interface OnboardingFilterPanelProps {
  onFilterChange: (filter: 'all' | 'Lead' | 'Join Request') => void;
  activeFilter: string;
}

const OnboardingFilterPanel: React.FC<OnboardingFilterPanelProps> = ({ onFilterChange, activeFilter }) => {
  
  const getButtonClasses = (filterName: 'all' | 'Lead' | 'Join Request') => {
    const base = "w-full justify-center gap-2 py-3 text-base border transition-colors";
    
    if (activeFilter === filterName) {
      return `${base} bg-kala-secondary text-kala-900 font-bold border-kala-secondary`;
    }
    
    switch (filterName) {
      case 'Lead':
        return `${base} bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/20`;
      case 'Join Request':
        return `${base} bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20`;
      default:
        return `${base} bg-kala-800 hover:bg-kala-700 border-kala-600`;
    }
  };

  return (
    <div className="bg-kala-900/40 border border-kala-700 rounded-xl p-6 text-white h-full">
      <h2 className="text-xl font-bold mb-4">Request Filters</h2>
      <p className="text-sm text-kala-400 mb-6">Select a category to filter the onboarding requests shown in the main table.</p>
      <div className="space-y-3">
        <Button 
          onClick={() => onFilterChange('all')} 
          className={getButtonClasses('all')}
        >
          <Users size={18} /> Show All
        </Button>
        
        <Button 
          onClick={() => onFilterChange('Lead')} 
          className={getButtonClasses('Lead')}
        >
          <UserPlus size={18} /> Leads
        </Button>

        <Button 
          onClick={() => onFilterChange('Join Request')} 
          className={getButtonClasses('Join Request')}
        >
          <FileText size={16} /> Join Requests
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFilterPanel;
