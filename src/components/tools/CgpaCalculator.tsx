import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Sparkles, 
  Award, 
  TrendingUp, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GRADE_POINTS, IARE_CURRICULUM_DATA, IARE_SEMESTERS } from '../../data/iareData';
import { StudentProfile } from '../../types';

interface SubjectRow {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
}

interface CgpaCalculatorProps {
  student: StudentProfile;
}

export const CgpaCalculator: React.FC<CgpaCalculatorProps> = ({ student }) => {
  const [selectedSem, setSelectedSem] = useState<string>(student.yearSem || 'III Year I Semester');
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  
  // CGPA Multi-Semester Planner
  const [targetCgpa, setTargetCgpa] = useState<number>(8.5);
  const [currentCgpa, setCurrentCgpa] = useState<number>(7.8);
  const [completedCredits, setCompletedCredits] = useState<number>(80);
  const [remainingCredits, setRemainingCredits] = useState<number>(80);

  // Load semester subjects
  useEffect(() => {
    const list = IARE_CURRICULUM_DATA[selectedSem] || IARE_CURRICULUM_DATA['III Year I Semester'] || [];
    setSubjects(
      list.map((s, idx) => ({
        id: `sub_${idx}_${Date.now()}`,
        code: s.code,
        name: s.name,
        credits: s.credits,
        grade: 'A', // default good grade
      }))
    );
  }, [selectedSem]);

  // Calculate SGPA
  const totalCredits = subjects.reduce((acc, s) => acc + (Number(s.credits) || 0), 0);
  const totalPoints = subjects.reduce(
    (acc, s) => acc + (Number(s.credits) || 0) * (GRADE_POINTS[s.grade] ?? 0),
    0
  );
  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  // Confetti trigger if high SGPA
  useEffect(() => {
    const num = parseFloat(sgpa);
    if (num >= 8.5 && subjects.length > 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  }, [sgpa]);

  const addCustomSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        code: `ELEC${prev.length + 1}`,
        name: 'Elective / Lab Subject',
        credits: 3.0,
        grade: 'A',
      },
    ]);
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof SubjectRow, value: any) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Required future SGPA to achieve target
  // Target = (Current * Completed + Required * Remaining) / (Completed + Remaining)
  // Required = (Target * (Completed + Remaining) - Current * Completed) / Remaining
  const totalDegreeCredits = completedCredits + remainingCredits;
  const targetRequiredSgpa =
    remainingCredits > 0
      ? (
          (targetCgpa * totalDegreeCredits - currentCgpa * completedCredits) /
          remainingCredits
        ).toFixed(2)
      : '0.00';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                IARE SGPA & CGPA Autonomous Calculator
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  R22 / R20 Regulations
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official credit weighting for IARE engineering curricula with live SGPA calculation and Target CGPA roadmap.
              </p>
            </div>
          </div>

          {/* SGPA Metric Highlight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-cyan-950/40 border border-cyan-800/60 flex items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Calculated SGPA
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold font-mono text-cyan-300">
                  {sgpa}
                </span>
                <span className="text-xs text-slate-400">/ 10.0</span>
              </div>
            </div>
            <div className="text-right border-l border-slate-800 pl-3 text-xs">
              <span className="text-slate-400 block">Total Credits:</span>
              <span className="font-mono font-bold text-white">{totalCredits.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-300">Curriculum Semester:</label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {IARE_SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={addCustomSubject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Custom Subject</span>
          </button>
        </div>
      </div>

      {/* Subject Grades Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Course Code</th>
                <th className="p-3.5">Course Name</th>
                <th className="p-3.5 w-24 text-center">Credits</th>
                <th className="p-3.5 w-36 text-center">Grade</th>
                <th className="p-3.5 w-24 text-center">Points</th>
                <th className="p-3.5 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
              {subjects.map((sub) => {
                const points = GRADE_POINTS[sub.grade] ?? 0;
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-cyan-300 font-medium">
                      <input
                        type="text"
                        value={sub.code}
                        onChange={(e) => updateSubject(sub.id, 'code', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none w-20"
                      />
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none w-full max-w-sm"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <select
                        value={sub.credits}
                        onChange={(e) => updateSubject(sub.id, 'credits', parseFloat(e.target.value))}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                      >
                        {[1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 9.0].map((c) => (
                          <option key={c} value={c}>
                            {c.toFixed(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-center">
                      <select
                        value={sub.grade}
                        onChange={(e) => updateSubject(sub.id, 'grade', e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold font-mono text-cyan-400 focus:outline-none"
                      >
                        {Object.keys(GRADE_POINTS).map((g) => (
                          <option key={g} value={g}>
                            {g} ({GRADE_POINTS[g]} pts)
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-slate-300">
                      {(sub.credits * points).toFixed(1)}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => removeSubject(sub.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Remove subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target CGPA Roadmap Planner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base text-white">IARE Target CGPA Planner</h3>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          Find out what average SGPA you must maintain in your remaining semesters to graduate with your desired honors/distinction CGPA.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Current Cumulative CGPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={currentCgpa}
              onChange={(e) => setCurrentCgpa(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Completed Credits So Far
            </label>
            <input
              type="number"
              value={completedCredits}
              onChange={(e) => setCompletedCredits(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Remaining Degree Credits
            </label>
            <input
              type="number"
              value={remainingCredits}
              onChange={(e) => setRemainingCredits(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Desired Target CGPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={targetCgpa}
              onChange={(e) => setTargetCgpa(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Goal Projection Output */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-400 block">
              Required Average SGPA in Remaining Semesters:
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-2xl font-extrabold font-mono ${
                  parseFloat(targetRequiredSgpa) > 10.0
                    ? 'text-rose-400'
                    : parseFloat(targetRequiredSgpa) <= 8.0
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {targetRequiredSgpa}
              </span>
              <span className="text-xs text-slate-500">/ 10.0</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 max-w-sm sm:text-right">
            {parseFloat(targetRequiredSgpa) > 10.0 ? (
              <span className="text-rose-400 font-semibold">
                ⚠️ Mathematically unreachable even with 10.0 SGPA in all remaining courses. Consider adjusting target.
              </span>
            ) : parseFloat(targetRequiredSgpa) <= 0 ? (
              <span className="text-emerald-400 font-semibold">
                🎉 Target is already secured! Keep up the great work.
              </span>
            ) : (
              <span className="text-emerald-300">
                Maintain an average of at least <strong>{targetRequiredSgpa} SGPA</strong> to hit your target <strong>{targetCgpa} CGPA</strong>!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
