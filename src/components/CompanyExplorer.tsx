import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Layers,
  Sparkles,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { BRANDED_COMPANIES } from '../data/companyData';
import { CompanyInfo } from '../types';

interface CompanyExplorerProps {
  onStartInterview: (companyId: string) => void;
  onStartTest: (companyId: string) => void;
}

export const CompanyExplorer: React.FC<CompanyExplorerProps> = ({ onStartInterview, onStartTest }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('google');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'big-tech' | 'consulting-finance' | 'it-services'>('all');
  const [activeTab, setActiveTab] = useState<'rounds' | 'pillars' | 'salaries' | 'questions' | 'dosAndDonts'>('rounds');

  const filteredCompanies = BRANDED_COMPANIES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory === 'all') return true;
    if (filterCategory === 'big-tech') return ['google', 'amazon', 'microsoft', 'meta'].includes(c.id);
    if (filterCategory === 'consulting-finance') return ['mckinsey', 'goldman-sachs'].includes(c.id);
    if (filterCategory === 'it-services') return ['tcs'].includes(c.id);
    return true;
  });

  const selectedCompany = BRANDED_COMPANIES.find(c => c.id === selectedCompanyId) || BRANDED_COMPANIES[0];

  return (
    <div className="space-y-8" id="company-explorer-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Branded Company Hiring Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Company-Specific Interview Blueprints & Testing
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Master the hiring standards of top global companies. Explore stage-by-stage hiring rounds, Bar-Raiser criteria, verified salary benchmarks, and practice with real AI mock interviewers.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onStartInterview(selectedCompany.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              id="start-ai-interview-hero-btn"
            >
              <Sparkles className="w-4 h-4" /> Start AI Mock Interview with {selectedCompany.name.split(' ')[0]}
            </button>
            <button
              onClick={() => onStartTest(selectedCompany.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded-xl border border-slate-700 transition-all"
              id="take-oa-test-hero-btn"
            >
              <Layers className="w-4 h-4" /> Take Screening Assessment (OA)
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company (Google, Amazon, TCS...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            id="company-search-input"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'all', label: 'All Companies' },
            { key: 'big-tech', label: 'Big Tech / FAANG' },
            { key: 'consulting-finance', label: 'Finance & Strategy' },
            { key: 'it-services', label: 'IT Services' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat.key
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id={`filter-btn-${cat.key}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Company Selector + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Company Quick-Selection List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Select Company ({filteredCompanies.length})
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCompanies.map((comp) => {
              const isSelected = comp.id === selectedCompanyId;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompanyId(comp.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                  id={`company-select-card-${comp.id}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-sm">
                      {comp.logoBadge}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{comp.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{comp.tagline}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Company Details Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                {selectedCompany.logoBadge}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{selectedCompany.name}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedCompany.difficulty === 'Very Hard' ? 'bg-red-100 text-red-700' :
                    selectedCompany.difficulty === 'Hard' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedCompany.difficulty}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{selectedCompany.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onStartInterview(selectedCompany.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                id="panel-start-interview-btn"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Mock Interview
              </button>
              <button
                onClick={() => onStartTest(selectedCompany.id)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                id="panel-start-test-btn"
              >
                <Layers className="w-3.5 h-3.5" /> Online Test (OA)
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Hiring Process Length</span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> {selectedCompany.avgTurnaroundWeeks}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Core Interview Style</span>
              <span className="font-bold text-slate-800 text-sm line-clamp-1 mt-0.5">
                {selectedCompany.interviewStyle.split(',')[0]}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block font-medium">Screening Rounds</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5">
                {selectedCompany.rounds.length} Detailed Stages
              </span>
            </div>
          </div>

          {/* Tab Navigation for Detailed Sections */}
          <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
            {[
              { key: 'rounds', label: 'Hiring Rounds & Process' },
              { key: 'pillars', label: 'Evaluation Pillars & Culture' },
              { key: 'salaries', label: 'Salary Benchmarks' },
              { key: 'questions', label: 'Top Questions & Model Answers' },
              { key: 'dosAndDonts', label: 'Dos & Don’ts' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2.5 px-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
                id={`tab-btn-${tab.key}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Rounds Breakdown */}
          {activeTab === 'rounds' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Official hiring funnel based on recent accepted candidate reports and recruiter calibration guidelines:
              </p>
              <div className="space-y-4">
                {selectedCompany.rounds.map((round) => (
                  <div
                    key={round.stageNumber}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-xs space-y-2.5"
                    id={`round-card-${round.stageNumber}`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {round.stageNumber}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{round.title}</h4>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {round.duration}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Pass Rate: {round.passRate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{round.description}</p>

                    <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                      <span className="font-bold text-slate-700 block">Evaluated On:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {round.evalCriteria.map((c, i) => (
                          <span key={i} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {round.sampleQuestions.length > 0 && (
                      <div className="text-xs space-y-1 pt-1">
                        <span className="font-semibold text-slate-700">Frequently Asked:</span>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                          {round.sampleQuestions.map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Hiring Pillars & Values */}
          {activeTab === 'pillars' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Core behavioral and technical dimensions candidates are scored against by interviewers and the hiring committee:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCompany.keyHiringPillars.map((pillar, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-sm">{pillar.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Salary Benchmarks */}
          {activeTab === 'salaries' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Compensation bands verified across engineering and consulting cadres (Base Salary + Equity/Bonus):
              </p>
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Level / Cadre</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Base Pay</th>
                      <th className="p-3">Total Compensation (TC)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedCompany.salaryBenchmark.map((sal, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{sal.level}</td>
                        <td className="p-3">{sal.role}</td>
                        <td className="p-3 text-slate-600">{sal.base}</td>
                        <td className="p-3 font-semibold text-emerald-700">{sal.totalCompensation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Top Questions & Answers */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Real questions asked in recent interview loops with ideal answer blueprints and critical metrics to hit:
              </p>
              <div className="space-y-4">
                {selectedCompany.topQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {q.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{q.question}</h4>
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 border border-slate-100">
                      <span className="font-bold text-slate-700 block">Recommended Answer Blueprint:</span>
                      <p className="text-slate-600 leading-relaxed">{q.idealAnswerOutline}</p>
                    </div>
                    <div className="text-xs text-indigo-700 font-medium bg-indigo-50/50 px-3 py-1.5 rounded-lg">
                      🎯 Key Metrics to Hit: {q.keyMetricsToHit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Dos and Don'ts */}
          {activeTab === 'dosAndDonts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Critical Dos
                </div>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {selectedCompany.dosAndDonts.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-3">
                <div className="flex items-center gap-2 font-bold text-red-800 text-sm">
                  <XCircle className="w-4 h-4 text-red-600" /> Dangerous Don'ts
                </div>
                <ul className="space-y-2 text-xs text-red-950">
                  {selectedCompany.dosAndDonts.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
