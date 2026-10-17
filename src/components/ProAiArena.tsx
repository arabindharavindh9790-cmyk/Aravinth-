import React, { useState } from 'react';
import { ProAIUnifiedProject, ArchitectureMaterialCalculation } from '../types';
import { PRO_AI_PROJECTS } from '../data/proAiProjects';
import { ProAiSpaceHeader } from './pro-ai/ProAiSpaceHeader';
import { ProjectOverviewTab } from './pro-ai/ProjectOverviewTab';
import { ECECircuitStudio } from './pro-ai/ECECircuitStudio';
import { CSECodeStudio } from './pro-ai/CSECodeStudio';
import { ArchitectureMaterialStudio } from './pro-ai/ArchitectureMaterialStudio';
import { DownloadReportModal } from './pro-ai/DownloadReportModal';
import { ReportExportScope } from '../utils/proAiPdfExport';

export const ProAiArena: React.FC = () => {
  const [projectsList, setProjectsList] = useState<ProAIUnifiedProject[]>(PRO_AI_PROJECTS);
  const [currentProject, setCurrentProject] = useState<ProAIUnifiedProject>(PRO_AI_PROJECTS[0]);
  const [activeDeptTab, setActiveDeptTab] = useState<'all' | 'ece' | 'cse' | 'architecture'>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // PDF Export Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportModalScope, setReportModalScope] = useState<ReportExportScope>('full');
  const [reportCustomMaterials, setReportCustomMaterials] = useState<ArchitectureMaterialCalculation | undefined>(undefined);

  const handleOpenDownloadReport = (
    scope?: ReportExportScope,
    customMaterials?: ArchitectureMaterialCalculation
  ) => {
    setReportModalScope(scope || (activeDeptTab === 'all' ? 'full' : activeDeptTab));
    if (customMaterials) {
      setReportCustomMaterials(customMaterials);
    }
    setIsReportModalOpen(true);
  };

  const handleGenerateNewProject = async (userPrompt: string, focusArea: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/pro-ai/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, focusArea })
      });

      if (!response.ok) throw new Error('Generation failed');
      const generated = await response.json();

      if (generated && generated.name) {
        setProjectsList(prev => [generated, ...prev]);
        setCurrentProject(generated);
        setActiveDeptTab('all');
      }
    } catch (err) {
      console.error('Error generating project with PRO AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16" id="pro-ai-arena-container">
      {/* Space-Themed Cosmic Header with Interactive Selector & Prompt Generator */}
      <ProAiSpaceHeader
        currentProject={currentProject}
        onSelectProject={(proj) => {
          setCurrentProject(proj);
          setActiveDeptTab('all');
        }}
        onGenerateNewProject={handleGenerateNewProject}
        isGenerating={isGenerating}
        activeDeptTab={activeDeptTab}
        setActiveDeptTab={setActiveDeptTab}
        onOpenDownloadReport={(scope) => handleOpenDownloadReport(scope || (activeDeptTab === 'all' ? 'full' : activeDeptTab))}
      />

      {/* Main Viewport Content based on active department tab */}
      <div className="relative z-10 transition-all duration-300">
        {activeDeptTab === 'all' && (
          <ProjectOverviewTab
            project={currentProject}
            onNavigateToDept={(dept) => setActiveDeptTab(dept)}
            onDownloadReport={(scope) => handleOpenDownloadReport(scope || 'full')}
          />
        )}

        {activeDeptTab === 'ece' && (
          <ECECircuitStudio 
            ece={currentProject.ece} 
            onUpdateDesign={(newEce) => {
              setCurrentProject(prev => ({ ...prev, ece: newEce }));
            }}
            onDownloadReport={(scope) => handleOpenDownloadReport(scope || 'ece')}
          />
        )}

        {activeDeptTab === 'cse' && (
          <CSECodeStudio
            modules={currentProject.cse.modules}
            projectTitle={currentProject.name}
            onDownloadReport={(scope) => handleOpenDownloadReport(scope || 'cse')}
          />
        )}

        {activeDeptTab === 'architecture' && (
          <ArchitectureMaterialStudio 
            architecture={currentProject.architecture} 
            onUpdateArchitecture={(newArch) => {
              setCurrentProject(prev => ({ ...prev, architecture: newArch }));
            }}
            onDownloadReport={(scope, mats) => handleOpenDownloadReport(scope || 'architecture', mats)}
          />
        )}
      </div>

      {/* PDF Export Modal */}
      <DownloadReportModal
        project={currentProject}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialScope={reportModalScope}
        customMaterials={reportCustomMaterials}
      />
    </div>
  );
};
