import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  Download,
  BookOpen,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Table,
  HelpCircle,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { TechTalkReportData, StudentProfile } from '../../types';
import { copyToClipboard, downloadFile, requestGeneration, saveHistoryItem } from '../../utils/api';
import { generateLocalTechTalkReport } from '../../utils/localGenerators';

interface TechTalkReportGeneratorProps {
  student: StudentProfile;
  initialData?: TechTalkReportData | null;
}

const TECH_TALK_PRESETS = [
  'Autonomous Drone Swarm Navigation & Flight Control',
  'Large Language Models with Retrieval-Augmented Generation (RAG)',
  'Distributed Consensus in Web3 Blockchain Networks',
  'Zero-Trust Cybersecurity Architecture in Cloud Computing',
  'Deep Learning for Real-Time Medical Diagnostic Imaging',
  'Quantum Key Distribution & Post-Quantum Cryptography',
];

export const TechTalkReportGenerator: React.FC<TechTalkReportGeneratorProps> = ({
  student,
  initialData,
}) => {
  const [topic, setTopic] = useState('');
  const [courseTitle, setCourseTitle] = useState('Technical Seminar / Tech Talk (B.Tech VII Sem)');
  const [domain, setDomain] = useState('Advanced Computing & Autonomous Systems');
  const [academicYear, setAcademicYear] = useState('2024 - 2025');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<TechTalkReportData | null>(initialData || null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });
  const [openViva, setOpenViva] = useState<Record<number, boolean>>({ 0: true, 1: true });

  useEffect(() => {
    if (initialData) {
      setReportData(initialData);
    }
  }, [initialData]);

  const toggleChapter = (num: number) => {
    setOpenChapters((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const toggleViva = (idx: number) => {
    setOpenViva((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleGenerate = async (customTopic?: string) => {
    const topicToUse = customTopic || topic;
    if (!topicToUse.trim()) return;

    setLoading(true);
    try {
      const data = await requestGeneration(
        'tech_talk',
        topicToUse,
        { courseTitle, domain, academicYear },
        student
      );
      if (data && data.chapters && data.chapters.length > 0) {
        setReportData(data);
        saveHistoryItem('tech_talk', `${data.title} (Tech Talk Report)`, data);
      } else {
        const fallback = generateLocalTechTalkReport(
          topicToUse,
          { courseTitle, domain, academicYear },
          student
        );
        setReportData(fallback);
        saveHistoryItem('tech_talk', `${fallback.title} (Tech Talk Report)`, fallback);
      }
    } catch (err) {
      console.warn('API error, using local tech talk generator:', err);
      const fallback = generateLocalTechTalkReport(
        topicToUse,
        { courseTitle, domain, academicYear },
        student
      );
      setReportData(fallback);
      saveHistoryItem('tech_talk', `${fallback.title} (Tech Talk Report)`, fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!reportData) return;
    const text = `INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
Dundigal, Hyderabad - 500 043
DEPARTMENT OF ${student.branch.toUpperCase()}

TECHNICAL SEMINAR / TECH TALK REPORT
Topic: ${reportData.title}
Student: ${reportData.presenter} (${reportData.rollNo})
Academic Year: ${reportData.academicYear}
Course: ${reportData.courseTitle}
Domain: ${reportData.domain}

==================================================
ABSTRACT
==================================================
${reportData.abstract}

Keywords: ${reportData.keywords.join(', ')}

==================================================
CHAPTERS
==================================================
${reportData.chapters
  .map(
    (c) => `CHAPTER ${c.chapterNumber}: ${c.title}
${c.content.join('\n\n')}

${c.visualDescription ? `[Architecture / Visual Scheme]: ${c.visualDescription}\n` : ''}
${c.keyTakeaways ? `Key Takeaways:\n${c.keyTakeaways.map((t) => `• ${t}`).join('\n')}\n` : ''}`
  )
  .join('\n--------------------------------------------------\n\n')}

==================================================
COMPARATIVE BENCHMARK MATRIX
==================================================
${reportData.comparativeMetrics
  .map(
    (m) =>
      `${m.metric}: Existing Baseline = ${m.existingBaseline} | Proposed = ${m.proposedSystem} | Delta: ${m.improvement}`
  )
  .join('\n')}

==================================================
VIVA VOCE DEFENSE QUESTIONS & ANSWERS
==================================================
${reportData.vivaQuestions
  .map((v, i) => `Q${i + 1}: ${v.question}\nA: ${v.answer}`)
  .join('\n\n')}

==================================================
REFERENCES
==================================================
${reportData.references.map((r, i) => `[${i + 1}] ${r}`).join('\n')}
`;
    copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!reportData) return;
    const md = `# INSTITUTE OF AERONAUTICAL ENGINEERING
*(Autonomous • Accredited by NAAC with 'A+' Grade)*  
**Dundigal, Hyderabad - 500 043**

---

# TECHNICAL SEMINAR / TECH TALK REPORT
## **${reportData.title}**

> **Course:** ${reportData.courseTitle}  
> **Domain:** ${reportData.domain}  
> **Submitted By:** ${reportData.presenter} (\`${reportData.rollNo}\`)  
> **Department:** Department of ${student.branch}  
> **Academic Year:** ${reportData.academicYear}  

---

## **Abstract**
${reportData.abstract}

**Keywords:** *${reportData.keywords.join(', ')}*

---

${reportData.chapters
  .map(
    (c) => `## Chapter ${c.chapterNumber}: ${c.title}

${c.content.join('\n\n')}

${c.visualDescription ? `> **IARE Architecture / System Diagram:** ${c.visualDescription}\n` : ''}

${
  c.keyTakeaways && c.keyTakeaways.length > 0
    ? `**Key Engineering Takeaways:**\n${c.keyTakeaways.map((k) => `- ${k}`).join('\n')}\n`
    : ''
}
---`
  )
  .join('\n\n')}

## **Comparative Benchmark Evaluation**

| Evaluation Parameter | Existing Conventional Baseline | Proposed Solution Framework | Measured Performance Delta |
| :--- | :--- | :--- | :--- |
${reportData.comparativeMetrics
  .map(
    (m) =>
      `| **${m.metric}** | ${m.existingBaseline} | \`${m.proposedSystem}\` | **${m.improvement}** |`
  )
  .join('\n')}

---

## **Viva Voce Defense Questions & Answers**
${reportData.vivaQuestions
  .map(
    (v, i) => `### Q${i + 1}: ${v.question}
**Answer:** ${v.answer}
`
  )
  .join('\n')}

---

## **References (IEEE Format)**
${reportData.references.map((r, i) => `[${i + 1}] ${r}  `).join('\n')}
`;
    downloadFile(
      `${reportData.title.replace(/\s+/g, '_')}_IARE_TechTalk_Report.md`,
      md,
      'text/markdown'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Generator Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                IARE Tech Talk & Technical Seminar Report Generator
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800 font-mono">
                  8-Chapter Compendium
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generates complete, publication-grade B.Tech Technical Seminar Reports formatted with formal IARE cover page, theoretical equations, benchmark comparisons, and viva defense Q&A.
              </p>
            </div>
          </div>
        </div>

        {/* Input Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Title
              </label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technical Domain / Specialization
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Seminar Topic / Tech Talk Subject
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Autonomous Drone Swarm Navigation, Distributed Consensus in Web3, Quantum Cryptography..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pr-36"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !topic.trim()}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Popular Tech Talk Presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Popular IARE Tech Talk Seminar Topics (1-Click Try):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TECH_TALK_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setTopic(preset);
                    handleGenerate(preset);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/50 text-slate-300 transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report Workspace */}
      {reportData && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="px-2 py-0.5 rounded bg-violet-950 border border-violet-800 text-[10px] font-mono text-violet-300 font-bold uppercase">
                Technical Seminar Report Ready
              </span>
              <h3 className="font-bold text-sm text-white mt-1">
                {reportData.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
                title="Copy Full Report Text"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied' : 'Copy Full Text'}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
                title="Download Markdown Report"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Markdown</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
                title="Print Report / Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF Document</span>
              </button>
            </div>
          </div>

          {/* Printable Document View */}
          <div className="p-8 sm:p-12 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 printable-document">
            {/* Official IARE University Header */}
            <div className="text-center border-b-2 border-slate-300 pb-6 mb-8">
              <h1 className="text-xl sm:text-2xl font-black text-[#003e7e] tracking-tight uppercase">
                INSTITUTE OF AERONAUTICAL ENGINEERING
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                (Autonomous Institution • Affiliated to JNTUH • Accredited by NAAC with 'A+' Grade)
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Dundigal, Hyderabad - 500 043, Telangana, India
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-[#0056b3] uppercase tracking-wider block">
                  DEPARTMENT OF {student.branch.toUpperCase()}
                </span>
                <span className="text-sm font-black text-slate-800 tracking-wide block mt-1">
                  TECHNICAL SEMINAR / TECH TALK REPORT
                </span>
              </div>
            </div>

            {/* Title & Metadata Box */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl mb-8">
              <h2 className="text-2xl font-extrabold text-[#003e7e] tracking-tight mb-2">
                {reportData.title}
              </h2>
              <p className="text-xs italic text-slate-600 mb-4">
                {reportData.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Presenter Name:</span>
                  <span className="font-bold text-slate-900">{reportData.presenter}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Roll Number:</span>
                  <span className="font-mono font-bold text-slate-900">{reportData.rollNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Course / Seminar:</span>
                  <span className="font-semibold text-slate-900">{reportData.courseTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Academic Year:</span>
                  <span className="font-semibold text-slate-900">{reportData.academicYear}</span>
                </div>
              </div>
            </div>

            {/* Abstract Section */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-[#003e7e] uppercase tracking-wide border-b border-slate-300 pb-1 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#003e7e]" /> Abstract
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed text-justify">
                {reportData.abstract}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Keywords:</span>
                {reportData.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Chapters Section */}
            <div className="space-y-6 mb-8">
              <h3 className="text-base font-bold text-[#003e7e] uppercase tracking-wide border-b border-slate-300 pb-1 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#003e7e]" /> Chapters & Technical Elaboration
              </h3>

              {reportData.chapters.map((ch) => {
                const isOpen = !!openChapters[ch.chapterNumber];
                return (
                  <div
                    key={ch.chapterNumber}
                    className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleChapter(ch.chapterNumber)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#003e7e] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {ch.chapterNumber}
                        </span>
                        <h4 className="font-bold text-sm text-[#003e7e]">
                          Chapter {ch.chapterNumber}: {ch.title}
                        </h4>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-5 space-y-4 text-sm text-slate-800 leading-relaxed bg-white">
                        {ch.content.map((p, idx) => (
                          <p key={idx} className="text-justify">
                            {p}
                          </p>
                        ))}

                        {ch.visualDescription && (
                          <div className="p-3.5 rounded-lg bg-blue-50/80 border-l-4 border-[#003e7e] text-xs text-slate-700">
                            <span className="font-bold text-[#003e7e] block mb-0.5">
                              IARE System Schematic / Visual Blueprint:
                            </span>
                            {ch.visualDescription}
                          </div>
                        )}

                        {ch.keyTakeaways && ch.keyTakeaways.length > 0 && (
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-700 block mb-1">
                              Key Takeaways:
                            </span>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                              {ch.keyTakeaways.map((k, i) => (
                                <li key={i}>{k}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Comparative Benchmarks Matrix */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-[#003e7e] uppercase tracking-wide border-b border-slate-300 pb-1 mb-4 flex items-center gap-2">
                <Table className="w-4 h-4 text-[#003e7e]" /> Comparative Empirical Benchmarks Matrix
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-[#003e7e] text-white uppercase text-[11px]">
                    <tr>
                      <th className="p-3">Evaluation Parameter</th>
                      <th className="p-3">Conventional Baseline</th>
                      <th className="p-3">Proposed Framework</th>
                      <th className="p-3">Performance Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {reportData.comparativeMetrics.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-3 font-semibold text-slate-800">{row.metric}</td>
                        <td className="p-3 text-slate-600">{row.existingBaseline}</td>
                        <td className="p-3 font-mono font-bold text-blue-700">
                          {row.proposedSystem}
                        </td>
                        <td className="p-3 font-bold text-emerald-700">{row.improvement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Viva Voce Defense Q&A */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-[#003e7e] uppercase tracking-wide border-b border-slate-300 pb-1 mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#003e7e]" /> Technical Seminar Viva Voce Defense Q&A
              </h3>
              <div className="space-y-3">
                {reportData.vivaQuestions.map((viva, idx) => {
                  const isVivaOpen = !!openViva[idx];
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleViva(idx)}
                        className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left cursor-pointer transition-colors"
                      >
                        <span className="font-bold text-xs text-[#003e7e]">
                          Q{idx + 1}: {viva.question}
                        </span>
                        {isVivaOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                      {isVivaOpen && (
                        <div className="p-3.5 bg-white text-xs text-slate-700 border-t border-slate-100 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Model Viva Answer:</strong>
                          {viva.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* References Section */}
            <div>
              <h3 className="text-base font-bold text-[#003e7e] uppercase tracking-wide border-b border-slate-300 pb-1 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#003e7e]" /> References (IEEE Format)
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                {reportData.references.map((ref, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {ref}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
