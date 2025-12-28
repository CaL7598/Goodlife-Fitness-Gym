
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCommunication = async (type: 'welcome' | 'reminder' | 'expiry', memberName: string, planName: string, expiryDate?: string) => {
  const prompt = `Write a professional and friendly ${type} message for a gym member at "Goodlife Fitness". 
  Name: ${memberName}, Plan: ${planName}${expiryDate ? `, Expiry Date: ${expiryDate}` : ''}. 
  Keep it concise and motivating. Use placeholders like [Gym Phone] and [Gym Email].`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating message. Please try again or write manually.";
  }
};

export const generateSummary = async (stats: any) => {
  const prompt = `Based on these gym statistics, provide a brief, professional summary of business health and 3 actionable recommendations for management:
  ${JSON.stringify(stats)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Could not generate summary at this time.";
  }
};
