
export interface TreasuryAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  allocation: number;
  trend: 'up' | 'down';
}

export interface ExpenseItem {
  label: string;
  value: number;
}

export interface ExpenseData {
  operational: ExpenseItem[];
  grants: ExpenseItem[];
}

export interface RecentMovement {
  type: string;
  amount: number;
  currency: string;
}

export interface TreasuryDashboardData {
  totalValue: number;
  totalValueTrend: number;
  monthlyBurnRate: number;
  runwayEstimate: number;
  treasuryAssets: TreasuryAsset[];
  expenseData: ExpenseData;
  recentMovements: RecentMovement[];
}
