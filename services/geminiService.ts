
import { GoogleGenAI } from "@google/genai";

export async function getAiAnalystInsight(slideContext: string, data: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    You are a world-class senior equity research analyst specializing in the technology and credit scoring sectors.
    Analyze the following investment data for FICO (Fair Isaac Corporation) related to the section: "${slideContext}".
    
    Data: ${JSON.stringify(data)}
    
    Provide a concise (max 120 words), sharp, and professional investment insight in Ukrainian. 
    Focus on risks, execution challenges, or hidden opportunities. 
    Maintain a sophisticated, slightly skeptical tone typical of top-tier hedge fund analysts.
    Ensure formatting is clear and use bullet points where necessary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Не вдалося отримати аналітику від ШІ. Перевірте підключення.";
  }
}
