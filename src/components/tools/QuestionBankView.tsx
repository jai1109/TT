import React, { useState } from 'react';
import { 
  Award, 
  HelpCircle, 
  BookOpen, 
  FileCheck2, 
  Sparkles, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { BLOOMS_TAXONOMY_LEVELS } from '../../data/iareData';

export const QuestionBankView: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState(BLOOMS_TAXONOMY_LEVELS[1].level);
  const [activeModule, setActiveModule] = useState('Module 1');

  const SAMPLE_EXAM_QUESTIONS: Record<string, { q: string; blooms: string; co: string; marks: number }[]> = {
    'Module 1': [
      {
        q: 'State and explain the fundamental axioms and asymptotic notations (Big-O, Omega, Theta) with mathematical formulations.',
        blooms: 'L2: Understanding',
        co: 'CO1',
        marks: 7,
      },
      {
        q: 'Solve the recurrence relation T(n) = 2T(n/2) + n using Master Theorem and Substitution Method. Compare their derivation bounds.',
        blooms: 'L3: Applying',
        co: 'CO1',
        marks: 7,
      },
    ],
    'Module 2': [
      {
        q: 'Construct an optimal Huffman Tree for the message frequency string: A:45, B:13, C:12, D:16, E:9, F:5. Compute compression ratio.',
        blooms: 'L3: Applying',
        co: 'CO2',
        marks: 7,
      },
      {
        q: 'Compare and contrast Prim\'s and Kruskal\'s Minimum Spanning Tree algorithms with dense and sparse graph edge analysis.',
        blooms: 'L4: Analyzing',
        co: 'CO2',
        marks: 7,
      },
    ],
    'Module 3': [
      {
        q: 'Demonstrate Dynamic Programming paradigm for the 0/1 Knapsack Problem with weights {2, 3, 4, 5} and values {3, 4, 5, 6} for Capacity W = 5.',
        blooms: 'L3: Applying',
        co: 'CO3',
        marks: 7,
      },
      {
        q: 'Derive the all-pairs shortest path matrix using Floyd-Warshall Algorithm for a 4-vertex directed weighted graph.',
        blooms: 'L3: Applying',
        co: 'CO3',
        marks: 7,
      },
    ],
    'Module 4': [
      {
        q: 'Explain the Backtracking state space tree formulation for the 4-Queens and 8-Queens puzzle with bounding functions.',
        blooms: 'L2: Understanding',
        co: 'CO4',
        marks: 7,
      },
      {
        q: 'Formulate the Branch and Bound bounding strategy for the Travelling Salesperson Problem (TSP) with reduced cost matrix.',
        blooms: 'L4: Analyzing',
        co: 'CO4',
        marks: 7,
      },
    ],
    'Module 5': [
      {
        q: 'Differentiate between P, NP, NP-Complete, and NP-Hard complexity classes with formal reduction diagrams.',
        blooms: 'L4: Analyzing',
        co: 'CO5',
        marks: 7,
      },
      {
        q: 'State Cook\'s Theorem and explain why the Boolean Satisfiability Problem (SAT) is NP-Complete.',
        blooms: 'L2: Understanding',
        co: 'CO5',
        marks: 7,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              IARE Autonomous Question Paper Blueprint & Bloom's Guide
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                CIA (30M) + SEE (70M)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Exam patterns, marks distribution, and Bloom's Taxonomy question formats followed by IARE question paper setters.
            </p>
          </div>
        </div>

        {/* Exam Structure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Continuous Internal Assessment (CIA - 30 Marks)
            </span>
            <ul className="mt-2.5 space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>CIA-I Exam (20 Marks):</strong> Units I & II (Subjective & Objective test)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>CIA-II Exam (20 Marks):</strong> Units III, IV & V</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span><strong>Continuous Evaluation (10 Marks):</strong> Tech Talk / Seminar + 2 Assignments (5M each)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              Semester End Examination (SEE - 70 Marks)
            </span>
            <ul className="mt-2.5 space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span><strong>Duration:</strong> 3 Hours | <strong>Total Marks:</strong> 70</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span><strong>Part A (10 Marks):</strong> 5 compulsory short answer questions (2 Marks each from 5 modules)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                <span><strong>Part B (60 Marks):</strong> 5 essay questions with internal choice (either/or) from each module (12 Marks each)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bloom's Taxonomy Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Bloom's Taxonomy Levels & Action Verbs
        </h3>
        <p className="text-xs text-slate-400">
          IARE question papers mandatorily tag every question with its corresponding Bloom's cognitive level.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {BLOOMS_TAXONOMY_LEVELS.map((b) => (
            <div
              key={b.level}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300">{b.level}</span>
                <span className="font-mono text-[10px] text-slate-500">{b.weight} Weight</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong>Verbs:</strong> {b.verbs}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* High-Probability Exam Questions Explorer */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-white">Curriculum High-Probability Question Bank</h3>
            <p className="text-xs text-slate-400">
              Frequently asked semester end exam questions with Bloom's mapping.
            </p>
          </div>

          {/* Module Selector */}
          <div className="flex gap-1.5 overflow-x-auto py-1">
            {['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5'].map((mod) => (
              <button
                key={mod}
                onClick={() => setActiveModule(mod)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeModule === mod
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        {/* Questions in active module */}
        <div className="space-y-3 pt-2">
          {(SAMPLE_EXAM_QUESTIONS[activeModule] || []).map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors text-xs sm:text-sm space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono font-bold text-cyan-400 text-xs">
                  {activeModule} • Model Question {idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-[10px] font-semibold text-indigo-400">
                    {item.blooms}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] font-semibold text-emerald-400">
                    {item.co}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px]">
                    {item.marks} Marks
                  </span>
                </div>
              </div>

              <p className="font-semibold text-slate-200 leading-relaxed">
                {item.q}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
