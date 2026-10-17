import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Trophy, 
  BarChart3, 
  HelpCircle,
  Play,
  Pause,
  Check,
  Bookmark,
  Search,
  Printer,
  Sparkles,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizSession, QuizAttempt, QuestionAnalyticsItem } from '../types';
import { QUIZ_SESSIONS_DATABASE } from '../data/quizzesData';
import { saveQuizAttempt } from '../utils/offlineStorage';

interface QuizArenaProps {
  initialExamId?: string;
  onViewAnalyticsTab: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  initialExamId,
  onViewAnalyticsTab,
}) => {
  // Available quiz sessions
  const [selectedSession, setSelectedSession] = useState<QuizSession | null>(null);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Search and Category filters for quiz selector
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Full Mock' | 'Subject Practice' | 'Scholarship Aptitude'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Active test states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<number, number>>({});
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Result state
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct' | 'skipped'>('all');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Filter sessions if an initial exam was provided or user filters by category / search
  const availableSessions = useMemo(() => {
    return QUIZ_SESSIONS_DATABASE.filter((s) => {
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesExam = s.examName.toLowerCase().includes(q);
        const matchesCategory = s.category.toLowerCase().includes(q);
        const matchesQuestion = s.questions.some((item) => item.questionText.toLowerCase().includes(q) || item.subject.toLowerCase().includes(q));
        if (!matchesTitle && !matchesExam && !matchesCategory && !matchesQuestion) return false;
      }
      return true;
    });
  }, [categoryFilter, searchFilter]);

  useEffect(() => {
    if (initialExamId) {
      const match = QUIZ_SESSIONS_DATABASE.find((s) => s.examId === initialExamId);
      if (match) {
        setSelectedSession(match);
      }
    }
  }, [initialExamId]);

  // Start the test
  const handleStartTest = (session: QuizSession) => {
    setSelectedSession(session);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setCurrentQuestionIndex(0);
    setQuestionTimeSpent({});
    setSecondsRemaining(session.durationMinutes * 60);
    setIsTestActive(true);
    setIsTestCompleted(false);
    setIsPaused(false);
    setCompletedAttempt(null);
    questionStartTimeRef.current = Date.now();
  };

  // Re-attempt only missed/incorrect questions
  const handleReattemptMissed = () => {
    if (!selectedSession || !completedAttempt) return;
    const missedQuestions = selectedSession.questions.filter((_, idx) => {
      const q = completedAttempt.questionAnalytics[idx];
      return q.userAnswerIndex === null || !q.isCorrect;
    });

    if (missedQuestions.length === 0) return;

    const customSession: QuizSession = {
      ...selectedSession,
      id: `${selectedSession.id}_missed_${Date.now()}`,
      title: `Focus Drill: Missed Questions (${selectedSession.title})`,
      totalQuestions: missedQuestions.length,
      durationMinutes: Math.max(5, Math.ceil(missedQuestions.length * 1.5)),
      questions: missedQuestions,
      instructions: [
        'Focused revision test containing only the questions you skipped or answered incorrectly in your last attempt.',
        'Target 100% accuracy to solidify concept mastery.',
      ],
    };

    handleStartTest(customSession);
  };

  // Timer countdown
  useEffect(() => {
    if (!isTestActive || isTestCompleted || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestActive, isTestCompleted, isPaused]);

  // Track time spent on question before moving
  const recordQuestionTime = () => {
    const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
    setQuestionTimeSpent((prev) => ({
      ...prev,
      [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + elapsed,
    }));
    questionStartTimeRef.current = Date.now();
  };

  // Jump to specific question
  const jumpToQuestion = (index: number) => {
    recordQuestionTime();
    setCurrentQuestionIndex(index);
  };

  // Select an option
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  // Toggle Mark for Review
  const handleToggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestionIndex)) {
        next.delete(currentQuestionIndex);
      } else {
        next.add(currentQuestionIndex);
      }
      return next;
    });
  };

  // Clear current response
  const handleClearResponse = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestionIndex];
      return copy;
    });
  };

  // Final submission calculation
  const handleForceSubmit = async () => {
    if (!selectedSession) return;
    recordQuestionTime();

    if (timerRef.current) clearInterval(timerRef.current);

    const questions = selectedSession.questions;
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    const questionAnalytics: QuestionAnalyticsItem[] = [];
    const subjectBreakdown: Record<string, { correct: number; total: number; accuracy: number }> = {};

    questions.forEach((q, idx) => {
      const userAnswer = userAnswers[idx] !== undefined ? userAnswers[idx] : null;
      const isCorrect = userAnswer === q.correctOptionIndex;

      if (userAnswer === null) {
        skipped++;
      } else if (isCorrect) {
        correct++;
      } else {
        incorrect++;
      }

      // Subject tracking
      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { correct: 0, total: 0, accuracy: 0 };
      }
      subjectBreakdown[q.subject].total++;
      if (isCorrect) subjectBreakdown[q.subject].correct++;

      questionAnalytics.push({
        questionId: q.id,
        userAnswerIndex: userAnswer,
        correctAnswerIndex: q.correctOptionIndex,
        isCorrect,
        timeSpentSeconds: questionTimeSpent[idx] || 15,
      });
    });

    // Compute subject accuracies
    Object.keys(subjectBreakdown).forEach((subj) => {
      const item = subjectBreakdown[subj];
      item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });

    // Calculate score
    const marksPerQuestion = 2;
    const penaltyPerQuestion = selectedSession.negativeMarkingRatio * marksPerQuestion;
    const rawScore = (correct * marksPerQuestion) - (incorrect * penaltyPerQuestion);
    const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
    const maxScore = questions.length * marksPerQuestion;
    const accuracy = (correct + incorrect) > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const totalTime = (selectedSession.durationMinutes * 60) - secondsRemaining;

    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizSessionId: selectedSession.id,
      quizTitle: selectedSession.title,
      examName: selectedSession.examName,
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      timeSpentSeconds: Math.max(1, totalTime),
      correctCount: correct,
      incorrectCount: incorrect,
      skippedCount: skipped,
      score: finalScore,
      maxScore,
      accuracyPercentage: accuracy,
      subjectAnalytics: subjectBreakdown,
      questionAnalytics,
    };

    // Save to IndexedDB
    await saveQuizAttempt(attempt);

    setCompletedAttempt(attempt);
    setIsTestActive(false);
    setIsTestCompleted(true);
    setShowSubmitModal(false);

    // Celebrate if accuracy >= 70%
    if (accuracy >= 70) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ==================== SCREEN 1: QUIZ SELECTOR ====================
  if (!isTestActive && !isTestCompleted) {
    return (
      <div id="quiz-selection-screen" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>AAE Education CBT Practice & Performance Simulator</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Structured Practice Tests & Real Exam CBT Mocks
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Simulate actual Computer-Based Tests with official timers, sectional marking schemes, negative penalties, and instant question-by-question analytics. Cover central exams (UPSC, SSC, Banking, Railways), state PSCs, and scholarship aptitude tests.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
              {[
                { id: 'all' as const, label: `All Sessions (${QUIZ_SESSIONS_DATABASE.length})` },
                { id: 'Full Mock' as const, label: 'Full Mocks' },
                { id: 'Subject Practice' as const, label: 'Subject Practice' },
                { id: 'Scholarship Aptitude' as const, label: 'Scholarship Aptitude' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
                    categoryFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search filter */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search mock or subject..."
                className="w-full pl-9 pr-3 py-2 rounded-lg text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {availableSessions.map((session) => (
            <div
              key={session.id}
              id={`quiz-card-${session.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {session.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{session.durationMinutes} Minutes</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {session.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Exam Focus: <strong className="text-slate-700">{session.examName}</strong>
                </p>

                {/* Details Pills */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Questions</span>
                    <span className="font-bold text-slate-800">{session.totalQuestions} MCQs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Max Score</span>
                    <span className="font-bold text-blue-700">{session.totalQuestions * 2} Marks</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Negative</span>
                    <span className="font-bold text-rose-600">
                      {session.negativeMarkingRatio > 0 ? `-${session.negativeMarkingRatio * 2}` : 'Nil'}
                    </span>
                  </div>
                </div>

                {/* Instructions preview */}
                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                  {session.instructions.slice(0, 2).map((ins, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleStartTest(session)}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Practice Test</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== SCREEN 2: ACTIVE CBT TEST ====================
  if (isTestActive && selectedSession) {
    const currentQ = selectedSession.questions[currentQuestionIndex];
    const isAnswered = userAnswers[currentQuestionIndex] !== undefined;
    const isMarked = markedForReview.has(currentQuestionIndex);

    const answeredCount = Object.keys(userAnswers).length;
    const markedCount = markedForReview.size;
    const unattemptedCount = selectedSession.totalQuestions - answeredCount;

    return (
      <div id="cbt-active-test-arena" className="min-h-[80vh] bg-slate-100 py-4 px-3 sm:px-6 space-y-4">
        {/* Top CBT Test Header Bar */}
        <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {selectedSession.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>Section: <strong className="text-blue-400">{currentQ.subject}</strong></span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Marking: +2, -{(selectedSession.negativeMarkingRatio * 2).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font size control */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded font-bold ${fontSize === 'sm' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                title="Smaller font"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded font-bold ${fontSize === 'base' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                title="Default font"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded font-bold ${fontSize === 'lg' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                title="Larger font"
              >
                A+
              </button>
            </div>

            {/* Pause Timer Toggle */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={isPaused ? 'Resume Test' : 'Pause Test'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Live Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm sm:text-base font-black border ${
              secondsRemaining < 180 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                : 'bg-slate-800 text-emerald-400 border-slate-700'
            }`}>
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{isPaused ? 'PAUSED' : formatTime(secondsRemaining)}</span>
            </div>

            {/* End Test Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Paused Screen Overlay */}
        {isPaused && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center space-y-2">
            <h3 className="font-bold text-amber-900 text-sm">Test Paused</h3>
            <p className="text-xs text-amber-700">Take a breath. Click Resume whenever you are ready to continue answering questions.</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg shadow hover:bg-amber-700 transition"
            >
              Resume Test
            </button>
          </div>
        )}

        {/* Question + Question Palette Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Main Question Arena */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold">
                  Question {currentQuestionIndex + 1} of {selectedSession.totalQuestions}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {currentQ.subject}
                </span>
                {currentQ.previousYearRef && (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {currentQ.previousYearRef}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500">
                Difficulty: <span className="font-semibold text-slate-700">{currentQ.difficulty}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line select-none">
              {currentQ.questionText}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 transition cursor-pointer select-none ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {optionLetter}
                    </span>
                    <span className="text-sm sm:text-base text-slate-800 leading-normal pt-0.5">
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMarkForReview}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                    isMarked
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                {isAnswered && (
                  <button
                    onClick={handleClearResponse}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Response</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => jumpToQuestion(currentQuestionIndex - 1)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    if (currentQuestionIndex < selectedSession.totalQuestions - 1) {
                      jumpToQuestion(currentQuestionIndex + 1);
                    } else {
                      setShowSubmitModal(true);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition"
                >
                  <span>{currentQuestionIndex === selectedSession.totalQuestions - 1 ? 'Save & Summary' : 'Save & Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Question Palette */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Question Palette</span>
              <span className="text-xs text-slate-500 font-normal">
                {selectedSession.totalQuestions} Questions
              </span>
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 shrink-0" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-purple-600 shrink-0" />
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 shrink-0" />
                <span>Not Visited ({unattemptedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded border-2 border-blue-600 shrink-0" />
                <span>Current</span>
              </div>
            </div>

            {/* Matrix of Buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {selectedSession.questions.map((_, qIdx) => {
                const isCurr = currentQuestionIndex === qIdx;
                const isAns = userAnswers[qIdx] !== undefined;
                const isRev = markedForReview.has(qIdx);

                let bgStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isAns && isRev) {
                  bgStyle = 'bg-purple-600 text-white font-bold';
                } else if (isAns) {
                  bgStyle = 'bg-emerald-500 text-white font-bold';
                } else if (isRev) {
                  bgStyle = 'bg-purple-100 text-purple-800 border border-purple-300 font-bold';
                }

                return (
                  <button
                    key={qIdx}
                    onClick={() => jumpToQuestion(qIdx)}
                    className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${bgStyle} ${
                      isCurr ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Quick Summary Card */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Attempted:</span>
                <span className="font-bold text-emerald-600">{answeredCount} / {selectedSession.totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Unattempted:</span>
                <span className="font-bold text-slate-500">{unattemptedCount}</span>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
              >
                Finish & Submit Test
              </button>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span>Confirm Test Submission</span>
              </div>

              <p className="text-xs text-slate-600">
                Are you sure you want to end this test? Here is your session summary:
              </p>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Answered</span>
                  <span className="font-bold text-emerald-600 text-base">{answeredCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Marked Review</span>
                  <span className="font-bold text-purple-600 text-base">{markedCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Unanswered</span>
                  <span className="font-bold text-rose-500 text-base">{unattemptedCount}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Return to Test
                </button>
                <button
                  onClick={handleForceSubmit}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== SCREEN 3: TEST RESULT & DETAILED REVIEW ====================
  if (isTestCompleted && completedAttempt && selectedSession) {
    const questions = selectedSession.questions;

    // Filter questions for review mode
    const filteredQuestions = questions.filter((q, idx) => {
      const qAnalytics = completedAttempt.questionAnalytics[idx];
      if (reviewFilter === 'incorrect') return qAnalytics.userAnswerIndex !== null && !qAnalytics.isCorrect;
      if (reviewFilter === 'correct') return qAnalytics.isCorrect;
      if (reviewFilter === 'skipped') return qAnalytics.userAnswerIndex === null;
      return true;
    });

    return (
      <div id="quiz-result-review-screen" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Scorecard Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-900/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Completed Successfully • Detailed Analytics Generated</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {completedAttempt.quizTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Completed on {new Date(completedAttempt.date).toLocaleString()} • Duration: {Math.floor(completedAttempt.timeSpentSeconds / 60)}m {completedAttempt.timeSpentSeconds % 60}s
              </p>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center">
              <div>
                <span className="text-slate-400 text-xs block">Your Score</span>
                <span className="text-3xl font-black text-white">
                  {completedAttempt.score}
                  <span className="text-sm font-normal text-slate-400">/{completedAttempt.maxScore}</span>
                </span>
              </div>
              <div className="h-10 w-px bg-slate-700" />
              <div>
                <span className="text-slate-400 text-xs block">Accuracy</span>
                <span className={`text-3xl font-black ${
                  completedAttempt.accuracyPercentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {completedAttempt.accuracyPercentage}%
                </span>
              </div>
              <div className="h-10 w-px bg-slate-700" />
              <div>
                <span className="text-slate-400 text-xs block">Percentile</span>
                <span className="text-3xl font-black text-cyan-400">
                  {Math.min(99, Math.max(35, Math.round(completedAttempt.accuracyPercentage * 0.95 + 8)))}th
                </span>
              </div>
            </div>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Correct Answers:</span>
              <span className="text-base font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-4 h-4" />
                {completedAttempt.correctCount} Qs
              </span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Incorrect Answers:</span>
              <span className="text-base font-bold text-rose-400 flex items-center gap-1 mt-0.5">
                <XCircle className="w-4 h-4" />
                {completedAttempt.incorrectCount} Qs
              </span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Unanswered / Skipped:</span>
              <span className="text-base font-bold text-slate-300 flex items-center gap-1 mt-0.5">
                <HelpCircle className="w-4 h-4" />
                {completedAttempt.skippedCount} Qs
              </span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Avg Speed per Q:</span>
              <span className="text-base font-bold text-blue-300 flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4" />
                {Math.round(completedAttempt.timeSpentSeconds / (completedAttempt.correctCount + completedAttempt.incorrectCount || 1))}s
              </span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Analytics Breakdown */}
        {completedAttempt.subjectAnalytics && Object.keys(completedAttempt.subjectAnalytics).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Subject-Wise Performance & Diagnostic Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(completedAttempt.subjectAnalytics).map(([subj, stats]) => (
                <div key={subj} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{subj}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      stats.accuracy >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : stats.accuracy >= 50
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {stats.accuracy >= 75 ? 'Strong Area' : stats.accuracy >= 50 ? 'Moderate' : 'Needs Revision'}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        stats.accuracy >= 75 ? 'bg-emerald-500' : stats.accuracy >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${stats.accuracy}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{stats.correct} of {stats.total} correct</span>
                    <span className="font-bold text-slate-700">{stats.accuracy}% Accuracy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleStartTest(selectedSession)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Entire Quiz</span>
            </button>

            {(completedAttempt.incorrectCount > 0 || completedAttempt.skippedCount > 0) && (
              <button
                onClick={handleReattemptMissed}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Re-Attempt {completedAttempt.incorrectCount + completedAttempt.skippedCount} Missed Questions</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition"
              title="Print or save PDF of your test scorecard"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Print Scorecard</span>
            </button>

            <button
              onClick={onViewAnalyticsTab}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>View Full Analytics Dashboard</span>
            </button>
          </div>

          {/* Filter Reviews */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium mr-1">Filter:</span>
            {[
              { id: 'all' as const, label: `All (${questions.length})` },
              { id: 'incorrect' as const, label: `Incorrect (${completedAttempt.incorrectCount})` },
              { id: 'correct' as const, label: `Correct (${completedAttempt.correctCount})` },
              { id: 'skipped' as const, label: `Skipped (${completedAttempt.skippedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setReviewFilter(f.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  reviewFilter === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question-by-Question Detailed Explanations */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Question-by-Question Detailed Solutions & Concepts</span>
          </h3>

          {filteredQuestions.map((q) => {
            const originalIndex = questions.findIndex((orig) => orig.id === q.id);
            const userAns = completedAttempt.questionAnalytics[originalIndex]?.userAnswerIndex;
            const isCorrect = userAns === q.correctOptionIndex;
            const isSkipped = userAns === null;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-5 sm:p-6 transition space-y-4 bg-white ${
                  isSkipped
                    ? 'border-slate-200'
                    : isCorrect
                    ? 'border-emerald-300 shadow-sm'
                    : 'border-rose-300 shadow-sm'
                }`}
              >
                {/* Question meta */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                      Question #{originalIndex + 1}
                    </span>
                    <span className="font-medium text-slate-600">
                      {q.subject} • {q.topic}
                    </span>
                  </div>

                  <div>
                    {isSkipped ? (
                      <span className="px-2.5 py-0.5 rounded-full text-slate-600 bg-slate-100 font-semibold text-[11px]">
                        Skipped
                      </span>
                    ) : isCorrect ? (
                      <span className="px-2.5 py-0.5 rounded-full text-emerald-700 bg-emerald-100 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Correct (+2)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-rose-700 bg-rose-100 font-bold text-[11px] flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Incorrect (-{(selectedSession.negativeMarkingRatio * 2).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Content */}
                <p className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {q.questionText}
                </p>

                {/* Options Review */}
                <div className="space-y-2 text-xs sm:text-sm">
                  {q.options.map((opt, optIdx) => {
                    const isUserChoice = userAns === optIdx;
                    const isCorrectChoice = q.correctOptionIndex === optIdx;

                    let rowStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                    if (isCorrectChoice) {
                      rowStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (isUserChoice && !isCorrectChoice) {
                      rowStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-start justify-between gap-3 p-3 rounded-xl border ${rowStyle}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="font-mono font-bold w-5">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                        <div className="shrink-0 text-[11px] font-bold">
                          {isCorrectChoice && <span className="text-emerald-600">✓ Correct Answer</span>}
                          {isUserChoice && !isCorrectChoice && <span className="text-rose-600">✗ Your Answer</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Conceptual Explanation Box */}
                <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-200/80 text-xs sm:text-sm text-blue-950 space-y-1">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>Conceptual Solution & Reference:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-1">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
