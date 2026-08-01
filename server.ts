import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini AI Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ScreenCraft AI Backend" });
});

// 1. AI Screenshot Vision Analysis Endpoint
app.post("/api/ai/analyze-screen", async (req, res) => {
  try {
    const { imageBase64, appName, appCategory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const ai = getGenAI();

    let contents: any;
    if (imageBase64 && imageBase64.includes("base64,")) {
      const mimeType = imageBase64.split(";")[0].replace("data:", "");
      const base64Data = imageBase64.split("base64,")[1];

      contents = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: base64Data,
            },
          },
          {
            text: `Analyze this mobile app screenshot for the app "${appName || "Mobile App"}" in the category "${appCategory || "General"}".
Identify what screen this is, write a concise compelling title, a 1-2 sentence developer description, and extract 3 key UI features shown.`,
          },
        ],
      };
    } else {
      contents = `Analyze a generic mobile screenshot for an app named "${appName || "Mobile App"}" (${appCategory || "General"}). Generate a realistic screen title, description, and 3 key features.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            screenTitle: { type: Type.STRING, description: "Action-oriented screen title (e.g., Live Workout Tracker)" },
            category: { type: Type.STRING, description: "Screen category (e.g. Dashboard, Analytics, Onboarding, Checkout)" },
            description: { type: Type.STRING, description: "1-2 sentence description explaining what the user can do here" },
            keyFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 key UI/UX features identified",
            },
            suggestedCaption: { type: Type.STRING, description: "Short 4-6 word badge text" },
          },
          required: ["screenTitle", "description", "keyFeatures"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini AI");
    }

    const resultData = JSON.parse(response.text.trim());
    return res.json({ success: true, analysis: resultData });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-screen:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze screenshot with Gemini AI",
    });
  }
});

// 2. AI Showcase Copywriting & Feature Extraction Endpoint
app.post("/api/ai/generate-copy", async (req, res) => {
  try {
    const { name, tagline, description, category, techStack, screens } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const ai = getGenAI();

    const promptText = `You are a world-class Product Marketing Lead and Technical Writer for mobile apps.
Create high-converting landing page showcase copy for the following app:

App Name: ${name || "ScreenCraft Showcase"}
Category: ${category || "Productivity"}
Current Tagline: ${tagline || "Modern Mobile Application"}
Description: ${description || "A feature-rich mobile app."}
Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack || "Flutter, Material 3"}
Screen Count: ${Array.isArray(screens) ? screens.length : 0}
Screen Names: ${Array.isArray(screens) ? screens.map((s: any) => s.title || "Screen").join(", ") : "Main Screen"}

Generate:
1. Hero Title: High-impact 4-8 word headline that commands attention.
2. Hero Tagline: Punchy 1-sentence value proposition.
3. Overview Summary: 2-3 paragraph compelling app narrative for developers and potential users.
4. Features: Exactly 4 distinct feature cards with title, description, and an icon name (choose from: "Zap", "Shield", "BarChart3", "Sparkles", "Cpu", "Smartphone", "Activity", "Globe", "CheckCircle", "TrendingUp").
5. User Flow: Exactly 3 step-by-step user journey milestones (Step 1, Step 2, Step 3).
6. Architecture Notes: 1 paragraph explaining technical highlights (Clean Architecture, reactive state, fast storage).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            heroTitle: { type: Type.STRING },
            heroTagline: { type: Type.STRING },
            overviewSummary: { type: Type.STRING },
            features: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  iconName: { type: Type.STRING },
                },
                required: ["title", "description", "iconName"],
              },
            },
            userFlow: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["stepNumber", "title", "description"],
              },
            },
            architectureNotes: { type: Type.STRING },
          },
          required: ["heroTitle", "heroTagline", "overviewSummary", "features", "userFlow"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini AI");
    }

    const showcaseData = JSON.parse(response.text.trim());
    return res.json({ success: true, showcase: showcaseData });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-copy:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI showcase copy",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ScreenCraft AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
