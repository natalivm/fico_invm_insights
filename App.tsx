
import React, { useState, useCallback, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area
} from 'recharts';
import { SLIDES, HIST_DATA, RISKS } from './constants';
import { AiInsightBox } from './components/AiInsightBox';
import { getLatestStockData } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";

// --- Types & Data ---

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
  beta?: string;
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
    id: 'wwd', 
    ticker: 'WWD', 
    name: 'Woodward, Inc.', 
    price: '$394.00', 
    change: '+0.4%', 
    color: '#a78bfa', 
    logo: 'W',
    typeLabel: "Structural Compounder",
    typeDesc: "Industrial compounder з aerospace tailwind. Довгі програми 10–20 років, certification moat, без buyback-driven росту.",
    marketCap: "$23.6B",
    grossMargin: "~26.8%",
    ebitMargin: "15.6%",
    trailingPE: "57x",
    forwardPE: "45x",
    moat: "7.5/10",
    stats: [
      { label: "ЦІНА", value: "$394.00", color: "text-white" },
      { label: "FWD P/E", value: "45x", color: "text-purple-400" },
      { label: "TRAIL P/E", value: "57x", color: "text-amber-400" }
    ],
    hist: [
      { y: "FY23",  rev: 2.91, fcf: 0.232, eps: 5.20,  ebitdaM: 12.0 },
      { y: "FY24",  rev: 3.32, fcf: 0.343, eps: 6.10,  ebitdaM: 13.8 },
      { y: "FY25",  rev: 3.57, fcf: 0.340, eps: 6.89,  ebitdaM: 15.6 },
      { y: "FY26E", rev: 4.14, fcf: 0.430, eps: 8.75,  ebitdaM: 17.5 },
      { y: "FY27E", rev: 4.65, fcf: 0.530, eps: 10.20, ebitdaM: 19.0 },
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", cagr: 22, pe: 38, eps5: 22, price5: 836, ret: 16, prob: 30, driver: "Revenue 14%, margin 20%+, aerospace apцикл без перерви" },
      { label: "Base", color: "#f59e0b", cagr: 17, pe: 32, eps5: 15, price5: 480, ret: 4,  prob: 45, driver: "Revenue 10–12%, margin expansion помірна, execution без помилок" },
      { label: "Bear", color: "#ef4444", cagr: 8,  pe: 24, eps5: 10, price5: 240, ret: -9, prob: 25, driver: "Aerospace cycle slow, margin flat, P/E нормалізується до 24x" }
    ],
    risks: [
      { r: "Valuation Compression", prob: "55%", impact: "Дуже Високий", detail: "Trailing P/E 57x — vs historical 20–30x. Downside -44% без погіршення бізнесу." },
      { r: "Aerospace Cycle Risk", prob: "30%", impact: "Високий", detail: "OEM production rates та Boeing/Airbus delivery cycles. Цикл закінчиться." },
      { r: "Margin Expansion Ceiling", prob: "35%", impact: "Помірний", detail: "Industrial business не має software-like margins. Expansion вже в оцінці." },
      { r: "Revenue Growth Decel", prob: "25%", impact: "Помірний", detail: "FY23→FY26E CAGR ~13%. Сповільнення до 6-8% вб'є інвестиційну тезу." }
    ],
    strengths: ["Industrial moat: сертифікації", "Довгі програми 10–20 років", "Органічний EPS ріст", "Margin expansion", "Низький ризик дизрапції"],
    weaknesses: ["P/E 57x premium", "FCF yield лише 1.4%", "Gross margin ~27%", "Perfection priced in"],
    verdict: "WWD — це якісний industrial compounder з реальним moat, органічним ростом і expanding margins. Але це вже не early compounder — це розкручений winner за P/E 57x. Очікувана зважена ~4.3% річних. Це ставка на execution + aerospace апцикл без margin of safety. Ідеальна точка входу — корекція до $260–300."
  },
  { 
    id: 'fico', 
    ticker: 'FICO', 
    name: 'Fair Isaac Corp', 
    price: '$1,351.60', 
    change: '+1.2%', 
    color: '#3b82f6', 
    logo: 'F',
    stats: [
      { label: "ЦІНА", value: "$1,351.60", color: "text-white" },
      { label: "NTM P/E", value: "30.0x", color: "text-purple-400" },
      { label: "ВІД ПІКУ", value: "-35%", color: "text-rose-500" }
    ]
  },
  { 
    id: 'dash', 
    ticker: 'DASH', 
    name: 'DoorDash Inc', 
    price: '$173.42', 
    change: '-0.8%', 
    color: '#ef4444', 
    logo: 'D',
    stats: [
      { label: "ЦІНА", value: "$173.42", color: "text-white" },
      { label: "FWD P/E", value: "28x", color: "text-amber-400" },
      { label: "ВІД ПІКУ", value: "-39%", color: "text-rose-500" }
    ]
  },
  { 
    id: 'amat', 
    ticker: 'AMAT', 
    name: 'Applied Materials', 
    price: '$368.00', 
    change: '+0.5%', 
    color: '#06b6d4', 
    logo: 'A',
    stats: [
      { label: "ЦІНА", value: "$368.00", color: "text-white" },
      { label: "FWD P/E", value: "33x", color: "text-cyan-400" },
      { label: "MKT CAP", value: "$291B", color: "text-purple-400" }
    ]
  },
  { 
    id: 'avgo', 
    ticker: 'AVGO', 
    name: 'Broadcom Inc', 
    price: '$175.40', 
    change: '+0.2%', 
    color: '#6366f1', 
    logo: 'B',
    stats: [
      { label: "ЦІНА", value: "$175.40", color: "text-white" },
      { label: "FWD P/E", value: "34x", color: "text-indigo-400" },
      { label: "MKT CAP", value: "$1.64T", color: "text-purple-400" }
    ]
  },
  { 
    id: 'fn', 
    ticker: 'FN', 
    name: 'Fabrinet', 
    price: '$515.00', 
    change: '+0.4%', 
    color: '#14b8a6', 
    logo: 'N',
    stats: [
      { label: "ЦІНА", value: "$515.00", color: "text-white" },
      { label: "FWD P/E", value: "38x", color: "text-teal-400" },
      { label: "TRAILING", value: "50x", color: "text-amber-400" }
    ]
  },
];

const DASH_HIST = [
  { y: "FY23", rev: 6.6, fcf: 1.55, ebitdaM: 10, eps: 0.8 },
  { y: "FY24", rev: 8.6, fcf: 1.80, ebitdaM: 14, eps: 1.2 },
  { y: "FY25", rev: 10.7, fcf: 2.67, ebitdaM: 18, eps: 2.1 },
  { y: "FY26E", rev: 13.8, fcf: 3.48, ebitdaM: 21, eps: 3.4 },
  { y: "FY27E", rev: 17.9, fcf: 4.58, ebitdaM: 24, eps: 4.8 },
];

const AMAT_HIST = [
  { y: "FY22", rev: 25.8, eps: 7.70, fcf: 4.61, ebitdaM: 30.0 },
  { y: "FY23", rev: 26.5, eps: 8.11, fcf: 4.90, ebitdaM: 29.5 },
  { y: "FY24", rev: 27.2, eps: 8.65, fcf: 5.20, ebitdaM: 31.0 },
  { y: "FY25", rev: 28.4, eps: 9.42, fcf: 5.70, ebitdaM: 32.5 },
  { y: "FY26E", rev: 31.3, eps: 11.10, fcf: 6.40, ebitdaM: 34.0 },
  { y: "FY27E", rev: 37.1, eps: 13.71, fcf: 7.80, ebitdaM: 35.0 },
];

const AVGO_HIST = [
  { y: "FY22", rev: 33.2, eps: 3.76, fcf: 17.6, ebitdaM: 60 },
  { y: "FY23", rev: 35.8, eps: 3.92, fcf: 17.6, ebitdaM: 62 },
  { y: "FY24", rev: 51.6, eps: 4.80, fcf: 19.9, ebitdaM: 64 },
  { y: "FY25", rev: 63.9, eps: 6.82, fcf: 26.9, ebitdaM: 67 },
  { y: "FY26E", rev: 76.0, eps: 10.27, fcf: 33.0, ebitdaM: 70 },
  { y: "FY27E", rev: 91.0, eps: 14.46, fcf: 40.0, ebitdaM: 75 },
];

const FN_HIST = [
  { y: "FY22", rev: 2.26, fcf: 0.034, eps: 6.13, ebitdaM: 9.5 },
  { y: "FY23", rev: 2.71, fcf: 0.200, eps: 7.40, ebitdaM: 10.0 },
  { y: "FY24", rev: 3.01, fcf: 0.366, eps: 8.80, ebitdaM: 10.5 },
  { y: "FY25", rev: 3.42, fcf: 0.207, eps: 10.17, ebitdaM: 11.0 },
  { y: "FY26E", rev: 4.10, fcf: 0.442, eps: 13.58, ebitdaM: 11.5 },
  { y: "FY27E", rev: 4.85, fcf: 0.540, eps: 16.26, ebitdaM: 12.0 },
];

const TooltipStyle = { 
  contentStyle: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" },
  itemStyle: { color: "#e2e8f0" }
};

const Chip: React.FC<{ label: string; val: string; color: string; sub?: string }> = ({ label, val, color, sub }) => (
  <div className="bg-slate-900 border-t-2 rounded-xl p-4 transition-all hover:bg-slate-800" style={{ borderColor: color }}>
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

  const generateModel = async () => {
    if (!rawText.trim()) return;
    setGenLoading(true);
    setGenProgress(5);
    setGenError("");

    // Simulated progress increment
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
      Якщо якихось числових значень немає в тексті, спробуй надати розумні оціночні значення на основі контексту або ринкових стандартів.
      
      Структура JSON:
      {
        "ticker": "Тікер",
        "name": "Назва компанії",
        "price": "$Ціна",
        "marketCap": "Капіталізація (напр. $1.2T)",
        "typeLabel": "Категорія (напр. Structural Compounder)",
        "typeDesc": "Коротке обґрунтування категорії",
        "grossMargin": "XX%",
        "ebitMargin": "XX%",
        "fcfMargin": "XX%",
        "trailingPE": "XXx",
        "forwardPE": "XXx",
        "fromPeak": "-XX%",
        "beta": "X.XX",
        "moat": "Опис переваги (moat)",
        "verdictColor": "Hex-код (напр. #3b82f6)",
        "hist": [
          {"y":"FY23","rev":1.5,"fcf":0.4,"eps":10.5,"ebitdaM":30},
          {"y":"FY24","rev":1.8,"fcf":0.5,"eps":12.2,"ebitdaM":32},
          {"y":"FY25E","rev":2.1,"fcf":0.7,"eps":15.0,"ebitdaM":33},
          {"y":"FY26E","rev":2.5,"fcf":0.9,"eps":18.5,"ebitdaM":35}
        ],
        "scenarios": [
          {"label":"Bull","color":"#22c55e","cagr":20,"pe":30,"eps5":50,"price5":1500,"ret":25,"prob":35,"driver":"Чому буде ріст"},
          {"label":"Base","color":"#f59e0b","cagr":12,"pe":25,"eps5":35,"price5":875,"ret":12,"prob":50,"driver":"Базові очікування"},
          {"label":"Bear","color":"#ef4444","cagr":4,"pe":18,"eps5":20,"price5":360,"ret":-5,"prob":15,"driver":"Ризики падіння"}
        ],
        "risks": [
          {"r":"Назва ризику","prob":"XX%","impact":"Високий/Помірний/Низький","detail":"Опис ризику"}
        ],
        "strengths": ["Перевага 1", "Перевага 2"],
        "weaknesses": ["Недолік 1", "Недолік 2"],
        "verdict": "Фінальний висновок аналітика одним абзацом."
      }

      ТЕКСТ ДЛЯ АНАЛІЗУ:
      ${rawText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
          logo: parsed.ticker[0],
          change: '0.0%',
          stats: [
            { label: "ЦІНА", value: parsed.price, color: "text-white" },
            { label: "FWD P/E", value: parsed.forwardPE, color: "text-purple-400" },
            { label: "MKT CAP", value: parsed.marketCap, color: "text-rose-500" }
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

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Портфель Аналітика</h2>
            <p className="text-slate-500 text-lg">Оберіть актив або згенеруйте новий аналіз</p>
          </div>
          <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-3 px-6 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-bold text-slate-300 hover:text-white hover:border-blue-500 transition-all">
            <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
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
                <div className="flex flex-col">
                  <div className="text-white text-3xl font-black tracking-tighter leading-none mb-1">{stock.ticker}</div>
                  <div className="text-slate-500 text-xs font-medium truncate max-w-[140px]">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">{stock.price}</div>
                  <div className={`text-[11px] font-bold ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>{stock.change}</div>
                </div>
              </div>
              {(stock.id.startsWith('gen-') || stock.id === 'wwd') && (
                <div className="absolute -right-6 -top-6 w-12 h-12 bg-blue-500/10 rotate-45 flex items-center justify-center pt-6 pr-6">
                   <div className="text-[8px] text-blue-400 font-black uppercase tracking-widest -rotate-45">MODEL</div>
                </div>
              )}
            </div>
          ))}
          <div 
            onClick={() => setView('GENERATOR')}
            className="bg-[#0e1829] border-2 border-dashed border-[#1e3251] rounded-3xl p-8 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all hover:bg-slate-900 group"
          >
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-inner">
              <svg className="w-8 h-8 text-slate-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGenerator = () => (
    <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2">AI-Powered Extraction</div>
          <h2 className="text-5xl font-black text-white mb-4">Stock Model Generator</h2>
          <p className="text-slate-500 text-lg">Вставте текст аналізу, і ШІ автоматично побудує інтерактивну модель</p>
        </div>

        <div className="bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {genLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 z-50">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${genProgress}%` }}
              />
            </div>
          )}
          
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            disabled={genLoading}
            placeholder="Вставте текст аналізу акції (ChatGPT, TIKR, нотатки)..."
            className="w-full h-80 bg-[#080d1a] border border-[#1e3251] rounded-2xl p-6 text-slate-300 font-mono text-sm outline-none focus:border-blue-500 transition-all resize-none shadow-inner disabled:opacity-50"
          />
          
          {genError && <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-bold">{genError}</div>}
          
          <div className="mt-8">
            {genLoading && (
               <div className="mb-4 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  <span className="animate-pulse">Аналізуємо дані через Gemini 3 Flash...</span>
                  <span>{Math.round(genProgress)}%</span>
               </div>
            )}
            
            <button 
              onClick={generateModel}
              disabled={genLoading || !rawText.trim()}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-black shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {genLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Генерація моделі...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span>Згенерувати інтерактивну модель</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
            
            {!genLoading && (
              <p className="mt-4 text-center text-slate-600 text-[10px] font-medium uppercase tracking-widest">
                ШІ створить сценарії, аналіз ризиків та фінансовий вердикт
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!selectedStock) return null;
    
    // Prioritize embedded data for standardized modeling
    const histData = selectedStock.hist || (
      selectedStock.id === 'fico' ? HIST_DATA : 
      selectedStock.id === 'dash' ? DASH_HIST : 
      selectedStock.id === 'amat' ? AMAT_HIST : 
      selectedStock.id === 'avgo' ? AVGO_HIST :
      selectedStock.id === 'fn' ? FN_HIST :
      HIST_DATA
    );
    const risksData = selectedStock.risks || RISKS;

    return (
      <div className="max-w-6xl mx-auto space-y-10">
        {/* SNAPSHOT SLIDE */}
        {slide === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{selectedStock.ticker} Investigation</span>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">{selectedStock.name}</h2>
              <p className="text-slate-500 text-lg">{selectedStock.typeLabel || "Deep Fundamental Analysis"}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Chip label={selectedStock.marketCap ? "Market Cap" : "EPS FY26E"} val={selectedStock.marketCap || (selectedStock.id === 'fico' ? "$41.22" : "$8.75")} color="#22c55e" sub={selectedStock.marketCap ? "" : "+38% Growth"} />
              <Chip label={selectedStock.grossMargin ? "Gross Margin" : "FCF FY26E"} val={selectedStock.grossMargin || "$1,008M"} color="#22c55e" sub={selectedStock.ebitMargin ? `EBIT: ${selectedStock.ebitMargin}` : "Quality Cash Flow"} />
              <Chip label="Moat" val={selectedStock.moat || "9.5/10"} color="#a855f7" sub="Competitive Edge" />
              <Chip label="P/E" val={selectedStock.forwardPE || "30x"} color="#3b82f6" sub="NTM Multiplier" />
            </div>
            {selectedStock.typeDesc && (
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-slate-400 text-sm leading-relaxed italic border-l-4" style={{borderLeftColor: selectedStock.color}}>
                {selectedStock.typeDesc}
              </div>
            )}
            <AiInsightBox slideTitle={`${selectedStock.ticker} Snapshot`} slideData={histData} stockId={selectedStock.id} />
          </div>
        )}

        {/* FINANCIALS SLIDE */}
        {slide === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">Фінансові показники</h2>
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-500 font-black text-[10px]">
                  <tr>
                    <th className="p-4">METRIC</th>
                    {histData?.map((h: any) => <th key={h.y} className="p-4 text-right uppercase tracking-widest">{h.y}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-4 text-slate-400 font-bold">Revenue ($B)</td>
                    {histData?.map((h: any, j: number) => <td key={j} className="p-4 text-right text-slate-200">{h.rev}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 font-bold">FCF ($B)</td>
                    {histData?.map((h: any, j: number) => <td key={j} className="p-4 text-right text-emerald-400 font-bold">{h.fcf}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 font-bold">EPS ($)</td>
                    {histData?.map((h: any, j: number) => <td key={j} className="p-4 text-right text-blue-400 font-bold">{h.eps || h.epsN}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="grid md:grid-cols-2 gap-6 h-64">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData} barGap={4}>
                    <XAxis dataKey="y" tick={{fill:'#475569',fontSize:10}}/>
                    <YAxis tick={{fill:'#475569',fontSize:10}}/>
                    <Tooltip {...TooltipStyle}/>
                    <Bar name="Rev" dataKey="rev" fill="#3b82f6" radius={[4,4,0,0]}/>
                    <Bar name="FCF" dataKey="fcf" fill="#22c55e" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={histData}>
                    <XAxis dataKey="y" tick={{fill:'#475569',fontSize:10}}/>
                    <YAxis tick={{fill:'#475569',fontSize:10}}/>
                    <Tooltip {...TooltipStyle}/>
                    <Area name="Margin" dataKey="ebitdaM" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIOS SLIDE */}
        {slide === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">Сценарії · 5 років</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {(selectedStock.scenarios || [
                { label: "Bull", cagr: 22, pe: 28, price5: 2548, ret: 14, prob: 55, color: "#22c55e", driver: "DLP live + FICO 10T + AI lending" },
                { label: "Base", cagr: 17, pe: 25, price5: 1825, ret: 6,  prob: 32, color: "#f59e0b", driver: "FCF $1B підтверджено, органічний ріст" },
                { label: "Bear", cagr: 11, pe: 22, price5: 1100, ret: -4, prob: 13, color: "#ef4444", driver: "Mortgage cycle + DLP delay + compression" },
              ])?.map((s: any, i: number) => (
                <div key={i} className="bg-slate-900 p-8 rounded-3xl border-t-4 shadow-xl transition-all hover:scale-105" style={{ borderTopColor: s.color || '#3b82f6' }}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-black">{s.label} Case</span>
                    <span className="text-[10px] bg-slate-800/80 px-2 py-1 rounded text-slate-400 font-bold uppercase tracking-widest">P={s.prob}%</span>
                  </div>
                  <div className="text-5xl font-black mb-6" style={{color: s.color || '#3b82f6'}}>{s.ret}%</div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 h-12 overflow-hidden">{s.driver}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                      <div className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Target Price</div>
                      <div className="text-sm font-bold text-white">${s.price5}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner">
                      <div className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">EPS CAGR</div>
                      <div className="text-sm font-bold text-white">{s.cagr}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <AiInsightBox slideTitle="Financial Scenarios" slideData={selectedStock.scenarios || []} stockId={selectedStock.id} />
          </div>
        )}

        {/* RISKS SLIDE */}
        {slide === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">Аналіз ризиків</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {risksData?.map((risk: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setActiveRisk(activeRisk === i ? null : i)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer hover:bg-slate-800/80 ${activeRisk === i ? 'bg-slate-800 border-blue-500 shadow-lg' : 'bg-slate-900 border-slate-800'}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-200">{risk.r}</h4>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${risk.impact === 'Високий' || risk.impact === 'Дуже Високий' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {risk.impact}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold mb-4 uppercase tracking-widest">Ймовірність: {risk.prob}</div>
                  {activeRisk === i && (
                    <div className="text-sm text-slate-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      {risk.detail}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl">
                <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">✅ Strengths & Moats</h4>
                <ul className="space-y-2">
                  {(selectedStock.strengths || ["Pricing Power", "Regulatory Moat", "Execution Excellence"]).map((s, i) => (
                    <li key={i} className="text-slate-400 text-sm flex gap-2"><span className="text-emerald-500">→</span> {s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-2xl">
                <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest mb-4">⛔ Critical Weaknesses</h4>
                <ul className="space-y-2">
                  {(selectedStock.weaknesses || ["Valuation Premium", "Macro Cycle Risk", "Competition Pressure"]).map((w, i) => (
                    <li key={i} className="text-slate-400 text-sm flex gap-2"><span className="text-rose-500">→</span> {w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* VERDICT SLIDE */}
        {slide === 4 && (
          <div className="bg-gradient-to-br from-[#1e1b4b] to-slate-950 p-12 rounded-3xl text-center border border-blue-500/30 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <svg className="w-64 h-64 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
             </div>
            <h3 className="text-4xl font-black mb-6 text-white uppercase tracking-tight relative z-10">{selectedStock.verdict ? "Інвестиційний Вердикт" : "Structural Machine"}</h3>
            <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed relative z-10">
              {selectedStock.verdict || "Fair Isaac continues to leverage its unmatched pricing power. The market already reflects high expectations, making execution in DLP critical."}
            </p>
            <div className="flex justify-center gap-6 mb-12 relative z-10">
              <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 min-w-[140px] shadow-xl">
                <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">Recommendation</div>
                <div className="text-2xl font-black text-white">{selectedStock.typeLabel?.split(' ')[0] || "Hold"}</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 min-w-[140px] shadow-xl">
                <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">Target 5Y</div>
                <div className="text-2xl font-black text-blue-400">${selectedStock.scenarios?.[1]?.price5 || (selectedStock.id === 'fico' ? "2,548" : "480")}</div>
              </div>
            </div>
            <button onClick={backToHome} className="bg-blue-600 px-10 py-4 rounded-2xl font-black text-white shadow-lg hover:bg-blue-500 hover:shadow-blue-500/30 transition-all uppercase tracking-widest text-sm relative z-10">
              Back to Portfolio
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080d1a] text-slate-200 select-none font-inter">
      <header className="bg-[#0e1829] border-b border-[#1e3251] px-6 py-3 flex items-center justify-between z-10 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-1.5 rounded-lg shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all" onClick={backToHome}>
            <span className="font-black text-xl tracking-tighter text-white italic">
              {view === 'HOME' ? 'INSIGHTS' : 'BACK'}
            </span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-tight">
              {view === 'HOME' ? 'Investment Platform' : view === 'GENERATOR' ? 'AI Generator' : selectedStock?.name}
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {view === 'HOME' ? 'Portfolio Discovery' : view === 'GENERATOR' ? 'Data Extraction' : `Deep Analysis · ${selectedStock?.ticker}`}
            </p>
          </div>
        </div>
        {view !== 'HOME' && (
          <div className="flex gap-4 items-center">
            {view === 'ANALYSIS' && selectedStock?.stats.map(stat => (
              <div key={stat.label} className="bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-1 text-center hidden sm:block shadow-sm">
                <div className="text-[#475569] text-[9px] font-black uppercase tracking-tighter">{stat.label}</div>
                <div className={`${stat.color} font-bold text-sm tracking-tight`}>{stat.value}</div>
              </div>
            ))}
            <button onClick={backToHome} className="text-slate-400 hover:text-white transition-colors text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/50">ДОДОМУ</button>
          </div>
        )}
      </header>
      
      <div className="h-0.5 bg-[#0e1829] w-full shrink-0 shadow-sm overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-700 ease-in-out" 
          style={{ width: view === 'ANALYSIS' ? `${(slide / (SLIDES.length - 1)) * 100}%` : view === 'GENERATOR' ? '50%' : '0%' }} 
        />
      </div>

      {view === 'ANALYSIS' && (
        <nav className="flex gap-2 p-3 bg-[#0e1829] border-b border-[#1e3251] overflow-x-auto no-scrollbar shrink-0 shadow-md">
          {SLIDES.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setSlide(i)} 
              className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${slide === i ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' : 'bg-slate-900 text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
            >
              {s}
            </button>
          ))}
        </nav>
      )}

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#080d1a] to-[#040810]">
        {view === 'HOME' && renderHome()}
        {view === 'GENERATOR' && renderGenerator()}
        {view === 'ANALYSIS' && (
          <div className="px-6 py-8 md:px-10">
            {renderAnalysis()}
          </div>
        )}
      </main>

      {view === 'ANALYSIS' && (
        <footer className="bg-[#0e1829] border-t border-[#1e3251] px-6 py-4 flex items-center justify-between shrink-0 shadow-inner">
          <button onClick={() => go(-1)} disabled={slide === 0} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-10 transition-all font-black text-xs uppercase tracking-widest shadow-md">Назад</button>
          <div className="flex gap-3">
            {SLIDES.map((_, i) => (<div key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${slide === i ? 'w-10 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'w-2.5 bg-slate-800 hover:bg-slate-700'}`} />))}
          </div>
          <button onClick={() => go(1)} disabled={slide === SLIDES.length - 1} className="px-10 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg disabled:opacity-10 transition-all font-black text-xs uppercase tracking-widest">Далі</button>
        </footer>
      )}
    </div>
  );
}
