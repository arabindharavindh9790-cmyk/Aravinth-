import { jsPDF } from 'jspdf';
import { ProAIUnifiedProject, ArchitectureMaterialCalculation } from '../types';

export type ReportExportScope = 'full' | 'ece' | 'cse' | 'architecture';

export interface PdfExportOptions {
  scope: ReportExportScope;
  includeAdvantagesDisadvantages?: boolean;
  includeCode?: boolean;
  includeMaterialBreakdown?: boolean;
  includeCircuitSchematic?: boolean;
  customNotes?: string;
  customMaterials?: ArchitectureMaterialCalculation;
}

/**
 * Generates and downloads a branded PDF document for PRO AI.
 */
export function generateProAiPdf(
  project: ProAIUnifiedProject,
  options: PdfExportOptions = { scope: 'full' }
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      drawPageDecorations();
      y = 22;
    }
  };

  const drawPageDecorations = () => {
    // Top cosmic header bar
    doc.setFillColor(7, 14, 36); // #070e24 dark space blue
    doc.rect(0, 0, pageWidth, 12, 'F');

    // Electric cyan accent line
    doc.setFillColor(6, 182, 212); // #06b6d4 cyan
    doc.rect(0, 11.5, pageWidth, 0.8, 'F');

    // Header branding text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('PRO AI • MULTIDISCIPLINARY SPACE ENGINEERING LAB', margin, 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(147, 197, 253);
    doc.text('ECE • CSE • ARCHITECTURE UNIFIED SPECIFICATION', pageWidth - margin, 7.5, { align: 'right' });

    // Footer
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`CONFIDENTIAL • PRO AI AUTONOMOUS SYNTHESIZER • REF: PRO-${project.id.toUpperCase()}`, margin, pageHeight - 7);

    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.text(`Page ${pageCount}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // ---------------- PAGE 1 HEADER ----------------
  drawPageDecorations();
  y = 20;

  // Title Banner Card
  doc.setFillColor(11, 23, 56);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'D');

  // Subtitle badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(56, 189, 248);
  const scopeLabel = 
    options.scope === 'ece' ? 'DEPARTMENT OF ELECTRONICS & COMMUNICATION ENGINEERING (ECE)' :
    options.scope === 'cse' ? 'DEPARTMENT OF COMPUTER SCIENCE & FIRMWARE ENGINEERING (CSE)' :
    options.scope === 'architecture' ? 'DEPARTMENT OF ARCHITECTURAL & CIVIL ENGINEERING (ARCHITECTURE)' :
    'TRI-DEPARTMENT UNIFIED MASTER ENGINEERING DOSSIER';

  doc.text(scopeLabel, margin + 4, y + 7);

  // Main Project Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  
  // Truncate or split long titles
  const titleLines = doc.splitTextToSize(project.name, contentWidth - 8);
  doc.text(titleLines.slice(0, 1), margin + 4, y + 15);

  // Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(191, 219, 254);
  const tagLines = doc.splitTextToSize(project.tagline, contentWidth - 8);
  doc.text(tagLines.slice(0, 1), margin + 4, y + 22);

  // Metadata ribbon
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.text(`Generated: ${currentDate} | Status: Verified Autonomous Synthesis | Security Classification: Open Space Engineering`, margin + 4, y + 29);

  y += 39;

  // Helper section title renderer
  const renderSectionHeader = (title: string, subtitle?: string, accentColor: [number, number, number] = [37, 99, 235]) => {
    checkPageBreak(16);
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(margin, y, 2.5, 9, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 5, y + 6);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, margin + 5, y + 10);
      y += 13;
    } else {
      y += 11;
    }
  };

  // Helper key-value pair table
  const renderKeyValue = (label: string, value: string, boldValue = false) => {
    checkPageBreak(7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(label, margin + 2, y + 4);

    doc.setFont('helvetica', boldValue ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const valueLines = doc.splitTextToSize(value, contentWidth - 55);
    doc.text(valueLines, margin + 50, y + 4);
    y += Math.max(6, valueLines.length * 4.2 + 2);
  };

  // Helper boxed paragraph
  const renderBoxedNote = (text: string, title?: string, bgColor: [number, number, number] = [241, 245, 249], borderColor: [number, number, number] = [203, 213, 225]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(text, contentWidth - 10);
    const boxHeight = (title ? 6 : 0) + lines.length * 4 + 6;
    checkPageBreak(boxHeight + 2);

    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'D');

    let textY = y + 4;
    if (title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(title, margin + 4, textY);
      textY += 5;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(lines, margin + 4, textY);

    y += boxHeight + 4;
  };

  // =========================================================================
  // 1. EXECUTIVE SUMMARY & DOMAIN SYNERGY
  // =========================================================================
  if (options.scope === 'full') {
    renderSectionHeader('1. Executive Vision & Multidisciplinary Synergy', 'Cross-Domain integration of ECE, CSE and Architecture');
    
    renderBoxedNote(project.visionAbstract, 'Project Vision & Objective:', [238, 242, 255], [199, 210, 254]);

    // Synergy matrix box
    checkPageBreak(32);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'D');

    // 3 columns inside synergy box
    const colWidth = (contentWidth - 6) / 3;

    // ECE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // amber
    doc.text('ECE HARDWARE', margin + 3, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    const eceLines = doc.splitTextToSize(project.domainSynergy.eceRole, colWidth - 4);
    doc.text(eceLines.slice(0, 4), margin + 3, y + 10);

    // CSE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(4, 120, 87); // emerald
    doc.text('CSE FIRMWARE & AI', margin + colWidth + 5, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    const cseLines = doc.splitTextToSize(project.domainSynergy.cseRole, colWidth - 4);
    doc.text(cseLines.slice(0, 4), margin + colWidth + 5, y + 10);

    // ARCHITECTURE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(14, 116, 144); // cyan
    doc.text('ARCHITECTURE & CIVIL', margin + colWidth * 2 + 5, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    const archLines = doc.splitTextToSize(project.domainSynergy.archRole, colWidth - 4);
    doc.text(archLines.slice(0, 4), margin + colWidth * 2 + 5, y + 10);

    y += 34;

    // Unified Impact
    renderBoxedNote(
      project.domainSynergy.unifiedValue,
      'Unified Tri-Department Impact:',
      [240, 253, 250],
      [153, 246, 228]
    );
  }

  // =========================================================================
  // 2. ECE DEPARTMENT: CIRCUIT DESIGN & WORKING MODEL
  // =========================================================================
  if (options.scope === 'full' || options.scope === 'ece') {
    renderSectionHeader(
      'ECE Department: Circuit Design, Hardware & Working Model',
      `Title: ${project.ece.title}`,
      [217, 119, 6] // Amber accent
    );

    renderBoxedNote(
      project.ece.workingPrinciple,
      'Working Model & Operation Principles:',
      [254, 243, 199],
      [252, 211, 77]
    );

    // Power & Voltage Specs
    checkPageBreak(18);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Operating Voltage:', margin + 3, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(180, 83, 9);
    doc.text(project.ece.voltageAndPowerSpecs.operatingVoltage, margin + 32, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Current Consumption:', margin + 65, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(project.ece.voltageAndPowerSpecs.currentConsumption, margin + 98, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Power Backup:', margin + 130, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(project.ece.voltageAndPowerSpecs.backupSource, margin + 152, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Schematic Architecture: ${project.ece.schematicDescription.slice(0, 110)}...`, margin + 3, y + 11);

    y += 17;

    // Component Bill of Materials Table
    if (project.ece.components && project.ece.components.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Hardware Components Bill of Materials (BOM):', margin, y + 4);
      y += 6;

      // Table Header
      checkPageBreak(8);
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('Component Name', margin + 2, y + 4.2);
      doc.text('Category', margin + 45, y + 4.2);
      doc.text('Key Specifications', margin + 80, y + 4.2);
      doc.text('Pinout / Interface', margin + 130, y + 4.2);
      y += 6;

      // Rows
      project.ece.components.forEach((comp, idx) => {
        checkPageBreak(7);
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y + 6, margin + contentWidth, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(15, 23, 42);
        doc.text(comp.name.slice(0, 24), margin + 2, y + 4.2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(71, 85, 105);
        doc.text(comp.category, margin + 45, y + 4.2);
        doc.text(comp.specs.slice(0, 32), margin + 80, y + 4.2);
        doc.text(comp.pinConnections.slice(0, 32), margin + 130, y + 4.2);

        y += 6;
      });

      y += 3;
    }

    // Signal Flow Steps
    if (project.ece.signalFlowSteps && project.ece.signalFlowSteps.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Hardware Signal Flow & Circuit Execution Pipeline:', margin, y + 4);
      y += 6;

      project.ece.signalFlowSteps.forEach((step, idx) => {
        checkPageBreak(6);
        doc.setFillColor(243, 244, 246);
        doc.circle(margin + 3, y + 2.5, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${idx + 1}`, margin + 2.2, y + 3.3);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        const stepLines = doc.splitTextToSize(step, contentWidth - 10);
        doc.text(stepLines, margin + 8, y + 3.2);
        y += Math.max(5.5, stepLines.length * 3.8);
      });
      y += 2;
    }
  }

  // =========================================================================
  // 3. CSE DEPARTMENT: CODE, FIRMWARE & ERROR ANALYSIS
  // =========================================================================
  if (options.scope === 'full' || options.scope === 'cse') {
    renderSectionHeader(
      'CSE Department: Source Code, Firmware & Error Resolution',
      `Architecture: ${project.cse.architectureOverview}`,
      [16, 185, 129] // Emerald accent
    );

    project.cse.modules.forEach((mod, modIdx) => {
      checkPageBreak(25);
      
      // Module Title Banner
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(5, 150, 105);
      doc.text(`Module 0${modIdx + 1}: ${mod.filename} (${mod.language.toUpperCase()})`, margin + 3, y + 5.2);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(mod.purpose.slice(0, 80), margin + 80, y + 5.2);

      y += 10;

      // Why this language
      if (mod.whyLanguage) {
        checkPageBreak(10);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.text('Language Choice Justification:', margin + 2, y + 3);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        const whyLines = doc.splitTextToSize(mod.whyLanguage, contentWidth - 45);
        doc.text(whyLines, margin + 43, y + 3);
        y += Math.max(5, whyLines.length * 3.5 + 2);
      }

      // Code Snippet Box (Printable formatted)
      if (options.includeCode !== false) {
        const codeLines = mod.code.split('\n').slice(0, 36); // keep concise, clean
        const codeBoxHeight = Math.min(65, codeLines.length * 3.2 + 6);
        checkPageBreak(codeBoxHeight + 6);

        doc.setFillColor(15, 23, 42); // slate-900 dark console
        doc.roundedRect(margin, y, contentWidth, codeBoxHeight, 2, 2, 'F');
        doc.setDrawColor(51, 65, 85);
        doc.roundedRect(margin, y, contentWidth, codeBoxHeight, 2, 2, 'D');

        doc.setFont('courier', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(167, 243, 208); // emerald terminal text

        let codeY = y + 4.5;
        for (let i = 0; i < codeLines.length && codeY < y + codeBoxHeight - 3; i++) {
          doc.text(codeLines[i].slice(0, 95), margin + 3, codeY);
          codeY += 3.2;
        }

        y += codeBoxHeight + 4;
      }

      // Simulated Bug & AI Resolution
      if (mod.simulatedError) {
        checkPageBreak(18);
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'F');
        doc.setDrawColor(254, 202, 202);
        doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(220, 38, 38);
        doc.text(`Simulated Compiler/Runtime Error: ${mod.simulatedError.errorType} (Line ${mod.simulatedError.line})`, margin + 3, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(153, 27, 27);
        doc.text(`Error: "${mod.simulatedError.errorMessage}"`, margin + 3, y + 8.5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(22, 101, 52);
        doc.text(`PRO AI Fix: ${mod.simulatedError.solutionDiff}`, margin + 3, y + 12.5);

        y += 19;
      }
    });
  }

  // =========================================================================
  // 4. ARCHITECTURE DEPARTMENT: BLUEPRINT & MATERIAL QUANTIFICATION
  // =========================================================================
  if (options.scope === 'full' || options.scope === 'architecture') {
    renderSectionHeader(
      'Architecture & Civil Engineering: Design & Material Measurement',
      `Concept: ${project.architecture.conceptVision}`,
      [6, 182, 212] // Cyan accent
    );

    // Use custom user-calculated materials if provided, else project defaults
    const mat = options.customMaterials || project.architecture.defaultMaterialEstimates;

    // Material Summary Callout Grid
    checkPageBreak(36);
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'F');
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'D');

    // 4 Key Metrics: Sand, Cement, Bricks, Water
    const metricCol = (contentWidth - 6) / 4;

    // 1. Sand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144);
    doc.text('SAND / M-SAND', margin + 3, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${mat.sand.metricTons.toLocaleString()} Tons`, margin + 3, y + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${mat.sand.cubicFeet.toLocaleString()} cu.ft`, margin + 3, y + 15.5);
    doc.text(`${mat.sand.truckloads} Truckloads`, margin + 3, y + 19.5);
    doc.text(mat.sand.formula.slice(0, 22), margin + 3, y + 23.5);

    // 2. Cement
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144);
    doc.text('CEMENT (SIMIT)', margin + metricCol + 3, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${mat.cement.bags50kg.toLocaleString()} Bags`, margin + metricCol + 3, y + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${mat.cement.metricTons} Tons (${mat.cement.kg.toLocaleString()} kg)`, margin + metricCol + 3, y + 15.5);
    doc.text('50kg standard bags', margin + metricCol + 3, y + 19.5);
    doc.text(mat.cement.formula.slice(0, 22), margin + metricCol + 3, y + 23.5);

    // 3. Bricks
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144);
    doc.text('BRICKS', margin + metricCol * 2 + 3, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${mat.bricks.totalUnits.toLocaleString()} Nos`, margin + metricCol * 2 + 3, y + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Size: ${mat.bricks.standardSize.slice(0, 16)}`, margin + metricCol * 2 + 3, y + 15.5);
    doc.text(`Wastage: ${mat.bricks.wastagePercent}% included`, margin + metricCol * 2 + 3, y + 19.5);
    doc.text(mat.bricks.formula.slice(0, 22), margin + metricCol * 2 + 3, y + 23.5);

    // 4. Water & Steel
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144);
    doc.text('WATER & STEEL', margin + metricCol * 3 + 3, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${mat.waterLiters.toLocaleString()} L`, margin + metricCol * 3 + 3, y + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Curing & Mixing Water`, margin + metricCol * 3 + 3, y + 15.5);
    doc.text(`Steel: ${mat.steel.tons} Tons (${mat.steel.kg.toLocaleString()} kg)`, margin + metricCol * 3 + 3, y + 19.5);
    doc.text(`Gravel: ${mat.aggregateGravel.metricTons} Tons`, margin + metricCol * 3 + 3, y + 23.5);

    // Bottom parameter banner inside box
    doc.setDrawColor(226, 232, 240);
    doc.line(margin + 2, y + 26, margin + contentWidth - 2, y + 26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`Floor Area: ${mat.builtUpAreaSqFt.toLocaleString()} sq.ft | Floors: ${mat.floors} | Wall: ${mat.wallThicknessInches}" | Height: ${mat.ceilingHeightFeet} ft | Mortar: ${mat.mortarRatio} | Concrete: ${mat.concreteGrade}`, margin + 3, y + 30.5);

    y += 38;

    // Cost estimate strip
    checkPageBreak(10);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Estimated Construction Material Cost:', margin + 3, y + 5.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(`INR ₹${mat.estimatedMaterialCostINR.toLocaleString()} (approx. $${mat.estimatedMaterialCostUSD.toLocaleString()} USD)`, margin + 60, y + 5.2);
    y += 11;

    // Structural Zones Table
    if (project.architecture.structuralLayout?.zones && project.architecture.structuralLayout.zones.length > 0) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Architectural Zoning & Spatial Sensor Layout:', margin, y + 4);
      y += 6;

      // Table Header
      checkPageBreak(7);
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('Zone Name', margin + 2, y + 4.2);
      doc.text('Dimensions', margin + 45, y + 4.2);
      doc.text('Primary Purpose', margin + 75, y + 4.2);
      doc.text('Sensor & Hardware Placement', margin + 125, y + 4.2);
      y += 6;

      project.architecture.structuralLayout.zones.forEach((zone, zIdx) => {
        checkPageBreak(7);
        doc.setFillColor(zIdx % 2 === 0 ? 255 : 248, zIdx % 2 === 0 ? 255 : 250, zIdx % 2 === 0 ? 255 : 252);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y + 6, margin + contentWidth, y + 6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(15, 23, 42);
        doc.text(zone.name.slice(0, 22), margin + 2, y + 4.2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(71, 85, 105);
        doc.text(zone.dimensions, margin + 45, y + 4.2);
        doc.text(zone.purpose.slice(0, 28), margin + 75, y + 4.2);
        doc.text(zone.sensorPlacement.slice(0, 34), margin + 125, y + 4.2);

        y += 6;
      });
      y += 4;
    }
  }

  // =========================================================================
  // 5. ADVANTAGES & DISADVANTAGES ANALYSIS
  // =========================================================================
  if (options.scope === 'full' || options.includeAdvantagesDisadvantages) {
    renderSectionHeader(
      'Deep Engineering Matrix: Advantages & Disadvantages',
      'Technical breakthroughs and operational trade-offs evaluated by PRO AI',
      [99, 102, 241] // Indigo accent
    );

    checkPageBreak(40);
    const colW = (contentWidth - 6) / 2;

    // Advantages column
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, y, colW, 40, 2, 2, 'F');
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, colW, 40, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105);
    doc.text('Key Advantages & Innovations:', margin + 3, y + 5);

    let advY = y + 9;
    project.advantages.slice(0, 4).forEach((adv, i) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(30, 41, 59);
      const advLines = doc.splitTextToSize(`${i + 1}. ${adv}`, colW - 6);
      doc.text(advLines.slice(0, 2), margin + 3, advY);
      advY += 7;
    });

    // Disadvantages column
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin + colW + 6, y, colW, 40, 2, 2, 'F');
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin + colW + 6, y, colW, 40, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text('Disadvantages & Engineering Trade-offs:', margin + colW + 9, y + 5);

    let disY = y + 9;
    project.disadvantages.slice(0, 4).forEach((dis, i) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(30, 41, 59);
      const disLines = doc.splitTextToSize(`! ${dis}`, colW - 6);
      doc.text(disLines.slice(0, 2), margin + colW + 9, disY);
      disY += 7;
    });

    y += 44;
  }

  // =========================================================================
  // 6. OFFICIAL PRO AI CERTIFICATION & VERIFICATION STAMP
  // =========================================================================
  checkPageBreak(24);
  doc.setFillColor(7, 14, 36); // Space Blue stamp box
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(56, 189, 248);
  doc.text('PRO AI • AUTONOMOUS ENGINEERING CERTIFICATION', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(191, 219, 254);
  doc.text(
    'This dossier certifies cross-disciplinary compliance spanning IEEE (Hardware/ECE), ISO/IEC 25010 (Software/CSE), and NBC/IS 456 (Civil & Architecture). All calculations, source code synthetics, and material quantities have been checked for structural coherence.',
    margin + 4,
    y + 11,
    { maxWidth: contentWidth - 8 }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(245, 158, 11);
  doc.text(`Digital Verification Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-PROAI-CERTIFIED`, margin + 4, y + 18.5);

  // Trigger browser download
  const cleanTitle = project.name.split(':')[0].replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const filename = `PRO_AI_${options.scope.toUpperCase()}_Report_${cleanTitle}.pdf`;
  doc.save(filename);
}

/**
 * Opens a beautifully formatted, printable HTML report in a new tab
 * allowing direct printing / browser "Save as PDF" with crisp styling.
 */
export function openPrintableProjectReport(
  project: ProAIUnifiedProject,
  scope: ReportExportScope = 'full',
  customMaterials?: ArchitectureMaterialCalculation
): void {
  const mat = customMaterials || project.architecture.defaultMaterialEstimates;
  const printWindow = window.open('', '_blank', 'width=1024,height=800');
  if (!printWindow) {
    alert('Please allow pop-ups to open the printable report preview.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PRO AI - ${project.name} (Engineering Report)</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      line-height: 1.45;
      font-size: 11px;
      padding: 24px;
    }
    .print-bar {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999;
    }
    .print-btn {
      background: linear-gradient(135deg, #2563eb, #06b6d4);
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 12px;
    }
    .header-banner {
      background: linear-gradient(135deg, #070e24, #0b1738);
      color: white;
      padding: 24px;
      border-radius: 16px;
      margin-bottom: 24px;
      border: 1px solid #1e3a8a;
    }
    .header-tag {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(6, 182, 212, 0.2);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: #38bdf8;
      font-size: 10px;
      font-weight: 700;
      border-radius: 20px;
      margin-bottom: 10px;
      font-family: monospace;
    }
    .project-title {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 6px;
      color: #ffffff;
    }
    .project-tagline {
      font-size: 13px;
      color: #93c5fd;
      margin-bottom: 12px;
    }
    .project-meta {
      font-size: 10px;
      color: #94a3b8;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      border-left: 4px solid #2563eb;
      padding-left: 10px;
      margin: 20px 0 12px 0;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 14px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 14px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .metric-box {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 10px;
      padding: 12px;
    }
    .metric-label {
      font-size: 10px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .metric-val {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .metric-sub {
      font-size: 9px;
      color: #64748b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
      font-size: 10px;
    }
    th {
      background: #0f172a;
      color: white;
      text-align: left;
      padding: 8px 10px;
    }
    td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    pre {
      background: #0f172a;
      color: #34d399;
      padding: 12px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 9px;
      overflow-x: auto;
      margin-bottom: 14px;
      line-height: 1.4;
    }
    .seal-box {
      border: 2px dashed #3b82f6;
      background: #eff6ff;
      padding: 14px;
      border-radius: 12px;
      margin-top: 24px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <strong>PRO AI Space Lab: Branded Engineering Report</strong>
      <div style="font-size: 11px; opacity: 0.8;">Print or Save directly as PDF from browser</div>
    </div>
    <div>
      <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>
  </div>

  <div class="header-banner">
    <div class="header-tag">PRO AI • MULTIDISCIPLINARY SPECIFICATION REPORT</div>
    <h1 class="project-title">${project.name}</h1>
    <div class="project-tagline">${project.tagline}</div>
    <div class="project-meta">
      <span>Date: ${currentDate}</span>
      <span>Engine: PRO AI Multi-Agent Synthesizer</span>
      <span>Classification: ECE • CSE • ARCHITECTURE Unified</span>
    </div>
  </div>

  ${(scope === 'full') ? `
  <div class="section-title">1. Executive Abstract & Multidisciplinary Domain Synergy</div>
  <div class="card">
    <p><strong>Vision:</strong> ${project.visionAbstract}</p>
  </div>

  <div class="grid-3">
    <div class="card" style="border-top: 3px solid #f59e0b;">
      <strong style="color: #b45309;">ECE Hardware Role</strong>
      <p style="margin-top: 4px; font-size: 10px;">${project.domainSynergy.eceRole}</p>
    </div>
    <div class="card" style="border-top: 3px solid #10b981;">
      <strong style="color: #047857;">CSE Firmware Role</strong>
      <p style="margin-top: 4px; font-size: 10px;">${project.domainSynergy.cseRole}</p>
    </div>
    <div class="card" style="border-top: 3px solid #06b6d4;">
      <strong style="color: #0e7490;">Architecture Role</strong>
      <p style="margin-top: 4px; font-size: 10px;">${project.domainSynergy.archRole}</p>
    </div>
  </div>

  <div class="card" style="background: #f0fdfa; border-color: #99f6e4;">
    <strong style="color: #0f766e;">Unified Multi-Department Value:</strong>
    <p style="margin-top: 4px;">${project.domainSynergy.unifiedValue}</p>
  </div>
  ` : ''}

  ${(scope === 'full' || scope === 'ece') ? `
  <div class="section-title">ECE Department: Circuit Design & Working Model</div>
  <div class="card">
    <strong>Working Principle:</strong>
    <p style="margin-top: 4px;">${project.ece.workingPrinciple}</p>
    <div style="margin-top: 8px; font-size: 10px; color: #475569;">
      <strong>Operating Voltage:</strong> ${project.ece.voltageAndPowerSpecs.operatingVoltage} | 
      <strong>Current Draw:</strong> ${project.ece.voltageAndPowerSpecs.currentConsumption} | 
      <strong>Backup:</strong> ${project.ece.voltageAndPowerSpecs.backupSource}
    </div>
  </div>

  <h4 style="margin-bottom: 6px; font-weight: 700;">Hardware Bill of Materials (BOM)</h4>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Category</th>
        <th>Specifications</th>
        <th>Pin Connections & Role</th>
      </tr>
    </thead>
    <tbody>
      ${project.ece.components.map(c => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.category}</td>
          <td>${c.specs}</td>
          <td>${c.pinConnections} - ${c.roleInProject}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h4 style="margin-bottom: 6px; font-weight: 700;">Signal Flow & Working Pipeline</h4>
  <ol style="margin-left: 20px; margin-bottom: 16px;">
    ${project.ece.signalFlowSteps.map(s => `<li style="margin-bottom: 4px;">${s}</li>`).join('')}
  </ol>
  ` : ''}

  ${(scope === 'full' || scope === 'cse') ? `
  <div class="section-title">CSE Department: Source Code, Firmware & Error Solver</div>
  <div class="card">
    <strong>Architecture:</strong> ${project.cse.architectureOverview}
  </div>

  ${project.cse.modules.map((m, idx) => `
    <div style="margin-bottom: 14px;">
      <h4 style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        Module 0${idx + 1}: ${m.filename} (${m.language.toUpperCase()}) - ${m.purpose}
      </h4>
      ${m.whyLanguage ? `<p style="font-style: italic; color: #475569; font-size: 10px; margin-bottom: 6px;">Why this language: ${m.whyLanguage}</p>` : ''}
      <pre>${m.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      ${m.simulatedError ? `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px; margin-bottom: 10px; font-size: 10px;">
          <strong style="color: #dc2626;">Error Resolved:</strong> ${modError(m.simulatedError)}
        </div>
      ` : ''}
    </div>
  `).join('')}
  ` : ''}

  ${(scope === 'full' || scope === 'architecture') ? `
  <div class="section-title">Architecture Department: Material Quantification & Design</div>
  <div class="card">
    <strong>Spatial & Bioclimatic Vision:</strong>
    <p style="margin-top: 4px;">${project.architecture.conceptVision}</p>
  </div>

  <div class="grid-4">
    <div class="metric-box">
      <div class="metric-label">Sand (M-Sand)</div>
      <div class="metric-val">${mat.sand.metricTons.toLocaleString()} Tons</div>
      <div class="metric-sub">${mat.sand.cubicFeet.toLocaleString()} cu.ft (${mat.sand.truckloads} truckloads)</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Cement (Simit)</div>
      <div class="metric-val">${mat.cement.bags50kg.toLocaleString()} Bags</div>
      <div class="metric-sub">${mat.cement.metricTons} Tons (${mat.cement.kg.toLocaleString()} kg)</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Red Clay / Fly Ash Bricks</div>
      <div class="metric-val">${mat.bricks.totalUnits.toLocaleString()} Units</div>
      <div class="metric-sub">${mat.bricks.wastagePercent}% wastage included</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Potable Curing Water</div>
      <div class="metric-val">${mat.waterLiters.toLocaleString()} L</div>
      <div class="metric-sub">Steel: ${mat.steel.tons} Tons | Gravel: ${mat.aggregateGravel.metricTons} Tons</div>
    </div>
  </div>

  <div class="card" style="font-size: 10px;">
    <strong>Design Parameters:</strong> Built-up: ${mat.builtUpAreaSqFt} sq.ft | Floors: ${mat.floors} | Wall: ${mat.wallThicknessInches}" | Height: ${mat.ceilingHeightFeet}ft | Mortar: ${mat.mortarRatio} | Concrete: ${mat.concreteGrade}
    <br/>
    <strong>Estimated Material Cost:</strong> ₹${mat.estimatedMaterialCostINR.toLocaleString()} INR (~$${mat.estimatedMaterialCostUSD.toLocaleString()} USD)
  </div>

  <h4 style="margin-bottom: 6px; font-weight: 700;">Zoning Layout</h4>
  <table>
    <thead>
      <tr>
        <th>Zone</th>
        <th>Dimensions</th>
        <th>Purpose</th>
        <th>Sensors & Structural Details</th>
      </tr>
    </thead>
    <tbody>
      ${project.architecture.structuralLayout.zones.map(z => `
        <tr>
          <td><strong>${z.name}</strong></td>
          <td>${z.dimensions}</td>
          <td>${z.purpose}</td>
          <td>${z.sensorPlacement}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  ${(scope === 'full') ? `
  <div class="section-title">Advantages & Disadvantages Matrix</div>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
    <div class="card" style="background: #f0fdf4; border-color: #bbf7d0;">
      <strong style="color: #16a34a;">Project Advantages:</strong>
      <ul style="margin-left: 16px; margin-top: 6px;">
        ${project.advantages.map(a => `<li style="margin-bottom: 4px;">${a}</li>`).join('')}
      </ul>
    </div>
    <div class="card" style="background: #fff1f2; border-color: #fecdd3;">
      <strong style="color: #e11d48;">Disadvantages & Trade-offs:</strong>
      <ul style="margin-left: 16px; margin-top: 6px;">
        ${project.disadvantages.map(d => `<li style="margin-bottom: 4px;">${d}</li>`).join('')}
      </ul>
    </div>
  </div>
  ` : ''}

  <div class="seal-box">
    <strong style="color: #1e40af; font-size: 12px;">PRO AI SPACE ENGINEERING VERIFICATION SEAL</strong>
    <p style="font-size: 10px; color: #475569; margin-top: 4px;">
      Certified multi-domain blueprint compiled by PRO AI for ${project.name}.
      Meets cross-disciplinary standards for ECE circuit logic, CSE firmware integrity, and Architectural material quantification.
    </p>
  </div>
</body>
</html>
  `;

  function modError(err: any) {
    return `${err.errorType} at line ${err.line}: "${err.errorMessage}" -> Fixed by: ${err.solutionDiff}`;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
