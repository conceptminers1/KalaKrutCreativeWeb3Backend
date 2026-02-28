import React, { useState, useEffect } from 'react';
import { BarChart3, Users, DollarSign, Activity } from 'lucide-react';

interface AnalyticsData {
  totalUsers: { value: number; change: string };
  volume30d: { value: string; change: string };
  activeDaos: { value: number; change: string };
  gigsBooked: { value: number; change: string };
  userGrowth: number[];
  recentTransactions: any[];
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics.json');
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Activity className="text-kala-secondary" /> Platform Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.totalUsers.value} change={data.totalUsers.change} icon={Users} />
        <StatCard
          label="Volume (30d)"
          value={data.volume30d.value}
          change={data.volume30d.change}
          icon={DollarSign}
        />
        <StatCard label="Active DAOs" value={data.activeDaos.value} change={data.activeDaos.change} icon={Activity} />
        <StatCard
          label="Gigs Booked"
          value={data.gigsBooked.value}
          change={data.gigsBooked.change}
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6 h-80 flex flex-col justify-center items-center">
          <p className="text-kala-400 text-sm mb-4">
            User Growth (Last 6 Months)
          </p>
          {/* Mock Chart Graphic */}
          <div className="w-full h-full flex items-end justify-between gap-2 px-4">
            {data.userGrowth.map((h, i) => (
              <div
                key={i}
                className="w-full bg-kala-secondary/20 hover:bg-kala-secondary/40 rounded-t transition-colors relative group"
              >
                <div
                  className="absolute bottom-0 w-full bg-kala-secondary"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-kala-800/50 border border-kala-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {data.recentTransactions.map((tx, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-kala-900/50 rounded border border-kala-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                    TX
                  </div>
                  <div>
                    <div className="text-sm text-slate-200 font-medium">
                      {tx.description}
                    </div>
                    <div className="text-xs text-kala-500">{tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-mono ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, change, icon: Icon }: any) => (
  <div className="bg-kala-800 border border-kala-700 rounded-xl p-4">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-kala-700/50 rounded-lg text-kala-400">
        <Icon className="w-5 h-5" />
      </div>
      <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'} px-2 py-0.5 rounded-full`}>
        {change}
      </span>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-kala-500">{label}</div>
  </div>
);

export default AnalyticsDashboard;
