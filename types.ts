
export interface Slide {
  id: number;
  label: string;
}

export interface Metric {
  label: string;
  val: string;
  sub: string;
  color: string;
}

export interface Scenario {
  name: string;
  eps5y: number;
  price5y: number;
  cagr: number;
  prob: number;
  color: string;
  description: string;
}

export interface CompressionPoint {
  scenario: string;
  future: number;
  change: number;
}

export interface FCFDataPoint {
  year: string;
  fcf: number;
}

export interface ReturnMatrixPoint {
  growth: string;
  ret: number;
  color: string;
}
