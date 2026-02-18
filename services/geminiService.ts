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