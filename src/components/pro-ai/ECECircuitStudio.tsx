import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Activity, 
  Radio, 
  Wifi, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Info,
  CheckCircle2,
  Share2,
  Sparkles,
  RefreshCw,
  Send,
  Wand2,
  FileDown
} from 'lucide-react';
import { ECECircuitDesign, ECECircuitNode, ECEComponent } from '../../types';

interface ECECircuitStudioProps {
  ece: ECECircuitDesign;
  onUpdateDesign?: (newEce: ECECircuitDesign) => void;
  onDownloadReport?: (scope?: 'full' | 'ece' | 'cse' | 'architecture') => void;
}

export const ECECircuitStudio: React.FC<ECECircuitStudioProps> = ({ ece: initialEce, onUpdateDesign, onDownloadReport }) => {
  const [currentEce, setCurrentEce] = useState<ECECircuitDesign>(initialEce);
  const [typedPrompt, setTypedPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    initialEce.nodes[1]?.id || initialEce.nodes[0]?.id || ''
  );
  const [activeSignalStep, setActiveSignalStep] = useState<number | null>(null);

  const selectedNode = currentEce.nodes.find(n => n.id === selectedNodeId) || currentEce.nodes[0];

  const handleGenerateCustomECE = async (promptToUse?: string) => {
    const prompt = (promptToUse || typedPrompt).trim();
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/pro-ai/generate-ece', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt: prompt })
      });

      if (!response.ok) throw new Error('Failed to generate circuit');
      const data = await response.json();

      if (data && data.title) {
        setCurrentEce(data);
        if (data.nodes && data.nodes.length > 0) {
          setSelectedNodeId(data.nodes[0].id);
        }
        if (onUpdateDesign) {
          onUpdateDesign(data);
        }
      }
    } catch (err) {
      console.error('Error generating ECE design:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleEceIdeas = [
    'Smart Solar MPPT Microinverter & BMS Circuit',
    'Drone Autonomous Collision-Avoidance Radar',
    'Wearable Low-Power ECG Biometric IoT Node',
    'Industrial LoRa 4-Channel Solenoid Actuator'
  ];

  const getNodeBadgeColor = (type: ECECircuitNode['type']) => {
    switch (type) {
      case 'mcu': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'sensor': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'actuator': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'power': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'network': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6" id="pro-ai-ece-studio">
      {/* User Input Section: Type Any Project & Generate Circuit Design & Working Model */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#070e24] via-[#09153a] to-[#040817] border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Type Your ECE Project & Generate Circuit Design + Working Model
              </h3>
              <p className="text-xs text-blue-300">
                PRO AI synthesizes component schematics, signal paths, voltage rails, and working principles
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-950 text-cyan-300 border border-blue-800">
            ECE AI Synthesizer
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={typedPrompt}
              onChange={(e) => setTypedPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomECE()}
              placeholder="Type your ECE project (e.g. 'LoRa IoT Water Quality Sensor with Solar LiFePO4 BMS')..."
              className="w-full px-4 py-3 bg-[#030712] border border-blue-900/80 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition"
            />
          </div>
          <button
            type="button"
            onClick={() => handleGenerateCustomECE()}
            disabled={isGenerating || !typedPrompt.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Designing Circuit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Circuit & Model</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-slate-400 font-mono mr-1">Quick Presets:</span>
          {sampleEceIdeas.map((idea, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTypedPrompt(idea);
                handleGenerateCustomECE(idea);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-blue-900/60 text-slate-300 hover:text-cyan-300 text-[11px] font-mono transition cursor-pointer"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Title & Specs Banner */}
      <div className="rounded-3xl p-6 bg-[#070e24] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-900/50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase">
                ECE Module • Hardware & Circuit Engineering
              </span>
              <h2 className="text-xl font-bold text-white">{currentEce.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-blue-900 text-blue-300">
              ⚡ {currentEce.voltageAndPowerSpecs.operatingVoltage}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-blue-900 text-amber-300">
              🔋 {currentEce.voltageAndPowerSpecs.backupSource}
            </div>
            <button
              type="button"
              onClick={() => onDownloadReport?.('ece')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-300" />
              <span>Download Circuit Report</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentEce.summary}
        </p>
      </div>

      {/* Interactive Circuit Schematic Visualizer & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schematic Canvas */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-[#030712] border border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col justify-between relative overflow-hidden min-h-[420px]">
          {/* Subtle circuit grid background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Canvas Header */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-blue-950">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Interactive Circuit Schematic Canvas
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Click nodes to inspect electrical pinouts & routing
            </span>
          </div>

          {/* Node Schematic Stage */}
          <div className="relative z-10 my-8 h-72 w-full">
            {/* SVG Connecting Signal Bus Wires */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              {currentEce.nodes.map((node) => {
                return node.connectedTo.map((targetId) => {
                  const target = currentEce.nodes.find(n => n.id === targetId);
                  if (!target) return null;
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke="url(#wireGradient)"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      className="opacity-60"
                    />
                  );
                });
              })}
            </svg>

            {/* Circuit Nodes */}
            {currentEce.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute z-20 cursor-pointer p-3 rounded-2xl border transition-all duration-200 group select-none ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-110 ring-2 ring-cyan-400/40'
                      : 'bg-slate-950/90 border-blue-900/80 hover:border-blue-500 hover:scale-105'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-bold font-mono text-white whitespace-nowrap">
                      {node.label}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5 whitespace-nowrap">
                    {node.sublabel} • <span className="text-cyan-300 font-semibold">{node.voltage}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Schematic Legend */}
          <div className="relative z-10 pt-3 border-t border-blue-950 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> MCU Core
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Sensors
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Actuators
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Power
              </span>
            </div>
            <span className="text-blue-300">{currentEce.nodes.length} Active System Nodes</span>
          </div>
        </div>

        {/* Node Inspector Details Panel */}
        <div className="rounded-3xl p-6 bg-[#070e24] border border-blue-900/80 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                Node Inspector
              </span>
              {selectedNode && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getNodeBadgeColor(selectedNode.type)}`}>
                  {selectedNode.type.toUpperCase()}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
                  <div className="text-xs font-mono text-blue-300">{selectedNode.sublabel}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-950 space-y-1.5 text-xs">
                  <div className="text-slate-400 font-mono text-[11px]">Operating Potential:</div>
                  <div className="text-cyan-300 font-mono font-bold text-sm">{selectedNode.voltage}</div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="text-slate-400 block text-[11px] font-mono mb-1">Functional Details:</span>
                  {selectedNode.details}
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block text-[11px] font-mono mb-1">Interconnected Rails:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connectedTo.map((connId) => {
                      const tgt = currentEce.nodes.find(n => n.id === connId);
                      return (
                        <span key={connId} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800">
                          → {tgt ? tgt.label : connId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select any node on the schematic to view its electrical parameters.</p>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-[#030712] border border-blue-950 text-[11px] text-slate-400 font-mono">
            🛡️ ESD Protection: TVS Diodes on exposed I2C & Analog signal lines.
          </div>
        </div>
      </div>

      {/* Working Principle & Signal Dynamics Model */}
      <div className="rounded-3xl p-6 bg-[#070e24] border border-blue-500/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Working Design & Step-by-Step Signal Dynamics</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Sequential Execution Model</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentEce.workingPrinciple}
        </p>

        {/* Step-by-Step Signal Steps */}
        <div className="space-y-2 pt-2">
          {currentEce.signalFlowSteps.map((step, idx) => {
            const isHighlighted = activeSignalStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveSignalStep(isHighlighted ? null : idx)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer select-none text-xs flex items-start gap-3 ${
                  isHighlighted
                    ? 'bg-blue-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950/80 border-blue-950 text-slate-300 hover:border-blue-800'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-blue-900/60 border border-blue-700 flex items-center justify-center shrink-0 text-[10px] font-mono font-bold text-cyan-300">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <span className="font-mono text-blue-200">{step}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bill of Materials (BOM) & Pinout Table */}
      <div className="rounded-3xl p-6 bg-[#070e24] border border-blue-500/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Hardware Bill of Materials (BOM) & Pinout Interconnects</h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-300">{currentEce.components.length} Critical Parts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-blue-950 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Component</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Electrical Specifications</th>
                <th className="pb-3 font-semibold">Hardware Pin Interconnects</th>
                <th className="pb-3 font-semibold">Project Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-950/60 font-mono">
              {currentEce.components.map((comp, i) => (
                <tr key={i} className="hover:bg-blue-950/20 transition">
                  <td className="py-3 font-bold text-white">{comp.name}</td>
                  <td className="py-3 text-cyan-300">{comp.category}</td>
                  <td className="py-3 text-slate-300">{comp.specs}</td>
                  <td className="py-3 text-amber-300/90">{comp.pinConnections}</td>
                  <td className="py-3 text-slate-400 max-w-xs truncate">{comp.roleInProject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
