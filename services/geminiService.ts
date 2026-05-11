
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PetType, SafetyLevel, FoodSafetyResult } from "../types";

// 从环境变量获取 API Key
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * 定义 Gemini 响应的 JSON Schema
 * 确保 AI 返回的数据格式符合前端定义的接口
 */
const foodSafetySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    safetyLevel: {
      type: Type.STRING,
      enum: [SafetyLevel.SAFE, SafetyLevel.CAUTION, SafetyLevel.DANGEROUS, SafetyLevel.UNKNOWN],
      description: "宠物食用该食物的安全等级",
    },
    explanation: {
      type: Type.STRING,
      description: "简洁的理由解释（中文）",
    },
    nutritionalValue: {
      type: Type.STRING,
      description: "补充的营养价值提示",
    },
  },
  required: ["safetyLevel", "explanation"],
};

/**
 * 调用 Gemini AI 检查食物安全性
 * @param foodName 食物名称
 * @param petType 宠物种类
 */
export const checkFoodSafety = async (foodName: string, petType: PetType): Promise<FoodSafetyResult> => {
  if (!apiKey) {
    return {
      foodName,
      petType,
      safetyLevel: SafetyLevel.UNKNOWN,
      explanation: "API Key 未配置，无法进行实时验证。",
    };
  }

  try {
    const prompt = `评估 ${petType} 是否可以吃 ${foodName}。请给出简洁的解释。语言要求：简体中文。`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: foodSafetySchema,
        systemInstruction: "你是一位资深的宠物兽医。在评估食物安全性时非常严谨。必须以 JSON 格式回复。",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("AI 响应内容为空");

    const data = JSON.parse(jsonText);

    return {
      foodName,
      petType,
      safetyLevel: data.safetyLevel as SafetyLevel,
      explanation: data.explanation,
      nutritionalValue: data.nutritionalValue,
    };
  } catch (error) {
    console.error("Gemini API 调用失败:", error);
    return {
      foodName,
      petType,
      safetyLevel: SafetyLevel.UNKNOWN,
      explanation: "连接 AI 服务失败，请稍后重试。",
    };
  }
};
