import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const PRIMARY_MODEL = "gemini-3.8-flash";
const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash","gemini-3.6-flash"];

const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "";

async function generateWithModel(modelName, prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });
  const generationConfig = {
    temperature: 0.75,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  return response.text();
}

export default async function runChat(prompt) {
  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError;

  for (const modelName of models) {
    try {
      const text = await generateWithModel(modelName, prompt);
      console.log(`Generated response using ${modelName}`);
      return text;
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} returned error:`, err?.message);
      // Wait 1 second before trying next model
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw lastError;
}
