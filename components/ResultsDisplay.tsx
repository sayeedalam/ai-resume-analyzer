
import React from 'react';
import type { AnalysisResult, ComponentScores, SuggestedBullet } from '../types';
import { ScoreDonut } from './ScoreDonut';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
// FIX: Import missing icon components.
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

const getVerdictColor = (verdict: string) => {
    switch (verdict) {
        case 'Strong Apply': return 'text-green-400';
        case 'Apply after tailoring': return 'text-yellow-400';
        case 'Consider': return 'text-orange-400';
        case 'Don\'t Apply': return 'text-red-400';
        default: return 'text-gray-300';
    }
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-gray-100 flex items-center mb-4">
            <span className="mr-3 text-indigo-400">{icon}</span>
            {title}
        </h3>
        <div className="space-y-3 text-gray-300">{children}</div>
    </div>
);

const BulletList: React.FC<{ items: string[], itemClassName: string, icon: React.ReactNode }> = ({ items, itemClassName, icon }) => (
    <ul className="space-y-2">
        {items.map((item, index) => (
            <li key={index} className="flex items-start">
                <span className={`mr-3 mt-1 flex-shrink-0 ${itemClassName}`}>{icon}</span>
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const width = `${score}%`;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-gray-300">{label}</span>
                <span className="font-bold text-indigo-300">{score.toFixed(0)}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width }}></div>
            </div>
        </div>
    );
};

const RewriteBullet: React.FC<{ bullet: SuggestedBullet }> = ({ bullet }) => (
    <div className="p-4 bg-gray-900/70 rounded-lg border border-gray-600">
        <p className="text-sm text-gray-400 line-through mb-2">{bullet.old}</p>
        <p className="text-sm text-green-300">{bullet.new}</p>
    </div>
);

export const ResultsDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    return (
        <div className="space-y-8">
            {/* Top Section: Score and Verdict */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
                <div className="flex justify-center">
                    <ScoreDonut score={result.overall_score} />
                </div>
                <div className="md:col-span-2 text-center md:text-left">
                    <p className="text-lg text-gray-400">Overall Fit Score</p>
                    <h2 className={`text-4xl font-extrabold ${getVerdictColor(result.verdict)}`}>
                        {result.verdict}
                    </h2>
                    <p className="mt-2 text-gray-300">
                        <span className="font-semibold">Confidence:</span> {(result.confidence * 100).toFixed(0)}%
                    </p>
                     <p className="mt-4 text-gray-400 text-sm max-w-2xl">{result.notes}</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InfoCard title="Strengths" icon={<CheckIcon />}>
                    <BulletList items={result.strengths} itemClassName="text-green-400" icon={<CheckIcon />} />
                </InfoCard>

                <InfoCard title="Weaknesses & Gaps" icon={<XIcon />}>
                     <BulletList items={result.weaknesses} itemClassName="text-red-400" icon={<XIcon />} />
                </InfoCard>
                
                <div className="lg:col-span-2">
                   <InfoCard title="Suggested Resume Rewrites" icon={<LightbulbIcon />}>
                        <div className="space-y-4">
                            {result.suggested_resume_bullets.map((bullet, i) => <RewriteBullet key={i} bullet={bullet} />)}
                        </div>
                    </InfoCard>
                </div>
                
                 <InfoCard title="Cover Letter Opening" icon={<DocumentTextIcon />}>
                    <p className="italic text-gray-400">{result.suggested_cover_letter_opening}</p>
                </InfoCard>

                <InfoCard title="Score Breakdown" icon={<BriefcaseIcon />}>
                    <div className="space-y-4">
                        {Object.entries(result.component_scores).map(([key, value]) => {
                            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return <ScoreBar key={key} label={formattedKey} score={value} />
                        })}
                    </div>
                </InfoCard>
            </div>
        </div>
    );
};
