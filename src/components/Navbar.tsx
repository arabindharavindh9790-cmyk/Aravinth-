import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Layers, 
  Wand2, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  BarChart3, 
  DownloadCloud, 
  Wifi, 
  WifiOff, 
  Search, 
  Menu, 
  X, 
  Share2,
  Mic,
  Orbit
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export type AppTabType = 
  | 'pro-ai'
  | 'company-interview' 
  | 'company-intel' 
  | 'company-tests' 
  | 'star-optimizer' 
  | 'exams' 
  | 'quizzes' 
  | 'scholarships' 
  | 'analytics' 
  | 'offline';

interface NavbarProps {
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  offlineCount: number;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  offlineCount,
  onOpenSearch,
}) => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const proAiTab = {
    id: 'pro-ai' as const,
    label: 'PRO AI',
    icon: Orbit,
    badge: 'ECE • CSE • ARCH'
  };

  const mainCompanyTabs = [
    { id: 'company-interview' as const, label: 'AI Mock Interview', icon: Mic, badge: 'Live Voice & AI' },
    { id: 'company-intel' as const, label: 'Company Guides', icon: Building2, badge: 'FAANG & Top Firms' },
    { id: 'company-tests' as const, label: 'Screening Tests (OA)', icon: Layers, badge: 'Amazon/Google/TCS' },
    { id: 'star-optimizer' as const, label: 'STAR Answer Studio', icon: Wand2, badge: 'AI Polish' },
  ];

  const secondaryTabs = [
    { id: 'exams' as const, label: 'Govt Exams', icon: BookOpen },
    { id: 'quizzes' as const, label: 'CBT Quizzes', icon: FileText },
    { id: 'scholarships' as const, label: 'Scholarships', icon: GraduationCap },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'offline' as const, label: 'Offline Library', icon: DownloadCloud },
  ];

  return (
    <>
      <header id="aae-navbar" className="sticky top-0 z-40 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
              onClick={() => setActiveTab('company-interview')}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-700 to-amber-500 p-0.5 shadow-lg shadow-blue-900/40 group-hover:scale-105 transition duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300 text-base md:text-lg tracking-wider font-mono">
                    AAE
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg md:text-xl font-black tracking-tight text-white">
                    AAE <span className="text-blue-400">Education</span>
                  </span>
                  <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Govt Exams & Scholarships
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  State & Central Exam Syllabus • CBT Quizzes • Offline Library • Scholarships
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              {/* Featured PRO AI Space Engineering Tool */}
              <button
                id="nav-btn-pro-ai"
                onClick={() => setActiveTab('pro-ai')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition relative border ${
                  activeTab === 'pro-ai'
                    ? 'bg-[#050c24] text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] ring-1 ring-cyan-400/50'
                    : 'bg-[#040817] text-blue-200 border-blue-900/80 hover:border-cyan-500/60 hover:text-white shadow-sm'
                }`}
              >
                <Orbit className={`w-4 h-4 text-cyan-400 ${activeTab === 'pro-ai' ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>PRO AI</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                  ECE • CSE • ARCH
                </span>
              </button>

              <span className="w-px h-6 bg-slate-800 mx-1" />

              {/* Primary AI Company Tools */}
              {mainCompanyTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <span className="w-px h-6 bg-slate-800 mx-1" />

              {/* Secondary Tools */}
              {secondaryTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-btn-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-800 text-blue-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.id === 'offline' && offlineCount > 0 && (
                      <span className="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                        {offlineCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Tools: Search, Online Indicator, PWA Install */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search */}
              <button
                id="header-search-btn"
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs border border-slate-700 transition"
                title="Search exams, companies & scholarships"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">Quick Search</span>
                <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-[9px] bg-slate-900 border border-slate-700 rounded text-slate-400">
                  Ctrl+K
                </kbd>
              </button>

              {/* Online / Offline Status Badge */}
              <div 
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isOnline 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                }`}
                title={isOnline ? 'Connected to Internet' : 'Offline Mode Active - Cached materials available'}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    <span className="hidden sm:inline">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-400" />
                    <span>Offline</span>
                  </>
                )}
              </div>

              {/* PWA In-App Install Button */}
              {!isInstalled && isInstallable && (
                <button
                  id="pwa-install-header-btn"
                  onClick={install}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Install App</span>
                  <span className="sm:hidden">Install</span>
                </button>
              )}

              {/* iOS Safari Fallback Install */}
              {!isInstalled && isIOS && !isInstallable && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700"
                >
                  <Share2 className="w-3 h-3 text-blue-400" />
                  <span className="hidden sm:inline">Add to Home</span>
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown navigation menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-1">
            {/* PRO AI Space Tool for Mobile */}
            <button
              onClick={() => {
                setActiveTab('pro-ai');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                activeTab === 'pro-ai'
                  ? 'bg-[#050c24] text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-[#040817] text-blue-200 border-blue-900/80 hover:border-cyan-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Orbit className="w-5 h-5 text-cyan-400" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">PRO AI Space Lab</div>
                  <div className="text-[10px] text-cyan-300 font-mono">ECE • CSE • ARCHITECTURE</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
                Active
              </span>
            </button>

            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 pt-2">
              AI Company Interview & Tests
            </div>
            {mainCompanyTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                </button>
              );
            })}

            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 pt-3 border-t border-slate-800">
              Government Exams & Scholarships
            </div>
            {secondaryTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'offline' && offlineCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold">
                      {offlineCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* iOS Install Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Install AAE Education on iOS
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <p>Tap the <strong>Share</strong> button (box with an upward arrow) in the Safari toolbar.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <p>Scroll down the share sheet and tap <strong>Add to Home Screen</strong>.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <p>Launch from your home screen for full offline study and interview access anytime anywhere!</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
