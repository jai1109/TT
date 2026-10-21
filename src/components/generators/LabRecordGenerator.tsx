import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Award
} from 'lucide-react';
import { LabRecordData, StudentProfile } from '../../types';
import { LAB_PRESETS } from '../../data/iareData';
import { copyToClipboard, downloadFile, requestGeneration, saveHistoryItem } from '../../utils/api';
import { generateLocalLabRecord } from '../../utils/localGenerators';

interface LabRecordGeneratorProps {
  student: StudentProfile;
  initialData?: LabRecordData | null;
}

export const LabRecordGenerator: React.FC<LabRecordGeneratorProps> = ({ student, initialData }) => {
  const [expTitle, setExpTitle] = useState('');
  const [expNumber, setExpNumber] = useState('Experiment 01');
  const [subjectName, setSubjectName] = useState('Data Structures');
  const [language, setLanguage] = useState('c');
  const [loading, setLoading] = useState(false);
  const [recordData, setRecordData] = useState<LabRecordData | null>(initialData || null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [expandedViva, setExpandedViva] = useState<Record<number, boolean>>({ 0: true, 1: true });

  useEffect(() => {
    if (initialData) {
      setRecordData(initialData);
    }
  }, [initialData]);

  const handleGenerate = async (customTitle?: string, customLang?: string, customSub?: string) => {
    const titleToUse = customTitle || expTitle;
    if (!titleToUse.trim()) return;

    setLoading(true);
    try {
      const data = await requestGeneration(
        'lab_record',
        titleToUse,
        {
          expNumber,
          subjectName: customSub || subjectName,
          language: customLang || language,
        },
        student
      );
      if (data && data.experimentTitle) {
        setRecordData(data);
        saveHistoryItem('lab_record', `${data.experimentNumber}: ${data.experimentTitle}`, data);
      } else {
        const fallback = generateLocalLabRecord(
          titleToUse,
          { expNumber, subjectName: customSub || subjectName, language: customLang || language },
          student
        );
        setRecordData(fallback);
        saveHistoryItem('lab_record', `${fallback.experimentNumber}: ${fallback.experimentTitle}`, fallback);
      }
    } catch (err) {
      console.warn('API error, using local lab generator:', err);
      const fallback = generateLocalLabRecord(
        titleToUse,
        { expNumber, subjectName: customSub || subjectName, language: customLang || language },
        student
      );
      setRecordData(fallback);
      saveHistoryItem('lab_record', `${fallback.experimentNumber}: ${fallback.experimentTitle}`, fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!recordData) return;
    copyToClipboard(recordData.sourceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyAll = () => {
    if (!recordData) return;
    const allText = `INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
Department of ${student.branch}
Student: ${student.name} | Roll No: ${student.rollNo} | ${student.yearSem}

${recordData.experimentNumber}: ${recordData.experimentTitle}

AIM:
${recordData.aim}

HARDWARE & SOFTWARE REQUIREMENTS:
${recordData.softwareHardwareRequirements.map((r) => `- ${r}`).join('\n')}

THEORY:
${recordData.theoreticalConcepts}

ALGORITHM:
${recordData.algorithm.join('\n')}

SOURCE CODE:
${recordData.sourceCode}

SAMPLE INPUT:
${recordData.sampleInput}

SAMPLE OUTPUT:
${recordData.sampleOutput}

RESULT:
${recordData.result}

VIVA QUESTIONS:
${recordData.vivaQuestions.map((v, i) => `Q${i + 1}: ${v.question}\nA: ${v.answer}`).join('\n\n')}
`;
    copyToClipboard(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!recordData) return;
    const md = `# INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
**Dundigal, Hyderabad - 500 043**  
### Department of ${student.branch}
**Student Name:** ${student.name} | **Roll No:** ${student.rollNo} | **Year/Sem:** ${student.yearSem}

---

## ${recordData.experimentNumber}: ${recordData.experimentTitle}

### 1. Aim
${recordData.aim}

### 2. Software & Hardware Requirements
${recordData.softwareHardwareRequirements.map((r) => `- ${r}`).join('\n')}

### 3. Theoretical Concepts
${recordData.theoreticalConcepts}

### 4. Algorithm
${recordData.algorithm.map((step) => `${step}`).join('\n')}

### 5. Flowchart Logic
${recordData.flowchartDescription}

### 6. Source Code
\`\`\`${recordData.language}
${recordData.sourceCode}
\`\`\`

### 7. Sample Input
\`\`\`
${recordData.sampleInput}
\`\`\`

### 8. Sample Output
\`\`\`
${recordData.sampleOutput}
\`\`\`

### 9. Complexity Analysis
- **Time Complexity:** ${recordData.timeComplexity}
- **Space Complexity:** ${recordData.spaceComplexity}

### 10. Result
${recordData.result}

### 11. Viva Voce Questions & Answers
${recordData.vivaQuestions.map((v, i) => `**Q${i + 1}: ${v.question}**  \n*Ans:* ${v.answer}`).join('\n\n')}
`;
    downloadFile(`${recordData.experimentNumber.replace(/\s+/g, '_')}_IARE_Record.md`, md, 'text/markdown');
  };

  const toggleViva = (index: number) => {
    setExpandedViva((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl no-print">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              IARE Lab Record & Manual Generator
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Official Format
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generates complete laboratory manuals: Aim, Requirements, Theory, Step-by-Step Algorithm, Code, I/O, Result, and Viva Q&A with IARE formatting.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Experiment #
              </label>
              <input
                type="text"
                value={expNumber}
                onChange={(e) => setExpNumber(e.target.value)}
                placeholder="e.g. Experiment 01, Week 3"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Laboratory Subject
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Data Structures Laboratory"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="c">C Language</option>
                <option value="cpp">C++</option>
                <option value="java">Java (OOP)</option>
                <option value="python">Python 3</option>
                <option value="sql">SQL / PL-SQL</option>
                <option value="javascript">JavaScript / HTML</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Experiment Title / Problem Statement
            </label>
            <div className="relative">
              <input
                type="text"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                placeholder="e.g. Implement Binary Search Tree with Insertion, Deletion, and Inorder Traversal..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 pr-28"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !expTitle.trim()}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Popular IARE Lab Experiments (1-Click Try):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {LAB_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setExpTitle(preset.title);
                    setSubjectName(preset.subject);
                    setLanguage(preset.lang);
                    handleGenerate(preset.title, preset.lang, preset.subject);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-slate-300 transition-colors"
                >
                  <span className="text-emerald-400 font-medium">[{preset.subject}]</span> {preset.title.split('(')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Record Document */}
      {recordData && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 no-print">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                {recordData.experimentNumber} Ready
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Markdown</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Document Sheet */}
          <div className="printable-document p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-200 space-y-6">
            {/* Formal IARE College Header */}
            <div className="text-center border-b-2 border-slate-800 pb-5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Institute of Aeronautical Engineering
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-cyan-400 tracking-wide mt-0.5">
                (Autonomous - NAAC Accredited with 'A+' Grade)
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Dundigal, Hyderabad - 500 043, Telangana, India
              </p>
              <div className="mt-2.5 inline-block px-4 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-widest">
                Department of {student.branch}
              </div>
            </div>

            {/* Student Meta Details Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Student Name:</span>
                <span className="font-semibold text-white">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Roll Number:</span>
                <span className="font-mono font-bold text-cyan-400">{student.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Year / Semester:</span>
                <span className="font-semibold text-white">{student.yearSem}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Department / Branch:</span>
                <span className="font-semibold text-white">{student.branch}</span>
              </div>
            </div>

            {/* Experiment Title */}
            <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-xl">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                {recordData.experimentNumber}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {recordData.experimentTitle}
              </h2>
            </div>

            {/* 1. Aim */}
            <section className="space-y-1.5">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                1. Aim / Objective
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1">
                {recordData.aim}
              </p>
            </section>

            {/* 2. Requirements */}
            <section className="space-y-1.5">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                2. Software & Hardware Requirements
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pl-1 pt-1">
                {recordData.softwareHardwareRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Theory */}
            <section className="space-y-1.5">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                3. Theoretical Concept & Foundation
              </h3>
              <div className="text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-line pl-1">
                {recordData.theoreticalConcepts}
              </div>
            </section>

            {/* 4. Algorithm */}
            <section className="space-y-1.5">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                4. Step-by-Step Algorithm
              </h3>
              <div className="space-y-1.5 pt-1">
                {recordData.algorithm.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                    <span className="font-mono text-cyan-400 font-bold">{idx + 1}.</span>
                    <span>{step.replace(/^Step \d+:\s*/i, '')}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Flowchart Logic */}
            <section className="space-y-1.5">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                5. Flowchart Architecture
              </h3>
              <p className="text-xs text-slate-300 italic bg-slate-950 p-3 rounded-lg border border-slate-800">
                {recordData.flowchartDescription}
              </p>
            </section>

            {/* 6. Source Code */}
            <section className="space-y-1.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                  6. Verified Source Code ({recordData.language.toUpperCase()})
                </h3>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 no-print"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                  <span>solution.{recordData.language === 'c' ? 'c' : recordData.language === 'cpp' ? 'cpp' : recordData.language === 'java' ? 'java' : recordData.language === 'python' ? 'py' : 'txt'}</span>
                  <span>Compilable & Bug-Free</span>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{recordData.sourceCode}</code>
                </pre>
              </div>
            </section>

            {/* 7 & 8. Input and Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <section className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  7. Sample Input
                </h3>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
                  <code>{recordData.sampleInput || '(Standard Test Input)'}</code>
                </pre>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  8. Sample Output
                </h3>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                  <code>{recordData.sampleOutput}</code>
                </pre>
              </section>
            </div>

            {/* 9. Complexity */}
            <section className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Time Complexity:</span>
                <span className="text-emerald-400 font-mono font-semibold">{recordData.timeComplexity}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Space Complexity:</span>
                <span className="text-indigo-400 font-mono font-semibold">{recordData.spaceComplexity}</span>
              </div>
            </section>

            {/* 10. Result */}
            <section className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs sm:text-sm text-slate-200">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                10. Result
              </span>
              <p className="italic">
                "{recordData.result}"
              </p>
            </section>

            {/* 11. Viva Voce Questions */}
            <section className="space-y-2 pt-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  11. Viva Voce Questions & Answers
                </h3>
                <span className="text-[11px] text-slate-400">
                  5 Essential External Examiner Questions
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {recordData.vivaQuestions.map((v, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                    <button
                      onClick={() => toggleViva(idx)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-amber-400 font-mono">Q{idx + 1}:</span>
                        <span>{v.question}</span>
                      </span>
                      {expandedViva[idx] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {expandedViva[idx] && (
                      <div className="p-3 pt-0 border-t border-slate-900 text-xs text-slate-300 bg-slate-950/50">
                        <span className="font-semibold text-emerald-400 block mb-0.5">Answer:</span>
                        {v.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Signatures footer for submission */}
            <div className="pt-10 border-t border-slate-800 grid grid-cols-2 text-center text-xs text-slate-400">
              <div>
                <p className="mt-8 font-semibold text-slate-300">Signature of the Student</p>
              </div>
              <div>
                <p className="mt-8 font-semibold text-slate-300">Signature of the Internal Examiner</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
