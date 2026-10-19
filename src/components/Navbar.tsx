import React from 'react';
import { 
  Sparkles, 
  User, 
  History, 
  GraduationCap, 
  BookOpen, 
  Terminal, 
  FileText, 
  Presentation, 
  Calculator, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { StudentProfile, TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  student: StudentProfile;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  student,
  onOpenProfile,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Thought Titan Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Thought <span className="text-cyan-400">Titan</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 border border-cyan-800/60 rounded">
                  Titan AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Academic & Engineering Copilot • 18-Slide PPT • Live Voice • Visual Studio
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Student ID Badge */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all text-xs text-slate-200"
              title="Edit Student Credentials for Document Exports"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left hidden xs:block sm:block">
                <span className="font-mono font-medium text-cyan-300 block leading-tight">
                  {student.rollNo || '22951A05XX'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[100px] block">
                  {student.name}
                </span>
              </div>
              <User className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Saved History */}
            <button
              onClick={onOpenHistory}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all text-xs text-slate-300"
              title="View Previously Generated Materials"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-semibold font-mono">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
