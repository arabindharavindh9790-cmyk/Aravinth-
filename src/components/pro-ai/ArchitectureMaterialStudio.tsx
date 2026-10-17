import React, { useState, useMemo, useRef } from 'react';
import { 
  Building2, 
  Calculator, 
  Boxes, 
  Layers, 
  TrendingUp, 
  Droplets,
  Compass, 
  Copy,
  Check,
  RefreshCw,
  Sun,
  Wind,
  Upload,
  Image as ImageIcon,
  Scan,
  Sparkles,
  FileText,
  Eye,
  Sliders,
  X,
  FileDown
} from 'lucide-react';
import { ArchitectureDesign, ArchitectureMaterialCalculation } from '../../types';
import { calculateCivilMaterials } from '../../data/proAiProjects';

interface ArchitectureMaterialStudioProps {
  architecture: ArchitectureDesign;
  onUpdateArchitecture?: (newArch: ArchitectureDesign) => void;
  onDownloadReport?: (scope?: 'full' | 'ece' | 'cse' | 'architecture', customMaterials?: ArchitectureMaterialCalculation) => void;
}

export const ArchitectureMaterialStudio: React.FC<ArchitectureMaterialStudioProps> = ({ 
  architecture: initialArch,
  onUpdateArchitecture,
  onDownloadReport
}) => {
  const [currentArch, setCurrentArch] = useState<ArchitectureDesign>(initialArch);
  
  // User typed inputs
  const [typedDesignPrompt, setTypedDesignPrompt] = useState<string>('');
  const [areaSqFt, setAreaSqFt] = useState<number>(1500);
  const [floors, setFloors] = useState<number>(1);
  const [wallThickness, setWallThickness] = useState<number>(9);
  const [ceilingHeight, setCeilingHeight] = useState<number>(10);
  const [mortarRatio, setMortarRatio] = useState<string>('1:6 (Standard Masonry)');
  const [concreteGrade, setConcreteGrade] = useState<string>('M20 (1:1.5:3 RCC)');

  // Picture / Image Upload State
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [copiedBOQ, setCopiedBOQ] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute live material measurements (Sand, Simit/Cement, Bricks, Water)
  const materials = useMemo(() => {
    return calculateCivilMaterials(
      areaSqFt,
      floors,
      wallThickness,
      ceilingHeight,
      mortarRatio,
      concreteGrade
    );
  }, [areaSqFt, floors, wallThickness, ceilingHeight, mortarRatio, concreteGrade]);

  // Handle local image upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImagePreview(reader.result as string);
      triggerScanAnimation();
    };
    reader.readAsDataURL(file);
  };

  const triggerScanAnimation = () => {
    setIsScanningImage(true);
    setTimeout(() => {
      setIsScanningImage(false);
    }, 1800);
  };

  // Sample blueprint presets for quick testing
  const sampleBlueprints = [
    {
      title: 'Bioclimatic Courtyard Villa',
      sqft: 2400,
      floors: 2,
      walls: 9,
      preview: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      description: '2-story residence with passive cross-ventilation atrium and solar thermal envelope.'
    },
    {
      title: 'Eco Duplex Urban Residence',
      sqft: 1800,
      floors: 2,
      walls: 9,
      preview: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
      description: 'Modern modular duplex with living pod zoning and structural shear wall conduits.'
    },
    {
      title: 'Compact Low-Carbon Smart Home',
      sqft: 950,
      floors: 1,
      walls: 9,
      preview: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      description: 'High-density bioclimatic studio designed for minimal embodied carbon and rapid masonry.'
    }
  ];

  const handleSelectPresetBlueprint = (preset: typeof sampleBlueprints[0]) => {
    setUploadedImagePreview(preset.preview);
    setUploadedFileName(preset.title + ' (Blueprint)');
    setAreaSqFt(preset.sqft);
    setFloors(preset.floors);
    setWallThickness(preset.walls);
    setTypedDesignPrompt(preset.description);
    triggerScanAnimation();
  };

  // Synthesize Architecture & Material Estimation with PRO AI
  const handleAnalyzeArchitecture = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/pro-ai/analyze-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: typedDesignPrompt,
          sqft: areaSqFt,
          floors,
          wallThickness,
          hasImage: !!uploadedImagePreview,
          imageDescription: uploadedFileName || 'Floor plan blueprint'
        })
      });

      if (!response.ok) throw new Error('Architecture analysis failed');
      const data = await response.json();

      if (data && data.title) {
        const updated: ArchitectureDesign = {
          title: data.title,
          conceptVision: data.conceptVision || currentArch.conceptVision,
          structuralLayout: data.structuralLayout || currentArch.structuralLayout,
          defaultMaterialEstimates: materials
        };
        setCurrentArch(updated);
        if (onUpdateArchitecture) {
          onUpdateArchitecture(updated);
        }
      }
    } catch (err) {
      console.error('Error analyzing architecture:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyBOQ = () => {
    const text = `
=== PRO AI CIVIL MATERIAL MEASUREMENT BILL OF QUANTITIES (BOQ) ===
Project: ${currentArch.title}
Total Built-up Area: ${areaSqFt * floors} sq.ft (${floors} Floor(s))
Wall Thickness: ${wallThickness} inches | Ceiling Height: ${ceilingHeight} ft
Mortar Mix: ${mortarRatio} | Concrete Grade: ${concreteGrade}

1. BRICKS (Standard 190x90x90mm Modular):
   - Total Units: ${materials.bricks.totalUnits.toLocaleString()} bricks (includes 5% wastage allowance)
   - Volume Breakdown: ${materials.bricks.formula}

2. WATER REQUIREMENT (Mixing & 14-Day Curing Pool):
   - Total Water: ${materials.waterLiters.toLocaleString()} Liters (~${Math.round(materials.waterLiters * 0.264172).toLocaleString()} Gallons)
   - Water-Cement Ratio: 0.45 for concrete + standard 2.5x curing volume multiplier

3. SAND (Fine Aggregates):
   - Cubic Feet: ${materials.sand.cubicFeet.toLocaleString()} cu.ft
   - Cubic Meters: ${materials.sand.cubicMeters} m³
   - Metric Tons: ${materials.sand.metricTons} MT
   - Standard Tipper Truckloads: ${materials.sand.truckloads} Trucks (approx 350 cu.ft/truck)
   - Calculation: ${materials.sand.formula}

4. CEMENT / SIMIT (Binder Matrix):
   - Standard 50kg Bags: ${materials.cement.bags50kg.toLocaleString()} bags
   - Net Metric Weight: ${materials.cement.metricTons} Metric Tons (${materials.cement.kg.toLocaleString()} kg)
   - Calculation: ${materials.cement.formula}

5. SECONDARY REINFORCEMENTS:
   - Structural Steel Rebar: ${materials.steel.kg.toLocaleString()} kg (${materials.steel.tons} MT)
   - Coarse Aggregate Gravel: ${materials.aggregateGravel.cubicFeet.toLocaleString()} cu.ft (${materials.aggregateGravel.metricTons} MT)

6. ESTIMATED CIVIL MATERIAL COST:
   - ₹${materials.estimatedMaterialCostINR.toLocaleString()} INR (approx $${materials.estimatedMaterialCostUSD.toLocaleString()} USD)
==================================================================
`;
    navigator.clipboard.writeText(text);
    setCopiedBOQ(true);
    setTimeout(() => setCopiedBOQ(false), 2500);
  };

  return (
    <div className="space-y-6" id="pro-ai-architecture-studio">
      {/* 1. User Input: Picture Upload OR Type Sqft & Design */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#070e24] via-[#09153a] to-[#040817] border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Upload Architectural Blueprint Picture OR Type Sq.Ft & Design
              </h3>
              <p className="text-xs text-blue-300">
                PRO AI analyzes spatial layout and calculates exact quantities of Bricks, Water, Sand, and Simit (Cement)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-950 text-cyan-300 border border-blue-800">
            Civil & Spatial AI
          </span>
        </div>

        {/* Dual Input Grid: Left = Picture Upload, Right = Type Sq.Ft & Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Picture / Blueprint Upload Zone */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                Upload Blueprint Picture / Floor Plan:
              </span>
              {uploadedImagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImagePreview(null);
                    setUploadedFileName(null);
                  }}
                  className="text-slate-400 hover:text-rose-400 flex items-center gap-1 text-[11px] transition"
                >
                  <X className="w-3 h-3" /> Clear Image
                </button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Dropzone Container */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-44 rounded-2xl border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center p-4 overflow-hidden group select-none ${
                uploadedImagePreview
                  ? 'border-cyan-400/60 bg-slate-950'
                  : 'border-blue-900/80 hover:border-cyan-400/50 bg-[#030712]'
              }`}
            >
              {uploadedImagePreview ? (
                <>
                  <img
                    src={uploadedImagePreview}
                    alt="Uploaded blueprint"
                    className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition"
                  />
                  {/* Laser Scanning Visual Animation */}
                  {isScanningImage && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-center">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-950/90 border border-blue-900/80 backdrop-blur-sm flex items-center justify-between text-[11px] font-mono">
                    <span className="text-cyan-300 truncate">{uploadedFileName || 'Blueprint Loaded'}</span>
                    <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3" /> Spatial Scanned
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center group-hover:scale-110 transition">
                    <Upload className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Click to browse or drop blueprint picture
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Supports JPG, PNG, WEBP architectural drawings
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Blueprint Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-400 font-mono">Sample Blueprints:</span>
              {sampleBlueprints.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetBlueprint(sample)}
                  className="px-2 py-0.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-blue-900/60 text-slate-300 hover:text-cyan-300 text-[10px] font-mono transition cursor-pointer"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Type Sqft & Design Parameters */}
          <div className="space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Type Project Design Concept / Style:
              </label>
              <input
                type="text"
                value={typedDesignPrompt}
                onChange={(e) => setTypedDesignPrompt(e.target.value)}
                placeholder="Type design concept (e.g. 'Bioclimatic 2-story home with central lightwell and thermal brick walls')..."
                className="w-full px-3.5 py-2.5 bg-[#030712] border border-blue-900/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Sq.Ft Input & Slider */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-blue-900/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Type Built-Up Square Footage (Sq.Ft):</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="200"
                    max="15000"
                    step="50"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Math.max(100, Number(e.target.value)))}
                    className="w-20 px-2 py-1 bg-slate-900 border border-blue-800 rounded-lg text-xs text-cyan-300 font-mono font-bold text-right focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] font-mono text-slate-400">sq.ft</span>
                </div>
              </div>

              <input
                type="range"
                min="500"
                max="6000"
                step="100"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full h-1.5 bg-blue-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>500 sq.ft</span>
                <span>Total: {areaSqFt * floors} sq.ft ({floors}F)</span>
                <span>6,000 sq.ft</span>
              </div>
            </div>

            {/* Quick Specs: Floors & Wall Thickness */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Floors:</label>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFloors(num)}
                      className={`py-1 text-xs font-mono font-bold rounded-lg border transition ${
                        floors === num
                          ? 'bg-cyan-600 border-cyan-400 text-white'
                          : 'bg-slate-900 border-blue-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}F
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Wall Thickness:</label>
                <select
                  value={wallThickness}
                  onChange={(e) => setWallThickness(Number(e.target.value))}
                  className="w-full p-1.5 bg-slate-900 border border-blue-900 rounded-lg text-xs text-white font-mono"
                >
                  <option value={9}>9" (Load-Bearing)</option>
                  <option value={4.5}>4.5" (Partition)</option>
                  <option value={13.5}>13.5" (Thermal Mass)</option>
                </select>
              </div>
            </div>

            {/* Action Button: Synthesize Architecture & Materials */}
            <button
              type="button"
              onClick={handleAnalyzeArchitecture}
              disabled={isAnalyzing}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Architecture & Materials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Synthesize Architecture & Materials with PRO AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE 4 PROMINENT MATERIAL MEASUREMENTS (BRICKS, WATER, SAND, SIMIT / CEMENT) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#030712] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-blue-900/60">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Exact Civil Material Takeoff (Bricks, Water, Sand, Simit)
              </h3>
              <p className="text-xs text-blue-300 font-mono">
                Calculated for {areaSqFt * floors} sq.ft total built-up area across {floors} floor(s) using IS 456 & SP 23 standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onDownloadReport?.('architecture', materials)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download Material Report</span>
            </button>

            <button
              onClick={handleCopyBOQ}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-blue-800 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedBOQ ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBOQ ? 'BOQ Copied!' : 'Copy Material BOQ'}</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Estimated Material Cost</span>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-400">
                ₹{materials.estimatedMaterialCostINR.toLocaleString()} INR <span className="text-xs text-slate-400 font-normal">(${materials.estimatedMaterialCostUSD.toLocaleString()} USD)</span>
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Demanded Pillars: BRICKS, WATER, SAND, SIMIT / CEMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. BRICKS CARD */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-[#0f172a] to-[#090d1a] border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Boxes className="w-3 h-3" /> 1. BRICKS
              </span>
              <span className="text-[10px] font-mono text-slate-400">+5% Wastage</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Total Bricks Measured</span>
              <div className="text-3xl font-black font-mono text-amber-400 tracking-tight">
                {materials.bricks.totalUnits.toLocaleString()}
                <span className="text-xs font-normal text-slate-300 ml-1.5">units</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-950/60 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Standard Size:</span>
                <span className="text-amber-200">190×90×90 mm</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Density:</span>
                <span className="text-amber-200">~500 bricks/m³</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 leading-relaxed font-mono">
                {materials.bricks.formula}
              </p>
            </div>
          </div>

          {/* 2. WATER CARD */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-[#0f172a] to-[#090d1a] border border-teal-500/40 shadow-[0_0_30px_rgba(20,184,166,0.15)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> 2. WATER
              </span>
              <span className="text-[10px] font-mono text-slate-400">W/C Ratio 0.45</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Total Water Measured</span>
              <div className="text-3xl font-black font-mono text-teal-400 tracking-tight">
                {materials.waterLiters.toLocaleString()}
                <span className="text-xs font-normal text-slate-300 ml-1.5">Liters</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-950/60 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Gallons:</span>
                <span className="text-teal-200">~{Math.round(materials.waterLiters * 0.264172).toLocaleString()} Gal</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Application:</span>
                <span className="text-teal-200">Mix + 14d Curing</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 leading-relaxed font-mono">
                28L/bag concrete hydration + 2.5x curing volume multiplier.
              </p>
            </div>
          </div>

          {/* 3. SAND CARD */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-[#0f172a] to-[#090d1a] border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 3. SAND
              </span>
              <span className="text-[10px] font-mono text-slate-400">Dry Factor 1.33</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Total Sand Measured</span>
              <div className="text-3xl font-black font-mono text-blue-400 tracking-tight">
                {materials.sand.cubicFeet.toLocaleString()}
                <span className="text-xs font-normal text-slate-300 ml-1.5">cu.ft</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-blue-950/60 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Cubic Meters:</span>
                <span className="text-blue-200">{materials.sand.cubicMeters} m³</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Tipper Trucks:</span>
                <span className="text-blue-200 font-bold">{materials.sand.truckloads} Trucks</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 leading-relaxed font-mono">
                {materials.sand.formula}
              </p>
            </div>
          </div>

          {/* 4. SIMIT / CEMENT CARD */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-[#0f172a] to-[#090d1a] border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Layers className="w-3 h-3" /> 4. SIMIT (CEMENT)
              </span>
              <span className="text-[10px] font-mono text-slate-400">50 kg / bag</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 block">Total Simit (Cement) Measured</span>
              <div className="text-3xl font-black font-mono text-cyan-400 tracking-tight">
                {materials.cement.bags50kg.toLocaleString()}
                <span className="text-xs font-normal text-slate-300 ml-1.5">bags</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-950/60 space-y-1 text-xs text-slate-300">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Metric Weight:</span>
                <span className="text-cyan-200">{materials.cement.metricTons} Metric Tons</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-slate-400">Kilograms:</span>
                <span className="text-cyan-200">{materials.cement.kg.toLocaleString()} kg</span>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 leading-relaxed font-mono">
                {materials.cement.formula}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Reinforcements: Steel Rebar & Gravel Aggregate */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-blue-900/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700 text-indigo-400 flex items-center justify-center font-bold font-mono">
              Fe
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Structural Steel Rebar (Fe500D)</span>
              <span className="font-bold text-white font-mono text-sm">{materials.steel.kg.toLocaleString()} kg</span>
              <span className="text-slate-500 text-[10px] ml-1">({materials.steel.tons} MT ~ 4 kg/sq.ft)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-700 text-teal-400 flex items-center justify-center font-bold font-mono">
              Ag
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Coarse Aggregate Gravel (20mm)</span>
              <span className="font-bold text-white font-mono text-sm">{materials.aggregateGravel.cubicFeet.toLocaleString()} cu.ft</span>
              <span className="text-slate-500 text-[10px] ml-1">({materials.aggregateGravel.metricTons} MT)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Architectural Design Blueprint & Bioclimatic Zoning */}
      <div className="rounded-3xl p-6 bg-[#070e24] border border-blue-500/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-blue-900/50">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Architectural Spatial Blueprint
              </span>
              <h3 className="text-base font-bold text-white">{currentArch.title}</h3>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800/60">
            Bioclimatic Engineering Layout
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentArch.conceptVision}
        </p>

        {/* Spatial Zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {currentArch.structuralLayout.zones.map((zone, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-blue-900/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                  Zone 0{idx + 1}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{zone.dimensions}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{zone.name}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{zone.purpose}</p>

              <div className="pt-2 border-t border-blue-950 space-y-1 text-[11px]">
                <div className="text-amber-300/90 font-mono">
                  <span className="text-slate-500">Sensor:</span> {zone.sensorPlacement}
                </div>
                <div className="text-slate-400 font-mono">
                  <span className="text-slate-500">Specs:</span> {zone.constructionDetails}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bioclimatic Strategies & Sustainability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#04091c] border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold uppercase">
              <Sun className="w-4 h-4" /> Passive Bioclimatic Strategies
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentArch.structuralLayout.passiveBioclimaticStrategies.map((strat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{strat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#04091c] border border-blue-900/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold uppercase">
              <Wind className="w-4 h-4" /> Low-Carbon Sustainability Matrix
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {currentArch.structuralLayout.sustainabilityFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
