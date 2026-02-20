
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { SLIDES } from './constants';
import { AiInsightBox } from './components/AiInsightBox';
import { Stock, InvestmentRating } from './types';
import { INITIAL_STOCKS } from './stocksData';
import { getLatestStockData } from './services/geminiService';

// --- Constants ---
const STORAGE_KEY = 'insight_portfolio_v34'; 

const TooltipStyle = { 
  contentStyle: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
  itemStyle: { color: "#e2e8f0" }
};

// --- Helpers ---

/**
 * Parses a probability string like "40%" or "45-55%" and returns a single average string "50%".
 */
const formatAccelerationScore = (probStr: string): string => {
  if (!probStr) return "N/A";
  // Check for range like 45-55 or 45–55
  const rangeMatch = probStr.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const low = parseInt(rangeMatch[1], 10);
    const high = parseInt(rangeMatch[2], 10);
    return `${Math.round((low + high) / 2)}%`;
  }
  return probStr;
};

// --- Sub-components ---

const Chip: React.FC<{ label: string; val: string; color: string }> = ({ label, val, color }) => (
  <div className="bg-slate-900/80 backdrop-blur-sm border-t-2 rounded-2xl p-4 transition-all hover:bg-slate-800 shadow-xl" style={{ borderColor: color }}>
    <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</div>
    <div className="text-2xl font-black tabular-nums" style={{ color }}>{val}</div>
  </div>
);

const Tag: React.FC<{ label: string }> = ({ label }) => {
  const isAlert = label.includes('🔴') || label.includes('Risk') || label.includes('Lagging');
  const isPositive = label.includes('🟢') || label.includes('Moat') || label.includes('Power') || label.includes('Leader');
  
  return (
    <span 
      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
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
  const [stocks, setStocks] = useState<Stock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });
  const [slide, setSlide] = useState(0);
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }, [stocks]);

  // Initial splash effect - Extended duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsInitialLoading(false), 400); 
    }, 2800); 
    return () => clearTimeout(timer);
  }, []);

  const go = useCallback((d: number) => {
    setSlide(s => Math.max(0, Math.min(SLIDES.length - 1, s + d)));
  }, []);
  
  const backToHome = useCallback(() => { 
    setView('HOME'); 
    setSelectedStock(null); 
    setSlide(0); 
    setShowBuyPopup(false);
  }, []);

  const getRatingColor = (rating: InvestmentRating) => {
    switch (rating) {
      case 'Strong Buy': return 'text-emerald-400';
      case 'Buy': return 'text-blue-500';
      case 'Hold': return 'text-amber-500';
      case 'Sell': return 'text-rose-500';
      default: return 'text-white';
    }
  };

  const alertTags = useMemo(() => 
    selectedStock?.dnaTags?.filter(t => t.includes('🔴') || t.includes('GM') || t.includes('Risk') || t.includes('Conc.')) || []
  , [selectedStock]);

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto px-6 py-10 md:px-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Institutional Portfolio</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
              15 Core Positions • Strategic Focus
              {isSyncing && <span className="ml-2 text-blue-400 animate-pulse">• Updating Prices...</span>}
            </p>
            <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full"></div>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map(stock => (
            <div 
              key={stock.id} 
              onClick={() => { setSelectedStock(stock); setView('ANALYSIS'); setSlide(0); }} 
              className="group bg-[#0e1829] border border-[#1e293b] rounded-[2rem] p-7 cursor-pointer hover:border-blue-500/40 hover:bg-[#111d32] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="min-w-0">
                  <div className="text-white text-5xl font-black tracking-tighter leading-none mb-1">{stock.ticker}</div>
                  <div className="text-slate-500 text-xs font-medium truncate max-w-[180px]">{stock.name}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-bold text-2xl tabular-nums leading-none mb-1.5">{stock.price}</div>
                  <div className={`text-sm font-bold tabular-nums ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {stock.change}
                  </div>
                </div>
              </div>
              
              <div className="h-6"></div>
              
              <div className="flex items-center justify-between">
                <div className={`text-sm font-black uppercase tracking-[0.2em] ${getRatingColor(stock.rating)}`}>
                  {stock.rating}
                </div>
                <div className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg bg-slate-950/40 border border-white/5 ${stock.rs >= 80 ? 'text-emerald-400' : stock.rs < 40 ? 'text-rose-500' : 'text-slate-400'}`}>
                  RS {stock.rs}
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
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
    const is3Y = selectedStock.ticker === 'ANET';

    return (
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24">
        {slide === 0 && (
          <div className="space-y-10">
            <div className="text-center">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">{selectedStock.ticker} Strategic Snapshot</span>
              <h2 className="text-6xl md:text-7xl font-black text-white mt-2 leading-none tracking-tighter">
                {selectedStock.name}
              </h2>
              <p className="text-slate-500 text-xl mt-4 font-medium">{selectedStock.typeLabel}</p>
              {selectedStock.dnaTags && (
                <div className="flex flex-wrap justify-center gap-2 mt-10">
                  {selectedStock.dnaTags.map((t, i) => <Tag key={i} label={t} />)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-5">
              {selectedStock.stats.filter(s => s.label !== "RS RATING").map((st, idx) => (
                <Chip key={idx} label={st.label} val={st.value} color={st.label.includes('TARGET') || st.label.includes('VALUE') ? '#10b981' : '#3b82f6'} />
              ))}
              <Chip label="BETA" val={selectedStock.beta.toString()} color="#a855f7" />
              <Chip label="UPSIDE (1Y)" val={selectedStock.momentumUpside1Y} color="#38bdf8" />
              <Chip label="EST. VELOCITY" val={selectedStock.timeToMilestone} color="#f59e0b" />
              
              <div className="bg-slate-900 border-t-2 rounded-2xl p-4 shadow-xl" style={{ borderColor: rsColor }}>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">RS RATING</div>
                <div className="text-2xl font-black tabular-nums" style={{ color: rsColor }}>{rsRating}</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full transition-all duration-1000" style={{ width: `${rsRating}%`, backgroundColor: rsColor }}></div>
                </div>
                <div className="text-slate-600 text-[9px] mt-2 font-black uppercase tracking-widest">{rsStatus}</div>
              </div>
            </div>
            <AiInsightBox slideTitle="Summary" slideData={histData} stockId={selectedStock.id} ticker={selectedStock.ticker} />
          </div>
        )}

        {slide === 1 && (
           <div className="space-y-10">
             <div className="text-center">
               <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Performance Audit</span>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Financial Performance Trends</h2>
             </div>
             <div className="h-[450px] bg-[#0e1829]/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="y" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                    <Tooltip {...TooltipStyle} cursor={{fill: '#1e293b', opacity: 0.4}} />
                    <Bar name="Revenue ($B)" dataKey="rev" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                    {histData[0]?.eps !== undefined && <Bar name="EPS ($)" dataKey="eps" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />}
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <AiInsightBox slideTitle="Financial Analysis" slideData={histData} stockId={selectedStock.id} ticker={selectedStock.ticker} />
           </div>
        )}

        {slide === 2 && (
          <div className="space-y-10">
            <div className="text-center">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Market Projection</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{is3Y ? '3-Year' : '5-Year'} Valuation Modeling</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {scenariosData.map((s, i) => (
                <div key={i} className="bg-[#0e1829] border-t-4 p-8 rounded-[2rem] shadow-2xl transition-all hover:bg-[#111d32]" style={{borderColor: s.color}}>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-black text-xl uppercase tracking-tighter" style={{color: s.color}}>{s.label} Case</span>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full uppercase tracking-widest">{s.prob}% Prob</span>
                  </div>
                  <div className="text-5xl font-black mb-4 tabular-nums text-white">${s.price5}</div>
                  <div className="h-1 w-12 bg-slate-800 mb-6 rounded-full"></div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium italic">"{s.driver}"</p>
                </div>
              ))}
            </div>
            <AiInsightBox slideTitle="Valuation & Scenarios" slideData={scenariosData} stockId={selectedStock.id} ticker={selectedStock.ticker} />
          </div>
        )}

        {slide === 3 && (
           <div className="space-y-10">
             <div className="text-center">
               <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Risk Assessment</span>
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Risk Map & Vulnerability Profile</h2>
             </div>
             
             {alertTags.length > 0 && (
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-[2rem] p-8 mb-10 shadow-[0_0_50px_-10px_rgba(244,63,94,0.1)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30">
                     <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                     </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="text-rose-500 font-black uppercase tracking-widest text-sm">Critical Risk Indicators</h3>
                    <p className="text-slate-500 text-xs mt-1 font-bold">Identified structural bottlenecks with asymmetric downside potential.</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {alertTags.map((tag, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-6 rounded-2xl border border-rose-500/10 group hover:border-rose-500/40 transition-all duration-300">
                      <div className="text-rose-400 font-black mb-3 text-sm uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        {tag}
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed font-bold">
                        This factor requires aggressive monitoring. Failure to resolve or mitigate this could lead to a significant multiple de-rating or structural margin degradation.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

             <div className="grid md:grid-cols-2 gap-6">
                {selectedStock.risks.map((risk, i) => (
                  <div key={i} className="p-8 rounded-[2rem] border bg-[#0e1829] border-slate-800 transition-all hover:border-slate-700 hover:bg-[#111d32] shadow-xl group">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-black text-white text-lg group-hover:text-blue-400 transition-colors">{risk.r}</h4>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${risk.impact === 'Extreme' || risk.impact.includes('Високий') ? 'bg-rose-500 text-white shadow-[0_0_15px_-3px_rgba(244,63,94,0.5)]' : 'bg-amber-500 text-white shadow-[0_0_15px_-3px_rgba(245,158,11,0.5)]'}`}>
                        {risk.impact}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{risk.detail}</p>
                  </div>
                ))}
             </div>
             <AiInsightBox slideTitle="Risk Profile" slideData={selectedStock.risks} stockId={selectedStock.id} ticker={selectedStock.ticker} />
           </div>
        )}

        {slide === 4 && (
          <div className="space-y-10">
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#080d1a] p-16 md:p-24 rounded-[3rem] text-center border border-blue-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              
              <h3 className="text-5xl md:text-6xl font-black mb-8 text-white uppercase tracking-tighter text-center">Investment Verdict</h3>
              <div className="text-slate-300 max-w-4xl mx-auto mb-16 text-xl md:text-2xl leading-relaxed font-medium italic text-center">"{selectedStock.verdict}"</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="bg-slate-900/60 backdrop-blur-sm p-10 rounded-[2.5rem] border border-slate-800 shadow-xl flex flex-col justify-center">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">{is3Y ? '3Y' : '5Y'} Base Target</div>
                  <div className="text-5xl font-black text-blue-400 tracking-tighter tabular-nums mb-6">${(scenariosData.find(s => s.label === 'Base')?.price5 || "N/A")}</div>
                  <div className="pt-5 border-t border-slate-800/50 flex justify-between items-center">
                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Bull Target</div>
                    <div className="text-xl font-black text-emerald-400 tabular-nums">${(scenariosData.find(s => s.label === 'Bull')?.price5 || "N/A")}</div>
                  </div>
                </div>
                <div className="bg-blue-600/10 backdrop-blur-sm p-10 rounded-[2.5rem] border border-blue-500/30 shadow-xl scale-110 relative z-10 flex flex-col justify-center items-center">
                  <div className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-4">Momentum Upside</div>
                  <div className="text-5xl font-black text-blue-400 tracking-tighter">{selectedStock.momentumUpside1Y}</div>
                  <div className="mt-4 pt-4 border-t border-blue-500/20 w-full text-center">
                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Est. Time to Target</div>
                    <div className="text-sm font-bold text-slate-300">{selectedStock.timeToMilestone}</div>
                  </div>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-sm p-10 rounded-[2.5rem] border border-slate-800 shadow-xl">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">Prob of Acceleration</div>
                  <div className="text-5xl font-black text-emerald-400 tracking-tighter">{formatAccelerationScore(selectedStock.accelerationProb)}</div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => setShowBuyPopup(true)}
                  className="group relative overflow-hidden px-16 py-8 rounded-[2rem] bg-pink-500/10 border-2 border-pink-500/30 transition-all hover:bg-pink-500/20 active:scale-95 shadow-[0_0_50px_-10px_rgba(236,72,153,0.2)]"
                >
                  <span className="relative z-10 text-pink-500 font-black uppercase tracking-[0.35em] text-lg md:text-xl animate-pink-pulse inline-block">
                    Is it a BUY?
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>
            </div>

            <AiInsightBox slideTitle="Verdict Analysis" slideData={{verdict: selectedStock.verdict, scenarios: scenariosData}} stockId={selectedStock.id} ticker={selectedStock.ticker} />
          </div>
        )}

        {showBuyPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
             <div 
               className="bg-[#0e1829] border border-pink-500/30 w-full max-w-2xl rounded-[3rem] p-10 md:p-16 relative shadow-[0_0_100px_-20px_rgba(236,72,153,0.3)] animate-in zoom-in-95 duration-300 overflow-hidden"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -ml-32 -mb-32"></div>

                <div className="flex flex-col items-center mb-8 relative z-10 text-center">
                   <h3 className="text-pink-500 font-black uppercase tracking-[0.2em] text-xs mb-2">Exclusive Institutional Insight</h3>
                   <h2 className="text-white text-4xl md:text-5xl font-black tracking-tighter">{selectedStock.ticker} Thesis</h2>
                   <button 
                     onClick={() => setShowBuyPopup(false)}
                     className="absolute top-0 right-0 text-slate-500 hover:text-white transition-colors p-2 rounded-full bg-slate-900/50"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                   </button>
                </div>

                <div className="relative z-10 text-center">
                   <div className="h-px w-12 bg-pink-500 mb-8 mx-auto"></div>
                   <div className="text-slate-200 text-lg md:text-xl leading-relaxed font-medium space-y-6 text-center">
                      {selectedStock.buyThesis?.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                   </div>
                </div>

                <div className="mt-12 flex justify-center relative z-10">
                  <button 
                    onClick={() => setShowBuyPopup(false)}
                    className="bg-white text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-pink-500 hover:text-white transition-all shadow-xl"
                  >
                    Close Thesis
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isInitialLoading && (
        <div className={`fixed inset-0 z-[200] bg-[#080d1a] flex items-center justify-center transition-opacity duration-400 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-center space-y-2">
            <div 
              className="text-7xl md:text-9xl font-black uppercase tracking-tighter animate-pink-pulse leading-tight"
              style={{
                color: '#ff2d95',
                textShadow: '0 0 20px rgba(255, 45, 149, 0.8), 0 0 40px rgba(255, 45, 149, 0.4), 0 0 60px rgba(255, 45, 149, 0.2)',
                filter: 'drop-shadow(0 0 10px rgba(255, 45, 149, 0.5))'
              }}
            >
              Is it<br/>
              A<br/>
              BUY?
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col h-screen overflow-hidden bg-[#080d1a] text-slate-200 select-none font-inter selection:bg-blue-500 selection:text-white">
        <header className="bg-[#0e1829]/80 backdrop-blur-xl border-b border-[#1e3251] px-10 py-5 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={backToHome}>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-5 py-2 rounded-xl shadow-lg shadow-blue-500/20">
              <span className="font-black text-2xl tracking-tighter text-white">INSIGHTS</span>
            </div>
          </div>
          
          {view === 'ANALYSIS' && selectedStock && (
            <div className="flex items-center gap-6 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-slate-950/50 border border-slate-800 px-6 py-2.5 rounded-2xl flex items-center gap-4">
                <span className="text-2xl font-black text-white tracking-tighter">{selectedStock.ticker}</span>
                <div className="w-px h-6 bg-slate-800"></div>
                <span className="text-xl font-black text-emerald-400 tabular-nums">{selectedStock.price}</span>
              </div>
            </div>
          )}
        </header>

        {view === 'ANALYSIS' && (
          <nav className="flex justify-center gap-2 p-3 bg-[#0e1829]/50 backdrop-blur-md border-b border-[#1e3251] overflow-x-auto no-scrollbar shrink-0 z-10">
            {SLIDES.map((s, i) => (
              <button 
                key={i} 
                onClick={() => { setSlide(i); setShowBuyPopup(false); }} 
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap tracking-widest ${slide === i ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-500/20' : 'bg-slate-900/50 text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
              >
                {s}
              </button>
            ))}
          </nav>
        )}

        <main className="flex-1 overflow-y-auto">
          {view === 'HOME' && renderHome()}
          {view === 'ANALYSIS' && <div className="px-6 py-12 md:px-10">{renderAnalysis()}</div>}
        </main>

        {view === 'ANALYSIS' && (
          <footer className="bg-[#0e1829]/90 backdrop-blur-xl border-t border-[#1e3251] px-10 py-6 flex items-center justify-between shrink-0 z-20">
            <button 
              onClick={() => go(-1)} 
              disabled={slide === 0} 
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest disabled:opacity-10 hover:bg-slate-800 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Назад
            </button>
            
            <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${slide === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800'}`}></div>
              ))}
            </div>

            <button 
              onClick={() => go(1)} 
              disabled={slide === SLIDES.length - 1} 
              className="flex items-center gap-3 px-12 py-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-0"
            >
              Далі
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </footer>
        )}
      </div>
    </>
  );
}
