import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  Check, 
  Sparkles, 
  Cpu, 
  Code2, 
  Building2, 
  Layers, 
  Sliders, 
  X, 
  FileText,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { ProAIUnifiedProject, ArchitectureMaterialCalculation } from '../../types';
import { generateProAiPdf, openPrintableProjectReport, ReportExportScope } from '../../utils/proAiPdfExport';

interface DownloadReportModalProps {
  project: ProAIUnifiedProject;
  isOpen: boolean;
  onClose: () => void;
  initialScope?: ReportExportScope;
  customMaterials?: ArchitectureMaterialCalculation;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  project,
  isOpen,
  onClose,
  initialScope = 'full',
  customMaterials
}) => {
  const [selectedScope, setSelectedScope] = useState<ReportExportScope>(initialScope);
  const [includeCode, setIncludeCode] = useState<boolean>(true);
  const [includeAdvantages, setIncludeAdvantages] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    setIsDone(false);
    try {
      generateProAiPdf(project, {
        scope: selectedScope,
        includeCode,
        includeAdvantagesDisadvantages: includeAdvantages,
        customMaterials
      });
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3500);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenPrintPreview = () => {
    openPrintableProjectReport(project, selectedScope, customMaterials);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#070e24] border border-blue-500/40 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-[0_0_60px_rgba(59,130,246,0.3)] text-white space-y-5 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Export Branded PRO AI Engineering Report
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-blue-800">
                  PDF • ISO Format
                </span>
              </div>
              <p className="text-xs text-blue-300/80">
                Official multidisciplinary documentation ready for printing, submission, and archiving
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-900 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Project Target Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-blue-900/60 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Active Project
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {project.name}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            ID: PRO-{project.id.toUpperCase()}
          </span>
        </div>

        {/* 1. Select Export Scope */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-blue-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            1. Select Report Scope & Department Focus
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Unified Master */}
            <button
              type="button"
              onClick={() => setSelectedScope('full')}
              className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                selectedScope === 'full'
                  ? 'bg-blue-600/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/60 border-blue-950 hover:border-blue-800 text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                selectedScope === 'full' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-900 text-slate-400'
              }`}>
                <Layers className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">
                  Unified Master Dossier
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  All 3 Departments: ECE Circuit + CSE Code + Civil Material Measurement + Synergy
                </p>
              </div>
            </button>

            {/* ECE Circuit Design */}
            <button
              type="button"
              onClick={() => setSelectedScope('ece')}
              className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                selectedScope === 'ece'
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-950/60 border-blue-950 hover:border-blue-800 text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                selectedScope === 'ece' ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-900 text-slate-400'
              }`}>
                <Cpu className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">
                  ECE Circuit & Working Model
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Schematics, Hardware BOM, Operating Voltages, and Signal Pipeline
                </p>
              </div>
            </button>

            {/* CSE Code & Firmware */}
            <button
              type="button"
              onClick={() => setSelectedScope('cse')}
              className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                selectedScope === 'cse'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-950/60 border-blue-950 hover:border-blue-800 text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                selectedScope === 'cse' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-900 text-slate-400'
              }`}>
                <Code2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">
                  CSE Code & Firmware Studio
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  C++/Python/TS Source Code, Error Resolver Diff, and Language Rationale
                </p>
              </div>
            </button>

            {/* Architecture Materials */}
            <button
              type="button"
              onClick={() => setSelectedScope('architecture')}
              className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                selectedScope === 'architecture'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/60 border-blue-950 hover:border-blue-800 text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                selectedScope === 'architecture' ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-900 text-slate-400'
              }`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold block">
                  Architecture & Material BOQ
                </span>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Sand (Tons/M³), Cement Bags, Bricks Count, Curing Water & Cost Table
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Optional Section Inclusions */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-blue-200 uppercase tracking-wider font-mono">
            2. Report Inclusions & Formatting
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-blue-950 cursor-pointer hover:border-blue-800">
              <input
                type="checkbox"
                checked={includeCode}
                onChange={(e) => setIncludeCode(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-blue-700"
              />
              <span className="text-slate-300">Include Complete Source Code Snippets</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-blue-950 cursor-pointer hover:border-blue-800">
              <input
                type="checkbox"
                checked={includeAdvantages}
                onChange={(e) => setIncludeAdvantages(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-blue-700"
              />
              <span className="text-slate-300">Include Advantages & Disadvantages Matrix</span>
            </label>
          </div>
        </div>

        {/* Certification Badge Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-900/60 flex items-center gap-2.5 text-[11px] text-blue-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Generates standard A4 printable PDF with PRO AI watermarks, IEEE/ISO cross-discipline verification hashes, and high-resolution tables.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-blue-900/60">
          <button
            type="button"
            onClick={handleOpenPrintPreview}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-blue-800 text-blue-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print Preview / Save as PDF</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_25px_rgba(59,130,246,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer flex-1 sm:flex-none"
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Report Downloaded!</span>
                </>
              ) : isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-cyan-200" />
                  <span>Download Branded PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
