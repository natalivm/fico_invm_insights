
import React from 'react';
import { Slide, Scenario, CompressionPoint, FCFDataPoint, ReturnMatrixPoint } from './types';

export const SLIDES: Slide[] = [
  { id: 0, label: "Вступ" },
  { id: 1, label: "Поточна оцінка" },
  { id: 2, label: "Звідки 38%?" },
  { id: 3, label: "Три сценарії" },
  { id: 4, label: "Через FCF" },
  { id: 5, label: "Compression ризик" },
  { id: 6, label: "Ймовірнісна модель" },
  { id: 7, label: "Висновок" },
];

export const SCENARIO_DATA: Scenario[] = [
  { 
    name: "Bull Case", 
    eps5y: 121, 
    price5y: 3388, 
    cagr: 21, 
    prob: 50, 
    color: "#22c55e",
    description: "22% EPS CAGR / P/E 28"
  },
  { 
    name: "Base Case", 
    eps5y: 94, 
    price5y: 2350, 
    cagr: 12.6, 
    prob: 35, 
    color: "#f59e0b",
    description: "16% EPS CAGR / P/E 25"
  },
  { 
    name: "Bear Case", 
    eps5y: 79, 
    price5y: 1738, 
    cagr: 6, 
    prob: 15, 
    color: "#ef4444",
    description: "12% EPS CAGR / P/E 22"
  },
];

export const COMPRESSION_DATA: CompressionPoint[] = [
  { scenario: "EPS +20%", future: 1188, change: -8.6 },
  { scenario: "EPS +15%", future: 1140, change: -12 },
  { scenario: "EPS +10%", future: 1089, change: -16 },
  { scenario: "EPS flat", future: 990, change: -24 },
];

export const FCF_DATA: FCFDataPoint[] = [
  { year: "2025", fcf: 1.0 },
  { year: "2026E", fcf: 1.2 },
  { year: "2027E", fcf: 1.45 },
  { year: "2028E", fcf: 1.65 },
  { year: "2029E", fcf: 1.85 },
  { year: "2030E", fcf: 2.1 },
];

export const RETURN_MATRIX: ReturnMatrixPoint[] = [
  { growth: "25% CAGR", ret: 24, color: "#16a34a" },
  { growth: "22% CAGR", ret: 21, color: "#22c55e" },
  { growth: "18% CAGR", ret: 15, color: "#84cc16" },
  { growth: "15% CAGR", ret: 9, color: "#f59e0b" },
  { growth: "12% CAGR", ret: 4, color: "#ef4444" },
];
