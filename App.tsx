import React, { useState, useCallback, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line
} from 'recharts';
import { SLIDES, HIST_DATA, RISKS } from './constants';
import { AiInsightBox } from './components/AiInsightBox';
import { getLatestStockData } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";

// --- Types & Data ---

type InvestmentRating = 'Strong Buy' | 'Buy' | 'Hold' | 'Sell';

interface StockStat {
  label: string;
  value: string;
  color: string;
}

interface Stock {
  id: string;
  ticker: string;
  name: string;
  price: string;
  change: string;
  color: string;
  logo: string;
  stats: StockStat[];
  rs?: number; // Relative Strength Rating
  rating: InvestmentRating; 
  beta: number; // For acceleration logic
  accelerationProb: string; // Probability of hitting target early
  timeToMilestone: string; // Hyper-growth timeline
  momentumUpside1Y: string; // 1-year "stars align" upside
  // Extended fields for dynamic models
  type?: string;
  typeLabel?: string;
  typeDesc?: string;
  marketCap?: string;
  grossMargin?: string;
  ebitMargin?: string;
  fcfMargin?: string;
  trailingPE?: string;
  forwardPE?: string;
  fromPeak?: string;
  moat?: string;
  cycleRisk?: string;
  buybacks?: string;
  hist?: any[];
  scenarios?: any[];
  risks?: any[];
  strengths?: string[];
  weaknesses?: string[];
  verdict?: string;
  verdictColor?: string;
}

const ANET_HIST = [
  { y: "FY22",  rev: 4.38, fcf: 0.45, eps: 1.07, ebitdaM: 41 },
  { y: "FY23",  rev: 5.86, fcf: 2.00, eps: 1.73, ebitdaM: 44 },
  { y: "FY24",  rev: 7.05, fcf: 3.10, eps: 2.33, ebitdaM: 46 },
  { y: "FY25A", rev: 9.00, fcf: 4.25, eps: 2.98, ebitdaM: 48.2 },
  { y: "FY26E", rev: 11.25, fcf: 5.30, eps: 3.43, ebitdaM: 46 },
];

const INITIAL_STOCKS: Stock[] = [
  {
    id: 'anet',
    ticker: 'ANET',
    name: 'Arista Networks, Inc.',
    price: '$140.00',
    change: '+0.2%',
    color: '#10b981',
    logo: 'A',
    rs: 81,
    rating: 'Buy',
    beta: 1.42,
    accelerationProb: "40%",
    timeToMilestone: "1.8 - 2.5 Years",
    momentumUpside1Y: "+35%",
    typeLabel: "Structural Compounder",
    typeDesc: "Найякісніший pure-play AI networking compounder. Ethernet dominance.",
    marketCap: "$44.2B",
    grossMargin: "64.6%",
    ebitMargin: "48.2%",
    moat: "9/10",
    forwardPE: "42x",
    stats: [
      { label: "ЦІНА", value: "$140.00", color: "text-white" },
      { label: "BETA", value: "1.42", color: "text-emerald-400" },
      { label: "1Y UPSIDE", value: "+35%", color: "text-blue-400" }
    ],
    hist: ANET_HIST,
    scenarios: [
      { label: "Bull", color: "#22c55e", cagr: 22, pe: 40, eps5: 8.96, price5: 358, ret: 21, prob: 30, driver: "AI buildout без спаду, memory вирішується" },
      { label: "Base", color: "#f59e0b", cagr: 14, pe: 32, eps5: 6.54, price5: 209, ret: 8, prob: 45, driver: "Lumpy execution, memory тиск" },
      { label: "Bear", color: "#ef4444", cagr: 8,  pe: 25, eps5: 4.52, price5: 113, ret: -4, prob: 25, driver: "AI capex digestion, shipment delay" }
    ],
    risks: [
      { r: "Multiple Compression", prob: "45%", impact: "Дуже Високий", detail: "Forward P/E ~42x. Нормалізація до 30x downside складає -27%." },
      { r: "Concentration", prob: "35%", impact: "Високий", detail: "Customer A+B = 42% revenue." }
    ],
    strengths: ["AI networking x2 growth guide", "47% FCF margin"],
    weaknesses: ["Margin compression in 2026", "High valuation premium"],
    verdict: "ANET — це найякісніший play на AI networking. Висока бета (1.42) означає, що при підтвердженні AI-тези у 2026, ціль $200+ може быть досягнута за 18 місяців."
  },
  {
    id: 'spot',
    ticker: 'SPOT',
    name: 'Spotify Technology S.A.',
    price: '$478.00',
    change: '+0.5%',
    color: '#1DB954',
    logo: 'S',
    rs: 89,
    rating: 'Strong Buy',
    beta: 1.25,
    accelerationProb: "65%",
    timeToMilestone: "2.5 - 3.5 Years",
    momentumUpside1Y: "+20%",
    typeLabel: "Structural Compounder",
    typeDesc: "Early cash machine stage. Structural improvement in margins.",
    marketCap: "$95.3B",
    grossMargin: "32.4%",
    ebitMargin: "13.0%",
    stats: [
      { label: "ЦІНА", value: "$478.00", color: "text-white" },
      { label: "EV/FCF", value: "25.2x", color: "text-emerald-400" },
      { label: "NET CASH", value: "$9B", color: "text-blue-400" }
    ],
    hist: [
      { y: "2022", rev: 11.7, fcf: 0.30, eps: -1.51 },
      { y: "2023", rev: 13.2, fcf: 0.80, eps: -0.90 },
      { y: "2024", rev: 16.1, fcf: 2.20, eps: 3.40 },
      { y: "2025", rev: 20.4, fcf: 3.42, eps: 5.27 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", cagr: 20.9, pe: 28, price5: 840, ret: 18.5, prob: 30, driver: "Gross margin → 35–37%, Ads step-up 2H'26+, AI efficiency" },
      { label: "Base", color: "#60a5fa", cagr: 16.5, pe: 22, price5: 550, ret: 12.5, prob: 45, driver: "Realistic execution, rev 12% CAGR, FCF margin 20.5%" },
      { label: "Bear", color: "#f87171", cagr: 8.0, pe: 16, price5: 400, ret: 6.0, prob: 25, driver: "Rev slowdown · Margin stagnates ~18%" }
    ],
    risks: [
      { r: "Margin Stagnation", prob: "40%", impact: "Високий", detail: "FCF margin fails to reach 22-24%, staying at ~18%." },
      { r: "Ads Recovery Miss", prob: "30%", impact: "Помірний", detail: "Ads recovery fails to provide the expected multi-year tailwind." }
    ],
    strengths: ["Structural cash machine shift", "Ads revenue step-up in 2026"],
    weaknesses: ["Tax normalization drag", "EV/FCF multiple compression risk"],
    verdict: "SPOT — це structural compounder, що перетворюється на cash machine. Ставка на виконання (Ads, Gross Margin 35%+), а не просто на цикл. Прогноз дохідності 15%+ IRR має 60-65% ймовірності."
  },
  {
    id: 'cls',
    ticker: 'CLS',
    name: 'Celestica, Inc.',
    price: '$293.90',
    change: '+1.5%',
    color: '#f59e0b',
    logo: 'C',
    rs: 92,
    rating: 'Hold',
    beta: 1.85,
    accelerationProb: "28%",
    timeToMilestone: "3.0 - 4.0 Years",
    momentumUpside1Y: "+15%",
    typeLabel: "B) Циклічний Growth",
    typeDesc: "EMS з AI-інфраструктурним tailwind. Execution + operating leverage.",
    marketCap: "$34B",
    grossMargin: "11.5%",
    ebitMargin: "7.5%",
    forwardPE: "33.6x",
    stats: [
      { label: "ЦІНА", value: "$293.90", color: "text-white" },
      { label: "FWD P/E", value: "33.6x", color: "text-amber-400" },
      { label: "CAPEX 2026", value: "$1B", color: "text-rose-400" }
    ],
    hist: [
      { y: "FY22",  rev: 7.20,  fcf: 0.18, eps: 2.50, opM: 5.5 },
      { y: "FY23",  rev: 9.20,  fcf: 0.28, eps: 3.88, opM: 6.3 },
      { y: "FY24",  rev: 10.20, fcf: 0.35, eps: 4.72, opM: 7.2 },
      { y: "FY25A", rev: 12.40, fcf: 0.45, eps: 6.05, opM: 7.5 },
      { y: "FY26E", rev: 17.00, fcf: 0.50, eps: 8.75, opM: 7.8 },
    ],
    scenarios: [
      { label: "Bull", cagr: 20, pe: 28, price5: 610, ret: 16, prob: 28, color: "#22c55e", driver: "1.6T рамп 2027–28 + next-gen compute + capex $1B 'відбивається' в EBIT" },
      { label: "Base", cagr: 12, pe: 20, price5: 308, ret: 1,  prob: 47, color: "#f59e0b", driver: "AI cycle продовжується, але margin pressure зростає, P/E нормалізується" },
      { label: "Bear", cagr: 3,  pe: 15, price5: 153, ret: -12, prob: 25, color: "#ef4444", driver: "Hyperscaler capex pause + клієнт №1 перерозподіляє share + P/E collapses" },
    ],
    risks: [
      { r: "Валюація / P/E De-rating", prob: "55–65%", impact: "Дуже Високий", detail: "Trailing P/E ~49x, forward ~34x для EMS. Hist. range 15–25x. Downside -40% без погіршення бізнесу." },
      { r: "Концентрація: Топ-3 = 63%", prob: "40–50%", impact: "Дуже Високий", detail: "Клієнт №1 = 36%, №2 = 15%, №3 = 12%. Разом 63% revenue. Один сигнал — і quarterly miss." },
      { r: "CapEx $1B у 2026", prob: "35–45%", impact: "Високий", detail: "CapEx стрибає з $201M до $1B. Execution bet на 2027. Якщо замовлення сповільнюються — burn без return." }
    ],
    strengths: ["EPS guide $8.75: +45% YoY", "ROIC 43% — пікова ефективність"],
    weaknesses: ["FCF yield лише ~1.7%", "Екстремальна концентрація клієнтів"],
    verdict: "Celestica — це найкращий EMS виконавець в AI infrastructure. Але оцінка P/E 34x для EMS компанії — це historical anomaly. Це не ставка на compounder — це ставка на те, що AI capex cycle продовжується до 2028 без паузи. Ідеальна точка входу: $180–200 (P/E ~22x)."
  },
  {
    id: 'tln',
    ticker: 'TLN',
    name: 'Talen Energy Corp.',
    price: '$238.00',
    change: '+0.4%',
    color: '#f59e0b',
    logo: 'T',
    rs: 83,
    rating: 'Buy',
    beta: 1.15,
    accelerationProb: "55%",
    timeToMilestone: "1.2 - 1.5 Years",
    momentumUpside1Y: "+45%",
    typeLabel: "Power / AI Infrastructure",
    typeDesc: "Nuclear baseload (Susquehanna) + AWS colocation.",
    marketCap: "$13.4B",
    grossMargin: "~32.5%",
    ebitMargin: "21.0%",
    moat: "9.5/10",
    forwardPE: "7.0x (P/FCF '27)",
    stats: [
      { label: "ЦІНА", value: "$238.00", color: "text-white" },
      { label: "1Y UPSIDE", value: "+45%", color: "text-amber-400" },
      { label: "EXIT P/FCF", value: "9.0x", color: "text-purple-400" }
    ],
    hist: [
      { y: "FY23", rev: 3.12, fcf: 0.08, eps: 2.15, ebitdaM: 25 },
      { y: "FY24", rev: 3.45, fcf: 5.10, eps: 3.80, ebitdaM: 28 }, 
      { y: "FY25E", rev: 4.10, fcf: 14.5, eps: 6.42, ebitdaM: 32 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", cagr: 18.8, pe: 11, eps5: 51.2, price5: 563, ret: 18.8, prob: 40, driver: "FCF/share 10% CAGR + exit 11x" },
      { label: "Base", color: "#f59e0b", cagr: 8.9, pe: 9, eps5: 40.4, price5: 364, ret: 8.9, prob: 45, driver: "FCF/share 6% CAGR + exit 9x" },
    ],
    risks: [
      { r: "FERC / ISA", prob: "45%", impact: "Високий", detail: "Блокування підключень AWS." }
    ],
    strengths: ["Unique nuclear asset", "Aggressive buyback"],
    weaknesses: ["Regulatory sensitivity"],
    verdict: "Talen — це high-beta ставка на дефіцит енергії. При позитивному рішенні FERC по ISA, акція може злетіти до $350+ вже у 2026."
  },
  { 
    id: 'wwd', 
    ticker: 'WWD', 
    name: 'Woodward, Inc.', 
    price: '$394.00', 
    change: '+0.4%', 
    color: '#a78bfa', 
    logo: 'W',
    rs: 95,
    rating: 'Hold',
    beta: 0.88,
    accelerationProb: "15%",
    timeToMilestone: "4.0 - 5.0 Years",
    momentumUpside1Y: "+8%",
    stats: [
      { label: "ЦІНА", value: "$394.00", color: "text-white" },
      { label: "BETA", value: "0.88", color: "text-slate-400" },
      { label: "FWD P/E", value: "45x", color: "text-purple-400" }
    ],
    typeLabel: "Structural Compounder",
    typeDesc: "Industrial aerospace compounder.",
    marketCap: "$23.6B",
    grossMargin: "~26.8%",
    ebitMargin: "15.6%",
    trailingPE: "57x",
    forwardPE: "45x",
    moat: "7.5/10",
    hist: [{y:"FY23",rev:2.9,fcf:0.2,eps:5.2,ebitdaM:12}],
    scenarios: [{label:"Base",color:"#f59e0b",cagr:17,pe:32,eps5:15,price5:480,ret:4,prob:45,driver:"Execution without errors"}],
    risks: [{r:"Valuation Compression",prob:"55%",impact:"Високий",detail:"Trailing P/E 57x is dangerous."}],
    strengths: ["Moat: certification", "Aero tailwinds"],
    weaknesses: ["Valuation premium"],
    verdict: "Вкрай низька ймовірність прискорення (15%) через низьку бету та вже розкручений мультиплікатор 57х."
  },
  { 
    id: 'amat', 
    ticker: 'AMAT', 
    name: 'Applied Materials', 
    price: '$368.00', 
    change: '+0.5%', 
    color: '#06b6d4', 
    logo: 'A',
    rs: 97,
    rating: 'Buy',
    beta: 1.58,
    accelerationProb: "65%",
    timeToMilestone: "1.5 - 2.0 Years",
    momentumUpside1Y: "+40%",
    stats: [
      { label: "ЦІНА", value: "$368.00", color: "text-white" },
      { label: "BETA", value: "1.58", color: "text-cyan-400" },
      { label: "1Y UPSIDE", value: "+40%", color: "text-cyan-400" }
    ],
    hist: [],
    scenarios: [{label:"Bull",color:"#22c55e",cagr:20,pe:40,eps5:25,price5:1000,ret:22,prob:35,driver:"AI semi-cap supercycle"}],
    risks: [{r:"China Export",prob:"50%",impact:"Високий",detail:"Geopolitical restrictions."}],
    strengths: ["AI semi leader", "Moat: node transition"],
    weaknesses: ["Cyclical industry"],
    verdict: "High Beta (1.58) stock. В Bull-сценарії AMAT — це ракета. Ціль $500 цілком реальна за 12 місяців при продовженні AI capex."
  },
  { 
    id: 'fn', 
    ticker: 'FN', 
    name: 'Fabrinet', 
    price: '$515.00', 
    change: '+0.4%', 
    color: '#14b8a6', 
    logo: 'N',
    rs: 95,
    rating: 'Strong Buy',
    beta: 1.35,
    accelerationProb: "70%",
    timeToMilestone: "1.0 - 1.5 Years",
    momentumUpside1Y: "+50%",
    stats: [
      { label: "ЦІНА", value: "$515.00", color: "text-white" },
      { label: "BETA", value: "1.35", color: "text-teal-400" },
      { label: "1Y UPSIDE", value: "+50%", color: "text-teal-400" }
    ],
    hist: [],
    scenarios: [{label:"Bull",color:"#22c55e",cagr:30,pe:45,eps5:35,price5:1575,ret:28,prob:35,driver:"800G optical supercycle"}],
    risks: [{r:"Concentration",prob:"45%",impact:"Високий",detail:"Reliant on NVDA."}],
    strengths: ["Sole-source optical", "NVIDIA cluster play"],
    weaknesses: ["Geography (Thailand)"],
    verdict: "Найвищий шанс прискорення. Fabrinet постачає критичні компоненти для NVIDIA. Зв'язка RS 95 + Beta 1.35 — це вибухова комбінація."
  },
  { 
    id: 'avgo', 
    ticker: 'AVGO', 
    name: 'Broadcom Inc', 
    price: '$175.40', 
    change: '+0.2%', 
    color: '#6366f1', 
    logo: 'B',
    rs: 78,
    rating: 'Strong Buy',
    beta: 1.18,
    accelerationProb: "30%",
    timeToMilestone: "2.5 - 3.5 Years",
    momentumUpside1Y: "+20%",
    stats: [
      { label: "ЦІНА", value: "$175.40", color: "text-white" },
      { label: "BETA", value: "1.18", color: "text-indigo-400" },
      { label: "FWD P/E", value: "34x", color: "text-indigo-400" }
    ],
    hist: [],
    scenarios: [{label:"Bull",color:"#22c55e",cagr:25,pe:40,eps5:25,price5:1000,ret:35,prob:40,driver:"VMware synergies"}],
    risks: [{r:"Integration Risk",prob:"35%",impact:"Помірний",detail:"Software M&A scaling."}],
    strengths: ["AI networking", "Software FCF machine"],
    weaknesses: ["Customer concentration (AAPL)"],
    verdict: "Broadcom — це гігант. Помірне прискорення можливе, але капіталізація $1.6T обмежує 'ракетний' потенціал до 20-25% в рік."
  },
  { 
    id: 'fico', 
    ticker: 'FICO', 
    name: 'Fair Isaac Corp', 
    price: '$1,351.60', 
    change: '+1.2%', 
    color: '#3b82f6', 
    logo: 'F',
    rs: 16,
    rating: 'Hold',
    beta: 1.05,
    accelerationProb: "10%",
    timeToMilestone: "5.0+ Years",
    momentumUpside1Y: "+5%",
    typeLabel: "Credit Scoring Monopoly",
    typeDesc: "Дуополія кредитного скорингу · Pricing Power · FCF Machine",
    marketCap: "$34.2B",
    grossMargin: "82.9%",
    ebitMargin: "59.7%",
    moat: "9.5/10",
    stats: [
      { label: "ЦІНА", value: "$1,351.60", color: "text-white" },
      { label: "NTM P/E", value: "30.0x", color: "text-purple-400" },
      { label: "від піку", value: "-35%", color: "text-rose-500" }
    ],
    hist: [
      { y: "FY23", rev: 1513, fcf: 465, eps: 19.71 },
      { y: "FY24", rev: 1717, fcf: 607, eps: 23.74 },
      { y: "FY25", rev: 1991, fcf: 739, eps: 29.88 },
      { y: "FY26E", rev: 2458, fcf: 1008, eps: 41.22 },
    ],
    scenarios: [
      { label: "Bull", cagr: 22, pe: 28, price5: 2548, ret: 14, prob: 55, color: "#22c55e", driver: "DLP live + FICO 10T + AI lending" },
      { label: "Base", cagr: 17, pe: 25, price5: 1825, ret: 6,  prob: 32, color: "#f59e0b", driver: "FCF $1B підтверджено, органічний ріст" },
      { label: "Bear", cagr: 11, pe: 22, price5: 1100, ret: -4, prob: 13, color: "#ef4444", driver: "Mortgage cycle + DLP delay + compression" },
    ],
    risks: [
      { r: "VantageScore parity (FHFA)", prob: "10–15%", impact: "Дуже Високий", detail: "Якщо FHFA надасть рівний LLPA grid — тиск на pricing power. CEO: відмінності 20%+ у 30% випадків." },
      { r: "Mortgage Cycle Down", prob: "25–30%", impact: "Помірний", detail: "Mortgage = 42% Scores revenue. При -30% volume → -12–15% Scores revenue. DLP частково ізолює." },
      { r: "FCF H2 Miss", prob: "30–35%", impact: "Помірний", detail: "Q1 annualized ~$660M vs $1.008B est. H2 має дати $843M — більше за весь FY25. Q2 = тригер." },
      { r: "DLP / 10T Delay", prob: "40–50%", impact: "Низький", detail: "Затримка — не відміна. Але стискає timing каталізатора і short-term sentiment." },
    ],
    strengths: ["Scores дуополія — de facto стандарт США", "FCF margin: 31% → 41% за 3 роки", "EBITDA margin expansion: 51% → 61%", "Platform NRR 122% — recurring росте", "DLP: 70–80% ринку підписано"],
    weaknesses: ["Mortgage = 42% Scores (циклічність)", "FCF Q1 annualized $660M vs $1.008B est.", "FHFA/VantageScore tail risk"],
    verdict: "FICO — де-факто стандарт кредитного ризику США з FCF 26% CAGR і EBITDA margin що йде до 61%. P/E compression з 56x до 30x вже відбулась. При ~15% очікуваної зваженої дохідності — це обґрунтована інвестиція. Головний ризик — не фундаментал, а виконання: DLP go-live і підтвердження FCF $1B у H2 FY26."
  },
  { 
    id: 'dash', 
    ticker: 'DASH', 
    name: 'DoorDash Inc', 
    price: '$165.00', 
    change: '-7.5%', 
    color: '#ef4444', 
    logo: 'D',
    rs: 14,
    rating: 'Hold',
    beta: 1.48,
    accelerationProb: "10%",
    timeToMilestone: "5.0+ Years",
    momentumUpside1Y: "-25%",
    typeLabel: "Logistics Marketplace / Cyclical Growth",
    typeDesc: "US market leader. High beta, low margin structural profile. Post-earnings sentiment shift.",
    marketCap: "$64.2B",
    stats: [
      { label: "ЦІНА", value: "$165.00", color: "text-white" },
      { label: "FAIR VALUE", value: "$115-125", color: "text-rose-500" },
      { label: "2026E EPS", value: "$6.00", color: "text-amber-400" }
    ],
    hist: [
      { y: "2023", rev: 8.63, eps: -1.42 },
      { y: "2024", rev: 10.12, eps: 0.85 },
      { y: "Q4'25A", rev: 3.955, eps: 0.48 },
      { y: "2026E", rev: 15.2, eps: 6.00 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", cagr: 22.5, pe: 24, price5: 415, ret: 19, prob: 20, driver: "23% EPS CAGR. Market maintains optimism. Ads & Grocery scale beyond expectations." },
      { label: "Base", color: "#f59e0b", cagr: 15.5, pe: 20, price5: 240, ret: 10, prob: 45, driver: "15-16% EPS growth. Margin plateau concerns. Multiple normalizes to 20x historical norms." },
      { label: "Bear", color: "#ef4444", cagr: 12.0, pe: 18, price5: 190, ret: 3, prob: 35, driver: "Growth slows to 12%. P/E collapses. Margin contraction due to competition." }
    ],
    risks: [
      { r: "Valuation Gap (DASH-gap)", prob: "70%", impact: "Дуже Високий", detail: "Fair value is $120. At $165, market implies Bull case. Negative margin of safety." },
      { r: "Margin Plateau", prob: "60%", impact: "Високий", detail: "Structural limits of delivery marketplace. Potential stall at 15-18% FCF margins." },
      { r: "RS 14 / Momentum Breakdown", prob: "80%", impact: "Високий", detail: "Broken 50 MA and RS 14 signal a major shift from 'momentum story' to 'execution story'." }
    ],
    strengths: ["38% Revenue Growth YoY"],
    weaknesses: ["EPS Miss (-17%)", "Weak Technical Indicators (RS 14)", "High execution sensitivity"],
    verdict: "Звіт Q4 2025 зламав momentum-кейс DASH. Не дивлячись на ріст виручки +38%, просадка по EPS (-17%) вказує на проблеми з маржею. При базовому сценарії (15% ріст) справедлива ціна становить ~$120. Ймовірність 15% CAGR впала з 50% до 35%. Downside значно перевищує Upside."
  },
];

const TooltipStyle = { 
  contentStyle: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" },
  itemStyle: { color: "#e2e8f0" }
};

const Chip: React.FC<{ label: string; val: string; color: string; sub?: string }> = ({ label, val, color, sub }) => (
  <div className="bg-slate-900 border-t-2 rounded-xl p-4 transition-all hover:bg-slate-800 shadow-lg" style={{ borderColor: color }}>
    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black" style={{ color }}>{val}</div>
    {sub && <div className="text-slate-600 text-[10px] mt-1 font-medium">{sub}</div>}
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'HOME' | 'ANALYSIS' | 'GENERATOR'>('HOME');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [slide, setSlide] = useState(0);
  const [activeRisk, setActiveRisk] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rawText, setRawText] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genError, setGenError] = useState("");

  const go = useCallback((d: number) => setSlide(s => Math.max(0, Math.min(SLIDES.length - 1, s + d))), []);
  const backToHome = useCallback(() => { setView('HOME'); setSelectedStock(null); setSlide(0); setGenProgress(0); }, []);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const updates = await getLatestStockData(stocks.map(s => s.ticker));
    if (updates) {
      setStocks(current => current.map(s => {
        const up = updates[s.ticker];
        if (!up) return s;
        return {
          ...s, price: up.price, change: up.change,
          stats: s.stats.map(st => st.label === "ЦІНА" ? { ...st, value: up.price } : st)
        };
      }));
    }
    setIsRefreshing(false);
  };

  const getRatingColor = (rating: InvestmentRating) => {
    switch (rating) {
      case 'Strong Buy': return 'text-emerald-400';
      case 'Buy': return 'text-blue-400';
      case 'Hold': return 'text-amber-400';
      case 'Sell': return 'text-rose-500';
      default: return 'text-white';
    }
  };

  const generateModel = async () => {
    if (!rawText.trim()) return;
    setGenLoading(true);
    setGenProgress(5);
    setGenError("");

    const progressInterval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 92) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 8;
      });
    }, 600);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Ти — експертний фінансовий аналітик. Твоє завдання — перетворити наданий текст аналізу акції на структуровану модель у форматі JSON.
      Обчисли також показник Momentum Acceleration:
      - beta: (число 0.5-2.0)
      - accelerationProb: (%) ймовірність досягти цілі за 1-2 роки замість 5
      - timeToMilestone: (текст) термін досягнення цілі при гіпер-рості
      - momentumUpside1Y: (%) апсайд за 1 рік якщо зірки зійдуться
      
      Структура JSON:
      {
        "ticker": "Тікер",
        "name": "Назва компанії",
        "price": "$Ціна",
        "marketCap": "Капіталізація",
        "beta": 1.25,
        "accelerationProb": "XX%",
        "timeToMilestone": "X - X Years",
        "momentumUpside1Y": "+XX%",
        "rating": "Strong Buy | Buy | Hold | Sell",
        "verdictColor": "#HexCode",
        "hist": [],
        "scenarios": [
           {"label":"Bull", "color":"#22c55e", "cagr": 25, "pe": 40, "price5": 1200, "ret": 22, "prob": 30, "driver": "Textual driver"},
           {"label":"Base", "color":"#f59e0b", "cagr": 15, "pe": 30, "price5": 800, "ret": 12, "prob": 50, "driver": "Textual driver"},
           {"label":"Bear", "color":"#ef4444", "cagr": 5, "pe": 20, "price5": 400, "ret": -5, "prob": 20, "driver": "Textual driver"}
        ],
        "risks": [{"r": "Risk Title", "prob": "30%", "impact": "Високий", "detail": "Risk Detail"}],
        "strengths": ["Strength 1"],
        "weaknesses": ["Weakness 1"],
        "verdict": "Фінальний висновок..."
      }

      ТЕКСТ ДЛЯ АНАЛІЗУ:
      ${rawText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const newStock: Stock = {
          ...parsed,
          id: `gen-${Date.now()}`,
          color: parsed.verdictColor || '#3b82f6',
          logo: parsed.ticker[0] || '?',
          change: '0.0%',
          stats: [
            { label: "ЦІНА", value: parsed.price || "$0.00", color: "text-white" },
            { label: "1Y UPSIDE", value: parsed.momentumUpside1Y || "0%", color: "text-cyan-400" },
            { label: "BETA", value: (parsed.beta || 1.0).toString(), color: "text-purple-400" }
          ]
        };
        
        setGenProgress(100);
        setTimeout(() => {
          setStocks(prev => [...prev, newStock]);
          setSelectedStock(newStock);
          setView('ANALYSIS');
          setSlide(0);
          setRawText("");
          setGenLoading(false);
          clearInterval(progressInterval);
        }, 500);
      }
    } catch (e: any) {
      setGenError("Помилка генерації: " + e.message);
      setGenLoading(false);
      clearInterval(progressInterval);
    }
  };

  const renderGenerator = () => (
    <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-white mb-4">AI Model Generator</h2>
          <p className="text-slate-500">Paste raw analysis text to calculate Momentum Acceleration and 5Y targets.</p>
        </div>
        <div className="bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8 shadow-2xl">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste analysis text here... (e.g. from TIKR or analyst report)"
            className="w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-300 focus:outline-none focus:border-blue-500 transition-all resize-none mb-6 font-mono text-sm"
          />
          {genError && <p className="text-rose-500 text-sm mb-4">{genError}</p>}
          <button
            onClick={generateModel}
            disabled={genLoading || !rawText.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            {genLoading ? 'Генерація...' : 'Аналізувати & Згенерувати Модель'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Investment Insights</h2>
            <p className="text-slate-500 text-lg">Focus on high-beta momentum and 5Y growth quality.</p>
          </div>
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {isRefreshing ? 'Оновлення...' : 'Оновити ціни'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map(stock => (
            <div 
              key={stock.id} 
              onClick={() => { setSelectedStock(stock); setView('ANALYSIS'); setSlide(0); }} 
              className="bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8 cursor-pointer hover:border-blue-500 transition-all hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white text-3xl font-black tracking-tighter leading-none mb-1">{stock.ticker}</div>
                  <div className="text-slate-500 text-xs font-medium truncate max-w-[120px]">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">{stock.price}</div>
                  <div className={`text-[11px] font-bold ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>{stock.change}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className={`text-[10px] font-black uppercase tracking-widest ${getRatingColor(stock.rating)}`}>
                  {stock.rating}
                </div>
                {(stock.beta >= 1.3 || (stock.rs && stock.rs > 90)) && (
                   <div className="flex items-center gap-1 text-cyan-400 text-[9px] font-black uppercase bg-cyan-400/10 px-2 py-0.5 rounded">
                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                     MOMENTUM
                   </div>
                )}
              </div>
            </div>
          ))}
          <div onClick={() => setView('GENERATOR')} className="bg-[#0e1829] border-2 border-dashed border-[#1e3251] rounded-3xl p-8 flex items-center justify-center cursor-pointer hover:border-blue-500 group transition-all">
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg className="w-8 h-8 text-slate-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!selectedStock) return null;
    const histData = selectedStock.hist || [];
    const risksData = selectedStock.risks || [];
    const scenariosData = selectedStock.scenarios || [];

    return (
      <div className="max-w-6xl mx-auto space-y-10">
        {/* SNAPSHOT SLIDE */}
        {slide === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{selectedStock.ticker} Analysis Snapshot</span>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">{selectedStock.name}</h2>
              <p className="text-slate-500 text-lg mt-2">{selectedStock.typeLabel}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Chip label="Market Cap" val={selectedStock.marketCap || "N/A"} color="#3b82f6" sub="Total Value" />
              <Chip label="Gross Margin" val={selectedStock.grossMargin || "N/A"} color="#22c55e" sub="Profitability" />
              <Chip label="BETA" val={selectedStock.beta.toString()} color="#a855f7" sub="Volatility Index" />
              <Chip label="RS Rating" val={selectedStock.rs?.toString() || "N/A"} color="#f59e0b" sub="Strength Rank" />
            </div>
            <AiInsightBox slideTitle="Summary" slideData={histData} stockId={selectedStock.id} ticker={selectedStock.ticker} />
          </div>
        )}

        {/* FINANCIALS SLIDE */}
        {slide === 1 && (
           <div className="space-y-6">
             <h2 className="text-3xl font-black text-white">Фінансові Тренди</h2>
             <div className="h-80 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="y" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip {...TooltipStyle} />
                    <Bar name="Revenue" dataKey="rev" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar name="FCF" dataKey="fcf" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <AiInsightBox slideTitle="Financial Analysis" slideData={histData} stockId={selectedStock.id} ticker={selectedStock.ticker} />
           </div>
        )}

        {/* SCENARIOS SLIDE */}
        {slide === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">Моделювання Сценаріїв (5 років)</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {scenariosData.map((s: any, i: number) => (
                <div key={i} className="bg-slate-900 border-t-4 p-6 rounded-2xl shadow-lg" style={{borderColor: s.color}}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-lg">{s.label} Case</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.prob}% Prob</span>
                  </div>
                  <div className="text-3xl font-black mb-1" style={{color: s.color}}>${s.price5}</div>
                  <div className="text-xs text-slate-500 mb-6 uppercase tracking-widest">Target in 5Y</div>
                  <p className="text-sm text-slate-400 italic mb-6">"{s.driver}"</p>
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">CAGR Expectation</span>
                      <span className="text-slate-300 font-bold">{s.cagr}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISKS SLIDE */}
        {slide === 3 && (
           <div className="space-y-6">
             <h2 className="text-3xl font-black text-white">Карта Ризиків</h2>
             <div className="grid md:grid-cols-2 gap-4">
                {risksData.map((risk: any, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveRisk(risk.r === activeRisk ? null : risk.r)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${activeRisk === risk.r ? 'bg-slate-800 border-blue-500' : 'bg-slate-900 border-slate-800'}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-slate-100">{risk.r}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${risk.impact === 'Дуже Високий' || risk.impact === 'Високий' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>{risk.impact}</span>
                    </div>
                    {activeRisk === risk.r && <p className="text-sm text-slate-400 mt-4 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">{risk.detail}</p>}
                  </div>
                ))}
             </div>
           </div>
        )}

        {/* VERDICT SLIDE */}
        {slide === 4 && (
          <div className="bg-gradient-to-br from-[#1e1b4b] to-slate-950 p-12 rounded-3xl text-center border border-blue-500/30 shadow-2xl relative overflow-hidden">
            <h3 className="text-4xl font-black mb-6 text-white uppercase tracking-tight">Investment Verdict</h3>
            <div className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
              {selectedStock.verdict}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">5Y Expected Target</div>
                <div className="text-4xl font-black text-blue-400 tracking-tighter">
                  ${selectedStock.scenarios?.[1]?.price5 || "N/A"}
                </div>
                <div className="text-[10px] text-slate-600 mt-2 italic">Standard Base Case</div>
              </div>
              
              <div className="bg-indigo-900/40 p-8 rounded-3xl border border-indigo-500/30 ring-2 ring-indigo-500/20">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">Momentum Acceleration</div>
                </div>
                <div className="text-4xl font-black text-cyan-400 tracking-tighter">
                  {selectedStock.momentumUpside1Y}
                </div>
                <div className="text-[10px] text-indigo-300 mt-2 italic">Potential 12M Return</div>
              </div>

              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Hyper-Growth Timeline</div>
                <div className="text-3xl font-black text-emerald-400 tracking-tighter">
                  {selectedStock.timeToMilestone}
                </div>
                <div className="text-[10px] text-slate-600 mt-2 italic">Chance to hit early: {selectedStock.accelerationProb}</div>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={backToHome} className="bg-slate-800 px-10 py-4 rounded-2xl font-black text-slate-300 shadow-lg hover:text-white transition-all uppercase tracking-widest text-xs">
                Back to Portfolio
              </button>
              <button onClick={() => setSlide(0)} className="bg-blue-600 px-10 py-4 rounded-2xl font-black text-white shadow-lg hover:bg-blue-500 transition-all uppercase tracking-widest text-xs">
                Review Snapshot
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080d1a] text-slate-200 select-none font-inter">
      <header className="bg-[#0e1829] border-b border-[#1e3251] px-6 py-3 flex items-center justify-between z-10 shrink-0 shadow-lg">
        <div className="flex items-center gap-4 cursor-pointer" onClick={backToHome}>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-1.5 rounded-lg shadow-lg">
            <span className="font-black text-xl tracking-tighter text-white">INSIGHTS</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-tight">Investment Discovery Platform</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Advanced Financial Modeling</p>
          </div>
        </div>
        {view === 'ANALYSIS' && selectedStock && (
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-2xl">
               <span className="text-xl font-black text-white tracking-tighter">{selectedStock.ticker}</span>
               <div className="h-6 w-px bg-slate-800"></div>
               <div className="flex flex-col items-start leading-none">
                 <span className="text-lg font-black text-emerald-400 mb-0.5">{selectedStock.price}</span>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${selectedStock.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {selectedStock.change}
                 </span>
               </div>
             </div>
             <div className="hidden sm:flex w-8 h-8 rounded-full bg-slate-800 items-center justify-center text-[10px] font-black text-blue-400 border border-slate-700">AI</div>
          </div>
        )}
      </header>
      
      {view === 'ANALYSIS' && (
        <nav className="flex gap-2 p-3 bg-[#0e1829] border-b border-[#1e3251] overflow-x-auto no-scrollbar shrink-0 shadow-md items-center">
          {SLIDES.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setSlide(i)} 
              className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${slide === i ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
            >
              {s}
            </button>
          ))}
        </nav>
      )}

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#080d1a] to-[#040810]">
        {view === 'HOME' && renderHome()}
        {view === 'GENERATOR' && renderGenerator()}
        {view === 'ANALYSIS' && <div className="px-6 py-8 md:px-10">{renderAnalysis()}</div>}
      </main>

      {view === 'ANALYSIS' && (
        <footer className="bg-[#0e1829] border-t border-[#1e3251] px-6 py-4 flex items-center justify-between shrink-0 shadow-inner">
          <button onClick={() => go(-1)} disabled={slide === 0} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest disabled:opacity-20 hover:text-white transition-all">Назад</button>
          <div className="flex gap-3">
            {SLIDES.map((_, i) => (<div key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${slide === i ? 'w-10 bg-blue-500 shadow-lg' : 'w-2.5 bg-slate-800'}`} />))}
          </div>
          <button onClick={() => go(1)} disabled={slide === SLIDES.length - 1} className="px-10 py-3 rounded-2xl bg-blue-600 text-white shadow-lg font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all">Далі</button>
        </footer>
      )}
    </div>
  );
}
