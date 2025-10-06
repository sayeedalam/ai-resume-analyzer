
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TextAreaInput } from './components/TextAreaInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeResume } from './services/geminiService';
import type { AnalysisResult } from './types';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!jobDescription || !resumeText) {
      setError('Please provide both a job description and a resume.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(jobDescription, resumeText);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the documents. The AI model may be overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [jobDescription, resumeText]);
  
  const handlePasteExample = () => {
    setJobDescription(
`Job Title: Senior Frontend Engineer (React)
Location: San Francisco, CA (Remote Friendly)
Salary: $150,000 - $190,000

Company: InnovateTech

We are seeking a seasoned Senior Frontend Engineer with deep expertise in React and the modern JavaScript ecosystem to build beautiful, high-performance user interfaces.

Responsibilities:
- Develop and maintain web applications using React.js and TypeScript.
- Collaborate with product managers and designers to translate wireframes into high-quality code.
- Optimize components for maximum performance across a vast array of web-capable devices and browsers.
- Build reusable components and front-end libraries for future use (Storybook experience is a plus).
- Work with backend developers to integrate RESTful APIs.
- Write clean, maintainable, and well-tested code using Jest and React Testing Library.

Must-Have Skills:
- 5+ years of professional software development experience.
- Expert in React, Redux, and modern JavaScript (ES6+).
- Strong proficiency in TypeScript.
- Experience with CSS-in-JS or utility-first CSS frameworks like Tailwind CSS.
- Proficient with version control (Git).

Nice-to-Have:
- Experience with Next.js or other SSR frameworks.
- Knowledge of GraphQL.
- CI/CD pipeline experience (e.g., Jenkins, GitHub Actions).
- Contributions to open-source projects.`
    );
    setResumeText(
`John Doe
Senior Frontend Developer

Summary:
A results-oriented Senior Frontend Developer with 7 years of experience specializing in creating dynamic and responsive user interfaces with React. Passionate about clean code and performance optimization.

Experience:
Lead Frontend Developer | TechSolutions Inc. | 2018-Present
- Led the development of a new customer-facing dashboard using React and TypeScript, resulting in a 20% increase in user engagement.
- Implemented a component library that reduced code duplication by 40%.
- Integrated various REST APIs for real-time data display.
- Mentored junior developers on best practices.

Frontend Developer | WebCrafters | 2016-2018
- Worked on various client websites using React and JavaScript.
- Improved application performance by optimizing component rendering.
- Used Git for version control in a team environment.

Skills:
- Programming Languages: JavaScript, TypeScript, HTML, CSS
- Frameworks/Libraries: React, Redux, Tailwind CSS
- Tools: Git, Webpack, Jest`
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            AI-Powered Resume Analysis
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Instantly compare any resume to a job description. Get an objective fit score, detailed breakdown, and actionable feedback to land the interview.
          </p>
           <button
              onClick={handlePasteExample}
              className="mt-4 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Paste Example Data
            </button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TextAreaInput
            id="job-description"
            label="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            icon={<BriefcaseIcon />}
          />
          <TextAreaInput
            id="resume"
            label="Candidate's Resume"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste the candidate's resume text here..."
            icon={<DocumentTextIcon />}
          />
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Fit'}
          </button>
        </div>
        
        {error && <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-md max-w-2xl mx-auto">{error}</div>}
        
        {isLoading && <LoadingSpinner />}
        
        {analysisResult && (
          <div className="mt-12">
            <ResultsDisplay result={analysisResult} />
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default App;
