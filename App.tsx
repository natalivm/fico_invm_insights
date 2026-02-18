
import React, { useState, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ReferenceLine, Cell, AreaChart, Area 
} from 'recharts';
import { SLIDES, HIST_DATA, SCENARIOS, RISKS } from './constants';
import { AiInsightBox } from './components/AiInsightBox';

// --- Types & Constants ---

interface Stock {
  id: string;
  ticker: string;
  name: string;
  price: string;
  change: string;
  color: string;
  logo: string;
  stats: { label: string; value: string; color: string }[];
}

const STOCKS: Stock[] = [
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
      { label: "ВІД ПІКУ", value: "-39%", color: "text-rose-500" },
      { label: "BETA", value: "1.80", color: "text-purple-400" }
    ]
  },
];

const DASH_HIST = [
  { y: "FY23",  rev: 6.6,  fcf: 1.55, epsN: 0, ebitdaM: 10 },
  { y: "FY24",  rev: 8.6,  fcf: 1.80, epsN: 0, ebitdaM: 14 },
  { y: "FY25",  rev: 10.7, fcf: 2.67, epsN: 4.1,  ebitdaM: 18 },
  { y: "FY26E", rev: 13.8, fcf: 3.48, epsN: 6.11, ebitdaM: 21 },
  { y: "FY27E", rev: 17.9, fcf: 4.58, epsN: 8.14, ebitdaM: 24 },
];

const DASH_SCENARIOS = [
  { label: "Bull", cagr: 23, pe: 25, eps5: 19, price5: 475, ret: 22, prob: 30, color: "#22c55e", driver: "20%+ revenue growth + EBITDA margin 25%+ + FCF >5B" },
  { label: "Base", cagr: 18, pe: 22, eps5: 14, price5: 308, ret: 12, prob: 45, color: "#f59e0b", driver: "Execution без помилок, margin expansion продовжується" },
  { label: "Bear", cagr: 11, pe: 18, eps5: 10, price5: 180, ret: 1, prob: 25, color: "#ef4444", driver: "Revenue сповільнюється до 12%, margin стагнує" },
];

const DASH_RISKS = [
  { r: "Multiple Compression", prob: "40–50%", impact: "Дуже Високий", c: "#ef4444", detail: "Forward P/E 28x ціноутворює perfection. При normalized EPS $6 × 18x = $108 (-38%). Ринок не прощає промахів." },
  { r: "Margin Ceiling", prob: "30–40%", impact: "Високий", c: "#f97316", detail: "Доставка — не SaaS. Структурна обмеженість маржі. EBITDA >25% потребує суттєвого mix-shift до Advertising та DashPass." },
  { r: "Macro / Cyclicality", prob: "25–35%", impact: "Помірний", c: "#f59e0b", detail: "Beta 1.80. Замовлення та tips корелюють з disposable income. 2022 показав, як жорстко ринок карає при downturn." },
  { r: "Конкуренція", prob: "20–30%", impact: "Помірний", c: "#84cc16", detail: "Uber Eats, Instacart, локальні гравці. Немає pricing moat. Switching costs низькі — ні для ресторанів, ні для клієнтів." },
];

interface ChipProps {
  label: string;
  val: string;
  color: string;
  sub?: string;
}

// --- Components ---

const Chip: React.FC<ChipProps> = ({ label, val, color, sub }) => (
  <div className="bg-slate-900 border-t-2 rounded-xl p-4 transition-all hover:bg-slate-800" style={{ borderColor: color }}>
    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black" style={{ color }}>{val}</div>
    {sub && <div className="text-slate-600 text-[10px] mt-1 font-medium">{sub}</div>}
  </div>
);

const TooltipStyle = { 
  contentStyle: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" },
  itemStyle: { color: "#e2e8f0" }
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'HOME' | 'ANALYSIS'>('HOME');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [slide, setSlide] = useState(0);
  const [activeRisk, setActiveRisk] = useState<number | null>(null);

  const go = useCallback((d: number) => setSlide(s => Math.max(0, Math.min(SLIDES.length - 1, s + d))), []);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setView('ANALYSIS');
    setSlide(0);
    setActiveRisk(null);
  };

  const backToHome = () => {
    setView('HOME');
    setSelectedStock(null);
  };

  // --- Render Functions ---

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Портфель Аналітика</h2>
          <p className="text-slate-500 text-lg">Оберіть актив для глибокого інвестиційного аналізу</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {STOCKS.map(stock => (
            <div 
              key={stock.id}
              onClick={() => handleStockSelect(stock)}
              className="group relative bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8 cursor-pointer transition-all hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${stock.color}, #8b5cf6)` }}
                >
                  {stock.logo}
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-xl">{stock.price}</div>
                  <div className={`text-sm font-bold ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {stock.change}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stock.ticker}</div>
                <h3 className="text-white text-2xl font-black tracking-tight">{stock.name}</h3>
              </div>
              
              <div className="mt-8 flex items-center text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Переглянути звіт
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
          
          <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-slate-400 font-bold text-sm">Додати акцію</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashAnalysis = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 0 — SNAPSHOT */}
      {slide === 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-orange-500 text-[10px] font-black tracking-[0.4em] uppercase">Investigative Analysis · Feb 2026</span>
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 leading-tight">
              DoorDash
            </h2>
            <p className="text-slate-500 text-lg font-medium">Циклічний Growth · Margin Recovery · Execution Story</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Chip label="Revenue FY26E" val="$13.8B" color="#f97316" sub="+28% YoY · 3Y CAGR 30%" />
            <Chip label="FCF FY26E" val="$3.48B" color="#22c55e" sub="+30% vs FY25 · CAGR 31%" />
            <Chip label="EPS norm FY26E" val="$6.11" color="#f59e0b" sub="FY27E: $8.14 (+33%)" />
            <Chip label="Market Cap" val="$70B" color="#8b5cf6" sub="FCF yield FY27E ~6.5%" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Бізнес-модель</h3>
              <div className="space-y-3">
                {[
                  ["Тип бізнесу", "Marketplace / Logistics", "text-orange-400"],
                  ["Gross Margin", "~51%", "text-emerald-400"],
                  ["EBITDA Margin", "~20% (FY26E)", "text-amber-400"],
                  ["Recurring (DashPass)", "Частково", "text-slate-400"],
                  ["Beta", "1.80", "text-purple-400"],
                  ["Buybacks", "Мінімальні", "text-slate-400"]
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0 text-sm">
                    <span className="text-slate-400">{k}</span>
                    <span className={`${c} font-bold`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">КЛАСИФІКАЦІЯ</h3>
              <div className="mb-4 bg-slate-950 p-4 rounded-xl border-l-4 border-orange-500">
                <div className="text-orange-500 font-bold text-sm mb-1">B) Циклічний Growth</div>
                <div className="text-slate-400 text-xs leading-relaxed">
                  Перехідна фаза: Growth → Прибутковість. Сильний execution-елемент. Операційний moat, не pricing moat.
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ["Структурний moat?", "Так (операційний)", "text-emerald-400"],
                  ["Залежність від циклу?", "Так (income)", "text-amber-400"],
                  ["Buyback-driven?", "Ні (органічний)", "text-emerald-400"],
                  ["Hype-залежний?", "Частково", "text-amber-400"]
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between items-center py-1.5 border-b border-slate-800/50 last:border-0 text-xs">
                    <span className="text-slate-500">{k}</span>
                    <span className={`${c} font-bold`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-emerald-500 text-xs font-bold mb-3 uppercase tracking-wider">✅ Strengths</h3>
                <div className="space-y-2 mb-6">
                  {["30% revenue CAGR — топ серед великих", "FCF CAGR 31% FY23–27E", "2-sided network + локальна домінація", "Margin recovery: EBITDA 10% → 24%"].map(t => (
                    <div key={t} className="flex gap-2 text-xs text-slate-400"><span className="text-emerald-500 font-bold">→</span>{t}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-rose-500 text-xs font-bold mb-3 uppercase tracking-wider">⚠️ Ризики</h3>
                <div className="space-y-2">
                  {["Beta 1.80 — висока волатильність", "Margin ceiling: доставка ≠ SaaS", "P/E 28x = perfection pricing"].map(t => (
                    <div key={t} className="flex gap-2 text-xs text-slate-400"><span className="text-rose-500 font-bold">→</span>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <AiInsightBox slideTitle="DoorDash Executive Summary FY26" slideData={DASH_HIST} />
        </div>
      )}

      {/* 1 — ФІНАНСОВІ ДАНІ */}
      {slide === 1 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white">Фінансові дані</h2>
          <p className="text-slate-500 text-sm">FY23–FY25 Actuals · FY26–27E Estimates (TIKR)</p>

          <div className="bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950">
                    <th className="p-4 text-slate-500 text-[10px] uppercase font-black">Метрика</th>
                    <th className="p-4 text-right text-slate-400 text-xs font-bold">FY23A</th>
                    <th className="p-4 text-right text-slate-400 text-xs font-bold">FY24A</th>
                    <th className="p-4 text-right text-slate-400 text-xs font-bold">FY25E</th>
                    <th className="p-4 text-right text-orange-400 text-xs font-bold">FY26E</th>
                    <th className="p-4 text-right text-emerald-400 text-xs font-bold">FY27E</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { m:"Revenue ($B)",     v:["6.6","8.6","10.7","13.8","17.9"], bold:true },
                    { m:"  % YoY",          v:["—","+30%","+24%","+29%","+30%"], sub:true },
                    { m:"Gross Margin",     v:["~48%","~50%","~51%","~52%","~53%"], sub:true },
                    { m:"EBITDA Margin",    v:["~10%","~14%","~18%","~21%","~24%"], sub:true },
                    { m:"EPS GAAP",         v:["-","(-1.42)","0.29","2.25","3.20"], bold:true },
                    { m:"EPS Normalized",   v:["—","—","~4.1","6.11","8.14"], bold:true },
                    { m:"Free Cash Flow ($B)", v:["1.55","1.80","2.67","3.48","4.58"], bold:true },
                    { m:"  FCF YoY",        v:["—","+16%","+48%","+30%","+32%"], sub:true },
                  ].map((row, i) => (
                    <tr key={row.m} className={`hover:bg-slate-800/40 transition-colors ${row.bold ? 'font-bold' : ''}`}>
                      <td className={`p-4 text-sm ${row.sub ? 'pl-8 text-slate-500 text-xs' : 'text-slate-300'}`}>{row.m}</td>
                      {row.v.map((v, j) => (
                        <td key={j} className={`p-4 text-right text-sm ${j===3 ? 'text-orange-400 font-black' : j===4 ? 'text-emerald-400 font-black' : row.sub ? 'text-slate-500' : 'text-slate-200'}`}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-64">
              <h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">REVENUE & FCF ($B)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DASH_HIST} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="y" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:11 }} axisLine={false} />
                  <Tooltip {...TooltipStyle} />
                  <Bar name="Revenue" dataKey="rev" fill="#f97316" radius={[4,4,0,0]} opacity={0.6} />
                  <Bar name="FCF" dataKey="fcf" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-64">
              <h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">EBITDA MARGIN EXPANSION (%)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DASH_HIST}>
                  <defs>
                    <linearGradient id="mgDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="y" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:11 }} axisLine={false} unit="%" domain={[0, 30]} />
                  <Tooltip {...TooltipStyle} formatter={v => [`${v}%`]} />
                  <ReferenceLine y={25} stroke="#8b5cf6" strokeDasharray="4 4" label={{ value:"Ceiling?", fill:"#8b5cf6", fontSize:10 }} />
                  <Area name="EBITDA Margin" dataKey="ebitdaM" stroke="#f97316" fill="url(#mgDash)" strokeWidth={3} dot={{ r:5, fill:"#f97316" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Chip label="Forward P/E (norm 2026E)" val="28x" color="#f97316" sub="від 100x+ у 2021 · ринок оцінює normalized" />
            <Chip label="Forward P/E (norm 2027E)" val="21x" color="#f59e0b" sub="FCF yield FY27E ~6.5%" />
            <Chip label="Stress: P/E 18x × $6 EPS" val="$108" color="#ef4444" sub="Downside -38% від поточної ціни" />
          </div>
          <AiInsightBox slideTitle="DoorDash Financial Trajectory" slideData={DASH_HIST} />
        </div>
      )}

      {/* 2 — СЦЕНАРІЇ */}
      {slide === 2 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white">Три сценарії · 5 років</h2>
          <p className="text-slate-500 text-sm">Від $173 · EPS norm FY26E ~$6.11</p>

          <div className="grid lg:grid-cols-3 gap-6">
            {DASH_SCENARIOS.map((s, i) => (
              <div key={i} className="bg-slate-900 rounded-3xl p-8 border-t-4 shadow-xl" style={{ borderTopColor: s.color }}>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl font-black">{s.label} Case</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: s.color }}>P = {s.prob}%</span>
                </div>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 h-10">{s.driver}</p>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                  {s.cagr}% EPS CAGR · Exit P/E {[25, 22, 18][i]}x
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-950 p-4 rounded-xl">
                    <div className="text-slate-600 text-[9px] font-black uppercase mb-1">EPS FY31E</div>
                    <div className="text-xl font-black" style={{ color: s.color }}>${s.eps5}</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl">
                    <div className="text-slate-600 text-[9px] font-black uppercase mb-1">PRICE FY31E</div>
                    <div className="text-xl font-black" style={{ color: s.color }}>${s.price5}</div>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-slate-800">
                  <div className="text-slate-500 text-[10px] font-black uppercase mb-1">Annual Return</div>
                  <div className="text-6xl font-black leading-none" style={{ color: s.color }}>
                    {s.ret > 0 ? '+' : ''}{s.ret}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">FCF TRAJECTORY + ЦІЛЬ ДЛЯ 15%/РІК ($B)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { y:"FY23A", v:1.55, t:"a" }, { y:"FY24A", v:1.80, t:"a" }, { y:"FY25E", v:2.67, t:"e" },
                  { y:"FY26E", v:3.48, t:"e" }, { y:"FY27E", v:4.58, t:"e" },
                  { y:"FY28P*", v:5.5, t:"p" }, { y:"FY29P*", v:6.6, t:"p" }, { y:"FY30P*", v:7.9, t:"p" },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="y" tick={{ fill:"#475569", fontSize:10 }} axisLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:11 }} axisLine={false} unit="B" />
                  <Tooltip {...TooltipStyle} formatter={v=>[`$${v}B`]} />
                  <ReferenceLine y={5.0} stroke="#8b5cf6" strokeDasharray="3 3" label={{ value:"~$5B для 15%/рік", fill:"#8b5cf6", fontSize:10 }} />
                  <Bar dataKey="v" radius={[4,4,0,0]}>
                    {[{t:"a"},{t:"a"},{t:"e"},{t:"e"},{t:"e"},{t:"p"},{t:"p"},{t:"p"}].map((d,i)=>(
                      <Cell key={i} fill={d.t==="a"?"#f97316":d.t==="e"?"#22c55e":"#334155"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-slate-950 p-4 rounded-xl text-xs text-slate-500 border border-slate-800">
              💡 <b className="text-slate-300">Для 15% річних потрібен FCF CAGR ~20%.</b> Поточна траєкторія FY23–27E показує ~31%. Але це margin recovery phase. Після FY27 стійкість 20% FCF CAGR — під питанням.
            </div>
          </div>
          <AiInsightBox slideTitle="DoorDash Scenarios & FCF Quality" slideData={DASH_SCENARIOS} />
        </div>
      )}

      {/* 3 — РИЗИКИ */}
      {slide === 3 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white">Аналіз ризиків</h2>
          <p className="text-slate-500 text-sm">Натисніть на ризик для деталей</p>

          <div className="grid md:grid-cols-2 gap-4">
            {DASH_RISKS.map((r, i) => (
              <div 
                key={i} 
                onClick={() => setActiveRisk(activeRisk === i ? null : i)} 
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  activeRisk === i ? 'bg-slate-800 shadow-xl' : 'bg-slate-900 border-slate-800'
                }`}
                style={{ borderColor: activeRisk === i ? r.c : 'transparent' }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-slate-100">{r.r}</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: r.c }}>{r.prob} PROB.</span>
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Impact: <span style={{ color: r.c }}>{r.impact}</span></div>
                {activeRisk === i && (
                  <div className="mt-4 bg-slate-950 p-4 rounded-xl text-xs text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {r.detail}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">STRESS TEST: ЦІНА ЧЕРЕЗ 1 РІК (від $173)</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                ["Rev +29%\nP/E 28x", 171, "#22c55e"],
                ["Rev +20%\nP/E 25x", 153, "#84cc16"],
                ["Rev +15%\nP/E 22x", 134, "#f59e0b"],
                ["Rev flat\nP/E 20x", 122, "#f97316"],
                ["P/E→18x\nEPS $6", 108, "#ef4444"],
              ].map(([label, pr, color]) => {
                const price = Number(pr);
                const chg = ((price - 173.42) / 173.42 * 100).toFixed(0);
                return (
                  <div key={label.toString()} className="bg-slate-950 p-5 rounded-2xl text-center border-t-4" style={{ borderTopColor: color as string }}>
                    <div className="text-[10px] text-slate-500 font-bold uppercase whitespace-pre-line leading-relaxed mb-3 h-8">{label.toString()}</div>
                    <div className="text-xl font-black" style={{ color: color as string }}>${price}</div>
                    <div className={`text-sm font-black mt-2 ${Number(chg) > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {Number(chg) > 0 ? '+' : ''}{chg}%
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 bg-slate-950 p-4 rounded-xl text-xs text-slate-500 border border-slate-800 border-l-rose-500 border-l-4">
              ⚠️ При P/E 18x (historic stress) downside -38%. Це реальний сценарій при уповільненні росту або hawkish macro.
            </div>
          </div>
          <AiInsightBox slideTitle="DoorDash Risks & Stress Scenarios" slideData={DASH_RISKS} />
        </div>
      )}

      {/* 4 — ВИСНОВОК */}
      {slide === 4 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white">Висновок</h2>
          <p className="text-slate-500 text-sm">Інвестиційний вердикт при $173.42</p>

          <div className="bg-gradient-to-br from-[#1a0e06] to-[#0e1829] border border-orange-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="text-orange-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Final Verdict</div>
            <div className="text-2xl md:text-3xl font-black mb-10 leading-tight">
              <span className="text-orange-400">Операційний Turnaround</span><br/>
              <span className="text-slate-500">у фазі монетизації · -39% від піку</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                {l:"Бізнес moat", v:"7/10", c:"text-emerald-400", n:"Операційний"},
                {l:"FCF якість", v:"8/10", c:"text-emerald-400", n:"31% CAGR"},
                {l:"Оцінка", v:"6.5/10", c:"text-blue-400", n:"28x fwd"},
                {l:"Execution", v:"5.5/10", c:"text-amber-400", n:"Margin ceiling"},
                {l:"Macro", v:"4/10", c:"text-rose-400", n:"Beta 1.80"}
              ].map(score => (
                <div key={score.l} className="bg-slate-950 p-4 rounded-2xl text-center border border-slate-800">
                  <div className="text-slate-600 text-[9px] font-black uppercase mb-1">{score.l}</div>
                  <div className={`text-2xl font-black ${score.c}`}>{score.v}</div>
                  <div className="text-slate-700 text-[9px] font-bold mt-1">{score.n}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              {DASH_SCENARIOS.map((s, i) => (
                <div key={i} className="text-center p-6 bg-slate-950 rounded-2xl border-t-4" style={{ borderTopColor: s.color }}>
                  <div className="text-slate-600 text-[10px] font-black uppercase mb-1">{s.label} ({s.prob}%)</div>
                  <div className="text-3xl font-black" style={{ color: s.color }}>{s.ret > 0 ? "+" : ""}{s.ret}%</div>
                  <div className="text-slate-700 text-[9px] font-bold">contribution: {(s.prob/100*s.ret).toFixed(1)}%</div>
                </div>
              ))}
              <div className="text-center p-6 bg-gradient-to-br from-[#1a0e06] to-slate-950 rounded-2xl border border-orange-500 shadow-lg shadow-orange-500/10">
                <div className="text-slate-500 text-[10px] font-black uppercase mb-1">Expected Weighted</div>
                <div className="text-4xl font-black text-orange-400 tracking-tighter">~10%</div>
                <div className="text-slate-600 text-[10px] font-black">ANNUALIZED</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <h4 className="text-emerald-500 font-bold text-sm uppercase mb-6 flex items-center gap-2">
                ✅ Купувати при $173, якщо:
              </h4>
              <ul className="space-y-4">
                {[
                  "Revenue growth тримається 20%+ у FY26E",
                  "EBITDA margin впевнено виходить до 22%+",
                  "FCF підтверджується >$3B у FY26E",
                  "Віриш у Advertisting як головний driver"
                ].map(t => (
                  <li key={t} className="flex gap-3 text-xs text-slate-400 leading-relaxed">
                    <span className="text-emerald-500 font-bold">→</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <h4 className="text-rose-500 font-bold text-sm uppercase mb-6 flex items-center gap-2">
                ⛔ Чекати, якщо:
              </h4>
              <ul className="space-y-4">
                {[
                  "Macro погіршується → disposable income падає",
                  "Revenue growth сповільнюється нижче 18%",
                  "Ринок входить в risk-off (Beta 1.80 — боляче)",
                  "Очікуєш entry нижче $140 (P/E ~23x)"
                ].map(t => (
                  <li key={t} className="flex gap-3 text-xs text-slate-400 leading-relaxed">
                    <span className="text-rose-500 font-bold">→</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-950 to-orange-950 border border-orange-500/30 p-10 rounded-3xl shadow-2xl">
            <p className="text-slate-300 leading-relaxed text-lg">
              <b className="text-orange-400 font-black italic">Фінальне слово:</b> DASH — це не вічний compounder. Це операційний turnaround у фазі монетизації. 
              <span className="text-white font-black"> Очікувана зважена дохідність ~10% річних — нижча за FICO.</span> Головний ризик — 
              <b className="text-rose-500 italic"> multiple compression при найменшому промаху.</b> Це ставка на execution, а не на структурний тренд із pricing moat.
            </p>
          </div>
          <AiInsightBox slideTitle="DoorDash Final Verdict" slideData={DASH_HIST} />
        </div>
      )}
    </div>
  );

  const renderFicoAnalysis = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 0 — SNAPSHOT */}
      {slide === 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase">Investigative Analysis · Feb 2026</span>
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 leading-tight">
              Fair Isaac
            </h2>
            <p className="text-slate-500 text-lg font-medium">Дуополія кредитного скорингу · Pricing Power · FCF Machine</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Chip label="EPS FY26E" val="$41.22" color="#22c55e" sub="+37.9% YoY" />
            <Chip label="FCF FY26E" val="$1.01B" color="#22c55e" sub="+36% vs FY25" />
            <Chip label="EBITDA Margin" val="61.4%" color="#a855f7" sub="FY26E Projection" />
            <Chip label="FCF CAGR 3Y" val="26.2%" color="#3b82f6" sub="FY23–FY25 Actuals" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Бізнес-модель</h3>
              <div className="space-y-3">
                {[
                  ["Scores (B2B/B2C)", "~60% Revenue", "text-emerald-400"],
                  ["Software Platform", "~40% Revenue", "text-blue-400"],
                  ["Recurring Revenue", "~78%", "text-emerald-400"],
                  ["Gross Margin", "82.9% LTM", "text-emerald-400"],
                  ["Top US lenders", "90% = клієнти", "text-slate-400"]
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0 text-sm">
                    <span className="text-slate-400">{k}</span>
                    <span className={`${c} font-bold`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Q1 FY2026 Stats</h3>
              <div className="space-y-3">
                {[
                  ["Revenue", "$512M +16%", "text-emerald-400"],
                  ["Scores segment", "$305M +29%", "text-emerald-400"],
                  ["Software segment", "$207M +2%", "text-amber-400"],
                  ["Non-GAAP EPS", "$7.33 +27%", "text-emerald-400"],
                  ["Op. Margin", "54% (+432bps)", "text-emerald-400"],
                  ["FCF", "$165M", "text-amber-400"]
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0 text-sm">
                    <span className="text-slate-400">{k}</span>
                    <span className={`${c} font-bold`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-emerald-500 text-xs font-bold mb-3 uppercase tracking-wider">✅ Strengths</h3>
                <div className="space-y-2 mb-6">
                  {["Scores дуополія — стандарт США", "FCF margin: 31% → 41%", "Platform NRR 122%", "DLP: 70–80% ринку підписано"].map(t => (
                    <div key={t} className="flex gap-2 text-xs text-slate-400"><span className="text-emerald-500 font-bold">→</span>{t}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-amber-500 text-xs font-bold mb-3 uppercase tracking-wider">⚠️ Ризики</h3>
                <div className="space-y-2">
                  {["Циклічність Mortgage (42%)", "FCF Q1 annualized відстає", "FHFA/VantageScore tail risk"].map(t => (
                    <div key={t} className="flex gap-2 text-xs text-slate-400"><span className="text-amber-500 font-bold">→</span>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <AiInsightBox slideTitle="FICO Executive Summary FY26" slideData={{ mcap: "Mega-Cap", segments: ["Scores", "Software"], drivers: ["DLP", "Pricing Power"] }} />
        </div>
      )}

      {/* 1 — ФІНАНСОВІ ДАНІ */}
      {slide === 1 && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-white">Фінансова Траєкторія</h2>
              <p className="text-slate-500 text-sm">FY23–FY25 Actuals · FY26E Consensus (TIKR)</p>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950">
                    <th className="p-4 text-slate-500 text-[10px] uppercase font-black">Метрика</th>
                    <th className="p-4 text-right text-slate-400 text-xs font-bold">FY23A</th>
                    <th className="p-4 text-right text-slate-400 text-xs font-bold">FY24A</th>
                    <th className="p-4 text-right text-slate-400 text-xs font-bold">FY25A</th>
                    <th className="p-4 text-right text-emerald-400 text-xs font-bold">FY26E</th>
                    <th className="p-4 text-right text-purple-400 text-xs font-bold">CAGR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { m:"Revenue ($M)",     v:["1,513","1,717","1,991","2,458"], cagr:"14.7%", bold:true },
                    { m:"EBITDA ($M)",       v:["656","747","951","1,511"],       cagr:"20.4%", bold:true },
                    { m:"  EBITDA Margin",  v:["51.5%","52.2%","55.6%","61.4%"], cagr:"", sub:true },
                    { m:"EPS Normalized",   v:["$19.71","$23.74","$29.88","$41.22"], cagr:"27.7%", bold:true },
                    { m:"Free Cash Flow",   v:["$465M","$607M","$739M","$1,008M"], cagr:"26.2%", bold:true },
                    { m:"  FCF Margin",     v:["30.7%","35.4%","37.1%","41.0%"], cagr:"", sub:true },
                  ].map((row, i) => (
                    <tr key={row.m} className={`hover:bg-slate-800/40 transition-colors ${row.bold ? 'font-bold' : ''}`}>
                      <td className={`p-4 text-sm ${row.sub ? 'pl-8 text-slate-500 text-xs' : 'text-slate-300'}`}>{row.m}</td>
                      {row.v.map((v, j) => (
                        <td key={j} className={`p-4 text-right text-sm ${j===3 ? 'text-emerald-400 font-black' : row.sub ? 'text-slate-500' : 'text-slate-200'}`}>{v}</td>
                      ))}
                      <td className="p-4 text-right text-purple-400 text-xs font-bold">{row.cagr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-64">
              <h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">Revenue & FCF ($M)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HIST_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="y" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...TooltipStyle} />
                  <Bar name="Revenue" dataKey="rev" fill="#3b82f6" radius={[4,4,0,0]} opacity={0.6} />
                  <Bar name="FCF" dataKey="fcf" fill="#22c55e" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-64">
              <h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">EPS Normalized Path</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HIST_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="y" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip {...TooltipStyle} />
                  <Line name="EPS" dataKey="epsN" stroke="#22c55e" strokeWidth={4} dot={{ r:6, fill:"#22c55e", stroke:"#080d1a", strokeWidth:2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { l:"NTM P/E (зараз)", v:"30.0x", s:"від 56.3x у червні 2025 (-47%)", c:"#3b82f6" },
              { l:"NTM EV/EBITDA", v:"21.8x", s:"від 38.5x у червні 2025", c:"#a855f7" },
              { l:"Fair Value @ 30x", v:"~$1,237", s:"Поточна $1,351 = +9% premium", c:"#f59e0b" },
            ].map(m => <Chip key={m.l} label={m.l} val={m.v} color={m.c} sub={m.s} />)}
          </div>
          <AiInsightBox slideTitle="Financial Performance & Valuation" slideData={HIST_DATA} />
        </div>
      )}

      {/* 2 — СЦЕНАРІЇ */}
      {slide === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white">П'ятирічний Горизонт</h2>
            <p className="text-slate-500 text-sm">Цільові ціни на базі FY26E EPS $41.22</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {SCENARIOS.map((s, i) => (
              <div key={i} className="bg-slate-900 rounded-3xl p-8 border-t-4 shadow-xl transition-transform hover:scale-[1.02]" style={{ borderTopColor: s.color }}>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl font-black">{s.label} Case</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: s.color }}>P = {s.prob}%</span>
                </div>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 h-10">{s.driver}</p>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                  {s.cagr}% EPS CAGR · Exit P/E {[28, 25, 22][i]}x
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-950 p-4 rounded-xl">
                    <div className="text-slate-600 text-[9px] font-black uppercase mb-1">EPS FY31E</div>
                    <div className="text-xl font-black" style={{ color: s.color }}>${[91, 73, 50][i]}</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl">
                    <div className="text-slate-600 text-[9px] font-black uppercase mb-1">PRICE FY31E</div>
                    <div className="text-xl font-black" style={{ color: s.color }}>${s.price5.toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-slate-800">
                  <div className="text-slate-500 text-[10px] font-black uppercase mb-1">Annual Return</div>
                  <div className="text-6xl font-black leading-none" style={{ color: s.color }}>
                    {s.ret > 0 ? '+' : ''}{s.ret}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Return Sensitivity vs EPS CAGR (Exit P/E 28x)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  {g:"11% CAGR",r:-4,c:"#ef4444"},
                  {g:"15% CAGR",r:6,c:"#f59e0b"},
                  {g:"18% CAGR",r:10,c:"#84cc16"},
                  {g:"22% CAGR",r:14,c:"#22c55e"}
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="g" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:11 }} axisLine={false} unit="%" domain={[-10, 20]} />
                  <Tooltip {...TooltipStyle} />
                  <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
                  <Bar dataKey="r" radius={[6,6,0,0]}>
                    {[
                      {c:"#ef4444"},{c:"#f59e0b"},{c:"#84cc16"},{c:"#22c55e"}
                    ].map((item, idx) => <Cell key={idx} fill={item.c} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 bg-slate-950 p-4 rounded-xl text-xs text-slate-500 border border-slate-800">
              💡 <b className="text-slate-300">Інсайт:</b> FICO показала 23% EPS CAGR за FY23–25. Для досягнення цілі 15% річних при консервативному P/E 28x компанії необхідно підтримувати ріст на рівні ~19% CAGR.
            </div>
          </div>
          <AiInsightBox slideTitle="Scenario Analysis & Long-term Yield" slideData={SCENARIOS} />
        </div>
      )}

      {/* 3 — РИЗИКИ */}
      {slide === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white">Аналіз Ризиків</h2>
            <p className="text-slate-500 text-sm">Інтерактивна мапа загроз та стрес-тестування</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {RISKS.map((r, i) => (
              <div 
                key={i} 
                onClick={() => setActiveRisk(activeRisk === i ? null : i)} 
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  activeRisk === i ? 'bg-slate-800 shadow-xl' : 'bg-slate-900 border-slate-800'
                }`}
                style={{ borderColor: activeRisk === i ? r.c : 'transparent' }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-slate-100">{r.r}</span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black text-white" style={{ backgroundColor: r.c }}>{r.prob} PROB.</span>
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase mb-2">Impact: <span style={{ color: r.c }}>{r.impact}</span></div>
                {activeRisk === i && (
                  <div className="mt-4 bg-slate-950 p-4 rounded-xl text-xs text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {r.detail}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Stress Test: 1-Year Forward Price (від $1,351)</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                ["EPS +38%\nP/E 28x", 1573, "#22c55e"],
                ["EPS +20%\nP/E 28x", 1394, "#84cc16"],
                ["EPS +10%\nP/E 25x", 1134, "#f59e0b"],
                ["EPS flat\nP/E 25x", 1031, "#f97316"],
                ["EPS flat\nP/E 22x", 908, "#ef4444"]
              ].map(([label, pr, color]) => {
                const price = Number(pr);
                const chg = ((price - 1351.6) / 1351.6 * 100).toFixed(0);
                return (
                  <div key={label.toString()} className="bg-slate-950 p-5 rounded-2xl text-center border-t-4" style={{ borderTopColor: color as string }}>
                    <div className="text-[10px] text-slate-500 font-bold uppercase whitespace-pre-line leading-relaxed mb-3 h-8">{label.toString()}</div>
                    <div className="text-xl font-black" style={{ color: color as string }}>${price.toLocaleString()}</div>
                    <div className={`text-sm font-black mt-2 ${Number(chg) > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {Number(chg) > 0 ? '+' : ''}{chg}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <AiInsightBox slideTitle="Investment Risks & Tail Risks" slideData={RISKS} />
        </div>
      )}

      {/* 4 — ВИСНОВОК */}
      {slide === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-white">Інвестиційний Вердикт</h2>
            <p className="text-slate-500 text-sm">Оцінка при поточній ціні $1,351.60</p>
          </div>

          <div className="bg-gradient-to-br from-[#0e1829] to-[#111827] border border-[#1e3251] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <div className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Final Verdict</div>
            <div className="text-2xl md:text-3xl font-black mb-10 leading-tight">
              <span className="text-emerald-400">Structural Pricing Machine</span><br/>
              <span className="text-slate-500">після major compression (-47% P/E)</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                {l:"Бізнес moat", v:"9.5/10", c:"text-emerald-400", n:"Дуополія"},
                {l:"FCF якість", v:"8.5/10", c:"text-emerald-400", n:"26% CAGR"},
                {l:"Оцінка", v:"7/10", c:"text-blue-400", n:"30x P/E"},
                {l:"Execution", v:"6/10", c:"text-amber-400", n:"DLP + FCF"},
                {l:"Macro", v:"5.5/10", c:"text-amber-400", n:"Cycle"}
              ].map(score => (
                <div key={score.l} className="bg-slate-950 p-4 rounded-2xl text-center border border-slate-800">
                  <div className="text-slate-600 text-[9px] font-black uppercase mb-1">{score.l}</div>
                  <div className={`text-2xl font-black ${score.c}`}>{score.v}</div>
                  <div className="text-slate-700 text-[9px] font-bold mt-1">{score.n}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              {SCENARIOS.map((s, i) => (
                <div key={i} className="text-center p-6 bg-slate-950 rounded-2xl border-t-4" style={{ borderTopColor: s.color }}>
                  <div className="text-slate-600 text-[10px] font-black uppercase mb-1">{s.label} ({s.prob}%)</div>
                  <div className="text-3xl font-black" style={{ color: s.color }}>{s.ret > 0 ? '+' : ''}{s.ret}%</div>
                  <div className="text-slate-700 text-[9px] font-bold">contribution: {(s.prob/100*s.ret).toFixed(1)}%</div>
                </div>
              ))}
              <div className="text-center p-6 bg-gradient-to-br from-[#0e1f3a] to-slate-950 rounded-2xl border border-blue-500 shadow-lg shadow-blue-500/10">
                <div className="text-slate-500 text-[10px] font-black uppercase mb-1">Expected Weighted</div>
                <div className="text-4xl font-black text-blue-400 tracking-tighter">~15%</div>
                <div className="text-slate-600 text-[10px] font-black">ANNUALIZED</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <h4 className="text-emerald-500 font-bold text-sm uppercase mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                Купувати при $1,351, якщо:
              </h4>
              <ul className="space-y-4">
                {[
                  "P/E 30x — чудова точка входу після піку 56x",
                  "FCF $1B FY26E підтверджено в Q2 звіті",
                  "DLP виходить в live найближчими місяцями",
                  "Горизонт 3–5 років, допускаєте волатильність"
                ].map(t => (
                  <li key={t} className="flex gap-3 text-xs text-slate-400 leading-relaxed">
                    <span className="text-emerald-500 font-bold">→</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
              <h4 className="text-rose-500 font-bold text-sm uppercase mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
                Чекати, якщо:
              </h4>
              <ul className="space-y-4">
                {[
                  "Q2 FCF не підтверджує $1B trajectory (red flag)",
                  "Mortgage rates ростуть через hawkish Fed",
                  "FHFA рухається до VantageScore parity",
                  "Очікуєте нижче $1,150 (P/E 28x на FY26E)"
                ].map(t => (
                  <li key={t} className="flex gap-3 text-xs text-slate-400 leading-relaxed">
                    <span className="text-rose-500 font-bold">→</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-950 to-indigo-950 border border-purple-500/30 p-10 rounded-3xl shadow-2xl">
            <p className="text-slate-300 leading-relaxed text-lg">
              <b className="text-purple-400 font-black italic">Фінальне слово:</b> FICO — де-факто стандарт кредитного ризику США з FCF 26% CAGR і EBITDA margin, що прямує до 61%. P/E compression з 56x до 30x вже відбулась. 
              <span className="text-white font-black"> При ~15% очікуваної зваженої дохідності — це обґрунтована інвестиція.</span> Головний ризик — 
              <b className="text-amber-500 italic"> не фундаментал, а виконання</b>: DLP go-live і підтвердження FCF $1B у другому півріччі FY26.
            </p>
          </div>
          <AiInsightBox slideTitle="Final Investment Decision & Risk/Reward" slideData={{ er: 15, pe: 30, catalysts: ["DLP", "FCF"] }} />
        </div>
      )}
    </div>
  );

  const renderPlaceholderAnalysis = () => (
    <div className="max-w-4xl mx-auto py-20 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-8">
        <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-white mb-4">Аналіз {selectedStock?.ticker} в процесі</h2>
      <p className="text-slate-500 text-lg mb-10">Наші аналітики готують детальний звіт для цієї компанії. Поверніться пізніше!</p>
      <button 
        onClick={backToHome}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
      >
        Повернутись до списку
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080d1a] text-slate-200 select-none font-inter">
      
      {/* Header */}
      <header className="bg-[#0e1829] border-b border-[#1e3251] px-6 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div 
            className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-1.5 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
            onClick={backToHome}
          >
            <span className="font-black text-xl tracking-tighter text-white">INSIGHT</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-tight">
              {view === 'HOME' ? 'Інвестиційна Платформа' : selectedStock?.name}
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {view === 'HOME' ? 'Stock Discovery' : `Deep Analysis · ${selectedStock?.ticker}`}
            </p>
          </div>
        </div>
        
        {view === 'ANALYSIS' && (
          <div className="flex gap-4">
            {selectedStock?.stats.map(stat => (
              <div key={stat.label} className="bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-1 text-center hidden sm:block">
                <div className="text-[#475569] text-[9px] font-black uppercase">{stat.label}</div>
                <div className={`${stat.color} font-bold text-sm tracking-tight`}>{stat.value}</div>
              </div>
            ))}
            <button 
              onClick={backToHome}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Додому
            </button>
          </div>
        )}
      </header>

      {/* Progress bar / Separator */}
      <div className="h-0.5 bg-[#0e1829] w-full shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out" 
          style={{ width: view === 'ANALYSIS' ? `${(slide / (SLIDES.length - 1)) * 100}%` : '0%' }} 
        />
      </div>

      {/* Analysis Nav */}
      {view === 'ANALYSIS' && (
        <nav className="flex gap-2 p-3 bg-[#0e1829] border-b border-[#1e3251] overflow-x-auto no-scrollbar shrink-0">
          {SLIDES.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setSlide(i)} 
              className={`px-5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 whitespace-nowrap ${
                slide === i ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {view === 'HOME' ? renderHome() : (
          <div className="px-6 py-8 md:px-10">
            {selectedStock?.id === 'fico' ? renderFicoAnalysis() : selectedStock?.id === 'dash' ? renderDashAnalysis() : renderPlaceholderAnalysis()}
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      {view === 'ANALYSIS' && (
        <footer className="bg-[#0e1829] border-t border-[#1e3251] px-6 py-4 flex items-center justify-between shrink-0">
          <button 
            onClick={() => go(-1)} 
            disabled={slide === 0} 
            className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-bold text-sm">Назад</span>
          </button>

          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setSlide(i)} 
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${slide === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800 hover:bg-slate-700'}`} 
              />
            ))}
          </div>

          <button 
            onClick={() => go(1)} 
            disabled={slide === SLIDES.length - 1} 
            className="group flex items-center gap-2 px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <span className="font-bold text-sm">Далі</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </footer>
      )}
    </div>
  );
}
