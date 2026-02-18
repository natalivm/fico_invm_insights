
import React, { useState, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ReferenceLine, Cell 
} from 'recharts';
import { SLIDES, SCENARIO_DATA, COMPRESSION_DATA, FCF_DATA, RETURN_MATRIX } from './constants';
import { MetricCard } from './components/MetricCard';
import { AiInsightBox } from './components/AiInsightBox';

const App: React.FC = () => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [activeScenario, setActiveScenario] = useState<number | null>(null);

  const nextSlide = useCallback(() => setSlideIdx(s => Math.min(SLIDES.length - 1, s + 1)), []);
  const prevSlide = useCallback(() => setSlideIdx(s => Math.max(0, s - 1)), []);

  const progress = (slideIdx / (SLIDES.length - 1)) * 100;
  const currentSlide = SLIDES[slideIdx];

  return (
    <div className="flex flex-col h-screen overflow-hidden text-slate-200 select-none">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <span className="font-extrabold text-xl tracking-tighter">FICO</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-sm font-semibold text-slate-100">Fair Isaac Corporation</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Deep Equity Research Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current Price</div>
            <div className="text-emerald-400 font-bold text-lg">$1,300.24</div>
          </div>
          <div className="bg-slate-800 px-3 py-1 rounded-md text-xs font-mono text-slate-400">
            {slideIdx + 1} / {SLIDES.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-900 overflow-hidden shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation Pills */}
      <nav className="bg-slate-900/80 backdrop-blur-md px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 shrink-0">
        {SLIDES.map((s) => (
          <button
            key={s.id}
            onClick={() => setSlideIdx(s.id)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              slideIdx === s.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 bg-slate-950">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
          
          {/* SLIDE 0: Introduction */}
          {slideIdx === 0 && (
            <div className="space-y-8">
              <div className="text-center space-y-4 mb-12">
                <span className="text-blue-500 text-xs font-bold tracking-[0.3em] uppercase">Investigative Report 2024/25</span>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                  Чи варта FICO своїх <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">$1,300?</span>
                </h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                  Аналіз фундаментальних показників, ризиків стиснення мультиплікатора та ймовірнісних сценаріїв.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Stock Price" value="$1,300" sub="Market Leader" color="#3b82f6" />
                <MetricCard label="NTM P/E" value="29x" sub="Historical Mean: 32x" color="#f59e0b" />
                <MetricCard label="EPS Growth FY26" value="+38%" sub="Cyclical Peak?" color="#22c55e" />
                <MetricCard label="PEG Ratio" value="0.76" sub="Undervalued relative to growth" color="#a855f7" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6">
                  <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Bull Arguments
                  </h3>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    {["PEG < 1 — формально дешева акція", "Середній P/E за 3 роки ≥ 32x", "Рекордний звіт, підтверджено гайденс", "Сильний moat: Scores + Platform"].map((t, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed">
                        <span className="text-emerald-500 font-bold">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6">
                  <h3 className="text-rose-400 font-bold flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Risk Assessment
                  </h3>
                  <ul className="space-y-3 text-slate-300 text-sm">
                    {["38% EPS — пік чи нова норма?", "Compression ризик при уповільненні", "FCF відстає від паперового EPS", "Залежність від іпотечного циклу"].map((t, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed">
                        <span className="text-rose-500 font-bold">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <AiInsightBox slideTitle="FICO Introduction" slideData={{ price: 1300, pe: 29, peg: 0.76 }} />
            </div>
          )}

          {/* SLIDE 1: Valuation */}
          {slideIdx === 1 && (
            <div className="space-y-8">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Що зараз закладено в ціну?</h2>
                <p className="text-slate-400">Розрахунок implied growth expectations за поточних мультиплікаторів.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Valuation Formula</span>
                  <div className="space-y-4">
                    <div className="text-xl text-slate-400">Ціна = EPS × P/E</div>
                    <div className="text-5xl font-black text-blue-500 tracking-tighter">$45 × 29</div>
                    <div className="text-6xl font-black text-emerald-500">≈ $1,305</div>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Implied Assumptions</h3>
                  <div className="space-y-4">
                    {[
                      { t: "EPS ріст ~18.4% (5 років)", status: "Required", color: "text-blue-400" },
                      { t: "P/E стійкість > 25x", status: "Critical", color: "text-amber-400" },
                      { t: "FCF Conversion > 90%", status: "Monitor", color: "text-slate-400" },
                      { t: "Mortgage Market Recovery", status: "Macro", color: "text-rose-400" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                        <span className="text-slate-200 font-medium">{item.t}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded bg-slate-800 ${item.color}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/20 p-8 rounded-3xl">
                <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center">
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase mb-2">Target Price (5yr)</div>
                    <div className="text-4xl font-black text-blue-400">$2,613</div>
                  </div>
                  <div className="hidden md:block text-slate-700 text-4xl">→</div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase mb-2">Required EPS (5yr)</div>
                    <div className="text-4xl font-black text-amber-500">$105</div>
                  </div>
                  <div className="hidden md:block text-slate-700 text-4xl">→</div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase mb-2">Required CAGR</div>
                    <div className="text-4xl font-black text-emerald-500">18.4%</div>
                  </div>
                </div>
              </div>
              <AiInsightBox slideTitle="Valuation & Implied Growth" slideData={{ pe: 29, target_cagr: 18.4 }} />
            </div>
          )}

          {/* SLIDE 2: Structural Analysis */}
          {slideIdx === 2 && (
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Structural Shift vs Peak Earnings</h2>
                <p className="text-slate-400">Декомпозиція росту на 38%: що реально, а що — шум.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {[
                  { seg: "Scores", growth: "+38%", color: "#22c55e", desc: "Pricing power & volume consolidation.", badge: "Dominant" },
                  { seg: "Platform ARR", growth: "+33%", color: "#3b82f6", desc: "Cloud transition & recurring revenue.", badge: "Growth" },
                  { seg: "Legacy SW", growth: "-8%", color: "#ef4444", desc: "Strategic phasing out of old products.", badge: "Sunset" },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900 p-6 rounded-2xl border-l-4 border-slate-800 transition-all hover:bg-slate-800" style={{ borderLeftColor: s.color }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-lg font-bold">{s.seg}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black text-white" style={{ backgroundColor: s.color }}>{s.badge}</span>
                    </div>
                    <div className="text-4xl font-black mb-2" style={{ color: s.color }}>{s.growth}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="space-y-4">
                  <h3 className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-4">Structural Drivers</h3>
                  {[
                    "Зміна моделі ціноутворення Scores",
                    "Platform NRR = 122% (Sticky Revenue)",
                    "Barriers to entry: Integrated into credit ecosystem",
                    "Scalable margins: Revenue 16% -> EPS 27%"
                  ].map((t, i) => (
                    <div key={i} className="flex gap-3 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-sm text-slate-300">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-rose-400 font-bold text-sm tracking-widest uppercase mb-4">Temporary Noise</h3>
                  {[
                    "Агресивні Buybacks (~$1.2B/year)",
                    "FCF Q1 впав на 12% YoY (Red flag?)",
                    "Cyclical dependency: Mortgage volatility",
                    "Software ARR (Overall) only +5%"
                  ].map((t, i) => (
                    <div key={i} className="flex gap-3 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <span className="text-sm text-slate-300">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <AiInsightBox slideTitle="Structural vs Peak Analysis" slideData={{ scores_growth: 38, platform_arr: 33, fcf_dip: -12 }} />
            </div>
          )}

          {/* SLIDE 3: Three Scenarios */}
          {slideIdx === 3 && (
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Investment Horizons</h2>
                <p className="text-slate-400">Моделювання результату на 5 років залежно від CAGR та Multiplier.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {SCENARIO_DATA.map((s, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveScenario(activeScenario === idx ? null : idx)}
                    className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-300 border-2 ${
                      activeScenario === idx ? 'bg-slate-800 scale-[1.02]' : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                    style={{ borderColor: activeScenario === idx ? s.color : 'transparent' }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-white">{s.name}</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.description}</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: s.color }}>P = {s.prob}%</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-950/50 p-3 rounded-xl">
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">EPS 5Y</div>
                        <div className="text-2xl font-bold" style={{ color: s.color }}>${s.eps5y}</div>
                      </div>
                      <div className="bg-slate-950/50 p-3 rounded-xl">
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Price 5Y</div>
                        <div className="text-2xl font-bold" style={{ color: s.color }}>${s.price5y.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="text-center pt-4 border-t border-slate-800">
                      <div className="text-xs text-slate-500 font-bold uppercase mb-1">Annual Return (CAGR)</div>
                      <div className="text-5xl font-black" style={{ color: s.color }}>{s.cagr}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-72 w-full mt-12 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Return Sensitivity Matrix</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={RETURN_MATRIX}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="growth" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} unit="%" domain={[0, 30]} />
                    <Tooltip 
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", color: "#f8fafc" }}
                      itemStyle={{ color: "#3b82f6" }}
                    />
                    <ReferenceLine y={15} stroke="#8b5cf6" strokeDasharray="6 6" label={{ value: "15% Target", fill: "#8b5cf6", fontSize: 12, position: 'insideTopRight' }} />
                    <Bar dataKey="ret" radius={[8, 8, 0, 0]}>
                      {RETURN_MATRIX.map((r, i) => <Cell key={i} fill={r.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <AiInsightBox slideTitle="CAGR Scenarios" slideData={SCENARIO_DATA} />
            </div>
          )}

          {/* SLIDE 4: FCF Check */}
          {slideIdx === 4 && (
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Free Cash Flow Validation</h2>
                <p className="text-slate-400">Чи підкріплений паперовий EPS живими грошима?</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  {[
                    { l: "Market Cap", v: "~$32B", c: "text-blue-400" },
                    { l: "Current FCF", v: "$1.0B", c: "text-emerald-400" },
                    { l: "FCF Yield", v: "3.1%", c: "text-amber-400" },
                    { l: "FCF Target (2030)", v: "$2.1B", c: "text-indigo-400" },
                  ].map((m, i) => (
                    <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase">{m.l}</span>
                      <span className={`text-xl font-black ${m.c}`}>{m.v}</span>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-2 bg-slate-900 p-8 rounded-3xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">FCF Forecast Path ($ Billions)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={FCF_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} domain={[0.8, 2.4]} unit="B" />
                        <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }} />
                        <ReferenceLine y={2.1} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Target $2.1B", fill: "#22c55e", fontSize: 11, position: 'top' }} />
                        <Line type="monotone" dataKey="fcf" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#0f172a" }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-rose-950/20 border border-rose-500/20 p-8 rounded-3xl flex items-center gap-6">
                <div className="text-4xl text-rose-500">⚠️</div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-white">Critical Mismatch:</span> Заявлене подвоєння FCF за 5 років — це лише 15% CAGR. 
                  Для забезпечення 15% CAGR ціни акції (наш таргет), FCF має рости на 18-21%. Ризик недобору доходності.
                </div>
              </div>
              <AiInsightBox slideTitle="FCF Analysis" slideData={FCF_DATA} />
            </div>
          )}

          {/* SLIDE 5: Compression */}
          {slideIdx === 5 && (
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Multiple Compression Risks</h2>
                <p className="text-slate-400">Downside analysis: що станеться, якщо P/E нормалізується до 22x.</p>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 text-center">1-Year Scenario If P/E Drops to 22x (Current $1,300)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={COMPRESSION_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="scenario" tick={{ fill: "#64748b", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 12 }} domain={[900, 1400]} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }} />
                      <ReferenceLine y={1300} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" label={{ value: "Current Price", fill: "#f59e0b", position: 'insideTopRight' }} />
                      <Bar dataKey="future" radius={[8, 8, 0, 0]}>
                        {COMPRESSION_DATA.map((_, i) => (
                          <Cell key={i} fill={["#f59e0b", "#f87171", "#ef4444", "#b91c1c"][i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                  <h4 className="font-bold text-slate-100 mb-4">Drivers of Compression</h4>
                  <ul className="space-y-4">
                    {[
                      "Macro shift: Higher rates for longer.",
                      "Growth slowdown: Scores pricing reach saturation.",
                      "Regulatory pressure: Junk fees crackdown.",
                      "Market Rotation: Out of high-multiple growth."
                    ].map((t, i) => (
                      <li key={i} className="flex gap-4 text-sm text-slate-400">
                        <span className="text-amber-500 font-bold">•</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-emerald-950/10 border border-emerald-500/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase mb-4">The "Comfort Zone" Floor</div>
                  <div className="text-6xl font-black text-emerald-400 mb-2">$990</div>
                  <p className="text-xs text-slate-400 max-w-xs">При цій ціні ризик стиснення мультиплікатора вже закладений. Купівля тут має значно вищий Margin of Safety.</p>
                </div>
              </div>
              <AiInsightBox slideTitle="Multiple Compression Risk" slideData={COMPRESSION_DATA} />
            </div>
          )}

          {/* SLIDE 6: Probabilistic Model */}
          {slideIdx === 6 && (
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Probabilistic Weighted Outcome</h2>
                <p className="text-slate-400">Очікуваний результат з урахуванням ймовірностей сценаріїв.</p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 p-12 rounded-[3rem] border border-blue-500/30 text-center shadow-2xl shadow-blue-500/10">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.5em] mb-6">Weighted Expected Annual Return (5yr)</div>
                <div className="text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 leading-none">
                  ~15.8%
                </div>
                <div className="mt-8 text-slate-500 font-mono text-sm max-w-md mx-auto">
                  (50% × 21%) + (35% × 12.6%) + (15% × 6%)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[
                  { l: "Bull Case P=50%", v: "15.8%", c: "text-blue-400" },
                  { l: "Bull Case P=35%", v: "13.5%", c: "text-amber-400" },
                  { l: "Bull Case P=60%", v: "17.5%", c: "text-emerald-400" },
                  { l: "Bear Case P=25%", v: "13.0%", c: "text-rose-400" },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">{s.l}</div>
                    <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>
              <AiInsightBox slideTitle="Weighted Returns" slideData={{ expected_return: 15.8 }} />
            </div>
          )}

          {/* SLIDE 7: Conclusion */}
          {slideIdx === 7 && (
            <div className="space-y-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Final Verdict</h2>
                <p className="text-slate-400">Підсумкова оцінка та стратегія дій.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center col-span-1 lg:col-span-3">
                  <h3 className="text-2xl font-bold mb-4">FICO: <span className="text-amber-500 uppercase tracking-tighter">High-Quality Execution Bet</span></h3>
                  <p className="text-slate-400 max-w-3xl mx-auto">
                    Це не угода з глибокою недооцінкою (Value). Це ставка на те, що менеджмент зможе тримати темп 18%+ CAGR 
                    протягом наступних 5 років, попри високу базу та макро-виклики.
                  </p>
                </div>
                
                <MetricCard label="Business Quality" value="9/10" sub="Indisputable Moat" color="#22c55e" />
                <MetricCard label="Valuation Score" value="6/10" sub="Trading at Premium" color="#f59e0b" />
                <MetricCard label="Safety Margin" value="5/10" sub="Minimal Buffer" color="#ef4444" />
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mt-8">
                <h4 className="text-indigo-400 font-bold tracking-widest uppercase mb-8">Strategic Accumulation Plan</h4>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { phase: "Initial Entry", size: "40%", price: "$1,300", note: "Build core position now." },
                    { phase: "Buy the Dip", size: "30%", price: "$1,150", note: "Aggressive add on compression." },
                    { phase: "Confirmation", size: "30%", price: "Market", note: "Add after FY25 results check." },
                  ].map((p, i) => (
                    <div key={i} className="space-y-2 border-r border-slate-800 last:border-0 pr-6">
                      <div className="text-xs font-bold text-slate-500 uppercase">{p.phase}</div>
                      <div className="text-3xl font-black text-white">{p.size}</div>
                      <div className="text-indigo-400 font-bold">{p.price}</div>
                      <p className="text-xs text-slate-500">{p.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-950 to-slate-950 p-8 rounded-3xl border border-indigo-500/30">
                <p className="text-slate-200 leading-relaxed text-lg">
                  <span className="text-indigo-400 font-bold italic">Final Word:</span> Очікувана дохідність <span className="text-white font-bold">15-16% річних</span> є привабливою, 
                  але потребує бездоганного виконання плану. Якщо темп росту сповільниться до "ринкового" рівня в 10-12%, акція 
                  може показати стагнацію через нормалізацію P/E. <span className="font-bold border-b border-indigo-500">Рекомендація: BUY (Selective).</span>
                </p>
              </div>
              <AiInsightBox slideTitle="Final Verdict & Strategy" slideData={{ recommendation: "BUY (Selective)", target_return: "15.8%" }} />
            </div>
          )}

        </div>
      </main>

      {/* Footer Navigation Controls */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <button 
          onClick={prevSlide}
          disabled={slideIdx === 0}
          className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-bold text-sm">Previous</span>
        </button>

        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest hidden sm:block">
          Section: <span className="text-slate-300">{currentSlide.label}</span>
        </div>

        <button 
          onClick={nextSlide}
          disabled={slideIdx === SLIDES.length - 1}
          className="group flex items-center gap-2 px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <span className="font-bold text-sm">Next</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </footer>
    </div>
  );
};

export default App;
