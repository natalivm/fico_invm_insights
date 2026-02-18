
import { HistDataPoint, Scenario, Risk } from './types';

export const SLIDES = ["Snapshot", "Фінансові дані", "Сценарії", "Ризики", "Висновок"];

export const HIST_DATA: HistDataPoint[] = [
  { y: "FY23", rev: 1513, fcf: 465, epsN: 19.71 },
  { y: "FY24", rev: 1717, fcf: 607, epsN: 23.74 },
  { y: "FY25", rev: 1991, fcf: 739, epsN: 29.88 },
  { y: "FY26E", rev: 2458, fcf: 1008, epsN: 41.22 },
];

export const SCENARIOS: Scenario[] = [
  { label: "Bull", cagr: 22, pe: 28, price5: 2548, ret: 14, prob: 55, color: "#22c55e", driver: "DLP live + FICO 10T + AI lending" },
  { label: "Base", cagr: 17, pe: 25, price5: 1825, ret: 6,  prob: 32, color: "#f59e0b", driver: "FCF $1B підтверджено, органічний ріст" },
  { label: "Bear", cagr: 11, pe: 22, price5: 1100, ret: -4, prob: 13, color: "#ef4444", driver: "Mortgage cycle + DLP delay + compression" },
];

export const RISKS: Risk[] = [
  { r: "VantageScore parity (FHFA)", prob: "10–15%", impact: "Дуже Високий", c: "#ef4444", detail: "Якщо FHFA надасть рівний LLPA grid — тиск на pricing power. CEO: відмінності 20%+ у 30% випадків." },
  { r: "Mortgage Cycle Down", prob: "25–30%", impact: "Помірний", c: "#f59e0b", detail: "Mortgage = 42% Scores revenue. При -30% volume → -12–15% Scores revenue. DLP частково ізолює." },
  { r: "FCF H2 Miss", prob: "30–35%", impact: "Помірний", c: "#f59e0b", detail: "Q1 annualized ~$660M vs $1.008B est. H2 має дати $843M — більше за весь FY25. Q2 = тригер." },
  { r: "DLP / 10T Delay", prob: "40–50%", impact: "Низький", c: "#84cc16", detail: "Затримка — не відміна. Але стискає timing каталізатора і short-term sentiment." },
];
