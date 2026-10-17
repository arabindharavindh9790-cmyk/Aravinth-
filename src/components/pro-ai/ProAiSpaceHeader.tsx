import React, { useState } from 'react';
import { 
  Sparkles, 
  Orbit, 
  Cpu, 
  Code2, 
  Building2, 
  Layers, 
  Wand2, 
  RefreshCw, 
  CheckCircle2,
  Sliders,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { ProAIUnifiedProject } from '../../types';
import { PRO_AI_PROJECTS } from '../../data/proAiProjects';

interface ProAiSpaceHeaderProps {
  currentProject: ProAIUnifiedProject;
  onSelectProject: (project: ProAIUnifiedProject) => void;
  onGenerateNewProject: (prompt: string, focusArea: string) => Promise<void>;
  isGenerating: boolean;
  activeDeptTab: 'all' | 'ece' | 'cse' | 'architecture';
  setActiveDeptTab: (tab: 'all' | 'ece' | 'cse' | 'architecture') => void;
  onOpenDownloadReport?: (scope?: 'full' | 'ece' | 'cse' | 'architecture') => void;
}

export const ProAiSpaceHeader: React.FC<ProAiSpaceHeaderProps> = ({
  currentProject,
  onSelectProject,
  onGenerateNewProject,
  isGenerating,
  activeDeptTab,
  setActiveDeptTab,
  onOpenDownloadReport,
}) => {
  const [showGenModal, setShowGenModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [focusArea, setFocusArea] = useState('Smart Cities & Resilient Infrastructure');

  const presetPrompts = [
    'Autonomous Desert Eco-Dome with Solar Tracking, Edge Water Harvesting, and Sand-Stabilized Adobe Blocks',
    'Smart Hospital Kinetic Isolation Ward with Negative Pressure Sensor Relays and Vibration-Damped Foundations',
    'Coastal Cyclone-Proof IoT Marine Research Facility with Saltwater Corrosion Telemetry and Concrete Sea Walls'
  ];

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    await onGenerateNewProject(customPrompt, focusArea);
    setShowGenModal(false);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.18)] bg-[#030712] text-white">
      {/* Space Celestial Background with Starlight Dust & Radial Nebula Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 space-y-6">
        {/* Top Badges & Generator CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-semibold border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Orbit className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
              PRO AI • SPACE LAB
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              ECE • CSE • ARCHITECTURE
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Project Selector Dropdown */}
            <div className="relative">
              <select
                value={currentProject.id}
                onChange={(e) => {
                  const match = PRO_AI_PROJECTS.find(p => p.id === e.target.value);
                  if (match) onSelectProject(match);
                }}
                className="appearance-none bg-slate-900/90 hover:bg-slate-850 text-blue-200 border border-blue-500/40 px-3.5 py-1.5 pr-8 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer transition shadow-inner"
              >
                {PRO_AI_PROJECTS.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-950 text-white">
                    {p.name.split(':')[0]}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-blue-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Download Report Button */}
            <button
              onClick={() => onOpenDownloadReport?.(activeDeptTab === 'all' ? 'full' : activeDeptTab)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-200" />
              <span>Download Report</span>
            </button>

            {/* Prompt Generator Button */}
            <button
              onClick={() => setShowGenModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold border border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>Prompt PRO AI</span>
            </button>
          </div>
        </div>

        {/* Project Name & Multidisciplinary Abstract */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center p-0.5 shadow-lg shadow-blue-600/30 shrink-0 mt-1">
              <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400">
                {currentProject.name}
              </h1>
              <p className="text-xs sm:text-sm text-blue-300/90 font-medium mt-1">
                {currentProject.tagline}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300/90 max-w-4xl leading-relaxed">
            {currentProject.visionAbstract}
          </p>
        </div>

        {/* Tri-Department Interactive Filter Navigation */}
        <div className="pt-2 border-t border-blue-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950/80 border border-blue-900/60 backdrop-blur-md">
            <button
              onClick={() => setActiveDeptTab('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeDeptTab === 'all'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Unified Blueprint
            </button>

            <button
              onClick={() => setActiveDeptTab('ece')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeDeptTab === 'ece'
                  ? 'bg-gradient-to-r from-amber-500 to-blue-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              ECE Circuit & Working Design
            </button>

            <button
              onClick={() => setActiveDeptTab('cse')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeDeptTab === 'cse'
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              CSE Code & Error Solver
            </button>

            <button
              onClick={() => setActiveDeptTab('architecture')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeDeptTab === 'architecture'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              ARCHITECTURE & Materials
            </button>
          </div>

          <div className="text-[11px] font-mono text-blue-400/80 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            TELEMETRY: STABLE • 3 DEPARTMENTS SYNCED
          </div>
        </div>
      </div>

      {/* PRO AI Generator Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#070e24] border border-blue-500/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-[0_0_60px_rgba(59,130,246,0.3)] text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">PRO AI Multidisciplinary Engine</h3>
                  <p className="text-[11px] text-blue-300">Generate ECE + CSE + ARCHITECTURE Project from scratch</p>
                </div>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-200">Engineering Concept or Project Vision</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Smart earthquake-resistant coastal habitat with wave energy sensors, edge anomaly detection code, and saline-resistant concrete sand/cement ratios..."
                  rows={3}
                  className="w-full p-3 bg-slate-950/80 border border-blue-900 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-blue-200">Domain Focus & Constraints</label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-blue-900 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="Smart Cities & Resilient Infrastructure">Smart Cities & Resilient Infrastructure</option>
                  <option value="Zero-Energy Bioclimatic Habitats">Zero-Energy Bioclimatic Habitats</option>
                  <option value="Industrial IoT Automation & Structural Facilities">Industrial IoT Automation & Structural Facilities</option>
                  <option value="Autonomous Space Colony & Extreme Climate Shelters">Autonomous Space Colony & Extreme Climate Shelters</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Prompt Presets:</span>
                <div className="space-y-1.5">
                  {presetPrompts.map((p, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCustomPrompt(p)}
                      className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-900/70 hover:bg-slate-850 text-blue-200 border border-blue-950 hover:border-blue-700 transition line-clamp-1"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !customPrompt.trim()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Synthesizing with PRO AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Project Design
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
