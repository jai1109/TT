import React, { useState, useEffect } from 'react';
import { 
  Presentation, 
  FileCode, 
  FileText, 
  BookOpen, 
  Terminal, 
  FolderGit2, 
  Calculator, 
  Calendar, 
  Award, 
  Globe, 
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Radio,
  Wand2
} from 'lucide-react';

import { SavedHistoryItem, StudentProfile, TabType } from './types';
import { 
  getSavedStudentProfile, 
  saveStudentProfile, 
  loadHistory, 
  deleteHistoryItem, 
  clearAllHistory 
} from './utils/api';

import { Navbar } from './components/Navbar';
import { StudentProfileModal } from './components/StudentProfileModal';
import { HistoryDrawer } from './components/HistoryDrawer';

// Generators & Multimodal Tools
import { PPTGenerator } from './components/generators/PPTGenerator';
import { LiveVoiceAssistant } from './components/voice/LiveVoiceAssistant';
import { ImageStudio } from './components/image/ImageStudio';
import { LabRecordGenerator } from './components/generators/LabRecordGenerator';
import { AssignmentGenerator } from './components/generators/AssignmentGenerator';
import { CaseStudyGenerator } from './components/generators/CaseStudyGenerator';
import { CodeSolver } from './components/generators/CodeSolver';
import { ProjectDocGenerator } from './components/generators/ProjectDocGenerator';

// Academic Tools
import { CgpaCalculator } from './components/tools/CgpaCalculator';
import { AttendancePlanner } from './components/tools/AttendancePlanner';
import { QuestionBankView } from './components/tools/QuestionBankView';
import { QuickLinksView } from './components/tools/QuickLinksView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('ppt');
  const [student, setStudent] = useState<StudentProfile>(getSavedStudentProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<SavedHistoryItem[]>([]);
  const [restoredData, setRestoredData] = useState<{ type: TabType; data: any } | null>(null);

  useEffect(() => {
    setHistoryItems(loadHistory());
  }, []);

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setStudent(newProfile);
    saveStudentProfile(newProfile);
  };

  const handleSelectHistoryItem = (item: SavedHistoryItem) => {
    setActiveTab(item.type);
    setRestoredData({ type: item.type, data: item.data });
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistoryItems(updated);
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistoryItems([]);
  };

  const tabs = [
    { id: 'ppt' as TabType, label: 'PPT Generator', icon: Presentation, badge: '18 Slides' },
    { id: 'live_voice' as TabType, label: 'Live Voice AI', icon: Radio, badge: 'Gemini 3.8' },
    { id: 'image_studio' as TabType, label: 'Visual Studio', icon: Wand2, badge: 'Vector Art' },
    { id: 'lab_record' as TabType, label: 'Lab Record', icon: FileCode, badge: 'Manual' },
    { id: 'assignment' as TabType, label: 'Assignment', icon: FileText, badge: 'Blooms' },
    { id: 'case_study' as TabType, label: 'Case Study', icon: BookOpen, badge: 'Analysis' },
    { id: 'code_solver' as TabType, label: 'BuildIT Solver', icon: Terminal, badge: 'PAT' },
    { id: 'project_doc' as TabType, label: 'Project SRS', icon: FolderGit2, badge: 'Mini/Major' },
    { id: 'cgpa_calc' as TabType, label: 'SGPA/CGPA', icon: Calculator, badge: 'R22' },
    { id: 'attendance' as TabType, label: 'Attendance', icon: Calendar, badge: '75%' },
    { id: 'question_bank' as TabType, label: 'Exam Blueprint', icon: Award, badge: 'CIA/SEE' },
    { id: 'portal_links' as TabType, label: 'IARE Portals', icon: Globe, badge: 'Links' },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top App Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHistory={() => {
          setHistoryItems(loadHistory());
          setIsHistoryOpen(true);
        }}
        historyCount={historyItems.length}
      />

      {/* Hero Announcement & Fast Switcher */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#080c14] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/70">
                  <Zap className="w-3 h-3" /> Thought Titan Multi-Engine Online
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  • 18-Slide Decks • Gemini 3.8 Live Voice • Gemini Nano Banana 2.1
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Academic & Engineering Copilot: <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Thought Titan</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Create 18-slide presentations, converse in real-time with Live Voice AI, generate diagrams, and automate lab manuals.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs self-start md:self-auto">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
                  18S
                </div>
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[10px] text-indigo-300 font-bold">
                  LIVE
                </div>
                <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-[10px] text-violet-300 font-bold">
                  IMG
                </div>
              </div>
              <span className="text-slate-400 text-[11px] pl-1">
                Titan Suite Pro
              </span>
            </div>
          </div>

          {/* Tab Navigation Scrollable Bar */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setRestoredData(null);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 text-white border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-cyan-500/30 text-cyan-300'
                        : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'ppt' && (
          <PPTGenerator
            student={student}
            initialData={restoredData?.type === 'ppt' ? restoredData.data : null}
          />
        )}
        {activeTab === 'live_voice' && <LiveVoiceAssistant />}
        {activeTab === 'image_studio' && <ImageStudio />}
        {activeTab === 'lab_record' && (
          <LabRecordGenerator
            student={student}
            initialData={restoredData?.type === 'lab_record' ? restoredData.data : null}
          />
        )}
        {activeTab === 'assignment' && (
          <AssignmentGenerator
            student={student}
            initialData={restoredData?.type === 'assignment' ? restoredData.data : null}
          />
        )}
        {activeTab === 'case_study' && (
          <CaseStudyGenerator
            student={student}
            initialData={restoredData?.type === 'case_study' ? restoredData.data : null}
          />
        )}
        {activeTab === 'code_solver' && (
          <CodeSolver
            student={student}
            initialData={restoredData?.type === 'code_solver' ? restoredData.data : null}
          />
        )}
        {activeTab === 'project_doc' && (
          <ProjectDocGenerator
            student={student}
            initialData={restoredData?.type === 'project_doc' ? restoredData.data : null}
          />
        )}
        {activeTab === 'cgpa_calc' && <CgpaCalculator student={student} />}
        {activeTab === 'attendance' && <AttendancePlanner />}
        {activeTab === 'question_bank' && <QuestionBankView />}
        {activeTab === 'portal_links' && <QuickLinksView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Thought Titan</span>
            <span>•</span>
            <span>Premier AI Academic & Engineering Research Suite</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Roll No: <span className="font-mono text-cyan-300">{student.rollNo}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('portal_links')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Official Portals
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={student}
        onSave={handleSaveProfile}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={historyItems}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
