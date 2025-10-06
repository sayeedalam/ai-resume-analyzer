// ai-resume-analyzer/services/geminiService.ts (FINAL UPDATE)
import type { AnalysisResult } from '../types';

// *** THIS IS THE FINAL, WORKING API ENDPOINT ***
const VERCEL_API_BASE_URL = 'https://ai-resume-analyzer-one-mu.vercel.app/api/analyze'; 

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
            const errorBody = await response.json();
            throw new Error(`Backend API Error: ${response.status} - ${JSON.stringify(errorBody)}`);
        }

        const parsedResult: AnalysisResult = await response.json();
        return parsedResult;
    } catch (error) {
        console.error("Error calling Vercel analysis API:", error);
        throw new Error("Failed to get analysis from the secure backend.");
    }
};