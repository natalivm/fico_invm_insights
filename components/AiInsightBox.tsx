
import React, { useState, useEffect, useRef } from 'react';
import { getAiAnalystInsight } from '../services/geminiService';

interface AiInsightBoxProps {
  slideTitle: string;
  slideData: any;
  stockId: string;
  ticker: string;
}

// Module-level cache to persist insights across component re-mounts during a session
const insightCache: Record<string, string> = {};

export const AiInsightBox: React.FC<AiInsightBoxProps> = ({ slideTitle, slideData, stockId, ticker }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<'NONE' | 'RATE_LIMIT' | 'GENERAL'>('NONE');
  
  // Ref to track the current request to avoid state updates from stale requests
  const requestCount = useRef(0);
  // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to resolve the "Cannot find namespace 'NodeJS'" error.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cacheKey = `${stockId}-${slideTitle}`;
    
    // Clear any pending requests
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (insightCache[cacheKey]) {
      setInsight(insightCache[cacheKey]);
      setLoading(false);
      setErrorType('NONE');
      return;
    }

    setLoading(true);
    setInsight('');
    setErrorType('NONE');

    // Debounce: Wait 800ms before calling the API to allow user to browse slides
    timeoutRef.current = setTimeout(async () => {
      const currentRequest = ++requestCount.current;
      
      try {
        const result = await getAiAnalystInsight(ticker, slideTitle, slideData);
        
        // Only update if this is still the most recent request
        if (currentRequest === requestCount.current) {
          if (result && result.includes('перевищено квоту')) {
            setErrorType('RATE_LIMIT');
            setInsight(result);
          } else if (!result || result.includes('недоступна')) {
            setErrorType('GENERAL');
            setInsight(result);
          } else {
            insightCache[cacheKey] = result;
            setInsight(result);
            setErrorType('NONE');
          }
          setLoading(false);
        }
      } catch (err) {
        if (currentRequest === requestCount.current) {
          setErrorType('GENERAL');
          setLoading(false);
        }
      }
    }, 800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [slideTitle, stockId, ticker, slideData]);

  return (
    <div className={`mt-6 rounded-xl p-5 border transition-all duration-300 ${
      errorType === 'RATE_LIMIT' 
        ? 'bg-rose-950/20 border-rose-500/30' 
        : 'bg-indigo-950/30 border-indigo-500/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            loading ? 'bg-indigo-400 animate-pulse' : 
            errorType === 'RATE_LIMIT' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 
            'bg-emerald-400'
          }`}></div>
          <h3 className={`font-semibold text-sm flex items-center gap-2 ${
            errorType === 'RATE_LIMIT' ? 'text-rose-400' : 'text-indigo-300'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            ШІ Аналітик (Senior Associate)
          </h3>
        </div>
        {errorType === 'RATE_LIMIT' && (
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            Quota Exceeded
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm italic">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          Синтезуємо висновки на основі фундаментальних показників...
        </div>
      ) : insight ? (
        <div className={`text-sm leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-top-1 duration-500 ${
          errorType === 'RATE_LIMIT' ? 'text-rose-300/80 font-medium' : 'text-slate-300'
        }`}>
          {insight}
        </div>
      ) : (
        <div className="text-slate-500 text-xs italic">
          Очікування вхідних даних для розрахунку...
        </div>
      )}
    </div>
  );
};
