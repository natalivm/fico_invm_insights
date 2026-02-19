import { GoogleGenAI } from "@google/genai";

/**
 * Utility function to handle API calls with exponential backoff for retriable errors (like 429).
 */
async function callWithRetry(apiCall: () => Promise<any>, maxRetries = 3, initialDelay = 2000) {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      
      if (isRateLimit && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i); // Exponential backoff
        console.warn(`Gemini API rate limit hit. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error; // Re-throw if not a rate limit or we've exhausted retries
    }
  }
  throw lastError;
}

export async function getAiAnalystInsight(ticker: string, slideContext: string, data: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Ви — старший інвестиційний аналітик (Senior Associate) у провідному хедж-фонді.
    Ваше завдання: проаналізувати дані компанії ${ticker} для розділу: "${slideContext}".
    
    Дані для аналізу: ${JSON.stringify(data)}
    
    Надайте короткий (до 100 слів), гострий та професійний інвестиційний інсайт українською мовою.
    Зосередьтеся на якості грошових потоків, ризиках виконання та конкурентних перевагах (moat).
    Тон має бути аналітичним, злегка скептичним, але об'єктивним.
    Використовуйте марковані списки для ключових тез.
  `;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.6,
        topP: 0.9,
      }
    }));

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Insight Error:", error);
    if (error?.message?.includes('429')) {
      return "Система зараз перевантажена (перевищено квоту запитів). Будь ласка, зачекайте хвилину та оновіть сторінку.";
    }
    return "Аналітика тимчасово недоступна. Спробуйте пізніше.";
  }
}

export async function getLatestStockData(tickers: string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Використовуючи Google Search, знайди ПОТОЧНУ ринкову ціну, зміну за 24 години та RS Rating (Relative Strength за шкалою 1-99 відносно S&P 500, орієнтуйся на дані Investing.com або IBD) для наступних тікерів: ${tickers.join(", ")}.
    
    Відповідь надай ВИКЛЮЧНО у форматі JSON об'єкта, де ключами є тікери, а значеннями — об'єкти з полями "price", "change" та "rs" (число 1-99).
    Приклад: {"AAPL": {"price": "$150.25", "change": "+1.2%", "rs": 85}}.
    Не додавай жодних пояснень, лише чистий JSON.
  `;

  try {
    const response = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    }));
    
    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("Error fetching stock data via Gemini Search:", error);
    return null;
  }
}
