
export type InvestmentRating = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';

export interface StockStat {
  label: string;
  value: string;
  color: string;
}

export interface Scenario {
  label: string;
  price5: number;
  prob: number;
  color: string;
  driver: string;
  cagr?: number;
  pe?: number;
  ret?: number;
}

export interface Risk {
  r: string;
  prob: string;
  impact: string;
  detail: string;
  c?: string;
}

export interface HistDataPoint {
  y: string;
  rev: number;
  eps?: number;
  fcf?: number;
  epsN?: number;
}

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  price: string;
  change: string;
  color: string;
  logo: string;
  stats: StockStat[];
  rs: number; 
  rating: InvestmentRating; 
  beta: number;
  accelerationProb: string;
  timeToMilestone: string;
  momentumUpside1Y: string;
  typeLabel: string;
  dnaTags: string[];
  hist: HistDataPoint[];
  scenarios: Scenario[];
  risks: Risk[];
  verdict: string;
}

export interface FinancialRow {
  m: string;
  v: string[];
  cagr: string;
  sub?: boolean;
  bold?: boolean;
}
