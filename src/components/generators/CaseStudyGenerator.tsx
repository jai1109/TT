import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ShieldAlert, 
  TrendingUp, 
  RefreshCw,
  Award
} from 'lucide-react';
import { CaseStudyData, StudentProfile } from '../../types';
import { CASE_STUDY_PRESETS } from '../../data/iareData';
import { copyToClipboard, downloadFile, requestGeneration, saveHistoryItem } from '../../utils/api';

interface CaseStudyGeneratorProps {
  student: StudentProfile;
  initialData?: CaseStudyData | null;
}

export const CaseStudyGenerator: React.FC<CaseStudyGeneratorProps> = ({ student, initialData }) => {
  const [topic, setTopic] = useState('');
  const [industryDomain, setIndustryDomain] = useState('Distributed Systems & Cloud Architecture');
  const [loading, setLoading] = useState(false);
  const [caseStudyData, setCaseStudyData] = useState<CaseStudyData | null>(initialData || null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCaseStudyData(initialData);
    }
  }, [initialData]);

  const handleGenerate = async (customTopic?: string) => {
    const textToUse = customTopic || topic;
    if (!textToUse.trim()) return;

    setLoading(true);
    try {
      const data = await requestGeneration(
        'case_study',
        textToUse,
        { industryDomain },
        student
      );
      setCaseStudyData(data);
      saveHistoryItem('case_study', data.title, data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!caseStudyData) return;
    const text = `INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
Department of ${student.branch}
Author: ${student.name} (${student.rollNo})

${caseStudyData.title}

EXECUTIVE SUMMARY:
${caseStudyData.executiveSummary}

PROBLEM STATEMENT:
${caseStudyData.problemStatement}

BACKGROUND ANALYSIS:
${caseStudyData.backgroundAnalysis}

PROPOSED SOLUTION:
${caseStudyData.proposedSolution}

IMPLEMENTATION DETAILS:
${caseStudyData.implementationDetails}

RESULTS & IMPACT:
${caseStudyData.resultsAndImpact}

CHALLENGES & MITIGATIONS:
${caseStudyData.challengesAndMitigations.map((c) => `Challenge: ${c.challenge}\nMitigation: ${c.mitigation}`).join('\n\n')}

FUTURE SCOPE:
${caseStudyData.futureScope}

REFERENCES:
${caseStudyData.references.join('\n')}
`;
    copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!caseStudyData) return;
    const md = `# ${caseStudyData.title}
### Academic Engineering Case Study
**Institution:** Institute of Aeronautical Engineering (Autonomous), Dundigal, Hyderabad  
**Author:** ${student.name} | **Roll No:** ${student.rollNo} | **Department:** ${student.branch}  

---

## 1. Executive Summary
${caseStudyData.executiveSummary}

## 2. Problem Statement & Bottlenecks
${caseStudyData.problemStatement}

## 3. Background & Theoretical Context
${caseStudyData.backgroundAnalysis}

## 4. Proposed Solution & Architecture
${caseStudyData.proposedSolution}

## 5. Implementation Strategy & Tech Stack
${caseStudyData.implementationDetails}

## 6. Quantifiable Results & KPI Impact
${caseStudyData.resultsAndImpact}

## 7. Engineering Challenges & Mitigations
| Challenge Encountered | Mitigation Strategy |
| :--- | :--- |
${caseStudyData.challengesAndMitigations.map((c) => `| ${c.challenge} | ${c.mitigation} |`).join('\n')}

## 8. Future Scope & Scalability
${caseStudyData.futureScope}

## 9. References
${caseStudyData.references.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`;
    downloadFile(
      `${caseStudyData.title.replace(/\s+/g, '_')}_CaseStudy.md`,
      md,
      'text/markdown'
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl no-print">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              IARE Technical Case Study Generator
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                Research Grade
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Formulate real-world industrial case studies with executive summaries, architectural solutions, and risk mitigation matrices.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Domain / Industry Track
              </label>
              <select
                value={industryDomain}
                onChange={(e) => setIndustryDomain(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Distributed Systems & Cloud Architecture">Distributed Systems & Cloud Architecture</option>
                <option value="Artificial Intelligence & Machine Learning in Enterprise">AI & ML in Enterprise</option>
                <option value="Cybersecurity, Incidents & Forensics">Cybersecurity & Incidents</option>
                <option value="Fintech & High-Throughput Payment Gateways">Fintech & High-Throughput Payment Gateways</option>
                <option value="Autonomous Aviation & IoT Systems">Autonomous Aviation & IoT Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Format
              </label>
              <div className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300">
                IARE Seminar & Case Evaluation Standard
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Case Study Subject / Company Outage / Architecture Challenge
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Netflix Microservices & Chaos Engineering, WhatsApp 100B Messages Architecture..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-28"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !topic.trim()}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
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

          {/* Popular Presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Industry Standard Presets (1-Click Try):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CASE_STUDY_PRESETS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(item);
                    handleGenerate(item);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-300 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Case Study Workspace */}
      {caseStudyData && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 no-print">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                Case Study Generated
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Markdown</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-600/20 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Document Canvas */}
          <div className="printable-document p-6 sm:p-10 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-200 space-y-7">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 pb-5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                Institute of Aeronautical Engineering
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-amber-400 tracking-wide mt-0.5">
                Department of {student.branch} • Case Study Portfolio
              </p>
              <div className="mt-2 text-xs text-slate-400">
                Author: <strong className="text-white">{student.name}</strong> ({student.rollNo}) • {student.yearSem}
              </div>
            </div>

            <div className="text-center py-2 bg-amber-950/20 border border-amber-900/50 rounded-xl">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {caseStudyData.title}
              </h2>
            </div>

            {/* 1. Executive Summary */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                1. Executive Summary
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {caseStudyData.executiveSummary}
              </p>
            </section>

            {/* 2. Problem Statement */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                2. Problem Statement & Bottlenecks
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1">
                {caseStudyData.problemStatement}
              </p>
            </section>

            {/* 3. Background Analysis */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                3. Background & Operational Context
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1 whitespace-pre-line">
                {caseStudyData.backgroundAnalysis}
              </p>
            </section>

            {/* 4. Proposed Solution */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                4. Proposed Architectural Solution
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1 whitespace-pre-line">
                {caseStudyData.proposedSolution}
              </p>
            </section>

            {/* 5. Implementation Details */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                5. Implementation Strategy & Tech Stack
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1 whitespace-pre-line">
                {caseStudyData.implementationDetails}
              </p>
            </section>

            {/* 6. Results and Impact */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                6. Results, Metrics & Quantifiable Impact
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-cyan-300 leading-relaxed whitespace-pre-line font-mono">
                {caseStudyData.resultsAndImpact}
              </div>
            </section>

            {/* 7. Challenges and Mitigations Table */}
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                7. Engineering Challenges & Mitigations Matrix
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-3 border-b border-slate-800">Key Engineering Challenge</th>
                      <th className="p-3 border-b border-slate-800">Mitigation & Countermeasure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                    {caseStudyData.challengesAndMitigations.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 text-rose-300 font-medium">{item.challenge}</td>
                        <td className="p-3 text-emerald-300">{item.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 8. Future Scope */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                8. Future Scope & Scalability
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1">
                {caseStudyData.futureScope}
              </p>
            </section>

            {/* 9. References */}
            <section className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                9. References & Standards
              </h3>
              <ul className="space-y-1 text-xs text-slate-400 pl-1">
                {caseStudyData.references.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-amber-400">[{i + 1}]</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
