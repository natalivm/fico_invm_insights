import { GoogleGenAI } from "@google/genai";

export async function getAiAnalystInsight(slideContext: string, data: any) {
  // Always use a named parameter for apiKey and obtain exclusively from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Ви — старший інвестиційний аналітик (Senior Associate) у провідному хедж-фонді.
    Ваше завдання: проаналізувати дані компанії FICO для розділу: "${slideContext}".
    
    Дані для аналізу: ${JSON.stringify(data)}
    
    Надайте короткий (до 100 слів), гострий та професійний інвестиційний інсайт українською мовою.
    Зосередьтеся на якості грошових потоків, ризиках виконання та конкурентних перевагах (moat).
    Тон має бути аналітичним, злегка скептичним, але об'єктивним.
    Використовуйте марковані списки для ключових тез.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.6,
        topP: 0.9,
      }
    });

    // Directly access the .text property (not a function)
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Аналітика тимчасово недоступна. Спробуйте пізніше.";
  }
}

export async function getLatestStockData(tickers: string[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Використовуючи дані з Yahoo Finance або Google Finance, надай ПОТОЧНУ ринкову ціну та зміну за 24 години (у відсотках) для наступних тікерів: ${tickers.join(", ")}.
    
    Відповідь надай ВИКЛЮЧНО у форматі JSON об'єкта, де ключами є тікери, а значеннями — об'єкти з полями "price" та "change".
    Приклад: {"AAPL": {"price": "$150.25", "change": "+1.2%"}}.
    Не додавай жодних пояснень, лише чистий JSON. Переконайся, що ціни актуальні на сьогоднішню секунду.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        // Use Google Search grounding for real-time accuracy as per guidelines
        tools: [{ googleSearch: {} }]
      }
    });
    
    const text = response.text || "";
    // Clean potential markdown blocks
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