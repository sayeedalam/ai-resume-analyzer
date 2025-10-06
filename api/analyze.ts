// ai-resume-analyzer/api/analyze.ts (FINAL WORKING CODE FOR VERCEL)

import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node'; // Retain type imports for local development, Vercel handles the runtime import

// --- 1. CONFIGURATION ---
// The Gemini API key will be read securely from process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({}); 

const fullFailsafe = {
    overall_score: 0, component_scores: { skills: 0, experience: 0, achievements: 0, seniority: 0, ats_format: 0, soft_fit: 0, location_salary_visa: 0 },
    verdict: 'Error', confidence: 0, top_reasons: ['Service temporarily unavailable.'],
    strengths: ['ERROR: Service failed to respond.'], weaknesses: ['Please check Vercel logs or try again later.'],
    missing_must_have_skills: [], suggested_resume_bullets: [], suggested_cover_letter_opening: 'Error: Failed to generate cover letter opening.',
    apply_if_changes: [], raw_matches: { jd_must_have_skills: [], jd_nice_to_have: [], resume_skills_found: [] },
    notes: 'Analysis failed due to a server error or AI issue.'
};

// --- 2. PROMPT & SCHEMA ---
const systemPrompt = "You are an expert resume analyzer and career coach. Your task is to evaluate a candidate's resume against a specific job description. Your evaluation must be based strictly on the content provided in the resume and the job description. Do not make assumptions or use external knowledge.";

const responseSchema = {
    type: "object",
    properties: { 
        overall_score: { type: "integer" }, confidence: { type: "number" }, verdict: { type: "string" }, notes: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        top_reasons: { type: "array", items: { type: "string" } },
        missing_must_have_skills: { type: "array", items: { type: "string" } },
        apply_if_changes: { type: "array", items: { type: "string" } },
        component_scores: { type: "object", properties: { skills: { type: "number" }, experience: { type: "number" }, achievements: { type: "number" }, seniority: { type: "number" }, ats_format: { type: "number" }, soft_fit: { type: "number" }, location_salary_visa: { type: "number" } } },
        suggested_resume_bullets: { type: "array", items: { type: "object", properties: { old: { type: "string" }, new: { type: "string" } } } },
        suggested_cover_letter_opening: { type: "string" },
        raw_matches: { type: "object", properties: { jd_must_have_skills: { type: "array", items: { type: "string" } }, jd_nice_to_have: { type: "array", items: { type: "string" } }, resume_skills_found: { type: "array", items: { type: "string" } } } }
    },
    required: ['overall_score', 'strengths', 'weaknesses', 'component_scores'] 
};

// --- 3. VERCEL HANDLER ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
    
    // 🚨 CORS FIX: Allow access from your Hostinger domain
    res.setHeader('Access-Control-Allow-Origin', 'https://letsapplai.com');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { jobDescription, resumeText } = req.body;

        if (!jobDescription || !resumeText) {
            return res.status(400).json({ message: 'Missing data.' });
        }
        
        const userPromptData = `
Job Description: ${jobDescription}
Resume text: ${resumeText}
Instructions: 1. Provide a detailed, structured JSON response based on the attached schema. 2. Ensure the analysis is based only on the provided texts.`;
        
        const fullPrompt = systemPrompt + "\n\n" + userPromptData;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            // 🚨 FIX: Pass configuration options directly under 'config' using the SDK's structure
            config: { 
                temperature: 0.0,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                systemInstruction: systemPrompt // Use the correct field name here
            }
        });

        const finalJsonText = response.text;
        const cleanResponse = finalJsonText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        let finalResult = JSON.parse(cleanResponse);

        finalResult = { ...fullFailsafe, ...finalResult };
        finalResult.component_scores = { ...fullFailsafe.component_scores, ...finalResult.component_scores };
        finalResult.raw_matches = { ...fullFailsafe.raw_matches, ...finalResult.raw_matches };

        res.status(200).json(finalResult);

    } catch (error) {
        console.error("Vercel API Error:", error);
        res.status(200).json(fullFailsafe);
    }
}