// ai-resume-analyzer/server.js
// This will serve as your secure backend API on Hostinger.

const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenAI } = require("@google/genai");

// IMPORTANT: Path to your VITE build output
const FRONTEND_BUILD_PATH = './dist'; 

// --- Configuration ---
// The API key is read securely from the Hostinger environment variables.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const app = express();
const port = process.env.PORT || 3001; // Hostinger provides the port

// System Prompt and Schema (Moved from your original geminiService.ts)
const systemPrompt = `
You are an expert resume analyzer and career coach. Your task is to evaluate a candidate's resume against a specific job description.

Your evaluation must be based strictly on the content provided in the resume and the job description. Do not make assumptions or use external knowledge.

Provide a detailed, structured JSON response with the following fields:

1.  **match_score**: A single integer from 0 to 100 representing the overall fit.
2.  **strengths**: An array of 3-5 bullet points summarizing why the candidate is a strong fit. Focus on keywords, relevant experience, and measurable achievements that align with the job description.
3.  **areas_for_improvement**: An array of 3-5 bullet points outlining specific, actionable suggestions for improving the resume's alignment with the job description. This should include missing keywords, ambiguous skills, or experience gaps relative to the job requirements.
4.  **suggested_keywords**: An array of 5-8 specific, high-value keywords (e.g., "React Hooks", "CI/CD Pipeline", "Agile Methodology") found in the job description that the resume should emphasize or include.
`;

const responseSchema = {
    type: "object",
    properties: {
        match_score: {
            type: "integer",
            description: "The overall fit score (0-100)."
        },
        strengths: {
            type: "array",
            items: { type: "string" },
            description: "3-5 key reasons why the candidate is a strong fit."
        },
        areas_for_improvement: {
            type: "array",
            items: { type: "string" },
            description: "3-5 actionable suggestions for improving the resume."
        },
        suggested_keywords: {
            type: "array",
            items: { type: "string" },
            description: "5-8 specific keywords from the job description the resume should feature."
        }
    },
    required: ["match_score", "strengths", "areas_for_improvement", "suggested_keywords"]
};

// Middleware
app.use(bodyParser.json());

// 1. Secure API Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { jobDescription, resumeText } = req.body;

        if (!jobDescription || !resumeText) {
            return res.status(400).json({ message: 'Missing jobDescription or resumeText.' });
        }

        const userPrompt = `
Resume text:
${resumeText}

Job Description:
${jobDescription}

Instructions:
Produce the JSON output.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.0,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        // Clean up the JSON output returned by Gemini
        const jsonText = response.text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsedResult = JSON.parse(jsonText);
        
        res.status(200).json(parsedResult);

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: "Failed to process analysis request due to a server error." });
    }
});

// 2. Serve the Static Frontend Build
app.use(express.static(FRONTEND_BUILD_PATH));

// 3. Handle SPA routing (for direct URL access or refresh)
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: FRONTEND_BUILD_PATH });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});