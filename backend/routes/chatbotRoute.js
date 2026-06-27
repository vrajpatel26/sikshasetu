import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    const ai = new GoogleGenAI({});

  const prompt = `
You are an AI assistant for the SikshaSetu LMS platform helping students.

Response guidelines:

1. For general questions:
   - Keep answers around 50–60 words.

2. For concept explanations or when the student asks to explain something:
   - You may expand to 70–80 words.

3. Use simple language suitable for students.

4. Avoid long paragraphs.

5. Use bullet points or numbering ONLY if it improves clarity. 
   Do NOT force bullet points for every answer.

6. Keep answers concise, clear, and engaging.

Student question:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const reply = response.text;

    res.json({ reply });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Chatbot error" });
  }
});

export default router;