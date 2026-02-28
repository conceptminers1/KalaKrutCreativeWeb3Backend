
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/tables/Table';

interface AnalyticsData {
  totalArtists: number;
  totalBookingsThisMonth: number;
  mostPopularGenre: string;
  topRatedArtist: string;
  projectedMonthlyRevenue: number;
  artistGrowthRate: number;
  sponsorConversionRate: number;
}

const metricDisplayNames: Record<string, string> = {
  totalArtists: 'Total Artists',
  totalBookingsThisMonth: 'Total Bookings (This Month)',
  mostPopularGenre: 'Most Popular Genre',
  topRatedArtist: 'Top Rated Artist',
  projectedMonthlyRevenue: 'Projected Monthly Revenue',
  artistGrowthRate: 'Artist Growth Rate',
  sponsorConversionRate: 'Sponsor Conversion Rate',
};

const formatMetricValue = (key: string, value: any): string => {
  switch (key) {
    case 'projectedMonthlyRevenue':
      return `$${Number(value).toLocaleString()}`;
    case 'artistGrowthRate':
      return `+${value}%`;
    case 'sponsorConversionRate':
      return `${value}%`;
    default:
      return String(value);
  }
};

const RosterAnalyticsRealDataTable: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/roster-analytics.json');
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching roster analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-kala-900 text-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Roster Analytics</h2>
      <Table className="bg-kala-900 text-white rounded-lg p-6">
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">Loading data...</TableCell>
            </TableRow>
          ) : analyticsData ? (
            Object.entries(analyticsData).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{metricDisplayNames[key] || key}</TableCell>
                <TableCell>{formatMetricValue(key, value)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center">No data available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RosterAnalyticsRealDataTable;
