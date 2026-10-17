import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  Calendar,
  Zap,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { QuizAttempt } from '../types';
import { getAllQuizAttempts, clearAllQuizAttempts } from '../utils/offlineStorage';
import { computePerformanceAnalytics, PerformanceSummary } from '../utils/analyticsHelper';

interface AnalyticsDashboardProps {
  onTakeTest: () => void;
  onExploreStudyMaterial: (subject?: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  onTakeTest,
  onExploreStudyMaterial,
}) => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [analytics, setAnalytics] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllQuizAttempts();
      // Sort newest first
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAttempts(data);
      const summary = computePerformanceAnalytics(data);
      setAnalytics(summary);
    } catch (err) {
      console.error('Failed to load quiz attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearHistory = async () => {
    await clearAllQuizAttempts();
    setAttempts([]);
    setAnalytics(computePerformanceAnalytics([]));
    setConfirmClear(false);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Computing detailed analytics...</p>
      </div>
    );
  }

  const hasData = attempts.length > 0 && analytics && analytics.totalTestsTaken > 0;

  return (
    <div id="analytics-dashboard-container" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Personalized Progress Intelligence</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Performance & Detailed Analytics Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Track your exam readiness, subject-wise accuracy metrics, weak area diagnosis, speed efficiency, and percentile projections across all mock attempts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTakeTest}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Take New Practice Mock</span>
            </button>

            {hasData && (
              <button
                onClick={() => setConfirmClear(true)}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                title="Reset Attempt History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Clear History */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Reset Analytics History?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently delete all recorded test attempts and subject metrics from your local storage.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {!hasData ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Mock Attempts Recorded Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Take a simulated Computer-Based Test (UPSC, SSC CGL, State PSC, or Scholarship Mock) to unlock comprehensive subject diagnostics, time speed analysis, and accuracy tracking!
          </p>
          <button
            onClick={onTakeTest}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition shadow"
          >
            <span>Start Your First Practice Test</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Overall Accuracy */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Overall Accuracy</span>
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {analytics.overallAccuracy}%
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>{analytics.totalQuestionsAnswered} questions attempted</span>
              </div>
            </div>

            {/* KPI 2: Tests Taken */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Mock Tests Taken</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {analytics.totalTestsTaken}
              </div>
              <div className="text-[11px] text-slate-500">
                Best Score: <strong className="text-emerald-600">{analytics.bestScorePercentage}%</strong>
              </div>
            </div>

            {/* KPI 3: Avg Score Percentage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Average Score</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {analytics.averageScorePercentage}%
              </div>
              <div className="text-[11px] text-slate-500">
                Cumulative across exams
              </div>
            </div>

            {/* KPI 4: Speed Efficiency */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Average Speed</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {analytics.averageTimePerQuestionSeconds}s
              </div>
              <div className="text-[11px] text-slate-500">
                Per question response time
              </div>
            </div>
          </div>

          {/* Diagnostic Strengths & Weak Areas Alert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strong Areas Card */}
            <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strong Mastery Areas (Accuracy &ge; 75%)</span>
              </div>
              {analytics.strongSubjects.length === 0 ? (
                <p className="text-xs text-emerald-700">
                  Keep practicing across subjects to establish strong high-scoring subjects.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analytics.strongSubjects.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-300 shadow-sm"
                    >
                      {s} ({analytics.subjectStats[s]?.accuracy}%)
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* High Revision Priority / Weak Areas Card */}
            <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>High Revision Priority (Accuracy &lt; 60%)</span>
              </div>
              {analytics.weakSubjects.length === 0 ? (
                <p className="text-xs text-emerald-700">
                  Great job! No critically weak subjects detected based on your current attempts.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 items-center">
                  {analytics.weakSubjects.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => onExploreStudyMaterial(w)}
                      className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold border border-rose-300 transition flex items-center gap-1 shadow-sm"
                      title="Read Revision Capsule"
                    >
                      <span>{w} ({analytics.subjectStats[w]?.accuracy}%)</span>
                      <BookOpen className="w-3 h-3 text-rose-600" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject-Wise Performance Breakdown Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Subject-Wise Accuracy Breakdown</span>
              <span className="text-xs text-slate-500 font-normal">
                {Object.keys(analytics.subjectStats).length} Subjects Evaluated
              </span>
            </h3>

            <div className="space-y-3">
              {Object.entries(analytics.subjectStats).map(([subj, stats], idx) => {
                let barColor = 'bg-blue-600';
                if (stats.accuracy >= 75) barColor = 'bg-emerald-500';
                else if (stats.accuracy < 60) barColor = 'bg-rose-500';
                else barColor = 'bg-amber-500';

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                      <span className="font-semibold">{subj}</span>
                      <span>
                        <strong>{stats.accuracy}%</strong> ({stats.correct}/{stats.total} Correct)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.max(5, stats.accuracy)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Mock Attempts Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Recent Test History & Score Progression</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {attempts.length} Total Attempts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Test Title</th>
                    <th className="p-3">Exam Focus</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {attempts.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 text-slate-500 whitespace-nowrap text-xs">
                        {new Date(att.date).toLocaleDateString()} {new Date(att.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 font-semibold text-slate-900">
                        {att.quizTitle}
                      </td>
                      <td className="p-3 text-slate-600">
                        {att.examName}
                      </td>
                      <td className="p-3 font-bold text-blue-700">
                        {att.score} / {att.maxScore}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          att.accuracyPercentage >= 70
                            ? 'bg-emerald-100 text-emerald-800'
                            : att.accuracyPercentage >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {att.accuracyPercentage}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
