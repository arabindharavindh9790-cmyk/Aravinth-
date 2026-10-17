import React, { useState, useEffect, useMemo } from 'react';
import { 
  DownloadCloud, 
  CheckCircle, 
  Trash2, 
  BookOpen, 
  FileText, 
  Sparkles, 
  WifiOff, 
  Search, 
  ArrowLeft, 
  Copy, 
  Check, 
  HardDrive,
  ZoomIn,
  ZoomOut,
  Clock,
  Printer,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { StudyMaterial } from '../types';
import { STUDY_MATERIALS_DATABASE } from '../data/studyMaterialsData';
import { 
  saveStudyMaterialOffline, 
  getOfflineStudyMaterial, 
  getAllOfflineStudyMaterials, 
  removeStudyMaterialOffline 
} from '../utils/offlineStorage';

interface OfflineLibraryProps {
  initialMaterialId?: string;
  onMaterialsCountChange?: (count: number) => void;
}

export const OfflineLibrary: React.FC<OfflineLibraryProps> = ({
  initialMaterialId,
  onMaterialsCountChange,
}) => {
  const [offlineItems, setOfflineItems] = useState<Record<string, StudyMaterial>>({});
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyDownloaded, setOnlyDownloaded] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadingAll, setDownloadingAll] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Load offline saved materials
  const loadOfflineCache = async () => {
    try {
      const items = await getAllOfflineStudyMaterials();
      const map: Record<string, StudyMaterial> = {};
      items.forEach((m: StudyMaterial) => {
        map[m.id] = m;
      });
      setOfflineItems(map);
      if (onMaterialsCountChange) {
        onMaterialsCountChange(items.length);
      }
    } catch (err) {
      console.error('Failed to load offline materials:', err);
    }
  };

  useEffect(() => {
    loadOfflineCache();
  }, []);

  useEffect(() => {
    if (initialMaterialId) {
      const found = STUDY_MATERIALS_DATABASE.find((m) => m.id === initialMaterialId);
      if (found) {
        setSelectedMaterial(found);
      }
    }
  }, [initialMaterialId]);

  // Handle single download
  const handleToggleDownload = async (material: StudyMaterial, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isDownloaded = !!offlineItems[material.id];
    if (isDownloaded) {
      await removeStudyMaterialOffline(material.id);
    } else {
      await saveStudyMaterialOffline(material);
    }
    await loadOfflineCache();
  };

  // Download all materials at once
  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    for (const mat of STUDY_MATERIALS_DATABASE) {
      await saveStudyMaterialOffline(mat);
    }
    await loadOfflineCache();
    setDownloadingAll(false);
  };

  // Clear all offline storage
  const handleClearAllOffline = async () => {
    for (const id of Object.keys(offlineItems)) {
      await removeStudyMaterialOffline(id);
    }
    await loadOfflineCache();
    setShowClearConfirm(false);
  };

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return STUDY_MATERIALS_DATABASE.filter((mat) => {
      if (onlyDownloaded && !offlineItems[mat.id]) {
        return false;
      }
      if (selectedCategory !== 'all' && mat.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = mat.title.toLowerCase().includes(q);
        const matchesSubject = mat.subject.toLowerCase().includes(q);
        const matchesTags = mat.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSubject && !matchesTags) return false;
      }
      return true;
    });
  }, [selectedCategory, onlyDownloaded, searchQuery, offlineItems]);

  const categories = ['all', 'General Studies', 'Aptitude & Reasoning', 'State Exams', 'Scholarships', 'Current Affairs'];

  // Reader Copy function
  const handleCopyContent = () => {
    if (!selectedMaterial) return;
    navigator.clipboard.writeText(selectedMaterial.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const offlineSavedCount = Object.keys(offlineItems).length;
  const totalCount = STUDY_MATERIALS_DATABASE.length;
  const offlinePercentage = totalCount > 0 ? Math.round((offlineSavedCount / totalCount) * 100) : 0;

  // If viewing a single material (Reader Mode)
  if (selectedMaterial) {
    const isOfflineAvailable = !!offlineItems[selectedMaterial.id];

    return (
      <div id="material-reader-screen" className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-4">
        {/* Top bar back button & tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setSelectedMaterial(null)}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Study Materials Library</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Font size adjustments */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded font-bold ${fontSize === 'sm' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
                title="Smaller text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded font-bold ${fontSize === 'base' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded font-bold ${fontSize === 'lg' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
                title="Larger text"
              >
                A+
              </button>
            </div>

            {/* Print / Export PDF */}
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Print / Save PDF of this study capsule"
            >
              <Printer className="w-4 h-4 text-blue-600" />
            </button>

            {/* Offline save toggle */}
            <button
              onClick={() => handleToggleDownload(selectedMaterial)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                isOfflineAvailable
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              }`}
            >
              {isOfflineAvailable ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved Offline</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>Save for Offline</span>
                </>
              )}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyContent}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Copy text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reader Document Canvas */}
        <article className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
          {/* Header Metadata */}
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {selectedMaterial.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {selectedMaterial.subject}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {selectedMaterial.readTime}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-[11px] font-semibold text-emerald-600">
                {isOfflineAvailable ? 'Cached in Local Storage' : 'Online Mode'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {selectedMaterial.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {selectedMaterial.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedMaterial.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Formatted Content Viewer */}
          <div
            className={`prose prose-slate max-w-none leading-relaxed select-text space-y-4 ${
              fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            }`}
          >
            {selectedMaterial.content.split('\n\n').map((paragraph, pIdx) => {
              // Heading 1
              if (paragraph.startsWith('# ')) {
                return (
                  <h2 key={pIdx} className="text-xl sm:text-2xl font-black text-slate-900 pt-4 pb-2 border-b border-slate-100">
                    {paragraph.replace('# ', '')}
                  </h2>
                );
              }
              // Heading 2
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={pIdx} className="text-lg sm:text-xl font-bold text-slate-900 pt-3 pb-1 text-blue-950">
                    {paragraph.replace('## ', '')}
                  </h3>
                );
              }
              // Heading 3
              if (paragraph.startsWith('### ')) {
                return (
                  <h4 key={pIdx} className="text-base font-bold text-slate-800 pt-2">
                    {paragraph.replace('### ', '')}
                  </h4>
                );
              }
              // Divider
              if (paragraph.trim() === '---') {
                return <hr key={pIdx} className="border-slate-200 my-4" />;
              }
              // Bullets
              if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-slate-800">
                    {items.map((it, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">
                        {it.replace(/^[\*\-]\s+/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Numbered list
              if (/^\d+\./.test(paragraph.trim())) {
                const items = paragraph.split('\n');
                return (
                  <ol key={pIdx} className="list-decimal pl-5 space-y-1.5 text-slate-800">
                    {items.map((it, iIdx) => (
                      <li key={iIdx} className="leading-relaxed">
                        {it.replace(/^\d+\.\s+/, '')}
                      </li>
                    ))}
                  </ol>
                );
              }
              // Standard paragraph
              return (
                <p key={pIdx} className="text-slate-800 whitespace-pre-line leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    );
  }

  // Library Catalog View
  return (
    <div id="offline-library-catalog" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
              <WifiOff className="w-3.5 h-3.5 text-emerald-300" />
              <span>100% Offline Access Capability • AAE Education</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Offline Study Materials & Revision Capsules
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Download high-yield revision capsules, Indian Polity articles, Modern History timelines, speed maths formulas, General Science, and scholarship guides directly into browser IndexedDB for uninterrupted learning anywhere without internet.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>{downloadingAll ? 'Caching All Materials...' : 'Download All (Offline 100%)'}</span>
            </button>

            {offlineSavedCount > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                title="Clear Offline Cache"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Offline Cache Status & Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>
                <strong>{offlineSavedCount} of {totalCount}</strong> Materials Cached Locally ({offlinePercentage}%)
              </span>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>IndexedDB Offline Storage Active</span>
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${offlinePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clear Cache Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Clear Offline Storage?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove all {offlineSavedCount} cached study capsules from your offline storage. You can re-download them anytime when online.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllOffline}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Subjects' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Show only downloaded toggle */}
            <button
              onClick={() => setOnlyDownloaded((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 border ${
                onlyDownloaded
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Downloaded Only ({offlineSavedCount})</span>
            </button>

            {/* Search bar */}
            <div className="relative w-full md:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search capsule..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => {
          const isDownloaded = !!offlineItems[mat.id];

          return (
            <div
              key={mat.id}
              onClick={() => setSelectedMaterial(mat)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {mat.format}
                  </span>

                  <button
                    onClick={(e) => handleToggleDownload(mat, e)}
                    className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                      isDownloaded
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'
                    }`}
                    title={isDownloaded ? 'Click to remove from offline cache' : 'Download for offline reading'}
                  >
                    {isDownloaded ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px]">Saved</span>
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Save</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {mat.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {mat.readTime}
                </span>
                <span className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  Read Capsule →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
