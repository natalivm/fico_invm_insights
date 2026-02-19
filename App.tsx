
import React, { useState, useCallback, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { SLIDES } from './constants';
import { AiInsightBox } from './components/AiInsightBox';
import { Stock, InvestmentRating } from './types';
import { INITIAL_STOCKS, GLOSSARY } from './stocksData';

// --- Components ---

const STORAGE_KEY = 'insight_portfolio_v10';

const TooltipStyle = { 
  contentStyle: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" },
  itemStyle: { color: "#e2e8f0" }
};

const Chip: React.FC<{ label: string; val: string; color: string }> = ({ label, val, color }) => (
  <div className="bg-slate-900 border-t-2 rounded-xl p-4 transition-all hover:bg-slate-800 shadow-lg" style={{ borderColor: color }}>
    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black" style={{ color }}>{val}</div>
  </div>
);

const Tag: React.FC<{ label: string }> = ({ label }) => {
  const isAlert = label.includes('🔴') || label.includes('Risk') || label.includes('Lagging');
  const isPositive = label.includes('🟢') || label.includes('Moat') || label.includes('Power') || label.includes('Leader');
  
  const term = Object.keys(GLOSSARY).find(k => label.includes(k));
  const description = term ? GLOSSARY[term] : "";

  return (
    <span 
      title={description}
      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-help transition-all hover:scale-105 active:scale-95 ${
      isAlert ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_15px_-5px_rgba(244,63,94,0.3)]' : 
      isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' : 
      'bg-slate-800 text-slate-400 border border-slate-700'
    }`}>
      {label}
    </span>
  );
};

export default function App() {
  const [view, setView] = useState<'HOME' | 'ANALYSIS'>('HOME');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stocks] = useState<Stock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }, [stocks]);

  const go = useCallback((d: number) => setSlide(s => Math.max(0, Math.min(SLIDES.length - 1, s + d))), []);
  const backToHome = useCallback(() => { setView('HOME'); setSelectedStock(null); setSlide(0); }, []);

  const getRatingColor = (rating: InvestmentRating) => {
    switch (rating) {
      case 'Strong Buy': return 'text-emerald-400';
      case 'Buy': return 'text-blue-400';
      case 'Hold': return 'text-amber-400';
      case 'Sell': return 'text-rose-500';
      default: return 'text-white';
    }
  };

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto px-6 py-12 md:px-10 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Investment Insights</h2>
            <p className="text-slate-500 text-lg">Growth quality and high-beta momentum portfolio.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stocks.map(stock => (
            <div key={stock.id} onClick={() => { setSelectedStock(stock); setView('ANALYSIS'); setSlide(0); }} className="bg-[#0e1829] border border-[#1e3251] rounded-3xl p-8 cursor-pointer hover:border-blue-500 transition-all hover:-translate-y-1 group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white text-3xl font-black tracking-tighter leading-none mb-1">{stock.ticker}</div>
                  <div className="text-slate-500 text-[11px] font-medium truncate max-w-[140px]">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm">{stock.price}</div>
                  <div className={`text-[11px] font-bold ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>{stock.change}</div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-1">
                {stock.dnaTags?.slice(0, 2).map((t, i) => <span key={i} className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-bold uppercase">{t}</span>)}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className={`text-[10px] font-black uppercase tracking-widest ${getRatingColor(stock.rating)}`}>{stock.rating}</div>
                <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${stock.rs >= 80 ? 'bg-emerald-400/10 text-emerald-400' : stock.rs < 40 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'}`}>RS {stock.rs}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!selectedStock) return null;
    const histData = selectedStock.hist || [];
    const scenariosData = selectedStock.scenarios || [];
    const rsRating = selectedStock.rs || 0;
    const rsColor = rsRating >= 80 ? '#10b981' : rsRating < 40 ? '#f43f5e' : '#94a3b8';
    const rsStatus = rsRating >= 80 ? 'Leader' : rsRating < 40 ? 'Lagging' : 'Consolidating';
    
    const alertTags = selectedStock.dnaTags?.filter(t => t.includes('🔴') || t.includes('GM') || t.includes('Risk') || t.includes('Conc.'));

    return (
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
        {slide === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{selectedStock.ticker} Snapshot</span>
              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2 leading-tight">{selectedStock.name}</h2>
              <p className="text-slate-500 text-lg mt-2">{selectedStock.typeLabel}</p>
              {selectedStock.dnaTags && (
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {selectedStock.dnaTags.map((t, i) => <Tag key={i} label={t} />)}
                </div>
              )}
            </div>

            {alertTags && alertTags.length > 0 && (
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center">
                     <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <h3 className="text-rose-500 font-black uppercase tracking-widest text-sm">Критичні індикатори ризику</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {alertTags.map((tag, idx) => {
                     const term = Object.keys(GLOSSARY).find(k => tag.includes(k));
                     return (
                       <div key={idx} className="bg-slate-900/40 p-4 rounded-xl border border-rose-500/10">
                         <div className="text-rose-400 font-bold mb-1">{tag}</div>
                         <div className="text-xs text-slate-400 leading-relaxed">
                           {term ? GLOSSARY[term] : "Потребує детального моніторингу через потенційний вплив на оцінку."}
                         </div>
                       </div>
                     );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {selectedStock.stats.map((st, idx) => (
                <Chip key={idx} label={st.label} val={st.value} color={st.label.includes('TARGET') ? '#10b981' : '#3b82f6'} />
              ))}
              <Chip label="BETA" val={selectedStock.beta.toString()} color="#a855f7" />
              <div className="bg-slate-900 border-t-2 rounded-xl p-4 shadow-lg" style={{ borderColor: rsColor }}>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">RS RATING</div>
                <div className="text-2xl font-black" style={{ color: rsColor }}>{rsRating}</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full transition-all duration-1000" style={{ width: `${rsRating}%`, backgroundColor: rsColor }}></div>
                </div>
                <div className="text-slate-600 text-[9px] mt-1 font-bold uppercase">{rsStatus}</div>
              </div>
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
                {selectedStock.risks.map((risk: any, i: number) => (
                  <div key={i} className="p-6 rounded-2xl border bg-slate-900 border-slate-800 transition-all hover:bg-slate-800/50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-100">{risk.r}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${risk.impact === 'Extreme' || risk.impact.includes('Високий') ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>{risk.impact}</span>
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
            <button onClick={backToHome} className="bg-slate-800 px-10 py-4 rounded-2xl font-black text-slate-300 uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors">Back to Portfolio</button>
          </div>
        )}
        
        <div className="bg-slate-900/30 border-t border-slate-800 p-8 mt-12 rounded-3xl">
           <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Metric Glossary</h4>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(GLOSSARY).map(([term, desc]) => (
                <div key={term}>
                  <div className="text-blue-400 font-bold text-xs mb-1">{term}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{desc}</div>
                </div>
              ))}
           </div>
        </div>
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
            <button key={i} onClick={() => setSlide(i)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all whitespace-nowrap ${slide === i ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>{s}</button>
          ))}
        </nav>
      )}
      <main className="flex-1 overflow-y-auto">
        {view === 'HOME' && renderHome()}
        {view === 'ANALYSIS' && <div className="px-6 py-8 md:px-10">{renderAnalysis()}</div>}
      </main>
      {view === 'ANALYSIS' && (
        <footer className="bg-[#0e1829] border-t border-[#1e3251] px-6 py-4 flex items-center justify-between shrink-0">
          <button onClick={() => go(-1)} disabled={slide === 0} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-400 font-black text-xs uppercase disabled:opacity-20 hover:bg-slate-700 transition-colors">Назад</button>
          <button onClick={() => go(1)} disabled={slide === SLIDES.length - 1} className="px-10 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase hover:bg-blue-500 transition-colors">Далі</button>
        </footer>
      )}
    </div>
  );
}
