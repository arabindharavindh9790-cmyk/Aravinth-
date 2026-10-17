import { QuizAttempt } from '../types';

export interface PerformanceSummary {
  totalTestsTaken: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  averageScorePercentage: number;
  bestScorePercentage: number;
  averageTimePerQuestionSeconds: number;
  strongSubjects: string[];
  weakSubjects: string[];
  subjectStats: Record<string, { total: number; correct: number; accuracy: number }>;
}

export function computePerformanceAnalytics(attempts: QuizAttempt[]): PerformanceSummary {
  if (!attempts || attempts.length === 0) {
    return {
      totalTestsTaken: 0,
      totalQuestionsAnswered: 0,
      overallAccuracy: 0,
      averageScorePercentage: 0,
      bestScorePercentage: 0,
      averageTimePerQuestionSeconds: 0,
      strongSubjects: [],
      weakSubjects: [],
      subjectStats: {},
    };
  }

  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalTime = 0;
  let maxPct = 0;
  let sumPct = 0;

  const subjectAgg: Record<string, { total: number; correct: number }> = {};

  attempts.forEach((attempt) => {
    const answered = attempt.correctCount + attempt.incorrectCount;
    totalQuestions += answered;
    totalCorrect += attempt.correctCount;
    totalTime += attempt.timeSpentSeconds;

    const pct = attempt.maxScore > 0 ? (attempt.score / attempt.maxScore) * 100 : 0;
    sumPct += pct;
    if (pct > maxPct) maxPct = pct;

    if (attempt.subjectAnalytics) {
      Object.entries(attempt.subjectAnalytics).forEach(([subject, data]) => {
        if (!subjectAgg[subject]) {
          subjectAgg[subject] = { total: 0, correct: 0 };
        }
        subjectAgg[subject].total += data.total;
        subjectAgg[subject].correct += data.correct;
      });
    }
  });

  const subjectStats: Record<string, { total: number; correct: number; accuracy: number }> = {};
  const strong: string[] = [];
  const weak: string[] = [];

  Object.entries(subjectAgg).forEach(([subj, data]) => {
    const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    subjectStats[subj] = {
      total: data.total,
      correct: data.correct,
      accuracy: acc,
    };
    if (acc >= 75) {
      strong.push(subj);
    } else if (acc < 60 && data.total >= 3) {
      weak.push(subj);
    }
  });

  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const avgPct = Math.round(sumPct / attempts.length);
  const avgTimePerQ = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;

  return {
    totalTestsTaken: attempts.length,
    totalQuestionsAnswered: totalQuestions,
    overallAccuracy,
    averageScorePercentage: avgPct,
    bestScorePercentage: Math.round(maxPct),
    averageTimePerQuestionSeconds: avgTimePerQ,
    strongSubjects: strong,
    weakSubjects: weak,
    subjectStats,
  };
}
