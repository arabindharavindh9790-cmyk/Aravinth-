import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Layers, 
  Search, 
  ShieldCheck, 
  Building,
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Scholarship } from '../types';
import { SCHOLARSHIPS_DATABASE } from '../data/scholarshipsData';

interface ScholarshipHubProps {
  onPracticeScholarshipMock: () => void;
  onReadScholarshipNotes: () => void;
}

export const ScholarshipHub: React.FC<ScholarshipHubProps> = ({
  onPracticeScholarshipMock,
  onReadScholarshipNotes,
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'schemes' | 'checker' | 'syllabus' | 'guidelines'>('schemes');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'school' | 'college' | 'girls' | 'state'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(SCHOLARSHIPS_DATABASE[0]);

  // Quick Eligibility Checker state
  const [checkerLevel, setCheckerLevel] = useState<string>('all');
  const [checkerIncome, setCheckerIncome] = useState<string>('all');
  const [checkerCategory, setCheckerCategory] = useState<string>('all');

  const filteredScholarships = SCHOLARSHIPS_DATABASE.filter((sch) => {
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'school' && !sch.targetLevel.toLowerCase().includes('class') && !sch.targetLevel.toLowerCase().includes('school')) {
        return false;
      }
      if (selectedCategory === 'college' && !sch.targetLevel.toLowerCase().includes('undergraduate') && !sch.targetLevel.toLowerCase().includes('ug')) {
        return false;
      }
      if (selectedCategory === 'girls' && sch.category !== 'Girl Child & Minority' && !sch.title.toLowerCase().includes('girls') && !sch.title.toLowerCase().includes('penn') && !sch.title.toLowerCase().includes('kanya')) {
        return false;
      }
      if (selectedCategory === 'state' && sch.category !== 'State Government') {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = sch.title.toLowerCase().includes(q);
      const matchesBody = sch.authority.toLowerCase().includes(q);
      const matchesLevel = sch.targetLevel.toLowerCase().includes(q);
      const matchesCategory = sch.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesBody && !matchesLevel && !matchesCategory) return false;
    }
    return true;
  });

  // Filtered list for Eligibility Checker
  const eligibleSchemes = SCHOLARSHIPS_DATABASE.filter((sch) => {
    if (checkerLevel !== 'all') {
      if (checkerLevel === 'school' && !sch.targetLevel.toLowerCase().includes('school') && !sch.targetLevel.toLowerCase().includes('class')) return false;
      if (checkerLevel === 'college' && !sch.targetLevel.toLowerCase().includes('undergraduate')) return false;
      if (checkerLevel === 'overseas' && !sch.targetLevel.toLowerCase().includes('overseas')) return false;
    }
    if (checkerIncome === 'low') {
      // Income below 2.5L
    }
    if (checkerCategory === 'girls' && !sch.title.toLowerCase().includes('girls') && sch.category !== 'Girl Child & Minority' && !sch.title.toLowerCase().includes('penn') && !sch.title.toLowerCase().includes('kanya')) {
      return false;
    }
    return true;
  });

  return (
    <div id="scholarships-hub-container" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>National & State Scholarship Database • AAE Education</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Scholarship Exam Full Details & Application Guidelines
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Full official details on national and state competitive scholarship examinations (NMMSS, NTSE, PM YASASVI, AICTE Pragati, INSPIRE SHE, Post-Matric SC/ST, Begum Hazrat Mahal, and State Schemes). Includes MAT & SAT exam patterns, syllabi, award allowances, eligibility, and mandatory verification procedures.
          </p>
        </div>

        {/* Quick actions row */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <button
            onClick={onPracticeScholarshipMock}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Practice Scholarship MAT & SAT Mock CBT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onReadScholarshipNotes}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Open MAT Scholarship Prep Guide</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveViewTab('schemes')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeViewTab === 'schemes'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>All Scholarship Schemes ({SCHOLARSHIPS_DATABASE.length})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('checker')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeViewTab === 'checker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Quick Eligibility Calculator</span>
          </button>

          <button
            onClick={() => setActiveViewTab('syllabus')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeViewTab === 'syllabus'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>MAT & SAT Exam Pattern & Syllabus</span>
          </button>

          <button
            onClick={() => setActiveViewTab('guidelines')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeViewTab === 'guidelines'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Aadhaar & NSP Application Guide</span>
          </button>
        </div>
      </div>

      {/* VIEW TAB 1: ALL SCHOLARSHIP SCHEMES */}
      {activeViewTab === 'schemes' && (
        <div className="space-y-6">
          {/* Category Filter and Search Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
                {[
                  { id: 'all' as const, label: `All Schemes (${SCHOLARSHIPS_DATABASE.length})` },
                  { id: 'school' as const, label: 'School Level (Class 8 - 12)' },
                  { id: 'college' as const, label: 'College / Degree (UG)' },
                  { id: 'girls' as const, label: 'Girls & Special Schemes' },
                  { id: 'state' as const, label: 'State Specific Portals' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scholarship name, state or body..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              </div>
            </div>
          </div>

          {/* Two Column Layout: List and Detailed Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Scholarship Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-semibold text-slate-500 px-1">
                SHOWING {filteredScholarships.length} SCHEMES
              </div>

              <div className="space-y-3 max-h-[760px] overflow-y-auto pr-1">
                {filteredScholarships.map((sch) => {
                  const isSelected = selectedScholarship?.id === sch.id;
                  return (
                    <div
                      key={sch.id}
                      onClick={() => setSelectedScholarship(sch)}
                      className={`p-5 rounded-2xl border transition cursor-pointer select-none space-y-3 ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 shadow-md ring-1 ring-blue-400'
                          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {sch.targetLevel}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {sch.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1.5 leading-snug">
                            {sch.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span>{sch.authority}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>{sch.awardAmount}</span>
                        </div>
                        <span className="text-blue-600 font-bold text-[11px]">
                          View Full Details →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Full Details of Selected Scholarship */}
            <div className="lg:col-span-7">
              {selectedScholarship ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-6 p-6">
                  {/* Header */}
                  <div className="border-b border-slate-100 pb-5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          {selectedScholarship.targetLevel}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {selectedScholarship.category}
                        </span>
                      </div>
                      <a
                        href={selectedScholarship.officialPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 transition"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {selectedScholarship.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Authority: <strong>{selectedScholarship.authority}</strong>
                    </p>

                    {/* Award Banner */}
                    <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                        ₹
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                          Scholarship Financial Award
                        </span>
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          {selectedScholarship.awardAmount}
                        </span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {selectedScholarship.financialBenefitDetails}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Criteria */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Eligibility & Qualification Requirements</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 block font-medium text-[10px]">Academic Requirement</span>
                        <p className="font-semibold text-slate-800">{selectedScholarship.eligibility.academicPercentage}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 block font-medium text-[10px]">Annual Family Income Cap</span>
                        <p className="font-semibold text-slate-800">{selectedScholarship.eligibility.familyIncomeLimit}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 block font-medium text-[10px]">Target Community</span>
                        <p className="font-semibold text-slate-800">{selectedScholarship.eligibility.targetCommunity}</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 block font-medium text-[10px]">Applicable Courses</span>
                        <p className="font-semibold text-slate-800">{selectedScholarship.eligibility.applicableCourses}</p>
                      </div>
                    </div>
                  </div>

                  {/* Selection Process / Exam Pattern */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>Selection Mechanism & Written Exam Pattern</span>
                    </h3>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div>
                        <span className="font-bold text-slate-800">Selection Criteria: </span>
                        <span className="text-slate-700">{selectedScholarship.selectionProcess.selectionCriteria}</span>
                      </div>

                      {selectedScholarship.selectionProcess.hasWrittenExam && (
                        <div className="mt-2 pt-2 border-t border-slate-200 space-y-2">
                          <div className="font-bold text-blue-900 text-xs">
                            Exam Name: {selectedScholarship.selectionProcess.examName}
                          </div>
                          <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                            {selectedScholarship.selectionProcess.examPattern}
                          </p>
                          {selectedScholarship.keyDates.examDate && (
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] flex items-center justify-between">
                              <div>
                                <span className="text-slate-500 block">Exam Schedule / Timing:</span>
                                <span className="font-bold text-blue-700">{selectedScholarship.keyDates.examDate}</span>
                              </div>
                              <button
                                onClick={onPracticeScholarshipMock}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
                              >
                                Take Mock CBT Test
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mandatory Documents Checklist */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Mandatory Documents Required for Application</span>
                    </h3>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                      {selectedScholarship.documentsRequired.map((doc, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step by Step Application Guide */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Step-by-Step Online Application Procedure</span>
                    </h3>

                    <ol className="space-y-2 text-xs text-slate-700">
                      {selectedScholarship.stepByStepGuide.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <p className="leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Bottom Direct CTA */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Application Timeline: <strong>{selectedScholarship.keyDates.applicationWindow}</strong>
                    </span>
                    <a
                      href={selectedScholarship.officialPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <span>Apply on Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400">
                  Select a scholarship scheme to review full details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW TAB 2: ELIGIBILITY CHECKER */}
      {activeViewTab === 'checker' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>Scholarship Eligibility Calculator</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your academic stage, household income range, and category to instantly see all government scholarships you qualify to apply for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Education / Class Level</label>
              <select
                value={checkerLevel}
                onChange={(e) => setCheckerLevel(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="school">School Level (Class 8 to 12)</option>
                <option value="college">Undergraduate / College (B.E, B.Sc, BA, MBBS)</option>
                <option value="overseas">Master’s / Ph.D. Abroad</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Annual Family Income</label>
              <select
                value={checkerIncome}
                onChange={(e) => setCheckerIncome(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any Income</option>
                <option value="low">Below ₹2.5 Lakhs (Highest Eligibility)</option>
                <option value="mid">₹2.5 Lakhs to ₹4.5 Lakhs</option>
                <option value="high">₹4.5 Lakhs to ₹8.0 Lakhs</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Category / Reservation</label>
              <select
                value={checkerCategory}
                onChange={(e) => setCheckerCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">General / All Categories</option>
                <option value="girls">Girl Students</option>
                <option value="sc-st">SC / ST Categories</option>
                <option value="obc">OBC / EBC / DNT</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700">
              MATCHING SCHOLARSHIPS ({eligibleSchemes.length} FOUND)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibleSchemes.map((sch) => (
                <div key={sch.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {sch.targetLevel}
                    </span>
                    <span className="text-xs font-black text-amber-700">
                      {sch.awardAmount}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {sch.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {sch.eligibility.applicableCourses} • Income: {sch.eligibility.familyIncomeLimit}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <button
                      onClick={() => {
                        setSelectedScholarship(sch);
                        setActiveViewTab('schemes');
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Read Full Details →
                    </button>
                    <a
                      href={sch.officialPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-[11px]"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW TAB 3: MAT & SAT SYLLABUS & EXAM PATTERN */}
      {activeViewTab === 'syllabus' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">
              Scholarship Competitive Exam Pattern & Detailed Syllabus
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete subject-wise curriculum and question structure for NMMSS, NTSE, PM YASASVI (YET), and State Talent Search Examinations.
            </p>
          </div>

          {/* Paper 1: MAT */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-black text-xs">
                  PAPER 1
                </span>
                <h3 className="text-base font-black text-blue-950">
                  MAT (Mental Ability Test) — 90 to 100 MCQs (90–120 Minutes)
                </h3>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded border border-blue-200">
                1 Mark per question • No Negative Marking
              </span>
            </div>

            <p className="text-xs text-blue-900/80 leading-relaxed">
              MAT tests analytical thinking, pattern recognition, spatial ability, and numerical logic. It evaluates the raw problem-solving capability of candidates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Verbal Reasoning Topics (45–50 Questions)</span>
                </h4>
                <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                  <li><strong>Number Series & Letter Series:</strong> Identifying next term, missing numbers, and alternating patterns.</li>
                  <li><strong>Analogy:</strong> Word analogy, number analogy, and symbolic equivalence.</li>
                  <li><strong>Classification (Odd One Out):</strong> Finding discordant elements among words, numbers, and letter clusters.</li>
                  <li><strong>Coding-Decoding:</strong> Shift ciphers, substitution, and matrix coding.</li>
                  <li><strong>Blood Relations & Direction Sense:</strong> Family tree deduction, compass bearings, and distance calculation.</li>
                  <li><strong>Venn Diagrams & Syllogism:</strong> Intersection of sets and logical statement deduction.</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Non-Verbal Reasoning Topics (45–50 Questions)</span>
                </h4>
                <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                  <li><strong>Figure Series & Analogy:</strong> Clockwise/anticlockwise rotation, element addition, and symmetry.</li>
                  <li><strong>Mirror & Water Images:</strong> Lateral inversion and vertical reflection of shapes and alphanumerics.</li>
                  <li><strong>Paper Folding & Paper Cutting:</strong> Visualizing punched hole patterns upon unfolding.</li>
                  <li><strong>Embedded Figures:</strong> Spotting hidden geometric shapes inside complex composite figures.</li>
                  <li><strong>Cube & Dice:</strong> Opposite face identification on unfolded standard and non-standard dice.</li>
                  <li><strong>Counting Figures:</strong> Counting total triangles, squares, and rectangles in complex networks.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Paper 2: SAT */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-black text-xs">
                  PAPER 2
                </span>
                <h3 className="text-base font-black text-emerald-950">
                  SAT (Scholastic Aptitude Test) — 90 to 100 MCQs (90–120 Minutes)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded border border-emerald-200">
                NCERT Class 7, 8 & 10 Syllabus
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-slate-900">Science (35 Questions)</h4>
                <p className="text-slate-600 leading-relaxed">
                  Physics (Motion, Force, Light, Electricity, Heat); Chemistry (Synthetic Fibres, Metals & Non-metals, Combustion, Acids & Bases); Biology (Crop Production, Microorganisms, Cell Structure, Reproduction, Ecosystems).
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-slate-900">Social Science (35 Questions)</h4>
                <p className="text-slate-600 leading-relaxed">
                  History (Revolt of 1857, British Colonial Rule, National Movement); Civics (Indian Constitution, Secularism, Judiciary, Parliament); Geography (Resources, Agriculture, Industries, Human Resources).
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-slate-900">Mathematics (20 Questions)</h4>
                <p className="text-slate-600 leading-relaxed">
                  Rational Numbers, Linear Equations in One Variable, Quadrilaterals, Square & Cube Roots, Algebraic Expressions, Mensuration, Exponents & Powers, Direct & Inverse Proportions, Factorization.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TAB 4: APPLICATION PROCEDURES & AADHAAR DBT GUIDELINES */}
      {activeViewTab === 'guidelines' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">
              National Scholarship Portal (NSP) & DBT Seeding Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Essential checklist to avoid scholarship rejection or failed bank transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>1. Aadhaar-NPCI Bank Seeding (Mandatory)</span>
              </h3>
              <p className="leading-relaxed">
                Govt scholarship funds are sent via <strong>Aadhaar Payment Bridge System (APBS)</strong>. Simply linking your mobile number with bank account is NOT enough.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Visit your bank branch and ask for the <strong>"NPCI Aadhaar Mandate Seeding Form"</strong>.</li>
                <li>Check status on UIDAI portal (myaadhaar.uidai.gov.in) under "Bank Seeding Status".</li>
                <li>Minor accounts: Convert student’s bank account into a major account once they attain 18 years.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
              <h3 className="font-bold text-blue-950 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>2. NSP One Time Registration (NSP-OTR)</span>
              </h3>
              <p className="leading-relaxed">
                The Ministry of Education requires a 14-digit One Time Registration (OTR) number for all scholarship applications:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Download the <strong>NSP OTR App</strong> from Google Play Store or register on scholarships.gov.in.</li>
                <li>Complete Face-Authentication using Aadhaar FaceRD app.</li>
                <li>The OTR number is lifelong and applies across Pre-Matric, Post-Matric, and Higher Education schemes.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. Two-Tier Institutional Verification</span>
              </h3>
              <p className="leading-relaxed">
                After online submission, your application must be verified by:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                <li><strong>INO (Institute Nodal Officer):</strong> Principal/Headmaster of your current school/college.</li>
                <li><strong>DNO / SNO (District/State Nodal Officer):</strong> District Education Officer who sanctions the merit quota.</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>4. Annual Renewal Mandatory Rules</span>
              </h3>
              <p className="leading-relaxed">
                Scholarships are sanctioned for multi-year durations (e.g., 4 years for NMMSS or Degree).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Apply under <strong>"Renewal"</strong> category each academic year on NSP.</li>
                <li>Upload previous year annual progress card (minimum 50%–60% marks and 75% attendance).</li>
                <li>Failure to renew on NSP within the deadline forfeits all future payments.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
