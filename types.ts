
export interface ComponentScores {
  skills: number;
  experience: number;
  achievements: number;
  seniority: number;
  ats_format: number;
  soft_fit: number;
  location_salary_visa: number;
}

export interface SuggestedBullet {
  old: string;
  new: string;
}

export interface RawMatches {
  jd_must_have_skills: string[];
  jd_nice_to_have: string[];
  resume_skills_found: string[];
}

export interface AnalysisResult {
  overall_score: number;
  component_scores: ComponentScores;
  verdict: 'Strong Apply' | 'Apply after tailoring' | 'Consider' | 'Don\'t Apply';
  confidence: number;
  top_reasons: string[];
  strengths: string[];
  weaknesses: string[];
  missing_must_have_skills: string[];
  suggested_resume_bullets: SuggestedBullet[];
  suggested_cover_letter_opening: string;
  apply_if_changes: string[];
  raw_matches: RawMatches;
  notes: string;
}
