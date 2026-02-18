
export interface HistDataPoint {
  y: string;
  rev: number;
  fcf: number;
  epsN: number;
}

export interface Scenario {
  label: string;
  cagr: number;
  pe: number;
  price5: number;
  ret: number;
  prob: number;
  color: string;
  driver: string;
}

export interface Risk {
  r: string;
  prob: string;
  impact: string;
  c: string;
  detail: string;
}

export interface FinancialRow {
  m: string;
  v: string[];
  cagr: string;
  sub?: boolean;
  bold?: boolean;
}
