
import React, { useState, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area
} from 'recharts';
import { SLIDES, HIST_DATA } from './constants';
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
  // Added for dynamic models
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
  buyIf?: string[];
  waitIf?: string[];
  score?: any[];
  verdict?: string;
  verdictColor?: string;
}

const INITIAL_STOCKS: Stock[] = [
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

const FN_HIST = [
  { y: "FY22",  rev: 2.26, fcf: 0.034, eps: 6.13,  ebitM: 9.5 },
  { y: "FY23",  rev: 2.71, fcf: 0.200, eps: 7.40,  ebitM: 10.0 },
  { y: "FY24",  rev: 3.01, fcf: 0.366, eps: 8.80,  ebitM: 10.5 },
  { y: "FY25",  rev: 3.42, fcf: 0.207, eps: 10.17, ebitM: 11.0 },
  { y: "FY26E", rev: 4.10, fcf: 0.442, eps: 13.58, ebitM: 11.5 },
  { y: "FY27E", rev: 4.85, fcf: 0.540, eps: 16.26, ebitM: 12.0 },
];

const DASH_HIST = [
  { y: "FY23",  rev: 6.6,  fcf: 1.55, ebitdaM: 10 },
  { y: "FY24",  rev: 8.6,  fcf: 1.80, ebitdaM: 14 },
  { y: "FY25",  rev: 10.7, fcf: 2.67, ebitdaM: 18 },
  { y: "FY26E", rev: 13.8, fcf: 3.48, ebitdaM: 21 },
  { y: "FY27E", rev: 17.9, fcf: 4.58, ebitdaM: 24 },
];

const AMAT_HIST = [
  { y: "FY22",  rev: 25.8, eps: 7.70, fcf: 4.61, ebitM: 30.0 },
  { y: "FY23",  rev: 26.5, eps: 8.11, fcf: 4.90, ebitM: 29.5 },
  { y: "FY24",  rev: 27.2, eps: 8.65, fcf: 5.20, ebitM: 31.0 },
  { y: "FY25",  rev: 28.4, eps: 9.42, fcf: 5.70, ebitM: 32.5 },
  { y: "FY26E", rev: 31.3, eps: 11.10, fcf: 6.40, ebitM: 34.0 },
  { y: "FY27E", rev: 37.1, eps: 13.71, fcf: 7.80, ebitM: 35.0 },
];

const AVGO_HIST = [
  { y: "FY22",  rev: 33.2, eps: 3.76, fcf: 17.6, ebitM: 60 },
  { y: "FY23",  rev: 35.8, eps: 3.92, fcf: 17.6, ebitM: 62 },
  { y: "FY24",  rev: 51.6, eps: 4.80, fcf: 19.9, ebitM: 64 },
  { y: "FY25",  rev: 63.9, eps: 6.82, fcf: 26.9, ebitM: 67 },
  { y: "FY26E", rev: 76.0, eps: 10.27, fcf: 33.0, ebitM: 70 },
  { y: "FY27E", rev: 91.0, eps: 14.46, fcf: 40.0, ebitM: 75 },
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
  const [genError, setGenError] = useState("");

  const go = useCallback((d: number) => setSlide(s => Math.max(0, Math.min(SLIDES.length - 1, s + d))), []);
  const backToHome = useCallback(() => { setView('HOME'); setSelectedStock(null); setSlide(0); }, []);

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
    setGenError("");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Ти парсер фінансових даних. З тексту нижче витягни дані і поверни ТІЛЬКИ JSON об'єкт.
      
      Структура JSON:
      {
        "ticker": "AAPL",
        "name": "Apple Inc.",
        "price": "$180",
        "marketCap": "$2.8T",
        "type": "A",
        "typeLabel": "Structural Compounder",
        "typeDesc": "Чому саме цей тип",
        "grossMargin": "43%",
        "ebitMargin": "30%",
        "fcfMargin": "25%",
        "trailingPE": "28x",
        "forwardPE": "25x",
        "fromPeak": "-15%",
        "beta": "1.20",
        "moat": "Так (ecosystem lock-in)",
        "cycleRisk": "Частково",
        "buybacks": "Так (+3% EPS/рік)",
        "verdictColor": "#a78bfa",
        "hist": [
          {"y":"FY22","rev":394,"fcf":111,"eps":6.15,"ebitdaM":32},
          {"y":"FY23","rev":383,"fcf":99,"eps":6.13,"ebitdaM":31},
          {"y":"FY24E","rev":391,"fcf":105,"eps":6.43,"ebitdaM":32},
          {"y":"FY25E","rev":415,"fcf":115,"eps":7.10,"ebitdaM":33}
        ],
        "scenarios": [
          {"label":"Bull","color":"#22c55e","cagr":15,"pe":30,"eps5":25,"price5":750,"ret":18,"prob":35,"driver":"Опис bull драйверів"},
          {"label":"Base","color":"#f59e0b","cagr":10,"pe":25,"eps5":18,"price5":450,"ret":9,"prob":45,"driver":"Опис base драйверів"},
          {"label":"Bear","color":"#ef4444","cagr":4,"pe":18,"eps5":10,"price5":180,"ret":-1,"prob":20,"driver":"Опис bear драйверів"}
        ],
        "risks": [
          {"r":"Назва","prob":"25%","impact":"Високий","c":"#ef4444","detail":"Деталі"}
        ],
        "strengths": ["Strength 1"],
        "weaknesses": ["Weakness 1"],
        "buyIf": ["Умова 1"],
        "waitIf": ["Умова 1"],
        "score": [
          {"cat":"Бізнес moat","val":"9/10","c":"#22c55e","n":"Ecosystem"}
        ],
        "verdict": "Фінальний вердикт."
      }

      ТЕКСТ:
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
        setSelectedStock(newStock);
        setView('ANALYSIS');
        setSlide(0);
      }
    } catch (e: any) {
      setGenError("Помилка генерації: " + e.message);
    } finally {
      setGenLoading(false);
    }
  };

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Портфель Аналітика</h2>
            <p className="text-slate-500 text-lg">Оберіть актив для стратегічного огляду</p>
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
              className="bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8 cursor-pointer hover:border-blue-500 transition-all hover:-translate-y-1 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="text-white text-3xl font-black tracking-tighter leading-none mb-1">{stock.ticker}</div>
                  <div className="text-slate-500 text-xs font-medium truncate max-w-[150px]">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">{stock.price}</div>
                  <div className={`text-[11px] font-bold ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>{stock.change}</div>
                </div>
              </div>
            </div>
          ))}
          {/* Plus Tab */}
          <div 
            onClick={() => setView('GENERATOR')}
            className="bg-[#0e1829] border-2 border-dashed border-[#1e3251] rounded-3xl p-8 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all hover:bg-slate-900 group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
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
          <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2">AI-Powered</div>
          <h2 className="text-5xl font-black text-white mb-4">Stock Model Generator</h2>
          <p className="text-slate-500 text-lg">Вставте текст аналізу, і ШІ автоматично побудує інтерактивну модель</p>
        </div>

        <div className="bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Вставте сюди будь-який текст аналізу акції (ChatGPT, TIKR, нотатки)..."
            className="w-full h-80 bg-[#080d1a] border border-[#1e3251] rounded-2xl p-6 text-slate-300 font-mono text-sm outline-none focus:border-blue-500 transition-all resize-none"
          />
          {genError && <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-xs font-bold">{genError}</div>}
          <div className="mt-8 flex gap-4">
            <button 
              onClick={backToHome}
              className="flex-1 py-4 bg-slate-800 rounded-2xl text-slate-400 font-bold hover:bg-slate-700 transition-all"
            >
              Скасувати
            </button>
            <button 
              onClick={generateModel}
              disabled={genLoading || !rawText.trim()}
              className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-black shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {genLoading ? '⏳ Обробка...' : '⚡ Згенерувати модель'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!selectedStock) return null;

    const isGenerated = selectedStock.id.startsWith('gen-');
    const histData = isGenerated ? selectedStock.hist : (
      selectedStock.id === 'fico' ? HIST_DATA : 
      selectedStock.id === 'dash' ? DASH_HIST : 
      selectedStock.id === 'amat' ? AMAT_HIST : 
      selectedStock.id === 'avgo' ? AVGO_HIST :
      selectedStock.id === 'fn' ? FN_HIST :
      HIST_DATA
    );

    return (
      <div className="max-w-6xl mx-auto space-y-10">
        {slide === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{selectedStock.ticker} Investigation</span>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">{selectedStock.name}</h2>
              <p className="text-slate-500 text-lg">{isGenerated ? selectedStock.typeLabel : "Deep Fundamental Analysis"}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Chip label={isGenerated ? "Market Cap" : "EPS FY26E"} val={isGenerated ? selectedStock.marketCap! : "$41.22"} color="#22c55e" sub={isGenerated ? "" : "+38% Growth"} />
              <Chip label={isGenerated ? "Gross Margin" : "FCF FY26E"} val={isGenerated ? selectedStock.grossMargin! : "$1,008M"} color="#22c55e" sub={isGenerated ? `EBIT: ${selectedStock.ebitMargin}` : "Quality Cash Flow"} />
              <Chip label={isGenerated ? "Moat" : "Moat"} val={isGenerated ? selectedStock.moat! : "9.5/10"} color="#a855f7" sub={isGenerated ? "" : "Regulatory Moat"} />
              <Chip label="P/E" val={isGenerated ? selectedStock.forwardPE! : "30x"} color="#3b82f6" sub="NTM Multiplier" />
            </div>
            {isGenerated && selectedStock.typeDesc && (
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-slate-400 text-sm leading-relaxed italic">
                {selectedStock.typeDesc}
              </div>
            )}
            <AiInsightBox slideTitle={`${selectedStock.ticker} Snapshot`} slideData={histData} />
          </div>
        )}
        {slide === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">Фінансові дані</h2>
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-500 font-black text-[10px]">
                  <tr>
                    <th className="p-4">METRIC</th>
                    {histData?.map((h: any) => <th key={h.y} className="p-4 text-right">{h.y}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-4 text-slate-400 font-bold">Rev ($B)</td>
                    {histData?.map((h: any, j: number) => <td key={j} className="p-4 text-right text-slate-300">{h.rev}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 font-bold">FCF ($B)</td>
                    {histData?.map((h: any, j: number) => <td key={j} className="p-4 text-right text-emerald-400 font-bold">{h.fcf}</td>)}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 font-bold">EPS ($)</td>
                    {histData?.map((h: any, j: number) => <td key={j} className="p-4 text-right text-blue-400">{h.eps || h.epsN}</td>)}
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
        {slide === 2 && isGenerated && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">Сценарії · 5 років</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {selectedStock.scenarios?.map((s: any, i: number) => (
                <div key={i} className="bg-slate-900 p-8 rounded-3xl border-t-4 shadow-xl" style={{ borderTopColor: s.color }}>
                  <div className="flex justify-between mb-4">
                    <span className="text-xl font-black">{s.label}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded">P={s.prob}%</span>
                  </div>
                  <div className="text-5xl font-black mb-6" style={{color: s.color}}>{s.ret}%</div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6 h-12 overflow-hidden">{s.driver}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3 rounded-xl">
                      <div className="text-[9px] text-slate-600 uppercase font-bold">Target Price</div>
                      <div className="text-sm font-bold text-white">${s.price5}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl">
                      <div className="text-[9px] text-slate-600 uppercase font-bold">EPS CAGR</div>
                      <div className="text-sm font-bold text-white">{s.cagr}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {slide === 4 && (
          <div className="bg-gradient-to-br from-[#1e1b4b] to-slate-950 p-12 rounded-3xl text-center border border-blue-500/30">
            <h3 className="text-4xl font-black mb-4">{isGenerated ? "Investment Verdict" : "Structural Machine"}</h3>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              {isGenerated ? selectedStock.verdict : "Fair Isaac continues to leverage its unmatched pricing power. The market already reflects high expectations, making execution in DLP critical."}
            </p>
            <button onClick={backToHome} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all">Back to Portfolio</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080d1a] text-slate-200 select-none font-inter">
      <header className="bg-[#0e1829] border-b border-[#1e3251] px-6 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-1.5 rounded-lg shadow-lg cursor-pointer hover:scale-105" onClick={backToHome}>
            <span className="font-black text-xl tracking-tighter text-white">INSIGHT</span>
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
          <div className="flex gap-4">
            {view === 'ANALYSIS' && selectedStock?.stats.map(stat => (
              <div key={stat.label} className="bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-1 text-center hidden sm:block">
                <div className="text-[#475569] text-[9px] font-black uppercase">{stat.label}</div>
                <div className={`${stat.color} font-bold text-sm tracking-tight`}>{stat.value}</div>
              </div>
            ))}
            <button onClick={backToHome} className="text-slate-400 hover:text-white transition-colors text-sm font-bold px-4 py-1 rounded-lg border border-slate-700">Додому</button>
          </div>
        )}
      </header>
      <div className="h-0.5 bg-[#0e1829] w-full shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out" 
          style={{ width: view === 'ANALYSIS' ? `${(slide / (SLIDES.length - 1)) * 100}%` : view === 'GENERATOR' ? '50%' : '0%' }} 
        />
      </div>
      {view === 'ANALYSIS' && (
        <nav className="flex gap-2 p-3 bg-[#0e1829] border-b border-[#1e3251] overflow-x-auto no-scrollbar shrink-0">
          {SLIDES.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setSlide(i)} 
              className={`px-5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 whitespace-nowrap ${slide === i ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </nav>
      )}
      <main className="flex-1 overflow-y-auto">
        {view === 'HOME' && renderHome()}
        {view === 'GENERATOR' && renderGenerator()}
        {view === 'ANALYSIS' && (
          <div className="px-6 py-8 md:px-10">
            {renderAnalysis()}
          </div>
        )}
      </main>
      {view === 'ANALYSIS' && (
        <footer className="bg-[#0e1829] border-t border-[#1e3251] px-6 py-4 flex items-center justify-between shrink-0">
          <button onClick={() => go(-1)} disabled={slide === 0} className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-20 transition-all font-bold text-sm">Назад</button>
          <div className="flex gap-2">{SLIDES.map((_, i) => (<div key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${slide === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'}`} />))}</div>
          <button onClick={() => go(1)} disabled={slide === SLIDES.length - 1} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg disabled:opacity-20 transition-all font-bold text-sm">Далі</button>
        </footer>
      )}
    </div>
  );
}
