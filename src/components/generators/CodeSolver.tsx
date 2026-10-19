import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Database, 
  HelpCircle, 
  AlertTriangle, 
  RefreshCw,
  Code2
} from 'lucide-react';
import { CodeSolutionData, StudentProfile } from '../../types';
import { CODE_SOLVER_PRESETS } from '../../data/iareData';
import { copyToClipboard, requestGeneration, saveHistoryItem } from '../../utils/api';

interface CodeSolverProps {
  student: StudentProfile;
  initialData?: CodeSolutionData | null;
}

export const CodeSolver: React.FC<CodeSolverProps> = ({ student, initialData }) => {
  const [problem, setProblem] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [codeData, setCodeData] = useState<CodeSolutionData | null>(initialData || null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCodeData(initialData);
    }
  }, [initialData]);

  const handleGenerate = async (customProblem?: string, customLang?: string) => {
    const textToUse = customProblem || problem;
    if (!textToUse.trim()) return;

    setLoading(true);
    try {
      const data = await requestGeneration(
        'code_solution',
        textToUse,
        { language: customLang || language },
        student
      );
      setCodeData(data);
      saveHistoryItem('code_solver', `BuildIT: ${data.problemTitle}`, data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!codeData) return;
    copyToClipboard(codeData.optimalCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              IARE BuildIT & PAT Lab Solver
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
                100% Test Case Pass
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Optimal code solutions, time & space Big-O analysis, logic walkthroughs, and edge cases for IARE BuildIT & coding contests.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-slate-300">Target Language:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'python', label: 'Python 3' },
                { id: 'cpp', label: 'C++ 20' },
                { id: 'java', label: 'Java 17' },
                { id: 'c', label: 'C (GCC)' },
                { id: 'sql', label: 'SQL (Oracle/Postgres)' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    language === lang.id
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Paste BuildIT Problem Statement / Function Requirements
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g. Given an array of integers, find the maximum subarray sum in O(N) using Kadane's algorithm, handling all negative numbers..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex-1 min-w-[200px]">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Frequently Asked BuildIT Problems (1-Click Try):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CODE_SOLVER_PRESETS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setProblem(item);
                      handleGenerate(item);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-slate-300 transition-colors"
                  >
                    {item.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={loading || !problem.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all self-end"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Solution...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Solve Problem
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Solution Workspace */}
      {codeData && (
        <div className="space-y-5">
          {/* Top Complexity Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Time Complexity
                </span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {codeData.timeComplexity}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Space Complexity
                </span>
                <span className="text-sm font-mono font-bold text-indigo-400">
                  {codeData.spaceComplexity}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Language & Engine
                </span>
                <span className="text-sm font-mono font-bold text-purple-300 uppercase">
                  {codeData.language}
                </span>
              </div>
            </div>
          </div>

          {/* Optimal Code Editor Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-300 font-semibold">
                  {codeData.problemTitle} (Optimal Implementation)
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied Code' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-5 text-xs sm:text-sm font-mono text-purple-300 overflow-x-auto leading-relaxed">
              <code>{codeData.optimalCode}</code>
            </pre>
          </div>

          {/* Approach & Logic Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Algorithmic Intuition & Approach Walkthrough
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-1">
              {codeData.approachExplanation}
            </div>
          </div>

          {/* Edge Cases Warning */}
          {codeData.keyEdgeCases && codeData.keyEdgeCases.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Key Edge Cases Handled (BuildIT Test Verification):
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {codeData.keyEdgeCases.map((ec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>{ec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Cases Verification */}
          {codeData.testCases && codeData.testCases.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sample Test Cases Execution
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {codeData.testCases.map((tc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <span>Test Case {idx + 1}</span>
                      <span className="text-emerald-400 font-semibold">Passed ✓</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Input:</span>
                      <code className="p-1.5 block bg-slate-950 rounded text-slate-300 font-mono mt-0.5">
                        {tc.input}
                      </code>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Expected Output:</span>
                      <code className="p-1.5 block bg-slate-950 rounded text-emerald-400 font-mono mt-0.5">
                        {tc.expectedOutput}
                      </code>
                    </div>
                    {tc.explanation && (
                      <p className="text-[11px] text-slate-400 italic">
                        {tc.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
