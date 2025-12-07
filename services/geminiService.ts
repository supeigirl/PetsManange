import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PetType, SafetyLevel, FoodSafetyResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for Food Safety Check
const foodSafetySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    safetyLevel: {
      type: Type.STRING,
      enum: [SafetyLevel.SAFE, SafetyLevel.CAUTION, SafetyLevel.DANGEROUS, SafetyLevel.UNKNOWN],
      description: "The safety level of the food for the specified pet.",
    },
    explanation: {
      type: Type.STRING,
      description: "A concise explanation of why the food is safe, dangerous, or requires caution.",
    },
    nutritionalValue: {
      type: Type.STRING,
      description: "Brief note on nutritional benefits or lack thereof (optional).",
    },
  },
  required: ["safetyLevel", "explanation"],
};

export const checkFoodSafety = async (foodName: string, petType: PetType): Promise<FoodSafetyResult> => {
  if (!apiKey) {
    return {
      foodName,
      petType,
      safetyLevel: SafetyLevel.UNKNOWN,
      explanation: "API Key not configured. Unable to verify.",
    };
  }

  try {
    const prompt = `Can a ${petType} eat ${foodName}? Assess the safety. Provide a concise explanation. Language: Chinese (Simplified).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: foodSafetySchema,
        systemInstruction: "You are an expert veterinarian. Be strict about toxicity (e.g., chocolate for dogs, onions for cats). Return JSON.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response text");

    const data = JSON.parse(jsonText);

    return {
      foodName,
      petType,
      safetyLevel: data.safetyLevel as SafetyLevel,
      explanation: data.explanation,
      nutritionalValue: data.nutritionalValue,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      foodName,
      petType,
      safetyLevel: SafetyLevel.UNKNOWN,
      explanation: "Failed to connect to the AI service. Please try again later.",
    };
  }
};