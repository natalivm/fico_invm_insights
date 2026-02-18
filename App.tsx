import React, { useState, useCallback, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line
} from 'recharts';
import { SLIDES } from './constants';
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
    marketCap: "$44.2B",
    grossMargin: "64.6%",
    stats: [
      { label: "ЦІНА", value: "$140.00", color: "text-white" },
      { label: "BASE TARGET", value: "$209.00", color: "text-emerald-400" },
      { label: "BETA", value: "1.42", color: "text-blue-400" }
    ],
    hist: [
      { y: "FY22",  rev: 4.38, fcf: 0.45, eps: 1.07 },
      { y: "FY23",  rev: 5.86, fcf: 2.00, eps: 1.73 },
      { y: "FY24",  rev: 7.05, fcf: 3.10, eps: 2.33 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", cagr: 22, pe: 40, price5: 358, prob: 30, driver: "AI buildout без спаду" },
      { label: "Base", color: "#f59e0b", cagr: 14, pe: 32, price5: 209, prob: 45, driver: "Lumpy execution, memory тиск" },
      { label: "Bear", color: "#ef4444", cagr: 8,  pe: 25, price5: 113, prob: 25, driver: "AI capex digestion" }
    ],
    risks: [
      { r: "Multiple Compression", prob: "45%", impact: "Високий", detail: "Forward P/E ~42x. Нормалізація до 30x." }
    ],
    verdict: "ANET — це найякісніший play на AI networking. Висока бета (1.42) означає, що ціль $200+ може бути досягнута швидше за 5 років."
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
    marketCap: "$95.3B",
    stats: [
      { label: "ЦІНА", value: "$478.00", color: "text-white" },
      { label: "BASE TARGET", value: "$550.00", color: "text-emerald-400" },
      { label: "EV/FCF", value: "25.2x", color: "text-blue-400" }
    ],
    hist: [
      { y: "2023", rev: 13.2, fcf: 0.80 },
      { y: "2024", rev: 16.1, fcf: 2.20 },
      { y: "2025E", rev: 20.4, fcf: 3.42 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 840, prob: 30, driver: "Gross margin → 35%+" },
      { label: "Base", color: "#f59e0b", price5: 550, prob: 45, driver: "Realistic execution" },
      { label: "Bear", color: "#ef4444", price5: 400, prob: 25, driver: "Rev slowdown" }
    ],
    risks: [{ r: "Margin Stagnation", prob: "40%", impact: "Високий", detail: "FCF margin fails to reach 22-24%." }],
    verdict: "SPOT перетворюється на cash machine. Ставка на виконання (Ads, Gross Margin 35%+)."
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
    typeLabel: "Cyclical Growth",
    marketCap: "$34B",
    stats: [
      { label: "ЦІНА", value: "$293.90", color: "text-white" },
      { label: "BASE TARGET", value: "$308.00", color: "text-amber-400" },
      { label: "CAPEX 2026", value: "$1B", color: "text-rose-400" }
    ],
    hist: [
      { y: "FY23",  rev: 9.20, fcf: 0.28 },
      { y: "FY24",  rev: 10.20, fcf: 0.35 },
      { y: "FY25E", rev: 12.40, fcf: 0.45 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 610, prob: 28, driver: "1.6T ramp 2027-28" },
      { label: "Base", color: "#f59e0b", price5: 308, prob: 47, driver: "AI cycle continues but margins plateau" },
      { label: "Bear", color: "#ef4444", price5: 153, prob: 25, driver: "Hyperscaler capex pause" }
    ],
    risks: [
      { r: "P/E De-rating", prob: "60%", impact: "Дуже Високий", detail: "Historical range is 15-25x. Current is 34x." }
    ],
    verdict: "Celestica — це найкращий EMS в AI infra, але оцінка P/E 34x — це historical anomaly. Потребує корекції для входу."
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
    marketCap: "$13.4B",
    stats: [
      { label: "ЦІНА", value: "$238.00", color: "text-white" },
      { label: "BASE TARGET", value: "$364.00", color: "text-amber-400" },
      { label: "BETA", value: "1.15", color: "text-purple-400" }
    ],
    hist: [
      { y: "FY24", rev: 3.45, fcf: 5.10 },
      { y: "FY25E", rev: 4.10, fcf: 14.5 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 563, prob: 40, driver: "FCF/share 10% CAGR" },
      { label: "Base", color: "#f59e0b", price5: 364, prob: 45, driver: "FCF/share 6% CAGR" },
      { label: "Bear", color: "#ef4444", price5: 171, prob: 15, driver: "Regulatory block" }
    ],
    risks: [{ r: "Regulatory (FERC)", prob: "45%", impact: "Високий", detail: "Potential issues with AWS co-location." }],
    verdict: "Talen — це high-beta ставка на дефіцит енергії. Ключовий актив — АЕС Susquehanna."
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
    typeLabel: "Structural Compounder",
    stats: [
      { label: "ЦІНА", value: "$394.00", color: "text-white" },
      { label: "BASE TARGET", value: "$480.00", color: "text-purple-400" },
      { label: "FWD P/E", value: "45x", color: "text-slate-400" }
    ],
    hist: [{y:"FY23",rev:2.9,fcf:0.2}],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 630, prob: 20, driver: "Aero boom" },
      { label: "Base", color: "#f59e0b", price5: 480, prob: 55, driver: "Steady execution" },
      { label: "Bear", color: "#ef4444", price5: 300, prob: 25, driver: "Multiple compression" }
    ],
    risks: [{r:"Valuation",prob:"55%",impact:"Високий",detail:"Trailing P/E 57x is expensive."}],
    verdict: "Якісний бізнес, але ціна закладає ідеальність. Низька ймовірність прискорення."
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
      { label: "BASE TARGET", value: "$504.00", color: "text-cyan-400" },
      { label: "BETA", value: "1.58", color: "text-cyan-400" }
    ],
    hist: [],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 1000, prob: 35, driver: "AI supercycle" },
      { label: "Base", color: "#f59e0b", price5: 504, prob: 45, driver: "Standard growth" },
      { label: "Bear", color: "#ef4444", price5: 280, prob: 20, driver: "Geopolitics" }
    ],
    risks: [{r:"Export Controls",prob:"50%",impact:"Високий",detail:"China trade restrictions."}],
    verdict: "High Beta stock. Ставка на node transition і AI semi-cap."
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
      { label: "BASE TARGET", value: "$704.00", color: "text-teal-400" },
      { label: "BETA", value: "1.35", color: "text-teal-400" }
    ],
    hist: [],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 1575, prob: 35, driver: "800G optical boom" },
      { label: "Base", color: "#f59e0b", price5: 704, prob: 45, driver: "Strong execution" },
      { label: "Bear", color: "#ef4444", price5: 320, prob: 20, driver: "Concentration loss" }
    ],
    risks: [{r:"NVDA Reliant",prob:"45%",impact:"Високий",detail:"High customer concentration."}],
    verdict: "Найвищий шанс прискорення. Критичний постачальник для NVIDIA."
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
      { label: "BASE TARGET", value: "$238.00", color: "text-indigo-400" },
      { label: "FWD P/E", value: "34x", color: "text-indigo-400" }
    ],
    hist: [],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 480, prob: 35, driver: "VMware boom" },
      { label: "Base", color: "#f59e0b", price5: 238, prob: 50, driver: "Steady cash machine" },
      { label: "Bear", color: "#ef4444", price5: 136, prob: 15, driver: "Integration risks" }
    ],
    risks: [{r:"M&A Risk",prob:"35%",impact:"Помірний", detail:"Complexity of integration."}],
    verdict: "Гігант з диверсифікованим AI доходом. VMware додає margin leverage."
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
    stats: [
      { label: "ЦІНА", value: "$1,351.60", color: "text-white" },
      { label: "BASE TARGET", value: "$1,825.00", color: "text-blue-400" },
      { label: "FROM PEAK", value: "-35%", color: "text-rose-500" }
    ],
    hist: [
      { y: "FY24", rev: 1717, fcf: 607 },
      { y: "FY25E", rev: 1991, fcf: 739 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 2548, prob: 55, driver: "DLP live + FICO 10T" },
      { label: "Base", color: "#f59e0b", price5: 1825, prob: 32, driver: "FCF $1B confirmed" },
      { label: "Bear", color: "#ef4444", price5: 1100, prob: 13, driver: "Mortgage cycle delay" }
    ],
    risks: [{ r: "Regulatory", prob: "15%", impact: "Високий", detail: "FHFA/VantageScore parity." }],
    verdict: "FICO — це монополія кредитного ризику. P/E стиснувся до 30х, що створює вікно."
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
    typeLabel: "Logistics Marketplace",
    stats: [
      { label: "ЦІНА", value: "$165.00", color: "text-white" },
      { label: "BASE TARGET", value: "$240.00", color: "text-amber-400" },
      { label: "FAIR VALUE", value: "$120.00", color: "text-rose-500" }
    ],
    hist: [
      { y: "2024", rev: 10.12, eps: 0.85 },
      { y: "Q4'25", rev: 3.95, eps: 0.48 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 415, prob: 20, driver: "Ads & Grocery scale" },
      { label: "Base", color: "#f59e0b", price5: 240, prob: 45, driver: "Margin plateau concerns" },
      { label: "Bear", color: "#ef4444", price5: 190, prob: 35, driver: "Growth slows to 12%" }
    ],
    risks: [{ r: "Valuation Gap", prob: "70%", impact: "Високий", detail: "Market implies Bull case at $165." }],
    verdict: "Звіт Q4 зламав momentum. При базовому сценарії справедлива ціна ~$120."
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
      const prompt = `Analyze stock analysis text and produce a JSON model with 5Y scenarios (Bull, Base, Bear), risks, and Momentum indicators. Text: ${rawText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const text = response.text || "";
      const parsed = JSON.parse(text);
      const newStock: Stock = {
        ...parsed,
        id: `gen-${Date.now()}`,
        color: parsed.verdictColor || '#3b82f6',
        logo: parsed.ticker[0] || '?',
        change: '0.0%',
        stats: [
          { label: "ЦІНА", value: parsed.price || "$0.00", color: "text-white" },
          { label: "BASE TARGET", value: (parsed.scenarios?.find((s:any) => s.label === 'Base')?.price5 || "N/A").toString(), color: "text-emerald-400" },
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
    } catch (e: any) {
      setGenError("Помилка генерації: " + e.message);
      setGenLoading(false);
      clearInterval(progressInterval);
    }
  };

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
    const baseScenario = scenariosData.find(s => s.label === 'Base') || scenariosData[0];
    const baseTargetPrice = baseScenario?.price5 || "N/A";

    return (
      <div className="max-w-6xl mx-auto space-y-10">
        {slide === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{selectedStock.ticker} Analysis Snapshot</span>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">{selectedStock.name}</h2>
              <p className="text-slate-500 text-lg mt-2">{selectedStock.typeLabel}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedStock.stats.map((st, idx) => (
                <Chip key={idx} label={st.label} val={st.value} color={st.label === 'BASE TARGET' ? '#10b981' : '#3b82f6'} />
              ))}
              <Chip label="BETA" val={selectedStock.beta.toString()} color="#a855f7" />
            </div>
            <AiInsightBox slideTitle="Summary" slideData={histData} stockId={selectedStock.id} ticker={selectedStock.ticker} />
          </div>
        )}
        {slide === 1 && (
           <div className="space-y-6">
             <h2 className="text-3xl font-black text-white">Фінансові Тренди</h2>
             <div className="h-80 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="y" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip {...TooltipStyle} />
                    <Bar name="Revenue" dataKey="rev" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar name="FCF" dataKey="fcf" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
           </div>
        )}
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
                  <p className="text-sm text-slate-400 italic">"{s.driver}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {slide === 3 && (
           <div className="space-y-6">
             <h2 className="text-3xl font-black text-white">Карта Ризиків</h2>
             <div className="grid md:grid-cols-2 gap-4">
                {risksData.map((risk: any, i: number) => (
                  <div key={i} className="p-6 rounded-2xl border bg-slate-900 border-slate-800 transition-all hover:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-100">{risk.r}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${risk.impact === 'Високий' || risk.impact === 'Дуже Високий' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>{risk.impact}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{risk.detail}</p>
                    {risk.prob && <div className="mt-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ймовірність: {risk.prob}</div>}
                  </div>
                ))}
             </div>
           </div>
        )}
        {slide === 4 && (
          <div className="bg-gradient-to-br from-[#1e1b4b] to-slate-950 p-12 rounded-3xl text-center border border-blue-500/30 shadow-2xl relative overflow-hidden">
            <h3 className="text-4xl font-black mb-6 text-white uppercase tracking-tight">Investment Verdict</h3>
            <div className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">{selectedStock.verdict}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">5Y Expected Target</div>
                <div className="text-4xl font-black text-blue-400 tracking-tighter">${baseTargetPrice}</div>
                <div className="text-[10px] text-slate-600 mt-2 italic">Standard Base Case</div>
              </div>
              <div className="bg-indigo-900/40 p-8 rounded-3xl border border-indigo-500/30">
                <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-3">Momentum Upside</div>
                <div className="text-4xl font-black text-cyan-400 tracking-tighter">{selectedStock.momentumUpside1Y}</div>
                <div className="text-[10px] text-indigo-300 mt-2 italic">Potential 12M Return</div>
              </div>
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Prob of Acceleration</div>
                <div className="text-4xl font-black text-emerald-400 tracking-tighter">{selectedStock.accelerationProb}</div>
                <div className="text-[10px] text-slate-600 mt-2 italic">To target in {selectedStock.timeToMilestone}</div>
              </div>
            </div>
            <button onClick={backToHome} className="bg-slate-800 px-10 py-4 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-xs">Back to Portfolio</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080d1a] text-slate-200 select-none font-inter">
      <header className="bg-[#0e1829] border-b border-[#1e3251] px-6 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4 cursor-pointer" onClick={backToHome}>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-1.5 rounded-lg">
            <span className="font-black text-xl tracking-tighter text-white">INSIGHTS</span>
          </div>
        </div>
        {view === 'ANALYSIS' && selectedStock && (
           <div className="flex items-center gap-6">
             <div className="bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
               <span className="text-xl font-black text-white tracking-tighter">{selectedStock.ticker}</span>
               <span className="text-lg font-black text-emerald-400">{selectedStock.price}</span>
             </div>
          </div>
        )}
      </header>
      {view === 'ANALYSIS' && (
        <nav className="flex gap-2 p-3 bg-[#0e1829] border-b border-[#1e3251] overflow-x-auto no-scrollbar shrink-0">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${slide === i ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>{s}</button>
          ))}
        </nav>
      )}
      <main className="flex-1 overflow-y-auto">
        {view === 'HOME' && renderHome()}
        {view === 'GENERATOR' && (
          <div className="p-12 max-w-4xl mx-auto">
            <textarea value={rawText} onChange={(e)=>setRawText(e.target.value)} className="w-full h-64 bg-slate-900 rounded-2xl p-6 mb-6" placeholder="Paste stock analysis text..."/>
            <button onClick={generateModel} className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest">Generate Model</button>
          </div>
        )}
        {view === 'ANALYSIS' && <div className="px-6 py-8 md:px-10">{renderAnalysis()}</div>}
      </main>
      {view === 'ANALYSIS' && (
        <footer className="bg-[#0e1829] border-t border-[#1e3251] px-6 py-4 flex items-center justify-between shrink-0">
          <button onClick={() => go(-1)} disabled={slide === 0} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-400 font-black text-xs uppercase disabled:opacity-20">Назад</button>
          <button onClick={() => go(1)} disabled={slide === SLIDES.length - 1} className="px-10 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase">Далі</button>
        </footer>
      )}
    </div>
  );
}
