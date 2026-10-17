import React, { useState, useEffect } from 'react';
import { Navbar, AppTabType } from './components/Navbar';
import { ProAiArena } from './components/ProAiArena';
import { CompanyExplorer } from './components/CompanyExplorer';
import { AIMockInterviewArena } from './components/AIMockInterviewArena';
import { CompanyAssessmentArena } from './components/CompanyAssessmentArena';
import { AnswerOptimizer } from './components/AnswerOptimizer';
import { ExamExplorer } from './components/ExamExplorer';
import { QuizArena } from './components/QuizArena';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { OfflineLibrary } from './components/OfflineLibrary';
import { ScholarshipHub } from './components/ScholarshipHub';
import { SearchModal } from './components/SearchModal';
import { getAllOfflineStudyMaterials } from './utils/offlineStorage';
import { 
  Building2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Award,
  BookOpen,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabType>('pro-ai');
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Cross-component coordination states
  const [targetCompanyIdForInterview, setTargetCompanyIdForInterview] = useState<string>('google');
  const [targetCompanyIdForTest, setTargetCompanyIdForTest] = useState<string>('google');
  const [targetExamIdForQuiz, setTargetExamIdForQuiz] = useState<string | undefined>(undefined);
  const [targetMaterialId, setTargetMaterialId] = useState<string | undefined>(undefined);

  // Sync offline count on mount
  useEffect(() => {
    const checkOfflineItems = async () => {
      try {
        const items = await getAllOfflineStudyMaterials();
        setOfflineCount(items.length);
      } catch (err) {
        console.error('Failed to load offline items count:', err);
      }
    };
    checkOfflineItems();
  }, []);

  // Global keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for cross-tab workflows
  const handleStartInterviewForCompany = (companyId: string) => {
    setTargetCompanyIdForInterview(companyId);
    setActiveTab('company-interview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTestForCompany = (companyId: string) => {
    setTargetCompanyIdForTest(companyId);
    setActiveTab('company-tests');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuizForExam = (examId: string) => {
    setTargetExamIdForQuiz(examId);
    setActiveTab('quizzes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStudyMaterialForExam = (examId: string) => {
    setActiveTab('offline');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Primary Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        offlineCount={offlineCount}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Tab Content Display */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* 0. PRO AI Multidisciplinary Engineering Lab */}
        {activeTab === 'pro-ai' && (
          <ProAiArena />
        )}

        {/* 1. AI Mock Interview Arena */}
        {activeTab === 'company-interview' && (
          <AIMockInterviewArena
            initialCompanyId={targetCompanyIdForInterview}
            onViewHistory={() => setActiveTab('analytics')}
          />
        )}

        {/* 2. Company Intelligence & Guides */}
        {activeTab === 'company-intel' && (
          <CompanyExplorer
            onStartInterview={handleStartInterviewForCompany}
            onStartTest={handleStartTestForCompany}
          />
        )}

        {/* 3. Company Screening Tests (OA) Arena */}
        {activeTab === 'company-tests' && (
          <CompanyAssessmentArena
            initialCompanyId={targetCompanyIdForTest}
          />
        )}

        {/* 4. STAR & XYZ Answer Studio */}
        {activeTab === 'star-optimizer' && (
          <AnswerOptimizer />
        )}

        {/* 5. Government Exams & Syllabus */}
        {activeTab === 'exams' && (
          <ExamExplorer
            onStartQuizForExam={handleStartQuizForExam}
            onOpenStudyMaterialForExam={handleOpenStudyMaterialForExam}
          />
        )}

        {/* 6. CBT Practice & Quizzes */}
        {activeTab === 'quizzes' && (
          <QuizArena
            initialExamId={targetExamIdForQuiz}
            onViewAnalyticsTab={() => {
              setActiveTab('analytics');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 7. Performance Analytics & Scorecards */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            onTakeTest={() => {
              setActiveTab('quizzes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreStudyMaterial={(subject) => {
              setActiveTab('offline');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 8. Offline Study Library */}
        {activeTab === 'offline' && (
          <OfflineLibrary
            initialMaterialId={targetMaterialId}
            onMaterialsCountChange={(count) => setOfflineCount(count)}
          />
        )}

        {/* 9. Scholarships Hub */}
        {activeTab === 'scholarships' && (
          <ScholarshipHub
            onPracticeScholarshipMock={() => {
              setTargetExamIdForQuiz('nmmss');
              setActiveTab('quizzes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReadScholarshipNotes={() => {
              setTargetMaterialId('mat-scholarship-prep-guide');
              setActiveTab('offline');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectExam={(examId) => {
          setActiveTab('exams');
        }}
        onSelectMaterial={(materialId) => {
          setTargetMaterialId(materialId);
          setActiveTab('offline');
        }}
        onSelectScholarship={(scholarshipId) => {
          setActiveTab('scholarships');
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white font-mono text-sm">
                  AAE
                </div>
                <span className="text-base font-extrabold text-white">AAE Education</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Comprehensive AI interview simulation & testing platform for branded companies (Google, Amazon, Meta, Microsoft, McKinsey, Goldman Sachs, TCS, Infosys) alongside national examination preparation and scholarship intelligence.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Branded Companies Prepared
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Google (DSA, System Design, Googleyness)</li>
                <li>Amazon (16 Leadership Principles & Bar Raiser)</li>
                <li>Meta (Speed Coding & Product Architecture)</li>
                <li>McKinsey & Company (PEI & Case Structuring)</li>
                <li>Goldman Sachs (Quant, Superday, Low-Latency)</li>
                <li>TCS & Infosys (NQT, Digital, Specialist)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                AI Preparation Features
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Interactive Voice & Text AI Mock Interviewer</li>
                <li>Real Online Assessment (OA) Coding Simulations</li>
                <li>STAR & Google XYZ Answer Studio</li>
                <li>Hiring Committee Scorecard & Verdicts</li>
                <li>Verified Salary & Leveling Benchmarks</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-2">
                PWA & Offline Ready
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice interview questions, read company intelligence, and review offline capsules without network interruptions.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Voice & AI Powered</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
            <div>
              © {new Date().getFullYear()} AAE Education. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Press <strong>Ctrl+K</strong> to Quick Search</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
