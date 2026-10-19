import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Tag, 
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { AssignmentData, StudentProfile } from '../../types';
import { ASSIGNMENT_PRESETS } from '../../data/iareData';
import { copyToClipboard, downloadFile, requestGeneration, saveHistoryItem } from '../../utils/api';

interface AssignmentGeneratorProps {
  student: StudentProfile;
  initialData?: AssignmentData | null;
}

export const AssignmentGenerator: React.FC<AssignmentGeneratorProps> = ({ student, initialData }) => {
  const [prompt, setPrompt] = useState('');
  const [subjectName, setSubjectName] = useState('Design and Analysis of Algorithms');
  const [subjectCode, setSubjectCode] = useState('ACSD13');
  const [assignmentTitle, setAssignmentTitle] = useState('Assignment 1 (Continuous Internal Assessment)');
  const [loading, setLoading] = useState(false);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(initialData || null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (initialData) {
      setAssignmentData(initialData);
    }
  }, [initialData]);

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) return;

    setLoading(true);
    try {
      const data = await requestGeneration(
        'assignment',
        textToUse,
        { subjectName, subjectCode, assignmentTitle },
        student
      );
      setAssignmentData(data);
      saveHistoryItem('assignment', `${data.subjectCode}: ${data.assignmentTitle}`, data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!assignmentData) return;
    const text = `INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
Department of ${student.branch}
Student: ${student.name} | Roll No: ${student.rollNo}
Subject: ${assignmentData.subjectName} (${assignmentData.subjectCode})
Title: ${assignmentData.assignmentTitle}

${assignmentData.questions
  .map(
    (q) => `QUESTION ${q.questionNumber} [${q.bloomsLevel}] [${q.courseOutcome}]:
${q.questionText}

ANSWER:
${q.answer}`
  )
  .join('\n\n========================================\n\n')}

REFERENCES:
${assignmentData.references.map((r, i) => `[${i + 1}] ${r}`).join('\n')}
`;
    copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!assignmentData) return;
    const md = `# INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
**Department of ${student.branch}**  
**Student Name:** ${student.name} | **Roll No:** ${student.rollNo}  
**Course:** ${assignmentData.subjectName} (\`${assignmentData.subjectCode}\`)  
**Assignment:** ${assignmentData.assignmentTitle}  

---

${assignmentData.questions
  .map(
    (q) => `### Question ${q.questionNumber}
> **${q.questionText}**  
> *Bloom's Level:* **${q.bloomsLevel}** | *Target Outcome:* **${q.courseOutcome}**

#### Solution:
${q.answer}

---`
  )
  .join('\n\n')}

### References:
${assignmentData.references.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;
    downloadFile(
      `${assignmentData.subjectCode}_Assignment_${student.rollNo}.md`,
      md,
      'text/markdown'
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Configuration Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl no-print">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              IARE Assignment & Tech Talk Writer
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Bloom's Mapped
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generates rigorous, top-scoring assignment solutions with Course Outcome (CO) & Bloom's Taxonomy Level mapping.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Name
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Design and Analysis of Algorithms"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="e.g. ACSD13"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assignment Title
              </label>
              <select
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Assignment 1 (Continuous Internal Assessment - I)">Assignment 1 (CIA - I)</option>
                <option value="Assignment 2 (Continuous Internal Assessment - II)">Assignment 2 (CIA - II)</option>
                <option value="Tech Talk Presentation Report">Tech Talk Presentation Report</option>
                <option value="Make-up Assignment">Make-up Assignment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assignment Questions / Problem Prompts
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Paste your assignment questions or prompt here, e.g. '1. Compare Paging vs Segmentation in OS with diagrams. 2. Explain Banker's algorithm for deadlock avoidance with a numeric example.'"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex-1 min-w-[200px]">
              <span className="text-[11px] font-medium text-slate-400 block mb-1">
                Popular Sample Questions (1-Click Try):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ASSIGNMENT_PRESETS.slice(0, 3).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(item);
                      handleGenerate(item);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 transition-colors"
                  >
                    {item.slice(0, 45)}...
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all self-end"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Assignment...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Assignment
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Assignment Sheet */}
      {assignmentData && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 no-print">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">
                {assignmentData.subjectCode} • {assignmentData.questions.length} Questions Answered
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Document Canvas */}
          <div className="printable-document p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-200 space-y-8">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 pb-5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Institute of Aeronautical Engineering
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-cyan-400 tracking-wide mt-0.5">
                (Autonomous Institution, Approved by AICTE, Accredited by NBA & NAAC 'A+')
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Dundigal, Hyderabad - 500 043
              </p>
              <div className="mt-2.5 inline-block px-4 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-widest">
                Department of {student.branch}
              </div>
            </div>

            {/* Meta Table */}
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
                <span className="text-slate-500 block">Course Name & Code:</span>
                <span className="font-semibold text-white">{assignmentData.subjectName} ({assignmentData.subjectCode})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Year & Semester:</span>
                <span className="font-semibold text-white">{student.yearSem}</span>
              </div>
            </div>

            <div className="text-center py-1 bg-cyan-950/30 border border-cyan-900/50 rounded-lg">
              <h2 className="text-base font-bold text-cyan-300 uppercase tracking-wide">
                {assignmentData.assignmentTitle}
              </h2>
            </div>

            {/* Questions & Answers */}
            <div className="space-y-8">
              {assignmentData.questions.map((q) => (
                <div key={q.questionNumber} className="space-y-3 border-b border-slate-800/80 pb-6">
                  {/* Question Header */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                        Question {q.questionNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                          {q.bloomsLevel}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {q.courseOutcome}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {q.questionText}
                    </p>
                  </div>

                  {/* Answer Body */}
                  <div className="pl-2 sm:pl-4 space-y-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                      Answer & Technical Exposition:
                    </span>
                    <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-900 font-sans">
                      {q.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* References */}
            {assignmentData.references && assignmentData.references.length > 0 && (
              <section className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                  Academic References & Prescribed Textbooks
                </h3>
                <ul className="space-y-1 text-xs text-slate-400 pl-1">
                  {assignmentData.references.map((ref, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-cyan-400">[{idx + 1}]</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Faculty Evaluation Box */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block">Marks Awarded:</span>
                <span className="text-lg font-mono font-bold text-slate-300 mt-1 block">___ / 10</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block">Faculty Remarks:</span>
                <span className="text-xs text-slate-400 mt-2 block">Satisfactory / Excellent</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">Faculty Signature:</span>
                <div className="h-6 mt-2 border-b border-dashed border-slate-700" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
