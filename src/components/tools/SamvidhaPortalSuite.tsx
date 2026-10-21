import React, { useState } from 'react';
import {
  GraduationCap,
  ClipboardList,
  Calendar,
  FileCheck,
  UserCheck,
  DollarSign,
  Clock,
  Printer,
  Download,
  Copy,
  Check,
  Search,
  Plus,
  Trash2,
  Sparkles,
  Building,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  FileText,
  QrCode,
  Compass,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { IARE_LOGO_DATA_URL } from '../../assets/iareLogo';
import { IARE_CURRICULUM_DATA, BLOOMS_TAXONOMY_LEVELS } from '../../data/iareData';
import { copyToClipboard, downloadFile } from '../../utils/api';

interface SamvidhaPortalSuiteProps {
  student: StudentProfile;
}

type SamvidhaSection = 
  | 'cie_marks' 
  | 'attendance' 
  | 'hall_ticket' 
  | 'syllabus_co' 
  | 'timetable' 
  | 'mentoring' 
  | 'no_dues'
  | 'survey';

interface CIESubject {
  code: string;
  name: string;
  cia1Desc: number; // out of 20
  cia1Quiz: number; // out of 10
  cia2Desc: number; // out of 20
  cia2Quiz: number; // out of 10
  aat: number;      // out of 5
  isLab?: boolean;
}

export const SamvidhaPortalSuite: React.FC<SamvidhaPortalSuiteProps> = ({ student }) => {
  const [activeSection, setActiveSection] = useState<SamvidhaSection>('cie_marks');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // -------------------------------------------------------------
  // STATE 1: CIE Marks Table
  // -------------------------------------------------------------
  const [cieSubjects, setCieSubjects] = useState<CIESubject[]>([
    { code: 'ACSD13', name: 'Design and Analysis of Algorithms', cia1Desc: 18, cia1Quiz: 9, cia2Desc: 17, cia2Quiz: 8, aat: 5 },
    { code: 'ACSD14', name: 'Operating Systems', cia1Desc: 16, cia1Quiz: 8, cia2Desc: 19, cia2Quiz: 9, aat: 4.5 },
    { code: 'ACSD15', name: 'Computer Networks', cia1Desc: 17, cia1Quiz: 9, cia2Desc: 16, cia2Quiz: 8, aat: 5 },
    { code: 'ACSD16', name: 'Formal Languages and Automata Theory', cia1Desc: 15, cia1Quiz: 7, cia2Desc: 18, cia2Quiz: 9, aat: 4 },
    { code: 'AHSD08', name: 'Managerial Economics and Financial Analysis', cia1Desc: 19, cia1Quiz: 9, cia2Desc: 18, cia2Quiz: 8, aat: 5 },
    { code: 'ACSD17', name: 'Operating Systems Laboratory', cia1Desc: 19, cia1Quiz: 10, cia2Desc: 20, cia2Quiz: 10, aat: 5, isLab: true },
    { code: 'ACSD18', name: 'Computer Networks Laboratory', cia1Desc: 18, cia1Quiz: 9, cia2Desc: 19, cia2Quiz: 9, aat: 5, isLab: true },
  ]);

  // Calculate CIE for a subject according to IARE R22 Regulation:
  // CIA1 Total = Desc + Quiz (out of 30)
  // CIA2 Total = Desc + Quiz (out of 30)
  // Higher CIA = max(CIA1, CIA2)
  // Lower CIA = min(CIA1, CIA2)
  // Best Weighted CIA = (0.8 * Higher) + (0.2 * Lower)
  // Final CIE = Best Weighted CIA + AAT (Max 35 + 5 = 40)
  const calculateCIE = (sub: CIESubject) => {
    const cia1Total = sub.cia1Desc + sub.cia1Quiz;
    const cia2Total = sub.cia2Desc + sub.cia2Quiz;
    const higher = Math.max(cia1Total, cia2Total);
    const lower = Math.min(cia1Total, cia2Total);
    const weightedCIA = 0.8 * higher + 0.2 * lower;
    const finalCIE = Math.min(40, Math.round((weightedCIA + sub.aat) * 10) / 10);
    const status = finalCIE >= 14 ? 'Eligible' : 'Not Qualified (<14)';
    return { cia1Total, cia2Total, weightedCIA: Math.round(weightedCIA * 10) / 10, finalCIE, status };
  };

  const handleCieChange = (index: number, field: keyof CIESubject, val: number) => {
    setCieSubjects(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  // -------------------------------------------------------------
  // STATE 2: Attendance Table
  // -------------------------------------------------------------
  const [attendanceRecords, setAttendanceRecords] = useState([
    { code: 'ACSD13', name: 'Design and Analysis of Algorithms', conducted: 42, attended: 36, faculty: 'Dr. K. Srinivas Rao' },
    { code: 'ACSD14', name: 'Operating Systems', conducted: 40, attended: 33, faculty: 'Prof. M. Rajesh' },
    { code: 'ACSD15', name: 'Computer Networks', conducted: 38, attended: 32, faculty: 'Dr. V. Radhika' },
    { code: 'ACSD16', name: 'Formal Languages and Automata Theory', conducted: 36, attended: 26, faculty: 'Dr. Ch. Suresh' },
    { code: 'AHSD08', name: 'Managerial Economics & Financial Analysis', conducted: 32, attended: 28, faculty: 'Prof. P. Sunitha' },
    { code: 'ACSD17', name: 'Operating Systems Laboratory', conducted: 14, attended: 13, faculty: 'Prof. M. Rajesh' },
    { code: 'ACSD18', name: 'Computer Networks Laboratory', conducted: 14, attended: 14, faculty: 'Dr. V. Radhika' },
  ]);

  const totalConducted = attendanceRecords.reduce((acc, r) => acc + r.conducted, 0);
  const totalAttended = attendanceRecords.reduce((acc, r) => acc + r.attended, 0);
  const overallPct = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0;

  // -------------------------------------------------------------
  // STATE 3: Timetable Matrix
  // -------------------------------------------------------------
  const timetableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timetablePeriods = [
    { num: 'P1', time: '09:30 - 10:25' },
    { num: 'P2', time: '10:25 - 11:20' },
    { num: 'P3', time: '11:20 - 12:15' },
    { num: 'Lunch', time: '12:15 - 01:00' },
    { num: 'P4', time: '01:00 - 01:55' },
    { num: 'P5', time: '01:55 - 02:50' },
    { num: 'P6', time: '02:50 - 03:45' },
    { num: 'P7', time: '03:45 - 04:30' },
  ];

  const defaultSchedule: Record<string, string[]> = {
    Monday: ['DAA (B-204)', 'OS (B-204)', 'CN (B-204)', 'LUNCH', 'OS LAB (Lab 4)', 'OS LAB (Lab 4)', 'FLAT (B-204)', 'Mentoring'],
    Tuesday: ['FLAT (B-204)', 'MEFA (B-204)', 'DAA (B-204)', 'LUNCH', 'CN (B-204)', 'OS (B-204)', 'Library', 'Sports'],
    Wednesday: ['OS (B-204)', 'CN (B-204)', 'FLAT (B-204)', 'LUNCH', 'CN LAB (Lab 2)', 'CN LAB (Lab 2)', 'MEFA (B-204)', 'Tech Talk'],
    Thursday: ['MEFA (B-204)', 'DAA (B-204)', 'OS (B-204)', 'LUNCH', 'FLAT (B-204)', 'CN (B-204)', 'Remedial', 'Seminars'],
    Friday: ['CN (B-204)', 'FLAT (B-204)', 'MEFA (B-204)', 'LUNCH', 'DAA Studio (Lab 5)', 'DAA Studio (Lab 5)', 'DAA (B-204)', 'Counseling'],
    Saturday: ['Tech Talk Seminar', 'AAT Micro Project', 'Project Phase-1', 'LUNCH', 'Library Access', 'Coding Practice', 'Club Activity', 'Depart'],
  };

  // -------------------------------------------------------------
  // STATE 4: Mentoring Diary Record
  // -------------------------------------------------------------
  const [mentorRecord, setMentorRecord] = useState({
    mentorName: 'Dr. V. Radhika, Associate Professor (CSE)',
    cabin: 'Bharadwaja Block, 2nd Floor, Room 2210',
    mentorContact: '+91 94401 23456',
    sessions: [
      { date: '12-Aug-2024', topic: 'Course Registration & Target SGPA Planning', remarks: 'Advised student to target 8.5+ SGPA and maintain >=80% attendance in all core subjects.' },
      { date: '25-Sep-2024', topic: 'CIA-1 Performance Review & AAT Topic Finalization', remarks: 'Scored well in DAA and OS. Topic for Tech Talk approved: "Distributed Consensus in Web3".' },
      { date: '28-Oct-2024', topic: 'Attendance & Semester End Exam Readiness', remarks: 'Attendance is above 80%. Recommended attending BuildIT mock coding tests for placement prep.' },
    ],
    parentContacted: 'Yes (SMS Alert dispatched & Telephonic confirmation on 26-Sep-2024)',
    actionTaken: 'Satisfactory academic progress. Recommended for Semester End Exam Hall Ticket without conditions.'
  });

  // -------------------------------------------------------------
  // STATE 5: Course Syllabus & CO-PO Matrix
  // -------------------------------------------------------------
  const [selectedCourseCode, setSelectedCourseCode] = useState('ACSD13');
  const courseSyllabusDb: Record<string, { title: string; modules: string[]; cos: string[]; pos: string }> = {
    ACSD13: {
      title: 'Design and Analysis of Algorithms (ACSD13)',
      modules: [
        'Module I: Introduction & Asymptotic Notations (Big-O, Omega, Theta), Divide and Conquer (MergeSort, QuickSort, Strassen Matrix Multiplication).',
        'Module II: Greedy Method (Knapsack Problem, Job Sequencing with Deadlines, Minimum Spanning Trees - Prim & Kruskal, Dijkstra Shortest Path).',
        'Module III: Dynamic Programming (0/1 Knapsack, All Pairs Shortest Path - Floyd-Warshall, Matrix Chain Multiplication, Bellman-Ford, Traveling Salesperson).',
        'Module IV: Backtracking & Branch and Bound (N-Queens Problem, Sum of Subsets, Graph Coloring, Hamiltonian Cycles, 0/1 Knapsack via Branch & Bound).',
        'Module V: NP-Hard and NP-Complete Problems (Basic Concepts, Non-deterministic Algorithms, Cook Theorem, Clique Decision Problem, Vertex Cover).',
      ],
      cos: [
        'CO1: Formulate and evaluate asymptotic time and space complexities using recurrence relations (Bloom Level: L3 Applying).',
        'CO2: Apply Divide-and-Conquer and Greedy paradigms to solve optimization problems (Bloom Level: L3 Applying).',
        'CO3: Analyze Dynamic Programming state transitions to eliminate exponential overheads (Bloom Level: L4 Analyzing).',
        'CO4: Design state-space tree traversal strategies using Backtracking and Branch & Bound (Bloom Level: L5 Evaluating).',
        'CO5: Categorize computational tractability into P, NP, NP-Hard, and NP-Complete complexity classes (Bloom Level: L4 Analyzing).',
      ],
      pos: 'PO1 (Engineering Knowledge): 3 | PO2 (Problem Analysis): 3 | PO3 (Design/Development): 3 | PO4 (Investigations): 2 | PO5 (Tool Usage): 2 | PSO1: 3 | PSO2: 3',
    },
    ACSD14: {
      title: 'Operating Systems (ACSD14)',
      modules: [
        'Module I: Operating System Structure & Process Management (System Calls, Process States, PCB, Context Switch, Process Scheduling).',
        'Module II: CPU Scheduling & Process Synchronization (Preemptive vs Non-Preemptive, Round Robin, Critical Section, Semaphores, Monitors, Classic Problems).',
        'Module III: Deadlocks (Deadlock Characterization, Prevention, Avoidance - Banker Algorithm, Detection, Recovery).',
        'Module IV: Memory Management (Contiguous Allocation, Paging, Segmentation, Virtual Memory, Demand Paging, Page Replacement Algorithms - FIFO, LRU, Optimal).',
        'Module V: File System Storage & I/O Systems (File Concepts, Allocation Methods, Disk Scheduling - FCFS, SSTF, SCAN, LOOK, RAID Levels).',
      ],
      cos: [
        'CO1: Explain operating system architecture, process lifecycle, and kernel mode execution (Bloom Level: L2 Understanding).',
        'CO2: Evaluate CPU scheduling algorithms and concurrency synchronization mechanisms (Bloom Level: L4 Analyzing).',
        'CO3: Apply Banker algorithm to simulate deadlock-free system resource allocation (Bloom Level: L3 Applying).',
        'CO4: Compare virtual memory demand paging algorithms under high workload constraints (Bloom Level: L4 Analyzing).',
        'CO5: Analyze disk scheduling algorithms and directory indexing structures (Bloom Level: L3 Applying).',
      ],
      pos: 'PO1: 3 | PO2: 3 | PO3: 2 | PO4: 2 | PO5: 2 | PSO1: 3 | PSO2: 2',
    },
    ACSD21: {
      title: 'Machine Learning & Neural Networks (ACSD21)',
      modules: [
        'Module I: Foundations of Machine Learning (Supervised vs Unsupervised, Bias-Variance Tradeoff, Gradient Descent, Linear Regression).',
        'Module II: Classification Algorithms (Logistic Regression, Decision Trees, Random Forests, Support Vector Machines - Linear & Kernel Trick).',
        'Module III: Unsupervised Learning (K-Means Clustering, Hierarchical Clustering, Principal Component Analysis - PCA, Dimensionality Reduction).',
        'Module IV: Artificial Neural Networks (Perceptron, Multi-Layer Perceptron, Backpropagation Algorithm, Activation Functions, Regularization).',
        'Module V: Deep Learning Architectures (Convolutional Neural Networks - CNN, Recurrent Neural Networks - RNN, Transformers, Model Evaluation).',
      ],
      cos: [
        'CO1: Formulate supervised learning models and mathematical optimization loss functions (Bloom Level: L3 Applying).',
        'CO2: Implement classification and ensemble methods with cross-validation benchmarks (Bloom Level: L3 Applying).',
        'CO3: Apply clustering and dimensionality reduction for high-dimensional feature spaces (Bloom Level: L4 Analyzing).',
        'CO4: Design and train deep multi-layer neural networks using backpropagation (Bloom Level: L5 Evaluating).',
        'CO5: Assess model generalization using ROC-AUC, Precision-Recall, and Confusion Matrices (Bloom Level: L4 Analyzing).',
      ],
      pos: 'PO1: 3 | PO2: 3 | PO3: 3 | PO4: 3 | PO5: 3 | PSO1: 3 | PSO2: 3',
    },
  };

  const activeSyllabus = courseSyllabusDb[selectedCourseCode] || courseSyllabusDb['ACSD13'];

  // Print Handlers
  const handlePrintSection = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs shadow-2xl backdrop-blur-md animate-fade-in border border-emerald-400">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Official Samvidha College Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1627] to-[#0a1220] border border-blue-900/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200 flex-shrink-0">
              <img
                src={IARE_LOGO_DATA_URL}
                alt="IARE Samvidha"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  SAMVIDHA ACADEMIC ERP
                </span>
                <span className="text-[11px] text-slate-400">
                  Autonomous • NAAC 'A+' • Dundigal, Hyderabad
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                IARE Samvidha Student Information & Academic Automation System
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Official institutional module for CIE continuous internal marks, biometric attendance records, hall tickets, course outcomes, timetables & mentoring records.
              </p>
            </div>
          </div>

          {/* Student Profile Card Pill */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1 sm:min-w-[280px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Student Name:</span>
              <span className="font-bold text-white">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Roll Number:</span>
              <span className="font-mono font-bold text-cyan-400">{student.rollNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Branch / Dept:</span>
              <span className="font-medium text-slate-200 truncate max-w-[170px]">{student.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Academic Year:</span>
              <span className="font-medium text-slate-200">{student.yearSem || 'B.Tech III Year'} • Sec {student.section || 'B'}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">Regulation:</span>
              <span className="font-mono text-emerald-400">{student.regulation || 'R22 Autonomous'}</span>
            </div>
          </div>
        </div>

        {/* Samvidha Feature Selector Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'cie_marks', label: 'CIE Internal Marks', icon: Award, badge: 'R22 Formula' },
            { id: 'attendance', label: 'Biometric Attendance', icon: Calendar, badge: '75% Rule' },
            { id: 'hall_ticket', label: 'Semester Hall Ticket', icon: QrCode, badge: 'Official SEE' },
            { id: 'syllabus_co', label: 'Course Syllabus & COs', icon: BookOpen, badge: 'Blooms L1-L6' },
            { id: 'timetable', label: 'Academic Timetable', icon: Clock, badge: 'Weekly Schedule' },
            { id: 'mentoring', label: 'Mentor-Mentee Diary', icon: UserCheck, badge: 'Counseling' },
            { id: 'no_dues', label: 'Fee Dues & Clearance', icon: DollarSign, badge: 'No Due Cert' },
            { id: 'survey', label: 'Course End Survey', icon: FileCheck, badge: 'Feedback' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as SamvidhaSection)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                    : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-blue-900/80 text-white' : 'bg-slate-900 text-slate-500'}`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: CIE CONTINUOUS INTERNAL MARKS */}
      {activeSection === 'cie_marks' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-400" />
                <span>Samvidha CIE Continuous Internal Evaluation Marks Calculator</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  IARE R22 Autonomous Rule
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Formula: Final CIE = (80% of max(CIA1, CIA2) + 20% of min(CIA1, CIA2)) + AAT Score (Max 40 Marks). Passing benchmark: 14 / 40.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintSection}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official CIE Sheet</span>
              </button>
            </div>
          </div>

          {/* CIE Marks Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Course Code</th>
                  <th className="py-3 px-3">Subject Title</th>
                  <th className="py-3 px-2 text-center">CIA-1 Desc (/20)</th>
                  <th className="py-3 px-2 text-center">CIA-1 Quiz (/10)</th>
                  <th className="py-3 px-2 text-center">CIA-2 Desc (/20)</th>
                  <th className="py-3 px-2 text-center">CIA-2 Quiz (/10)</th>
                  <th className="py-3 px-2 text-center">AAT (/5)</th>
                  <th className="py-3 px-3 text-center font-bold text-blue-400">Total CIE (/40)</th>
                  <th className="py-3 px-3 text-center">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {cieSubjects.map((sub, idx) => {
                  const { cia1Total, cia2Total, finalCIE, status } = calculateCIE(sub);
                  const isEligible = finalCIE >= 14;
                  return (
                    <tr key={sub.code} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{sub.code}</td>
                      <td className="py-3 px-3 font-sans font-medium text-slate-200">
                        {sub.name}
                        {sub.isLab && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">LAB</span>}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={sub.cia1Desc}
                          onChange={(e) => handleCieChange(idx, 'cia1Desc', Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={sub.cia1Quiz}
                          onChange={(e) => handleCieChange(idx, 'cia1Quiz', Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={sub.cia2Desc}
                          onChange={(e) => handleCieChange(idx, 'cia2Desc', Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={sub.cia2Quiz}
                          onChange={(e) => handleCieChange(idx, 'cia2Quiz', Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.5"
                          value={sub.aat}
                          onChange={(e) => handleCieChange(idx, 'aat', Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center text-white focus:outline-none focus:border-blue-500"
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-sm text-cyan-300">
                        {finalCIE}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                          isEligible ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: BIOMETRIC & PERIOD ATTENDANCE */}
      {activeSection === 'attendance' && (
        <div className="space-y-4">
          {/* Attendance KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 block mb-1">Overall College Attendance</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black ${overallPct >= 75 ? 'text-emerald-400' : overallPct >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {overallPct.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-400">({totalAttended} / {totalConducted} Periods)</span>
              </div>
              <div className="mt-3 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${overallPct >= 75 ? 'bg-emerald-500' : overallPct >= 65 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(100, overallPct)}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 block mb-1">Samvidha Hall Ticket Status</span>
              <div className="flex items-center gap-2 mt-1">
                {overallPct >= 75 ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-emerald-400">Regular Eligibility</span>
                      <p className="text-[11px] text-slate-400">Eligible for Semester End Exams without fines.</p>
                    </div>
                  </>
                ) : overallPct >= 65 ? (
                  <>
                    <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-amber-400">Condonation Required</span>
                      <p className="text-[11px] text-slate-400">Medical Certificate & ₹1000 fee required.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-sm text-rose-400">Detained Category</span>
                      <p className="text-[11px] text-slate-400">Below 65% statutory threshold.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs text-slate-400 block mb-1">Biometric Attendance Punch Record</span>
              <div className="text-xs space-y-1.5 text-slate-300 font-mono mt-1">
                <div className="flex justify-between">
                  <span>Morning Punch IN:</span>
                  <span className="text-emerald-400 font-bold">09:14 AM (Gate 1 Bio)</span>
                </div>
                <div className="flex justify-between">
                  <span>Evening Punch OUT:</span>
                  <span className="text-blue-400 font-bold">04:12 PM (Academic Bio)</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Status:</span>
                  <span className="text-emerald-400">PRESENT (Full Day Validated)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Attendance Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Subject-Wise Period Attendance Record</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Minimum 75% required per course</span>
            </div>

            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Subject Name</th>
                  <th className="py-3 px-3">Course Faculty</th>
                  <th className="py-3 px-2 text-center">Conducted</th>
                  <th className="py-3 px-2 text-center">Attended</th>
                  <th className="py-3 px-3 text-center">Percentage</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {attendanceRecords.map((r) => {
                  const pct = r.conducted > 0 ? (r.attended / r.conducted) * 100 : 0;
                  const isOk = pct >= 75;
                  return (
                    <tr key={r.code} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{r.code}</td>
                      <td className="py-3 px-3 font-sans font-medium text-slate-200">{r.name}</td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">{r.faculty}</td>
                      <td className="py-3 px-2 text-center text-slate-400">{r.conducted}</td>
                      <td className="py-3 px-2 text-center text-emerald-400 font-bold">{r.attended}</td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span className={pct >= 75 ? 'text-emerald-400' : pct >= 65 ? 'text-amber-400' : 'text-rose-400'}>
                          {pct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                          isOk ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {isOk ? 'Eligible' : 'Shortage'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: OFFICIAL SEMESTER HALL TICKET */}
      {activeSection === 'hall_ticket' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">Official IARE Samvidha Semester End Examination Hall Ticket</h3>
              <p className="text-xs text-slate-400">Authentic IARE Autonomous Examination Cell format with course dates, sessions, and candidate signature.</p>
            </div>
            <button
              onClick={handlePrintSection}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Hall Ticket (PDF)</span>
            </button>
          </div>

          {/* Printable Hall Ticket Canvas */}
          <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl border border-slate-300 shadow-2xl max-w-4xl mx-auto font-sans">
            {/* Header with College Emblem */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-4">
                <img src={IARE_LOGO_DATA_URL} alt="IARE" className="h-16 w-auto object-contain" />
                <div>
                  <h1 className="text-xl font-black text-[#003e7e] tracking-tight uppercase">
                    Institute of Aeronautical Engineering
                  </h1>
                  <p className="text-xs font-bold text-slate-700">
                    (Autonomous Institution • Affiliated to JNTUH • Approved by AICTE • Accredited by NAAC 'A+')
                  </p>
                  <p className="text-[11px] text-slate-600">Dundigal, Hyderabad - 500043, Telangana, India | www.iare.ac.in</p>
                  <div className="mt-1 inline-block px-3 py-0.5 rounded bg-[#003e7e] text-white text-xs font-bold uppercase tracking-wider">
                    HALL TICKET — B.TECH SEMESTER END EXAMINATIONS
                  </div>
                </div>
              </div>

              {/* Photo Box Placeholder */}
              <div className="w-24 h-28 border-2 border-dashed border-slate-400 rounded flex flex-col items-center justify-center text-center p-1 bg-slate-50 flex-shrink-0">
                <QrCode className="w-8 h-8 text-slate-500 mb-1" />
                <span className="text-[9px] font-bold text-slate-600 uppercase">Affix Candidate Photo</span>
              </div>
            </div>

            {/* Candidate Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-6 font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Hall Ticket / Roll No</span>
                <span className="font-bold text-sm text-[#003e7e]">{student.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Candidate Name</span>
                <span className="font-bold text-slate-800 font-sans">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Branch & Section</span>
                <span className="font-bold text-slate-800 font-sans">{student.branch} ({student.section || 'B'})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Regulation & Center</span>
                <span className="font-bold text-emerald-700 font-sans">{student.regulation || 'R22'} (IARE Campus)</span>
              </div>
            </div>

            {/* Examination Schedule Table */}
            <table className="w-full text-left text-xs border border-slate-300 border-collapse mb-6">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                  <th className="p-2.5 border-r border-slate-300">Course Code</th>
                  <th className="p-2.5 border-r border-slate-300">Course Name</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">Exam Date</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">Session & Time</th>
                  <th className="p-2.5 text-center">Invigilator Sign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { code: 'ACSD13', name: 'Design and Analysis of Algorithms', date: '02-Dec-2024', time: 'FN (10:00 AM - 01:00 PM)' },
                  { code: 'ACSD14', name: 'Operating Systems', date: '05-Dec-2024', time: 'FN (10:00 AM - 01:00 PM)' },
                  { code: 'ACSD15', name: 'Computer Networks', date: '09-Dec-2024', time: 'FN (10:00 AM - 01:00 PM)' },
                  { code: 'ACSD16', name: 'Formal Languages and Automata Theory', date: '12-Dec-2024', time: 'FN (10:00 AM - 01:00 PM)' },
                  { code: 'AHSD08', name: 'Managerial Economics and Financial Analysis', date: '16-Dec-2024', time: 'FN (10:00 AM - 01:00 PM)' },
                ].map((row) => (
                  <tr key={row.code}>
                    <td className="p-2.5 font-bold font-mono border-r border-slate-300 text-[#003e7e]">{row.code}</td>
                    <td className="p-2.5 font-medium border-r border-slate-300">{row.name}</td>
                    <td className="p-2.5 font-mono text-center border-r border-slate-300">{row.date}</td>
                    <td className="p-2.5 font-mono text-center border-r border-slate-300 text-slate-600">{row.time}</td>
                    <td className="p-2.5 text-center text-slate-400 font-mono">___________</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Candidate Instructions & Signatures */}
            <div className="border-t border-slate-300 pt-4 text-[10px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">INSTRUCTIONS TO THE CANDIDATE:</p>
              <p>1. The candidate must report to the examination hall 15 minutes before the commencement of the exam with their physical ID card.</p>
              <p>2. Electronic gadgets, smart watches, programmable calculators, and study materials are strictly prohibited inside the hall.</p>
              <p>3. Possession of this Hall Ticket certifies that the student has fulfilled attendance (≥75%) and CIE minimum qualifications.</p>
            </div>

            <div className="mt-8 pt-6 flex justify-between items-end text-xs font-bold text-slate-800">
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1" />
                <span>Candidate’s Signature</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1" />
                <span>Chief Superintendent</span>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1" />
                <span className="text-[#003e7e]">Controller of Examinations</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: COURSE SYLLABUS & CO-PO MATRIX */}
      {activeSection === 'syllabus_co' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>IARE Course Syllabus, Course Outcomes (COs) & Blooms Levels</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official curriculum compendium mapped with Bloom's Taxonomy Cognitive Domains (L1-L6) and Program Outcomes.
              </p>
            </div>

            {/* Course Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Select Course:</span>
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
              >
                <option value="ACSD13">DAA (ACSD13)</option>
                <option value="ACSD14">Operating Systems (ACSD14)</option>
                <option value="ACSD21">Machine Learning (ACSD21)</option>
              </select>
            </div>
          </div>

          {/* Syllabus Modules */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-cyan-300 border-b border-slate-800 pb-2">
              {activeSyllabus.title} — Detailed Course Modules
            </h3>
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              {activeSyllabus.modules.map((mod, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="font-semibold text-white block mb-1">{mod.split(':')[0]}:</span>
                  <p className="text-slate-400">{mod.split(':')[1]}</p>
                </div>
              ))}
            </div>

            {/* Course Outcomes (CO1 to CO5) */}
            <h3 className="font-bold text-sm text-emerald-400 pt-4 border-b border-slate-800 pb-2">
              Course Outcomes (CO1 - CO5) with Bloom’s Taxonomy Mapping
            </h3>
            <div className="space-y-2 text-xs">
              {activeSyllabus.cos.map((co, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono font-bold text-[10px]">
                    CO{idx + 1}
                  </span>
                  <span>{co}</span>
                </div>
              ))}
            </div>

            {/* PO & PSO Articulation */}
            <div className="pt-3 p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/60 text-xs">
              <span className="font-bold text-blue-300 block mb-1">Program Outcomes (PO) & PSO Mapping Matrix (3: High, 2: Medium, 1: Low):</span>
              <p className="font-mono text-slate-300 text-[11px]">{activeSyllabus.pos}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DAY-TO-DAY ACADEMIC TIMETABLE */}
      {activeSection === 'timetable' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>IARE Samvidha Master Class Timetable & Schedule</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Classroom Room Allocation: Bharadwaja Block (B-204) • Laboratories: Computer Center CC-04.
              </p>
            </div>
            <button
              onClick={handlePrintSection}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Timetable</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full text-center text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3 text-left">Day / Period</th>
                  {timetablePeriods.map((p) => (
                    <th key={p.num} className="py-3 px-2">
                      <div className="font-bold text-white">{p.num}</div>
                      <div className="text-[9px] text-slate-500 font-mono">{p.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {timetableDays.map((day) => (
                  <tr key={day} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white font-sans text-left bg-slate-950/50">{day}</td>
                    {defaultSchedule[day]?.map((periodSlot, idx) => (
                      <td key={idx} className={`py-3 px-2 ${periodSlot === 'LUNCH' ? 'bg-slate-950 font-bold text-slate-500' : ''}`}>
                        <span className={`px-2 py-1 rounded ${
                          periodSlot.includes('LAB') || periodSlot.includes('Studio')
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : periodSlot.includes('Tech') || periodSlot.includes('Seminar')
                            ? 'bg-violet-950/80 text-violet-300 border border-violet-800'
                            : 'text-slate-200'
                        }`}>
                          {periodSlot}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6: MENTOR-MENTEE COUNSELING DIARY */}
      {activeSection === 'mentoring' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  <span>Samvidha Mentor-Mentee Counseling Log & Review Diary</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Institutional mentorship tracking for academic progress, placement goals, and parent communications.
                </p>
              </div>
            </div>

            {/* Mentor Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs mb-4">
              <div>
                <span className="text-slate-500 block">Assigned Faculty Mentor:</span>
                <span className="font-bold text-white text-sm">{mentorRecord.mentorName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mentor Cabin Location:</span>
                <span className="font-medium text-slate-300">{mentorRecord.cabin}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Parent Communication Status:</span>
                <span className="font-medium text-emerald-400">{mentorRecord.parentContacted}</span>
              </div>
            </div>

            {/* Meeting Timeline */}
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Counseling Sessions Record:</h3>
            <div className="space-y-3">
              {mentorRecord.sessions.map((ses, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400">Session {idx + 1}: {ses.topic}</span>
                    <span className="font-mono text-slate-500">{ses.date}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">{ses.remarks}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/60 text-xs flex items-center gap-2 text-emerald-300">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span><strong>Mentor Evaluation:</strong> {mentorRecord.actionTaken}</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: FEE DUES & NO DUE CERTIFICATE */}
      {activeSection === 'no_dues' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span>Samvidha Fee Dues & "No Due Certificate" Verification</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Institutional clearance status across all institutional departments required for exam hall ticket clearance.
              </p>
            </div>
            <button
              onClick={handlePrintSection}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print No Due Certificate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'College Tuition Fee', status: 'PAID IN FULL', amount: '₹1,05,000 / Year', ok: true },
              { title: 'Semester Examination Fee', status: 'CLEARED', amount: '₹1,800', ok: true },
              { title: 'Library Books Clearance', status: 'NO BOOKS OVERDUE', amount: '0 Books Pending', ok: true },
              { title: 'Laboratory Equipment Dues', status: 'CLEARED', amount: 'Nil', ok: true },
            ].map((fee, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">{fee.title}</span>
                <span className="text-emerald-400 font-bold text-sm block mb-1">{fee.status}</span>
                <span className="text-slate-500 text-[11px] font-mono">{fee.amount}</span>
              </div>
            ))}
          </div>

          {/* Certificate Preview Card */}
          <div className="p-8 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-xl max-w-3xl mx-auto text-xs space-y-4 font-sans">
            <div className="text-center border-b pb-4">
              <h3 className="font-black text-lg text-[#003e7e]">INSTITUTE OF AERONAUTICAL ENGINEERING</h3>
              <p className="font-semibold text-slate-600">Dundigal, Hyderabad - 500043</p>
              <div className="mt-2 inline-block px-4 py-1 rounded bg-emerald-700 text-white font-bold text-xs">
                OFFICIAL NO DUE CERTIFICATE (2024 - 2025)
              </div>
            </div>

            <p className="leading-relaxed">
              This is to certify that <strong>{student.name}</strong> bearing Roll Number <strong className="font-mono text-[#003e7e]">{student.rollNo}</strong>, student of <strong>{student.branch}</strong> ({student.yearSem || 'III Year'}), has cleared all college tuition dues, library books, laboratory apparatus charges, and hostel dues. No dues are outstanding against their name.
            </p>

            <div className="grid grid-cols-4 gap-4 pt-8 text-center text-[10px] font-bold text-slate-700">
              <div>
                <div className="w-20 border-b border-slate-400 mx-auto mb-1" />
                <span>Head of Dept</span>
              </div>
              <div>
                <div className="w-20 border-b border-slate-400 mx-auto mb-1" />
                <span>Librarian</span>
              </div>
              <div>
                <div className="w-20 border-b border-slate-400 mx-auto mb-1" />
                <span>Accounts Officer</span>
              </div>
              <div>
                <div className="w-20 border-b border-slate-400 mx-auto mb-1" />
                <span>Principal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: COURSE END SURVEY */}
      {activeSection === 'survey' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-400" />
              <span>Samvidha Student Course End Survey (CES) & Faculty Feedback</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              End-of-semester feedback mandatory for course attainment computation on Samvidha portal.
            </p>

            <div className="mt-4 space-y-3">
              {[
                'The course syllabus and instructional objectives were clearly articulated at the start of semester.',
                'The faculty utilized modern pedagogy, coding demonstrations, and real-time case studies effectively.',
                'Lab experiments provided practical hands-on application aligning with theoretical classroom lectures.',
                'Alternative Assessment Tools (Tech Talk, Assignments, Quizzes) enhanced critical analytical thinking.',
                'Evaluation of Continuous Internal Assessment (CIA) was transparent, objective, and timely.',
              ].map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-slate-300 font-medium">Q{idx + 1}. {q}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {['Excellent (5)', 'Very Good (4)', 'Good (3)'].map((opt, oIdx) => (
                      <span key={oIdx} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-semibold cursor-pointer hover:border-cyan-500">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => showToast('Course End Survey Submitted Successfully on Samvidha!')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
            >
              Submit Course End Survey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
