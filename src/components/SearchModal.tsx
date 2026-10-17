import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, FileText, GraduationCap, ArrowRight, ExternalLink } from 'lucide-react';
import { EXAMS_DATABASE } from '../data/examsData';
import { STUDY_MATERIALS_DATABASE } from '../data/studyMaterialsData';
import { SCHOLARSHIPS_DATABASE } from '../data/scholarshipsData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExam: (examId: string) => void;
  onSelectMaterial: (materialId: string) => void;
  onSelectScholarship: (scholarshipId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectExam,
  onSelectMaterial,
  onSelectScholarship,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle modal if trigger
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedExams = q
    ? EXAMS_DATABASE.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.conductingBody.toLowerCase().includes(q) ||
          e.shortCode.toLowerCase().includes(q) ||
          e.syllabus.some((s) => s.subject.toLowerCase().includes(q))
      ).slice(0, 4)
    : EXAMS_DATABASE.slice(0, 3);

  const matchedMaterials = q
    ? STUDY_MATERIALS_DATABASE.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 4)
    : STUDY_MATERIALS_DATABASE.slice(0, 3);

  const matchedScholarships = q
    ? SCHOLARSHIPS_DATABASE.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.authority.toLowerCase().includes(q) ||
          s.targetLevel.toLowerCase().includes(q)
      ).slice(0, 3)
    : SCHOLARSHIPS_DATABASE.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden space-y-0">
        {/* Search Input */}
        <div className="relative p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all state/central exams, syllabus topics, notes & scholarships..."
            className="w-full text-sm sm:text-base outline-none text-slate-900 placeholder:text-slate-400 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Section: Exams */}
          {matchedExams.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                Examinations & Syllabus
              </span>
              {matchedExams.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => {
                    onSelectExam(exam.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-blue-50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600">
                        {exam.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {exam.conductingBody} • {exam.category === 'central' ? 'Central' : exam.state}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </div>
              ))}
            </div>
          )}

          {/* Section: Study Materials */}
          {matchedMaterials.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                Study Materials & Revision Capsules
              </span>
              {matchedMaterials.map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => {
                    onSelectMaterial(mat.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-emerald-50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {mat.subject} • {mat.format}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                </div>
              ))}
            </div>
          )}

          {/* Section: Scholarships */}
          {matchedScholarships.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                Scholarship Schemes
              </span>
              {matchedScholarships.map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => {
                    onSelectScholarship(sch.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-amber-50 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-amber-800">
                        {sch.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {sch.authority} • Award: {sch.awardAmount}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>AAE Education Instant Global Search</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
