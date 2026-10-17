import React from 'react';
import { 
  Layers, 
  Cpu, 
  Code2, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp,
  AlertTriangle,
  Compass,
  FileDown
} from 'lucide-react';
import { ProAIUnifiedProject } from '../../types';

interface ProjectOverviewTabProps {
  project: ProAIUnifiedProject;
  onNavigateToDept: (dept: 'ece' | 'cse' | 'architecture') => void;
  onDownloadReport?: (scope?: 'full' | 'ece' | 'cse' | 'architecture') => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  onNavigateToDept,
  onDownloadReport,
}) => {
  return (
    <div className="space-y-6" id="pro-ai-overview-tab">
      {/* 1. Multidisciplinary Domain Synergy Map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ECE Card */}
        <div 
          onClick={() => onNavigateToDept('ece')}
          className="group relative rounded-2xl p-5 bg-gradient-to-b from-[#0a1226] to-[#040817] border border-blue-500/30 hover:border-amber-400/60 transition-all duration-300 shadow-[0_0_25px_rgba(30,58,138,0.15)] cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> ECE DEPARTMENT
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
                Explore Circuit →
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
              Circuit & Working Design
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {project.domainSynergy.eceRole}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-blue-900/40 flex items-center justify-between text-[11px] text-amber-400/90 font-mono">
            <span>Sensors & Microcontrollers</span>
            <span>Active I/O</span>
          </div>
        </div>

        {/* CSE Card */}
        <div 
          onClick={() => onNavigateToDept('cse')}
          className="group relative rounded-2xl p-5 bg-gradient-to-b from-[#0a1226] to-[#040817] border border-blue-500/30 hover:border-emerald-400/60 transition-all duration-300 shadow-[0_0_25px_rgba(30,58,138,0.15)] cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Code2 className="w-3 h-3" /> CSE DEPARTMENT
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                Run Code & Fix Error →
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
              Firmware & AI Error Solver
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {project.domainSynergy.cseRole}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-blue-900/40 flex items-center justify-between text-[11px] text-emerald-400/90 font-mono">
            <span>C++ / Python TinyML</span>
            <span>Self-Healing Engine</span>
          </div>
        </div>

        {/* ARCHITECTURE Card */}
        <div 
          onClick={() => onNavigateToDept('architecture')}
          className="group relative rounded-2xl p-5 bg-gradient-to-b from-[#0a1226] to-[#040817] border border-blue-500/30 hover:border-cyan-400/60 transition-all duration-300 shadow-[0_0_25px_rgba(30,58,138,0.15)] cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> ARCHITECTURE
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                Calculate Materials →
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
              Zoning & Material Measurement
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {project.domainSynergy.archRole}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-blue-900/40 flex items-center justify-between text-[11px] text-cyan-400/90 font-mono">
            <span>Sand • Cement • Bricks</span>
            <span>Bioclimatic Shell</span>
          </div>
        </div>
      </div>

      {/* Unified Value Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-950 to-blue-950/80 border border-blue-500/40 text-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-300 block">
              Tri-Department Engineering Unified Impact
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {project.domainSynergy.unifiedValue}
            </p>
          </div>
        </div>

        <button
          onClick={() => onDownloadReport?.('full')}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-emerald-400/40 transition cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-cyan-200" />
          <span>Download Master Report</span>
        </button>
      </div>

      {/* 2. System Design Blueprint */}
      <div className="rounded-3xl p-6 bg-[#070e24] border border-blue-500/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              System Design Blueprint & Cross-Disciplinary Architecture
            </h3>
          </div>
          <span className="text-[11px] font-mono text-blue-300 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
            Cyber-Physical Integration
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {project.systemDesignBlueprint.overallArchitecture}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {project.systemDesignBlueprint.subsystems.map((sub, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-blue-900/60 hover:border-blue-500/40 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  sub.dept === 'ECE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  sub.dept === 'CSE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {sub.dept}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Subsystem 0{idx + 1}</span>
              </div>
              <h4 className="text-xs font-bold text-white">{sub.name}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{sub.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Deep Advantages & Disadvantages Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Advantages Column */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-[#040f1a] border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-emerald-900/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Project Advantages & Technical Breakthroughs
            </h3>
          </div>

          <div className="space-y-3">
            {project.advantages.map((adv, i) => {
              const [heading, ...rest] = adv.split(':');
              return (
                <div key={i} className="flex items-start gap-3 text-xs leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="text-slate-300">
                    <strong className="text-emerald-300 block font-semibold">{heading}:</strong>
                    <span>{rest.join(':')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disadvantages Column */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-[#120713] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-amber-900/40">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Disadvantages, Trade-Offs & Mitigation
            </h3>
          </div>

          <div className="space-y-3">
            {project.disadvantages.map((dis, i) => {
              const [heading, ...rest] = dis.split(':');
              return (
                <div key={i} className="flex items-start gap-3 text-xs leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    !
                  </span>
                  <div className="text-slate-300">
                    <strong className="text-amber-300 block font-semibold">{heading}:</strong>
                    <span>{rest.join(':')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Future Upgrades & Roadmap */}
      {project.futureUpgrades?.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-blue-900/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 uppercase tracking-wider font-bold">
            <Compass className="w-4 h-4" /> Next Horizon Architectural & Silicon Upgrades
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {project.futureUpgrades.map((upg, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-blue-950 text-xs text-slate-300 flex items-start gap-2">
                <span className="text-blue-400 font-bold">→</span>
                <span>{upg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Complete Engineering Dossier Export Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#070e24] via-[#0a1738] to-[#040817] border border-blue-500/40 shadow-[0_0_35px_rgba(59,130,246,0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
            <FileDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">
                Download Complete PRO AI Engineering Dossier
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Official PDF
              </span>
            </div>
            <p className="text-xs text-blue-200/80 mt-0.5">
              Includes full ECE circuit diagrams & BOM, CSE firmware code & bug fixes, and Architecture civil material measurements (Sand, Cement, Bricks, Water).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => onDownloadReport?.('full')}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-cyan-100" />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
