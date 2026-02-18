
import React, { useState, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ReferenceLine, Cell 
} from 'recharts';
import { SLIDES, HIST_DATA, SCENARIOS, RISKS } from './constants';
import { AiInsightBox } from './components/AiInsightBox';

// Fix: Define ChipProps and use React.FC to properly handle standard props like 'key'
interface ChipProps {
  label: string;
  val: string;
  color: string;
  sub?: string;
}

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

export default function App() {
  const [slide, setSlide] = useState(0);
  const [activeRisk, setActiveRisk] = useState<number | null>(null);

  const go = useCallback((d: number) => setSlide(s => Math.max(0, Math.min(SLIDES.length - 1, s + d))), []);

  const currentSlideLabel = SLIDES[slide];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080d1a] text-slate-200 select-none font-inter">
      
      {/* Header */}
      <header className="bg-[#0e1829] border-b border-[#1e3251] px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-1.5 rounded-lg shadow-lg">
            <span className="font-black text-xl tracking-tighter text-white">FICO</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-tight">Fair Isaac Corporation</h1>
            <p className="text-[10px] text-slate-500 font-bold">Q1 FY2026 Earnings Analysis · 18 Feb 2026</p>
          </div>
        </div>
        <div className="flex gap-4">
          {[
            { l: "ЦІНА", v: "$1,351.60", c: "text-white" },
            { l: "NTM P/E", v: "30.0x", c: "text-purple-400" },
            { l: "ВІД ПІКУ", v: "-35%", c: "text-rose-500" }
          ].map(stat => (
            <div key={stat.l} className="bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-1 text-center hidden sm:block">
              <div className="text-[#475569] text-[9px] font-black uppercase">{stat.l}</div>
              <div className={`${stat.c} font-bold text-sm tracking-tight`}>{stat.v}</div>
            </div>
          ))}
          <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-xs font-mono font-bold flex items-center">
            {slide + 1} / {SLIDES.length}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-[#0e1829] w-full shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out" 
          style={{ width: `${(slide / (SLIDES.length - 1)) * 100}%` }} 
        />
      </div>

      {/* Nav */}
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

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
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
      </main>

      {/* Footer Navigation */}
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
    </div>
  );
}
