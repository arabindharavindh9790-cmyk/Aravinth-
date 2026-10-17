import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Clock, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  Award,
  BookMarked,
  Printer,
  CheckSquare,
  Square,
  RotateCcw,
  Zap
} from 'lucide-react';
import { Exam } from '../types';
import { EXAMS_DATABASE } from '../data/examsData';

interface ExamExplorerProps {
  onStartQuizForExam?: (examId: string) => void;
  onOpenStudyMaterialForExam?: (examId: string) => void;
}

export const ExamExplorer: React.FC<ExamExplorerProps> = ({
  onStartQuizForExam,
  onOpenStudyMaterialForExam,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'central' | 'state'>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(EXAMS_DATABASE[0]);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'pattern' | 'eligibility' | 'strategy'>('syllabus');

  // Interactive Topic Checklist persisted in localStorage
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('aae_syllabus_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aae_syllabus_checklist', JSON.stringify(checkedTopics));
    } catch (e) {
      console.error('Failed to save checklist:', e);
    }
  }, [checkedTopics]);

  const toggleTopicCheck = (topicKey: string) => {
    setCheckedTopics((prev) => ({
      ...prev,
      [topicKey]: !prev[topicKey],
    }));
  };

  const handleResetExamChecklist = (examId: string) => {
    setCheckedTopics((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(examId + '::')) {
          delete copy[k];
        }
      });
      return copy;
    });
  };

  // Extract unique states for state selector
  const availableStates = useMemo(() => {
    const states = new Set<string>();
    EXAMS_DATABASE.forEach((e) => {
      if (e.state) states.add(e.state);
    });
    return Array.from(states);
  }, []);

  // Filtered exams
  const filteredExams = useMemo(() => {
    return EXAMS_DATABASE.filter((exam) => {
      // Category filter
      if (activeCategory !== 'all' && exam.category !== activeCategory) {
        return false;
      }
      // State filter
      if (activeCategory === 'state' && selectedState !== 'all' && exam.state !== selectedState) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = exam.title.toLowerCase().includes(q);
        const matchesBody = exam.conductingBody.toLowerCase().includes(q);
        const matchesShort = exam.shortCode.toLowerCase().includes(q);
        const matchesPopular = exam.popularFor.toLowerCase().includes(q);
        const matchesState = exam.state?.toLowerCase().includes(q);
        const matchesSubject = exam.syllabus.some((s) => s.subject.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBody && !matchesShort && !matchesPopular && !matchesState && !matchesSubject) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, selectedState, searchQuery]);

  // Compute syllabus topic completion metrics for the selected exam
  const examCompletionStats = useMemo(() => {
    if (!selectedExam) return { total: 0, completed: 0, percentage: 0 };
    let total = 0;
    let completed = 0;

    selectedExam.syllabus.forEach((sec) => {
      sec.topics.forEach((t) => {
        total++;
        const key = `${selectedExam.id}::${sec.subject}::${t}`;
        if (checkedTopics[key]) completed++;
      });
    });

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [selectedExam, checkedTopics]);

  return (
    <div id="exam-explorer-container" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AAE Education Syllabus & Test Repository</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            All State & Central Government Exam Syllabus
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Detailed official syllabus, exam pattern schemas, negative marking rules, eligibility criteria, and preparation roadmaps for UPSC, SSC, Banking, Railways, and all State PSC commissions (TNPSC, UPPSC, BPSC, MPSC, RPSC, KPSC, Kerala PSC, WBPSC, APPSC/TSPSC, MPPSC, OPSC, Punjab PPSC).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              id="filter-all-exams"
              onClick={() => {
                setActiveCategory('all');
                setSelectedState('all');
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Examinations ({EXAMS_DATABASE.length})
            </button>
            <button
              id="filter-central-exams"
              onClick={() => {
                setActiveCategory('central');
                setSelectedState('all');
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeCategory === 'central'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Central Govt (UPSC, SSC, Bank, RRB)
            </button>
            <button
              id="filter-state-exams"
              onClick={() => setActiveCategory('state')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                activeCategory === 'state'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              State PSCs & Commissions
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              id="exam-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam, commission, or subject..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* State Pills if 'state' category is selected */}
        {(activeCategory === 'state' || activeCategory === 'all') && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Filter State:
            </span>
            <button
              onClick={() => setSelectedState('all')}
              className={`px-2.5 py-1 rounded-full font-medium transition shrink-0 ${
                selectedState === 'all'
                  ? 'bg-blue-100 text-blue-700 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All States
            </button>
            {availableStates.map((st) => (
              <button
                key={st}
                onClick={() => {
                  setSelectedState(st);
                  if (activeCategory === 'all') setActiveCategory('state');
                }}
                className={`px-2.5 py-1 rounded-full font-medium transition shrink-0 ${
                  selectedState === st
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout: Exam Directory & Detailed Syllabus Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Exams */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
            <span>SHOWING {filteredExams.length} EXAMINATIONS</span>
            {selectedExam && <span>Click to inspect syllabus</span>}
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredExams.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-6">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No exams match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSelectedState('all');
                  }}
                  className="mt-3 text-xs text-blue-600 font-medium hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredExams.map((exam) => {
                const isSelected = selectedExam?.id === exam.id;
                return (
                  <div
                    key={exam.id}
                    id={`exam-card-${exam.id}`}
                    onClick={() => setSelectedExam(exam)}
                    className={`p-4 rounded-xl border transition cursor-pointer select-none relative ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 shadow-md ring-1 ring-blue-400'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            exam.category === 'central'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {exam.category === 'central' ? 'Central Govt' : exam.state || 'State Govt'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {exam.stages.length} Stages
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {exam.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {exam.conductingBody}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition ${isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-400'}`} />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <div className="flex items-center gap-1 truncate max-w-[200px]">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{exam.popularFor}</span>
                      </div>
                      <span className="text-blue-600 font-semibold text-[10px] shrink-0">
                        View Syllabus →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Comprehensive Detail View of the Selected Exam */}
        <div className="lg:col-span-8">
          {selectedExam ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Exam Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                      {selectedExam.shortCode}
                    </span>
                    {selectedExam.state && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {selectedExam.state}
                      </span>
                    )}
                  </div>

                  <a
                    href={selectedExam.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white mt-3">
                  {selectedExam.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Conducted by: <strong className="text-white">{selectedExam.conductingBody}</strong>
                </p>

                {/* Quick stats banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Age Limit:</span>
                    <span className="font-semibold text-slate-200">{selectedExam.ageLimit.split('(')[0]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Min. Qualification:</span>
                    <span className="font-semibold text-slate-200 truncate block" title={selectedExam.educationalQualification}>
                      {selectedExam.educationalQualification.slice(0, 26)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Exam Frequency:</span>
                    <span className="font-semibold text-slate-200">{selectedExam.frequency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Selection Stages:</span>
                    <span className="font-semibold text-blue-300">{selectedExam.stages.length} Tier / Stages</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Practice Quiz for this Exam & Study Material */}
              <div className="bg-blue-50/80 px-6 py-3 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-blue-900 font-medium">
                  Ready to test your readiness for <strong>{selectedExam.shortCode}</strong>?
                </div>
                <div className="flex items-center gap-2">
                  {onOpenStudyMaterialForExam && (
                    <button
                      onClick={() => onOpenStudyMaterialForExam(selectedExam.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <BookMarked className="w-3.5 h-3.5 text-blue-600" />
                      <span>Study Notes</span>
                    </button>
                  )}
                  {onStartQuizForExam && (
                    <button
                      onClick={() => onStartQuizForExam(selectedExam.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <span>Take Practice Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation Tabs for Exam Details */}
              <div className="flex border-b border-slate-200 bg-slate-50/80 px-6">
                {[
                  { id: 'syllabus' as const, label: 'Detailed Syllabus', icon: BookOpen },
                  { id: 'pattern' as const, label: 'Exam Pattern & Marking', icon: Layers },
                  { id: 'eligibility' as const, label: 'Eligibility & Posts', icon: GraduationCap },
                  { id: 'strategy' as const, label: 'Preparation Roadmap', icon: Calendar },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
                        isActive
                          ? 'border-blue-600 text-blue-600 bg-white'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* TAB 1: DETAILED SYLLABUS */}
                {activeTab === 'syllabus' && (
                  <div className="space-y-6">
                    {/* Interactive Completion Progress Banner */}
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 rounded-xl p-4 border border-blue-200/80 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              Interactive Syllabus Completion Tracker
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                              {examCompletionStats.percentage}% Completed
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Check off topics as you finish revisions. Your progress is saved automatically.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          {examCompletionStats.completed > 0 && (
                            <button
                              onClick={() => handleResetExamChecklist(selectedExam.id)}
                              className="px-2.5 py-1 rounded text-slate-500 hover:text-rose-600 hover:bg-white text-[11px] font-semibold transition flex items-center gap-1"
                              title="Reset checklist for this exam"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset</span>
                            </button>
                          )}
                          <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition flex items-center gap-1.5 shadow-sm"
                            title="Print or save PDF of this syllabus"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-600" />
                            <span>Print Syllabus</span>
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${examCompletionStats.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                          <span>{examCompletionStats.completed} of {examCompletionStats.total} topics mastered</span>
                          <span>{examCompletionStats.total - examCompletionStats.completed} remaining</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        Comprehensive Subject & Topic Breakdown
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedExam.syllabus.length} Core Subjects
                      </span>
                    </div>

                    <div className="space-y-4">
                      {selectedExam.syllabus.map((section, idx) => {
                        const sectionCompletedCount = section.topics.filter(
                          (t) => checkedTopics[`${selectedExam.id}::${section.subject}::${t}`]
                        ).length;

                        return (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition bg-slate-50/50 space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                  {section.subject}
                                </h4>
                                <span className="text-[11px] text-slate-500">
                                  {sectionCompletedCount} / {section.topics.length} topics checked
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  section.weightage === 'High'
                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}>
                                  {section.weightage} Priority
                                </span>

                                {onStartQuizForExam && (
                                  <button
                                    onClick={() => onStartQuizForExam(selectedExam.id)}
                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1"
                                    title="Practice questions for this subject"
                                  >
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    <span>Practice Section</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 font-medium bg-amber-50/70 text-amber-900 px-3 py-1.5 rounded-md border border-amber-200/50">
                              <strong>Key Focus:</strong> {section.keyFocusAreas}
                            </p>

                            {/* Topics Checklist */}
                            <div className="space-y-1.5">
                              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                                Topics & Modules (Click to mark covered):
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {section.topics.map((t, tidx) => {
                                  const topicKey = `${selectedExam.id}::${section.subject}::${t}`;
                                  const isChecked = !!checkedTopics[topicKey];

                                  return (
                                    <div
                                      key={tidx}
                                      onClick={() => toggleTopicCheck(topicKey)}
                                      className={`flex items-start gap-2 p-2 rounded-lg border transition cursor-pointer select-none ${
                                        isChecked
                                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                                      }`}
                                    >
                                      {isChecked ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                      )}
                                      <span className={isChecked ? 'line-through text-slate-500' : ''}>
                                        {t}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Recommended Books */}
                            <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-600">
                              <span className="font-bold text-slate-700 shrink-0">Standard Books:</span>
                              <span>{section.recommendedBooks.join(' • ')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: EXAM PATTERN */}
                {activeTab === 'pattern' && (
                  <div className="space-y-6">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Stage-by-Stage Exam Pattern & Marking Scheme
                    </h3>

                    <div className="space-y-6">
                      {selectedExam.stages.map((stage, sidx) => (
                        <div
                          key={sidx}
                          className="rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                        >
                          <div className="bg-slate-800 text-white p-4 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-sm sm:text-base text-white">
                                {stage.name}
                              </h4>
                              <p className="text-xs text-slate-300 mt-0.5">
                                {stage.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-slate-700 text-slate-200 px-2.5 py-1 rounded">
                                {stage.type}
                              </span>
                              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded">
                                {stage.totalMarks} Marks
                              </span>
                            </div>
                          </div>

                          {/* Stage details */}
                          <div className="p-4 bg-white space-y-3">
                            <div className="flex items-center gap-4 text-xs text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-600" />
                                <span>Duration: <strong>{stage.durationMinutes} Minutes</strong></span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-rose-500" />
                                <span>Negative Marking: <strong>{stage.negativeMarking}</strong></span>
                              </div>
                            </div>

                            {/* Subjects table */}
                            <div className="border border-slate-200 rounded-lg overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                                  <tr>
                                    <th className="p-2.5">Paper / Subject</th>
                                    <th className="p-2.5">Questions</th>
                                    <th className="p-2.5">Total Marks</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-800">
                                  {stage.subjects.map((sub, subIdx) => (
                                    <tr key={subIdx} className="hover:bg-slate-50/50">
                                      <td className="p-2.5 font-medium">{sub.subjectName}</td>
                                      <td className="p-2.5">{sub.questionsCount > 0 ? sub.questionsCount : 'Subjective'}</td>
                                      <td className="p-2.5 font-bold text-blue-700">{sub.marks}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: ELIGIBILITY & POSTS */}
                {activeTab === 'eligibility' && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Eligibility Criteria & Popular Cadres
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Educational Qualification
                        </span>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          {selectedExam.educationalQualification}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Age Limits & Relaxations
                        </span>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          {selectedExam.ageLimit}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Permissible Attempts
                        </span>
                        <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                          {selectedExam.attempts}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Key Career Posts & Cadres
                        </span>
                        <p className="text-sm font-semibold text-blue-900 leading-relaxed">
                          {selectedExam.popularFor}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: PREPARATION STRATEGY */}
                {activeTab === 'strategy' && (
                  <div className="space-y-5">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Structured Preparation Roadmap & Cutoff Intelligence
                    </h3>

                    {/* Cutoff Trend Card */}
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-800 block mb-1">
                        Previous Years Cutoff Trends:
                      </span>
                      <p className="text-sm font-medium">
                        {selectedExam.preparationStrategy.cutoffTrends}
                      </p>
                    </div>

                    {/* Step-by-Step Roadmap */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Milestone Strategy:
                      </span>
                      {selectedExam.preparationStrategy.roadmap.map((step, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/40 text-xs sm:text-sm text-slate-800">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {rIdx + 1}
                          </span>
                          <p className="leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>

                    {/* Pro Tips */}
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Toppers’ Key Advice:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {selectedExam.preparationStrategy.proTips.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              Select an exam from the list to view its complete syllabus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
