import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Cpu, 
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { ProjectDocData, StudentProfile } from '../../types';
import { PROJECT_DOC_PRESETS } from '../../data/iareData';
import { copyToClipboard, downloadFile, requestGeneration, saveHistoryItem } from '../../utils/api';

interface ProjectDocGeneratorProps {
  student: StudentProfile;
  initialData?: ProjectDocData | null;
}

export const ProjectDocGenerator: React.FC<ProjectDocGeneratorProps> = ({ student, initialData }) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence & Full Stack Web');
  const [projectStage, setProjectStage] = useState('Mini Project (III Year II Semester)');
  const [loading, setLoading] = useState(false);
  const [docData, setDocData] = useState<ProjectDocData | null>(initialData || null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDocData(initialData);
    }
  }, [initialData]);

  const handleGenerate = async (customTitle?: string) => {
    const textToUse = customTitle || title;
    if (!textToUse.trim()) return;

    setLoading(true);
    try {
      const data = await requestGeneration(
        'project_doc',
        textToUse,
        { domain, projectStage },
        student
      );
      setDocData(data);
      saveHistoryItem('project_doc', `Project: ${data.projectTitle}`, data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!docData) return;
    const text = `INSTITUTE OF AERONAUTICAL ENGINEERING (Autonomous)
Department of ${student.branch}
Student: ${student.name} (${student.rollNo}) | ${projectStage}

PROJECT SYNOPSIS: ${docData.projectTitle}
DOMAIN: ${docData.domain}

ABSTRACT:
${docData.abstract}

PROBLEM DEFINITION:
${docData.problemDefinition}

EXISTING VS PROPOSED:
Existing Drawbacks:
${docData.existingVsProposed.existingSystemDrawbacks.map((d) => `- ${d}`).join('\n')}

Proposed Advantages:
${docData.existingVsProposed.proposedSystemAdvantages.map((a) => `- ${a}`).join('\n')}

HARDWARE & SOFTWARE REQUIREMENTS:
Hardware:
${docData.hardwareSoftwareRequirements.hardware.join('\n')}
Software:
${docData.hardwareSoftwareRequirements.software.join('\n')}

SYSTEM ARCHITECTURE:
${docData.systemArchitectureOverview}

MODULES:
${docData.modules.map((m) => `${m.name}:\n${m.description}`).join('\n\n')}

CONCLUSION:
${docData.conclusion}
`;
    copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!docData) return;
    const md = `# ${docData.projectTitle}
### IARE Mini / Major Project Documentation
**Department of ${student.branch}**  
**Institute of Aeronautical Engineering (Autonomous)**  
**Student:** ${student.name} | **Roll No:** ${student.rollNo} | **Stage:** ${projectStage}  

---

## 1. Abstract
${docData.abstract}

## 2. Problem Definition
${docData.problemDefinition}

## 3. Comparison of Systems
### Existing System Drawbacks:
${docData.existingVsProposed.existingSystemDrawbacks.map((d) => `- ${d}`).join('\n')}

### Proposed System Advantages:
${docData.existingVsProposed.proposedSystemAdvantages.map((a) => `- ${a}`).join('\n')}

## 4. Software Requirements Specification (SRS)
### Hardware Requirements:
${docData.hardwareSoftwareRequirements.hardware.map((h) => `- ${h}`).join('\n')}

### Software Requirements:
${docData.hardwareSoftwareRequirements.software.map((s) => `- ${s}`).join('\n')}

## 5. System Architecture
${docData.systemArchitectureOverview}

## 6. Functional Modules
${docData.modules.map((m, i) => `### 6.${i + 1} ${m.name}\n${m.description}\n`).join('\n')}

## 7. Conclusion & Future Work
${docData.conclusion}
`;
    downloadFile(`${docData.projectTitle.replace(/\s+/g, '_')}_SRS.md`, md, 'text/markdown');
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl no-print">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              IARE Mini & Major Project Documentation (SRS)
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                Full Synopsis
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate comprehensive project abstracts, problem definitions, SRS specifications, system architecture, and module breakdowns for project reviews.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Category / Review Stage
              </label>
              <select
                value={projectStage}
                onChange={(e) => setProjectStage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Mini Project (III Year II Semester)">Mini Project (III Year II Semester)</option>
                <option value="Major Project Work Phase - I (IV Year I Semester)">Major Project Work Phase - I (IV Year I Semester)</option>
                <option value="Major Project Work Phase - II & Dissertation (IV Year II Semester)">Major Project Work Phase - II & Dissertation</option>
                <option value="Capstone Engineering Project">Capstone Engineering Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Technical Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Artificial Intelligence & Full Stack Web">AI & Full Stack Web</option>
                <option value="Internet of Things (IoT) & Embedded Systems">IoT & Embedded Systems</option>
                <option value="Blockchain & Decentralized Web3">Blockchain & Web3</option>
                <option value="Cloud Computing & DevOps Automation">Cloud & DevOps</option>
                <option value="Cyber Security & Network Defense">Cyber Security</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Title / Idea Description
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smart Campus Navigation and IoT-Powered Attendance System for IARE..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 pr-28"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={loading || !title.trim()}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs shadow-md shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
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

          {/* Presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Popular IARE Project Presets (1-Click Try):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PROJECT_DOC_PRESETS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTitle(item);
                    handleGenerate(item);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-slate-300 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Synopsis Sheet */}
      {docData && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 no-print">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-semibold text-slate-200">
                Project Documentation Ready
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
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Markdown</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all"
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
              <p className="text-xs sm:text-sm font-semibold text-rose-400 tracking-wide mt-0.5">
                Department of {student.branch} • Project Review Committee
              </p>
              <div className="mt-2 text-xs text-slate-400">
                Candidate: <strong className="text-white">{student.name}</strong> ({student.rollNo}) • {projectStage}
              </div>
            </div>

            <div className="text-center py-2 bg-rose-950/20 border border-rose-900/50 rounded-xl">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {docData.projectTitle}
              </h2>
              <span className="text-xs text-slate-400 mt-1 block">
                Technical Domain: {docData.domain}
              </span>
            </div>

            {/* 1. Abstract */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                1. Academic Abstract
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {docData.abstract}
              </p>
            </section>

            {/* 2. Problem Definition */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                2. Problem Definition & Objectives
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1">
                {docData.problemDefinition}
              </p>
            </section>

            {/* 3. Existing vs Proposed */}
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                3. System Analysis: Existing Drawbacks vs Proposed Advantages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                    Existing System Limitations:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {docData.existingVsProposed.existingSystemDrawbacks.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-400">✕</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Proposed System Enhancements:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {docData.existingVsProposed.proposedSystemAdvantages.map((a, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 4. Requirements SRS */}
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                4. Software Requirements Specification (SRS)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" /> Hardware Requirements
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {docData.hardwareSoftwareRequirements.hardware.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-indigo-400" /> Software Stack
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {docData.hardwareSoftwareRequirements.software.map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Architecture */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                5. System Architecture Design
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {docData.systemArchitectureOverview}
              </p>
            </section>

            {/* 6. Modules */}
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                6. Module Breakdown & Technical Deliverables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {docData.modules.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-rose-300 block">
                      {idx + 1}. {m.name}
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Conclusion */}
            <section className="space-y-1.5">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
                7. Conclusion & Roadmap
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed pl-1">
                {docData.conclusion}
              </p>
            </section>

            {/* Signatures */}
            <div className="pt-10 border-t border-slate-800 grid grid-cols-2 text-center text-xs text-slate-400">
              <div>
                <p className="mt-8 font-semibold text-slate-300">Project Guide / Supervisor</p>
              </div>
              <div>
                <p className="mt-8 font-semibold text-slate-300">Head of the Department (HOD)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
