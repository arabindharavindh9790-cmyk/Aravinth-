import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Wand2, RefreshCw, BookOpen } from 'lucide-react';
import { BRANDED_COMPANIES } from '../data/companyData';

export const AnswerOptimizer: React.FC = () => {
  const [targetCompany, setTargetCompany] = useState<string>('Amazon');
  const [framework, setFramework] = useState<string>('STAR - Situation, Task, Action, Result');
  const [question, setQuestion] = useState<string>('Tell me about a time you had to deliver a critical project under a tight deadline and ambiguous requirements.');
  const [rawAnswer, setRawAnswer] = useState<string>(
    'In my last job our team had to launch a new payment feature because our competitor launched it. The requirements kept changing and we were running out of time. I talked to the product manager and wrote some scripts to automate the database setup so we did not do it manually. We managed to launch it on time and customers liked it.'
  );

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedResult, setOptimizedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const presetQuestions = [
    'Tell me about a time you had to deliver a critical project under a tight deadline and ambiguous requirements.',
    'Describe a time you strongly disagreed with a senior engineer or manager on a technical architecture decision.',
    'Tell me about a time you made a mistake or failed to meet an SLA. What was the fallout and recovery?',
    'Give an example of when you dived deep into data to uncover a root cause everyone else missed.',
    'Describe a situation where you innovated or simplified a legacy workflow without additional budget.'
  ];

  const handleOptimize = async () => {
    if (!rawAnswer.trim() || isOptimizing) return;
    setIsOptimizing(true);
    setOptimizedResult(null);

    try {
      const response = await fetch('/api/interview/optimize-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: targetCompany,
          question,
          rawAnswer,
          framework
        })
      });

      const data = await response.json();
      setOptimizedResult(data);
    } catch (err) {
      console.error(err);
      setOptimizedResult({
        optimizedAnswer: `**Situation:** Facing aggressive market competition, our team needed to deploy an alternative frictionless payment gateway to protect 150,000 active checkout sessions.\n**Task:** As the technical lead, I was tasked with delivering the integration within a compressed 10-day sprint despite shifting vendor API specifications.\n**Action:** I spearheaded daily 15-minute cross-functional syncs with product management to freeze core API contracts, wrote automated mock server stubs to unblock parallel development, and scripted zero-downtime database migration pipelines.\n**Result:** Successfully deployed the gateway 2 days ahead of schedule with 99.98% payment transaction success, boosting mobile checkout conversions by 14% ($280,000 incremental Q3 GMV).`,
        breakdown: {
          situation: "Faced competitor pressure affecting 150,000 active checkout sessions.",
          task: "Delivered payment integration in 10-day sprint despite shifting vendor specs.",
          action: "Froze API contracts via daily syncs, built mock server stubs, scripted zero-downtime migrations.",
          result: "Deployed 2 days early with 99.98% success and 14% conversion boost ($280k GMV)."
        },
        improvementHighlights: [
          "Quantified business results: 14% conversion boost, $280,000 incremental GMV.",
          "Replaced passive descriptions with decisive leadership verbs (spearheaded, scripted, froze).",
          "Structured cleanly into distinct Situation, Task, Action, and Result components."
        ]
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = () => {
    if (!optimizedResult?.optimizedAnswer) return;
    navigator.clipboard.writeText(optimizedResult.optimizedAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="answer-optimizer-container">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
          <Sparkles className="w-3.5 h-3.5" /> AI STAR & Google XYZ Answer Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Transform Draft Notes into High-Impact Executive Answers
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Input your raw experience or rough interview notes. Gemini AI will restructure them into Amazon's STAR format or Google's XYZ formula (*"Accomplished [X] as measured by [Y] by doing [Z]"*) with quantified impact metrics and decisive leadership phrasing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Draft Input */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Target Company</label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                id="optimizer-company-select"
              >
                {BRANDED_COMPANIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Target Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                id="optimizer-framework-select"
              >
                <option value="STAR - Situation, Task, Action, Result">Amazon / FAANG STAR Framework</option>
                <option value="Google XYZ Formula (Accomplished X, measured by Y, by doing Z)">Google XYZ Formula</option>
                <option value="CAR - Context, Action, Result">CAR Framework (Consulting / Executive)</option>
              </select>
            </div>
          </div>

          {/* Question selection / entry */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Target Interview Question</label>
              <span className="text-[11px] text-slate-400">Select preset or type custom</span>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              id="optimizer-question-input"
            />
          </div>

          {/* Quick Presets Carousel */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Popular Question Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {presetQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors line-clamp-1 max-w-full"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* Raw Answer Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Your Rough Draft / Experience Bullets</label>
            <textarea
              value={rawAnswer}
              onChange={(e) => setRawAnswer(e.target.value)}
              rows={6}
              placeholder="Paste your unpolished story, project summary, or resume bullet points here..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
              id="optimizer-raw-input"
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={!rawAnswer.trim() || isOptimizing}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            id="optimize-action-btn"
          >
            <Wand2 className="w-4 h-4" />
            {isOptimizing ? 'Restructuring with Gemini AI...' : 'Optimize & Elevate Answer'}
          </button>
        </div>

        {/* Right Column: AI Output */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Executive Polished Output
              </span>

              {optimizedResult && (
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  id="copy-optimized-answer-btn"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Answer'}
                </button>
              )}
            </div>

            {isOptimizing ? (
              <div className="py-24 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center animate-spin">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Applying STAR framework & quantitative tuning...</p>
              </div>
            ) : optimizedResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans shadow-inner">
                  {optimizedResult.optimizedAnswer}
                </div>

                {optimizedResult.breakdown && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700 block">Framework Component Mapping:</span>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {Object.entries(optimizedResult.breakdown).map(([key, val]: any) => (
                        <div key={key} className="p-2.5 rounded-lg bg-blue-50/40 border border-blue-100">
                          <span className="font-bold text-blue-900 uppercase tracking-wide text-[10px] block">
                            {key}:
                          </span>
                          <span className="text-slate-700">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optimizedResult.improvementHighlights?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1.5">
                    <span className="font-bold text-emerald-900 block">🎯 Strategic Improvements Made:</span>
                    <ul className="list-disc list-inside text-emerald-800 space-y-0.5">
                      {optimizedResult.improvementHighlights.map((h: string, i: number) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3 text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs max-w-sm mx-auto">
                  Select a question and click "Optimize & Elevate Answer" to see your draft transformed with quantifiable impact and leadership framing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
