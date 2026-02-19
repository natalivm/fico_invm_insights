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
    rs: 80,
    rating: 'Buy',
    beta: 1.42,
    accelerationProb: "40%",
    timeToMilestone: "1.8 - 2.5 Years",
    momentumUpside1Y: "+35%",
    typeLabel: "Structural Compounder",
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
      { label: "Bull", color: "#22c55e", price5: 358, prob: 30, driver: "AI buildout без спаду" },
      { label: "Base", color: "#f59e0b", price5: 209, prob: 45, driver: "Lumpy execution, memory тиск" },
      { label: "Bear", color: "#ef4444", price5: 113, prob: 25, driver: "AI capex digestion" }
    ],
    risks: [
      { r: "Multiple Compression", prob: "45%", impact: "Високий", detail: "Forward P/E ~42x. Нормалізація до 30x." }
    ],
    verdict: "ANET — це найякісніший play на AI networking. Потужний RS (80) підтверджує лідерство в секторі та силу технічного тренду."
  },
  {
    id: 'spot',
    ticker: 'SPOT',
    name: 'Spotify Technology S.A.',
    price: '$478.00',
    change: '+0.5%',
    color: '#1DB954',
    logo: 'S',
    rs: 13,
    rating: 'Strong Buy',
    beta: 1.25,
    accelerationProb: "65%",
    timeToMilestone: "2.5 - 3.5 Years",
    momentumUpside1Y: "+20%",
    typeLabel: "Structural Compounder",
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
    verdict: "SPOT — фундаментальна ракета, але RS (13) вказує на суттєве технічне відставання відносно AI-лідерів, що створює вікно для накопичення."
  },
  {
    id: 'cls',
    ticker: 'CLS',
    name: 'Celestica, Inc.',
    price: '$293.90',
    change: '+1.5%',
    color: '#f59e0b',
    logo: 'C',
    rs: 94,
    rating: 'Hold',
    beta: 1.85,
    accelerationProb: "28%",
    timeToMilestone: "3.0 - 4.0 Years",
    momentumUpside1Y: "+15%",
    typeLabel: "Cyclical Growth",
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
    risks: [{ r: "P/E De-rating", prob: "60%", impact: "Дуже Високий", detail: "Current is 34x vs 18x hist." }],
    verdict: "CLS — абсолютний лідер з RS 94. Ризиком є лише екстремальна оцінка порівняно з історичними мультиплікаторами."
  },
  {
    id: 'tln',
    ticker: 'TLN',
    name: 'Talen Energy Corp.',
    price: '$238.00',
    change: '+0.4%',
    color: '#f59e0b',
    logo: 'T',
    rs: 80,
    rating: 'Buy',
    beta: 1.15,
    accelerationProb: "55%",
    timeToMilestone: "1.2 - 1.5 Years",
    momentumUpside1Y: "+45%",
    typeLabel: "Power Infrastructure",
    stats: [
      { label: "ЦІНА", value: "$238.00", color: "text-white" },
      { label: "BASE TARGET", value: "$364.00", color: "text-amber-400" },
      { label: "RS RATING", value: "80", color: "text-emerald-400" }
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
    risks: [{ r: "Regulatory (FERC)", prob: "45%", impact: "Високий", detail: "AWS co-location risks." }],
    verdict: "Сильний RS (80) підтверджує вхід у фазу лідерства. Енергетичний дефіцит — довгостроковий паливний бак для ціни."
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
    accelerationProb: "20%",
    timeToMilestone: "3.5 - 4.5 Years",
    momentumUpside1Y: "+8%",
    stats: [
      { label: "ЦІНА", value: "$394.00", color: "text-white" },
      { label: "RS RATING", value: "95", color: "text-emerald-400" },
      { label: "FWD P/E", value: "45x", color: "text-slate-400" }
    ],
    hist: [{ y: "FY23", rev: 2.9, fcf: 0.2 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 630, prob: 20, driver: "Aero boom" },
      { label: "Base", color: "#f59e0b", price5: 480, prob: 55, driver: "Steady execution" }
    ],
    risks: [{ r: "Valuation", prob: "55%", impact: "Високий", detail: "Trailing P/E 57x." }],
    verdict: "Один з найвищих RS в портфелі (95). Технічно бездоганний лідер, хоча фундаментально виглядає перегрітим."
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
    accelerationProb: "35%",
    timeToMilestone: "2.0 - 3.0 Years",
    momentumUpside1Y: "+25%",
    stats: [
      { label: "ЦІНА", value: "$368.00", color: "text-white" },
      { label: "RS RATING", value: "97", color: "text-emerald-400" },
      { label: "BETA", value: "1.58", color: "text-cyan-400" }
    ],
    hist: [],
    scenarios: [],
    risks: [],
    verdict: "Абсолютний лідер (RS 97). Ринкова динаміка підтверджує, що ставка на semi-cap supercycle працює на повну потужність."
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
    accelerationProb: "45%",
    timeToMilestone: "1.5 - 2.5 Years",
    momentumUpside1Y: "+30%",
    stats: [
      { label: "ЦІНА", value: "$515.00", color: "text-white" },
      { label: "RS RATING", value: "95", color: "text-emerald-400" },
      { label: "BETA", value: "1.35", color: "text-teal-400" }
    ],
    hist: [],
    scenarios: [],
    risks: [],
    verdict: "Еталонний momentum (RS 95). Технічна перевага утримується за рахунок домінування в оптичному ланцюгу NVDA."
  },
  { 
    id: 'avgo', 
    ticker: 'AVGO', 
    name: 'Broadcom Inc', 
    price: '$175.40', 
    change: '+0.2%', 
    color: '#6366f1', 
    logo: 'B',
    rs: 76,
    rating: 'Strong Buy',
    beta: 1.18,
    accelerationProb: "50%",
    timeToMilestone: "2.0 - 3.0 Years",
    momentumUpside1Y: "+15%",
    stats: [
      { label: "ЦІНА", value: "$175.40", color: "text-white" },
      { label: "RS RATING", value: "76", color: "text-blue-400" },
      { label: "BETA", value: "1.18", color: "text-indigo-400" }
    ],
    hist: [],
    scenarios: [],
    risks: [],
    verdict: "Впевнений RS (76) вказує на здорову ринкову динаміку. Акція — стабільний перформер, що консолідується перед новим ривком."
  },
  { 
    id: 'fico', 
    ticker: 'FICO', 
    name: 'Fair Isaac Corp', 
    price: '$1,351.60', 
    change: '+1.2%', 
    color: '#3b82f6', 
    logo: 'F',
    rs: 17,
    rating: 'Hold',
    beta: 1.05,
    accelerationProb: "30%",
    timeToMilestone: "3.0 - 4.0 Years",
    momentumUpside1Y: "+10%",
    stats: [
      { label: "ЦІНА", value: "$1,351.60", color: "text-white" },
      { label: "BASE TARGET", value: "$1,825.00", color: "text-blue-400" },
      { label: "RS RATING", value: "17", color: "text-rose-500" }
    ],
    hist: [
      { y: "FY24", rev: 1717, fcf: 607, eps: 23.74 },
      { y: "FY25E", rev: 1991, fcf: 739, eps: 29.88 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 2548, prob: 55, driver: "DLP live + 10T" },
      { label: "Base", color: "#f59e0b", price5: 1825, prob: 32, driver: "Organic growth" },
      { label: "Bear", color: "#ef4444", price5: 1100, prob: 13, driver: "Mortgage cycle delay" }
    ],
    risks: [{ r: "Regulatory", prob: "15%", impact: "Високий", detail: "FHFA parity." }],
    verdict: "Слабкий RS (17) відображає технічну капітуляцію через песимізм щодо іпотечного циклу."
  },
  { 
    id: 'dash', 
    ticker: 'DASH', 
    name: 'DoorDash Inc', 
    price: '$194.00', 
    change: '+17.5%', 
    color: '#ef4444', 
    logo: 'D',
    rs: 17,
    rating: 'Hold',
    beta: 1.48,
    accelerationProb: "20%",
    timeToMilestone: "4.5 - 5.0 Years",
    momentumUpside1Y: "+10%",
    typeLabel: "Cyclical Growth / Momentum (Type B+C)",
    stats: [
      { label: "ЦІНА", value: "$194.00", color: "text-white" },
      { label: "BASE TARGET", value: "$275.00", color: "text-emerald-400" },
      { label: "FAIR VALUE", value: "$137.00", color: "text-rose-500" }
    ],
    hist: [
      { y: "2024", rev: 10.12, eps: 0.85 },
      { y: "2026E", eps: 6.00 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 390, prob: 20, driver: "CAGR 24% sustained (to justify 15% ROI)" },
      { label: "Base", color: "#f59e0b", price5: 275, prob: 45, driver: "CAGR 17%, Exit P/E 21x" },
      { label: "Bear", color: "#ef4444", price5: 120, prob: 35, driver: "P/E compression to 20x, growth plateau" }
    ],
    risks: [
      { r: "Growth Premium Gap", prob: "80%", impact: "Високий", detail: "При $194 ринок закладає агресивний bull-сценарій. Fwd P/E 32x." },
      { r: "Downside Potential", prob: "40%", impact: "Дуже Високий", detail: "Якщо P/E стиснеться до 20x, теоретичний downside становить -35-40% ($120)." },
      { r: "Margin Safety", prob: "90%", impact: "Високий", detail: "Справедлива ціна (~$137) на 40% нижче поточної." }
    ],
    verdict: "RS (17) сигналізує про технічний лаг відносно лідерів ринку, незважаючи на короткостроковий сплеск після звіту."
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
          ...s, 
          price: up.price, 
          change: up.change,
          rs: up.rs || s.rs,
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
      const prompt = `Analyze stock analysis text and produce a JSON model with 5Y scenarios, risks, RS rating, beta, accelerationProb, timeToMilestone, and momentumUpside1Y. Text: ${rawText}`;
      const fetchWithRetry = async (retries = 2): Promise<any> => {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
          });
          return JSON.parse(response.text || "{}");
        } catch (err: any) {
          if (err?.message?.includes('429') && retries > 0) {
            await new Promise(r => setTimeout(r, 3000));
            return fetchWithRetry(retries - 1);
          }
          throw err;
        }
      };
      const parsed = await fetchWithRetry();
      const newStock: Stock = {
        id: `gen-${Date.now()}`,
        ticker: parsed.ticker || 'UNKNOWN',
        name: parsed.name || 'Generated Asset',
        price: parsed.price || '$0.00',
        change: '0.0%',
        color: parsed.verdictColor || '#3b82f6',
        logo: (parsed.ticker && parsed.ticker[0]) || '?',
        rs: parsed.rs || 50,
        rating: (parsed.rating as InvestmentRating) || 'Hold',
        beta: parsed.beta || 1.0,
        accelerationProb: parsed.accelerationProb || "N/A",
        timeToMilestone: parsed.timeToMilestone || "N/A",
        momentumUpside1Y: parsed.momentumUpside1Y || "N/A",
        verdict: parsed.verdict || "No verdict provided.",
        stats: [
          { label: "ЦІНА", value: parsed.price || "$0.00", color: "text-white" },
          { label: "BASE TARGET", value: (parsed.scenarios?.find((s:any) => s.label === 'Base')?.price5 || "N/A").toString(), color: "text-emerald-400" },
          { label: "RS RATING", value: (parsed.rs || 50).toString(), color: "text-blue-400" }
        ],
        hist: parsed.hist || [],
        scenarios: parsed.scenarios || [],
        risks: parsed.risks || [],
        typeLabel: parsed.typeLabel || "Analytic Result"
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
      setGenError(e?.message?.includes('429') ? "Quota exceeded. Please retry." : "Error: " + e.message);
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
          <button onClick={handleRefresh} disabled={isRefreshing} className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-50">
            {isRefreshing ? 'Оновлення...' : 'Оновити ринок'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map(stock => (
            <div key={stock.id} onClick={() => { setSelectedStock(stock); setView('ANALYSIS'); setSlide(0); }} className="bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8 cursor-pointer hover:border-blue-500 transition-all hover:-translate-y-1 group relative overflow-hidden">
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
                <div className={`text-[10px] font-black uppercase tracking-widest ${getRatingColor(stock.rating)}`}>{stock.rating}</div>
                <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${stock.rs && stock.rs >= 80 ? 'bg-emerald-400/10 text-emerald-400' : stock.rs && stock.rs < 40 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'}`}>RS {stock.rs}</div>
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
    const rsRating = selectedStock.rs || 0;
    
    // Aligned logic: >= 80 is Leader, < 40 is Lagging
    const rsColor = rsRating >= 80 ? '#10b981' : rsRating < 40 ? '#f43f5e' : '#94a3b8';
    const rsStatus = rsRating >= 80 ? 'Leader' : rsRating < 40 ? 'Lagging' : 'Consolidating';
    
    return (
      <div className="max-w-6xl mx-auto space-y-10">
        {slide === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{selectedStock.ticker} Snapshot</span>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">{selectedStock.name}</h2>
              <p className="text-slate-500 text-lg mt-2">{selectedStock.typeLabel}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {selectedStock.stats.map((st, idx) => (
                <Chip key={idx} label={st.label} val={st.value} color={st.label === 'BASE TARGET' ? '#10b981' : st.label === 'FAIR VALUE' ? '#f43f5e' : '#3b82f6'} />
              ))}
              <Chip label="BETA" val={selectedStock.beta.toString()} color="#a855f7" />
              <Chip label="RS RATING" val={rsRating.toString()} color={rsColor} sub={rsStatus} />
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
                    <Bar name="EPS" dataKey="eps" fill="#10b981" radius={[4, 4, 0, 0]} />
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
                <div className="p-6 rounded-2xl border bg-slate-950 border-blue-500/30 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-blue-400">Технічний Ризик (Momentum)</h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${rsRating >= 80 ? 'bg-emerald-500/10 text-emerald-400' : rsRating < 40 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'}`}>
                      {rsStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl font-black text-white">{rsRating}</div>
                    <div className={`text-xs font-black uppercase ${rsRating >= 80 ? 'text-emerald-400' : rsRating < 40 ? 'text-rose-500' : 'text-slate-400'}`}>
                      {rsRating >= 80 ? 'Momentum Leader' : rsRating < 40 ? 'Underperformer' : 'Healthy Trend'}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {rsRating >= 80 
                      ? "Зона технічного лідерства. Акція демонструє виняткову силу відносно ринку, але можлива короткострокова перегрітість." 
                      : rsRating < 40 
                        ? "Технічний тренд зламано. Акція демонструє слабкість відносно широкого ринку, що підвищує ризик подальшої капітуляції." 
                        : "Помірний/здоровий тренд. Акція консолідується або рухається в межах ринкової норми без явної переваги лідера."}
                  </p>
                </div>
                {risksData.map((risk: any, i: number) => (
                  <div key={i} className="p-6 rounded-2xl border bg-slate-900 border-slate-800 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-100">{risk.r}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${risk.impact.includes('Високий') ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>{risk.impact}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{risk.detail}</p>
                  </div>
                ))}
             </div>
           </div>
        )}
        {slide === 4 && (
          <div className="bg-gradient-to-br from-[#1e1b4b] to-slate-950 p-12 rounded-3xl text-center border border-blue-500/30 shadow-2xl">
            <h3 className="text-4xl font-black mb-6 text-white uppercase tracking-tight">Investment Verdict</h3>
            <div className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">{selectedStock.verdict}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">5Y Expected Target</div>
                <div className="text-4xl font-black text-blue-400 tracking-tighter">${(scenariosData.find(s => s.label === 'Base')?.price5 || "N/A")}</div>
              </div>
              <div className="bg-indigo-900/40 p-8 rounded-3xl border border-indigo-500/30">
                <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-3">Momentum Upside</div>
                <div className="text-4xl font-black text-cyan-400 tracking-tighter">{selectedStock.momentumUpside1Y}</div>
              </div>
              <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Prob of Acceleration</div>
                <div className="text-4xl font-black text-emerald-400 tracking-tighter">{selectedStock.accelerationProb}</div>
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
          <div className="bg-slate-950/50 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
            <span className="text-xl font-black text-white tracking-tighter">{selectedStock.ticker}</span>
            <span className="text-lg font-black text-emerald-400">{selectedStock.price}</span>
          </div>
        )}
      </header>
      {view === 'ANALYSIS' && (
        <nav className="flex gap-2 p-3 bg-[#0e1829] border-b border-[#1e3251] overflow-x-auto no-scrollbar shrink-0">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all ${slide === i ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>{s}</button>
          ))}
        </nav>
      )}
      <main className="flex-1 overflow-y-auto">
        {view === 'HOME' && renderHome()}
        {view === 'GENERATOR' && (
          <div className="p-12 max-w-4xl mx-auto">
            <textarea value={rawText} onChange={(e)=>setRawText(e.target.value)} className="w-full h-64 bg-slate-900 rounded-2xl p-6 mb-6" placeholder="Paste stock analysis..."/>
            {genError && <p className="text-rose-500 mb-4 font-bold">{genError}</p>}
            <button onClick={generateModel} disabled={genLoading} className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest">
              {genLoading ? 'Processing...' : 'Generate Model'}
            </button>
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
