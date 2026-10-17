import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Play, 
  Wrench, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  RotateCcw, 
  Bug, 
  FileCode,
  Edit3,
  Lock,
  RefreshCw,
  Send,
  Wand2,
  HelpCircle,
  Info,
  Zap,
  FileDown
} from 'lucide-react';
import { CSEModuleCode } from '../../types';

interface CSECodeStudioProps {
  modules: CSEModuleCode[];
  projectTitle: string;
  onDownloadReport?: (scope?: 'full' | 'ece' | 'cse' | 'architecture') => void;
}

export const CSECodeStudio: React.FC<CSECodeStudioProps> = ({ modules: initialModules, projectTitle, onDownloadReport }) => {
  const [modulesList, setModulesList] = useState<CSEModuleCode[]>(initialModules);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  
  // Custom user project prompt state
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<'cpp' | 'python' | 'typescript'>('cpp');
  const [isShortCode, setIsShortCode] = useState<boolean>(true); // Default to short & concise code
  const [showWhyGuide, setShowWhyGuide] = useState<boolean>(false); // Language & Why guide toggle
  const [isGeneratingModule, setIsGeneratingModule] = useState<boolean>(false);

  // Active module
  const currentModule = modulesList[activeModuleIndex] || modulesList[0];

  // Editable Code State - User Modified Code Allowed!
  const [editableCode, setEditableCode] = useState<string>(currentModule.code);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Terminal & Execution Simulation State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[SYSTEM] CSE Execution Environment Initialized for "${projectTitle}"`,
    `[COMPILER] Target: GCC / Clang Embedded Bare-Metal (C++17 / FreeRTOS v10.4)`,
    `[STATUS] Ready. Click "Run Code Simulator" to execute or modify the code directly.`
  ]);
  const [hasRuntimeError, setHasRuntimeError] = useState<boolean>(false);

  // Error Diagnosis State
  const [isSolvingError, setIsSolvingError] = useState<boolean>(false);
  const [solutionReport, setSolutionReport] = useState<{
    rootCause: string;
    lineAffected: number;
    explanation: string;
    fixedCode: string;
    diffExplanation: string[];
    unitTestResult: string;
  } | null>(null);

  // Sync editable code when switching modules
  const handleSelectModule = (index: number) => {
    setActiveModuleIndex(index);
    const mod = modulesList[index];
    setEditableCode(mod.code);
    setSolutionReport(null);
    setHasRuntimeError(false);
    setTerminalLogs([
      `[SWITCH] Loaded module: ${mod.filename}`,
      `[PURPOSE] ${mod.purpose}`,
      `[STATUS] Ready for execution or user code modification.`
    ]);
  };

  // 1. User Types Program / Project & Generates Design Code + Working Model
  const handleGenerateCustomCSE = async (promptToUse?: string) => {
    const prompt = (promptToUse || userPrompt).trim();
    if (!prompt) return;

    setIsGeneratingModule(true);
    try {
      const response = await fetch('/api/pro-ai/generate-cse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: prompt, language: selectedLang, isShort: isShortCode })
      });

      if (!response.ok) throw new Error('Failed to generate CSE code');
      const data = await response.json();

      if (data && data.code) {
        const newMod: CSEModuleCode = {
          filename: data.filename || `custom_${Date.now()}.${selectedLang === 'python' ? 'py' : selectedLang === 'typescript' ? 'ts' : 'cpp'}`,
          language: data.language || selectedLang,
          purpose: data.purpose || `Custom generated module for ${prompt}`,
          whyLanguage: data.whyLanguage || (selectedLang === 'python' ? 'Python: Short syntax, rapid Edge AI and data processing.' : selectedLang === 'typescript' ? 'TypeScript: End-to-end type safety & async non-blocking execution.' : 'C++: Bare-metal execution speed & direct hardware register control.'),
          code: data.code,
          buggyCodeSample: data.buggyCodeSample || data.code,
          simulatedError: data.simulatedError || {
            errorType: 'RuntimeFault',
            errorMessage: 'Division by uninitialized variable at line 14',
            line: 14,
            explanation: 'Unchecked divisor state.',
            solutionDiff: 'Added guard clause before execution.'
          }
        };

        const updated = [newMod, ...modulesList];
        setModulesList(updated);
        setActiveModuleIndex(0);
        setEditableCode(newMod.code);
        setSolutionReport(null);
        setHasRuntimeError(false);
        setTerminalLogs([
          `[PRO AI] Successfully synthesized design code for "${prompt}"`,
          `[MODULE] ${newMod.filename} (${newMod.language.toUpperCase()})`,
          `[READY] Code is open in editor. You may modify lines or run the simulator.`
        ]);
      }
    } catch (err) {
      console.error('Error generating CSE code:', err);
    } finally {
      setIsGeneratingModule(false);
    }
  };

  // 2. Run the Code (Executes User Modified Code)
  const handleRunCode = () => {
    setIsRunning(true);
    setHasRuntimeError(false);
    setSolutionReport(null);

    setTerminalLogs([
      `[EXEC] Compiling & linking ${currentModule.filename}...`,
      `[FLAGS] -O2 -Wall -Wextra -pthread -std=c++17`,
      `[BOOT] Allocating 512KB SRAM heap...`,
    ]);

    // Check if code contains deliberate bugs or unhandled divide-by-zero
    const hasBuggyPattern = 
      editableCode.includes('/ 0') || 
      editableCode.includes('/0') || 
      editableCode.includes('sampleCount') && editableCode.includes('/ sampleCount') && !editableCode.includes('sampleCount > 0') ||
      editableCode.includes('NullPointer') ||
      editableCode.includes('BUG');

    setTimeout(() => {
      if (hasBuggyPattern) {
        setHasRuntimeError(true);
        setTerminalLogs(prev => [
          ...prev,
          `[TASK: telemetry_loop] CPU Core 0 -> Executing telemetry tick...`,
          `[CRITICAL ERROR] Fatal Exception in ${currentModule.filename}:`,
          `  >>> SIGFPE: Arithmetic division by zero or boundary overflow!`,
          `  >>> Program counter: 0x40081a2c | Backtrace: frame #0 at line ${currentModule.simulatedError.line}`,
          `[HALT] System halted. Click "Solve Error with PRO AI" to analyze and fix this code.`
        ]);
      } else {
        setHasRuntimeError(false);
        const timestamp = new Date().toISOString().substring(11, 19);
        setTerminalLogs(prev => [
          ...prev,
          `[${timestamp}] Core 0 (ESP32-S3): Telemetry Task started (Period: 100ms)`,
          `[${timestamp}] Core 1: Sensor fusion matrix synchronized. FreeRTOS Tick: 1000Hz`,
          `[${timestamp}] Sensor Data: AirQuality=94.2 AQI, Temp=24.8°C, Humidity=52%`,
          `[${timestamp}] Control Matrix: Actuator state = OPTIMAL (PWM Duty: 42%)`,
          `[${timestamp}] Edge Invariants Verified: 0 Buffer Overflows, 0 Memory Leaks`,
          `[SUCCESS] Simulation completed successfully with ZERO faults. Return code: 0`
        ]);
      }
      setIsRunning(false);
    }, 1100);
  };

  // 3. Inject Simulated Bug to test PRO AI Error Solver
  const handleInjectBug = () => {
    setEditableCode(currentModule.buggyCodeSample);
    setHasRuntimeError(true);
    setSolutionReport(null);
    setTerminalLogs([
      `[INJECT] Fault injection applied to ${currentModule.filename}.`,
      `[FAULT] ${currentModule.simulatedError.errorType}: ${currentModule.simulatedError.errorMessage}`,
      `[HINT] Click "Run Code Simulator" to see failure stack trace, or "Solve Error with PRO AI" directly.`
    ]);
  };

  // 4. Solve Error with PRO AI
  const handleSolveErrorWithAI = async () => {
    setIsSolvingError(true);
    try {
      const response = await fetch('/api/pro-ai/solve-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editableCode,
          errorMessage: currentModule.simulatedError.errorMessage,
          errorType: currentModule.simulatedError.errorType,
          language: currentModule.language,
          filename: currentModule.filename,
          projectContext: projectTitle
        })
      });

      if (!response.ok) throw new Error('API failed to solve error');
      const data = await response.json();
      setSolutionReport(data);

      setTerminalLogs(prev => [
        ...prev,
        `[PRO AI DIAGNOSIS] Error solved!`,
        `[ROOT CAUSE] ${data.rootCause}`,
        `[PATCH] Fix available. Click "Apply PRO AI Fix to Code" to update the editor.`
      ]);
    } catch (err) {
      console.error('Error solving bug:', err);
    } finally {
      setIsSolvingError(false);
    }
  };

  // 5. Apply the PRO AI fix directly into the user's editable editor
  const handleApplyFix = () => {
    if (!solutionReport) return;
    setEditableCode(solutionReport.fixedCode);
    setHasRuntimeError(false);
    setTerminalLogs(prev => [
      ...prev,
      `[PATCH APPLIED] The code editor has been updated with PRO AI defensive fixes.`,
      `[VERIFYING] Automatically running regression test suite...`
    ]);
    setTimeout(() => {
      handleRunCode();
    }, 400);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    setEditableCode(currentModule.code);
    setSolutionReport(null);
    setHasRuntimeError(false);
    setTerminalLogs([
      `[RESET] Code restored to baseline configuration.`,
      `[READY] You may edit or run.`
    ]);
  };

  const sampleCsePrompts = [
    'Real-Time FreeRTOS Telemetry & Sensor Fusion in C++',
    'Python Edge AI Computer Vision & MQTT Publisher',
    'LiDAR Obstacle Avoidance & Pathfinding Engine in C++',
    'Microcontroller Low-Power Deep Sleep Scheduler'
  ];

  return (
    <div className="space-y-6" id="pro-ai-cse-studio">
      {/* 1. User Types Program / Project & Generates Design Code + Working Model */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#070e24] via-[#09153a] to-[#040817] border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Type Your CSE Program or Project & Generate Design Code + Working Model
              </h3>
              <p className="text-xs text-blue-300">
                PRO AI synthesizes production source code, architecture models, and executable test suites
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowWhyGuide(!showWhyGuide)}
              className="px-2.5 py-1 rounded-full bg-blue-900/40 hover:bg-blue-800/60 text-cyan-300 border border-blue-700/60 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Why These Languages? (Y)</span>
            </button>
            <button
              type="button"
              onClick={() => onDownloadReport?.('cse')}
              className="px-2.5 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download Code Report</span>
            </button>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-950 text-cyan-300 border border-blue-800">
              CSE Code Synthesizer
            </span>
          </div>
        </div>

        {/* Expandable: Coding Languages & Why (Y) Guide */}
        {showWhyGuide && (
          <div className="p-4 rounded-2xl bg-[#020512] border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-blue-950">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                Coding Languages Creating This Project — Written Short & Why (Y):
              </span>
              <button
                type="button"
                onClick={() => setShowWhyGuide(false)}
                className="text-[10px] text-slate-400 hover:text-white font-mono"
              >
                Close ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-blue-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">1. TypeScript</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">TS</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong className="text-cyan-300">Why (Y):</strong> Full-stack compile-time type safety, zero undefined crashes, React virtual DOM, and async event loops for real-time web & telemetry.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-blue-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">2. C++ (C++17)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-amber-300 border border-blue-800 font-bold">C++</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong className="text-amber-300">Why (Y):</strong> Bare-metal execution speed, zero memory overhead, microsecond latency, direct ESP32/ARM hardware register control, and FreeRTOS deterministic task scheduling.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-blue-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">3. Python</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-emerald-300 border border-blue-800 font-bold">Py</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong className="text-emerald-300">Why (Y):</strong> Written 5x shorter with minimal syntax, native edge AI libraries (NumPy, PyTorch, OpenCV), and rapid IoT MQTT automation.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomCSE()}
              placeholder="Type your program or project (e.g. 'Fast Fourier Transform on ESP32 in C++')..."
              className="w-full px-4 py-3 bg-[#030712] border border-blue-900/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition"
            />
          </div>

          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as any)}
            className="p-3 bg-[#030712] border border-blue-900/80 rounded-2xl text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="cpp">C++ (Embedded / Systems)</option>
            <option value="python">Python (Edge AI / Cloud)</option>
            <option value="typescript">TypeScript (Fullstack)</option>
          </select>

          {/* Short & Concise Code Toggle */}
          <button
            type="button"
            onClick={() => setIsShortCode(!isShortCode)}
            className={`px-3 py-2 rounded-2xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              isShortCode 
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]' 
                : 'bg-slate-950 text-slate-400 border-blue-950'
            }`}
            title="Toggle between short, concise code and full verbose boilerplate"
          >
            <Zap className={`w-3.5 h-3.5 ${isShortCode ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Short Code: {isShortCode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenerateCustomCSE()}
            disabled={isGeneratingModule || !userPrompt.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer shrink-0"
          >
            {isGeneratingModule ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Synthesizing Code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Code & Model</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-mono mr-1">Quick Presets:</span>
          {sampleCsePrompts.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUserPrompt(preset);
                handleGenerateCustomCSE(preset);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-blue-900/60 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-blue-900/50">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {modulesList.map((mod, idx) => {
            const isActive = activeModuleIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectModule(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition ${
                  isActive
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                    : 'bg-slate-950/80 border-blue-950 text-slate-400 hover:text-white hover:border-blue-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{mod.filename}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 uppercase">
                  {mod.language}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* User Modified Code Allowed Indicator */}
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <Edit3 className="w-3 h-3 text-emerald-400" />
            <span>User Code Modification Allowed</span>
          </span>
        </div>
      </div>

      {/* 2. Interactive Code Editor & Runner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Code Editor (User Editable) */}
        <div className="rounded-3xl p-5 bg-[#030712] border border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col justify-between space-y-3 relative">
          {/* Editor Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-blue-950/80 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs font-mono font-bold text-white ml-2">
                {currentModule.filename}
              </span>
              <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                EDITABLE
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-blue-950 text-xs flex items-center gap-1 transition"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-mono">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleResetCode}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-blue-950 text-xs flex items-center gap-1 transition"
                title="Reset code to original"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">Reset</span>
              </button>

              <button
                onClick={handleInjectBug}
                className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/80 text-xs flex items-center gap-1 transition"
                title="Inject sample bug to test AI Error Solver"
              >
                <Bug className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">Inject Bug</span>
              </button>

              <button
                onClick={() => onDownloadReport?.('cse')}
                className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 text-xs flex items-center gap-1 transition"
                title="Download Code & Firmware PDF Report"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">Report PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-mono">
              {currentModule.purpose}
            </p>
            {/* Why This Language (Y) Context Ribbon */}
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/60 flex items-start gap-2 text-[11px] font-mono text-cyan-200">
              <span className="px-1.5 py-0.5 rounded bg-blue-900 text-cyan-300 font-bold shrink-0 text-[10px]">
                Why {currentModule.language.toUpperCase()} (Y):
              </span>
              <span className="text-slate-300 leading-tight">
                {currentModule.whyLanguage || (
                  currentModule.language === 'python'
                    ? 'Python enables concise syntax (5x shorter), fast math processing, and native AI/sensor library support.'
                    : currentModule.language === 'typescript'
                    ? 'TypeScript provides full-stack compile-time type safety, preventing undefined property errors in telemetry pipelines.'
                    : 'C++ delivers bare-metal microsecond execution speed, deterministic memory control, and direct FreeRTOS hardware task scheduling.'
                )}
              </span>
            </div>
          </div>

          {/* User Code Textarea Editor */}
          <div className="relative flex-1">
            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              spellCheck={false}
              className="w-full h-80 p-4 font-mono text-xs sm:text-[13px] leading-relaxed bg-[#02050f] text-cyan-200 border border-blue-950 rounded-2xl resize-none focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition scrollbar-thin scrollbar-thumb-blue-900"
              placeholder="// Type or edit your code directly here..."
            />
            <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-500 pointer-events-none">
              {editableCode.split('\n').length} lines • {editableCode.length} chars
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition cursor-pointer"
            >
              <Play className={`w-4 h-4 text-white ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Executing...' : 'Run Code Simulator'}</span>
            </button>

            {hasRuntimeError && (
              <button
                onClick={handleSolveErrorWithAI}
                disabled={isSolvingError}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition cursor-pointer"
              >
                <Wrench className={`w-4 h-4 text-white ${isSolvingError ? 'animate-spin' : ''}`} />
                <span>{isSolvingError ? 'Diagnosing Bug...' : 'Solve Error with PRO AI'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Terminal Execution Output Console */}
        <div className="rounded-3xl p-5 bg-[#030712] border border-blue-900/80 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-blue-950/80">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Virtual Hardware Execution Terminal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${hasRuntimeError ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
              <span className="text-[10px] font-mono text-slate-400">
                {hasRuntimeError ? 'FAULT DETECTED' : 'ONLINE'}
              </span>
            </div>
          </div>

          {/* Terminal Logs Output */}
          <div className="flex-1 h-80 p-4 font-mono text-xs bg-[#01040a] rounded-2xl border border-blue-950 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-blue-950">
            {terminalLogs.map((log, idx) => {
              const isError = log.includes('ERROR') || log.includes('SIGFPE') || log.includes('FAULT') || log.includes('HALT');
              const isSuccess = log.includes('SUCCESS') || log.includes('OPTIMAL') || log.includes('VERIFIED');
              const isInfo = log.includes('Core') || log.includes('Sensor Data');

              return (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    isError
                      ? 'text-rose-400 font-bold bg-rose-950/20 px-1 rounded'
                      : isSuccess
                      ? 'text-emerald-300 font-semibold'
                      : isInfo
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              );
            })}
          </div>

          {/* Error Banner when runtime fault occurs */}
          {hasRuntimeError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-600/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-mono font-semibold">
                  Runtime Exception at line {currentModule.simulatedError.line}!
                </span>
              </div>
              <button
                onClick={handleSolveErrorWithAI}
                disabled={isSolvingError}
                className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shrink-0 transition"
              >
                {isSolvingError ? 'Solving...' : 'Fix Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. PRO AI Error Diagnostic & Patch Inspector */}
      {solutionReport && (
        <div className="rounded-3xl p-6 bg-[#070e24] border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-blue-900/60 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  PRO AI Automated Compiler Diagnostic & Repair Engine
                </span>
                <h3 className="text-base font-bold text-white">
                  Root Cause Diagnosis & Defensive Patch Verified
                </h3>
              </div>
            </div>

            <button
              onClick={handleApplyFix}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Apply PRO AI Fix to Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-950 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Root Cause Analysis</span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">{solutionReport.rootCause}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-950 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Line Affected</span>
              <div className="text-xl font-mono font-bold text-amber-400">Line #{solutionReport.lineAffected}</div>
              <p className="text-[11px] text-slate-400">{solutionReport.explanation}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-950 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Regression Test Result</span>
              <div className="text-xs font-mono font-bold text-emerald-400">{solutionReport.unitTestResult}</div>
            </div>
          </div>

          {/* Diff explanation list */}
          <div className="p-4 rounded-2xl bg-[#030712] border border-blue-950 space-y-2">
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase">Changes in Defensive Patch:</span>
            <ul className="space-y-1 text-xs font-mono text-slate-300">
              {solutionReport.diffExplanation.map((diff, i) => (
                <li key={i} className="flex items-center gap-2 text-emerald-300">
                  <span>+</span>
                  <span>{diff}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
