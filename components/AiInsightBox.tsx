
import React, { useState, useEffect } from 'react';
import { getAiAnalystInsight } from '../services/geminiService';

interface AiInsightBoxProps {
  slideTitle: string;
  slideData: any;
  stockId: string;
}

// Module-level cache to persist insights across component re-mounts
const insightCache: Record<string, string> = {};

export const AiInsightBox: React.FC<AiInsightBoxProps> = ({ slideTitle, slideData, stockId }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cacheKey = `${stockId}-${slideTitle}`;
    
    const fetchInsight = async () => {
      // If we already have a cached insight for this stock and slide, use it
      if (insightCache[cacheKey]) {
        setInsight(insightCache[cacheKey]);
        return;
      }

      setLoading(true);
      setInsight('');
      
      const result = await getAiAnalystInsight(slideTitle, slideData);
      const formattedResult = result || '';
      
      // Store in cache
      insightCache[cacheKey] = formattedResult;
      
      setInsight(formattedResult);
      setLoading(false);
    };

    fetchInsight();
  }, [slideTitle, stockId]); // Only re-run if the stock or the slide changes, ignore data updates to keep the insight stable

  return (
    <div className="mt-6 bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`}></div>
          <h3 className="text-indigo-300 font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            ШІ Аналітик (Senior Associate)
          </h3>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm italic">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          Аналізуємо ринкові дані та стратегічні сценарії...
        </div>
      ) : insight ? (
        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-top-1 duration-500">
          {insight}
        </div>
      ) : (
        <div className="text-slate-500 text-xs italic">
          Очікування вхідних даних...
        </div>
      )}
    </div>
  );
};
