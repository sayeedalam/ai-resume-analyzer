// ai-resume-analyzer/services/geminiService.ts (UPDATED TO CALL VERCEL)
import type { AnalysisResult } from '../types';

// TODO: REPLACE THIS PLACEHOLDER with your actual Vercel URL
const VERCEL_API_BASE_URL = 'https://PLACEHOLDER-YOUR-VERCEL-APP.vercel.app/api/analyze';

export const analyzeResume = async (jobDescription: string, resumeText: string): Promise<AnalysisResult> => {
    try {
        const response = await fetch(VERCEL_API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobDescription, resumeText }),
        });

        if (!response.ok) {
            // Handle HTTP errors returned by the Vercel layer (e.g., 400 or 500)
            const errorBody = await response.json();
            throw new Error(`Backend API Error: ${response.status} - ${JSON.stringify(errorBody)}`);
        }

        // Vercel returns the final structured JSON (including the failsafe if there was an AI error)
        const parsedResult: AnalysisResult = await response.json();
        return parsedResult;
    } catch (error) {
        console.error("Error calling Vercel analysis API:", error);
        // Frontend will catch this and display the "Service is unavailable" message
        throw new Error("Failed to get analysis from the secure backend.");
    }
};