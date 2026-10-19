import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Plus, 
  Trash2, 
  HelpCircle,
  Percent
} from 'lucide-react';

interface SubjectAttendance {
  id: string;
  name: string;
  conducted: number;
  attended: number;
}

export const AttendancePlanner: React.FC = () => {
  const [overallConducted, setOverallConducted] = useState(140);
  const [overallAttended, setOverallAttended] = useState(115);

  const [subjects, setSubjects] = useState<SubjectAttendance[]>([
    { id: '1', name: 'Web Technologies (ACSD20)', conducted: 32, attended: 28 },
    { id: '2', name: 'Machine Learning (ACSD21)', conducted: 30, attended: 22 },
    { id: '3', name: 'Compiler Design (ACSD22)', conducted: 28, attended: 25 },
    { id: '4', name: 'Cloud Computing (ACSD23)', conducted: 26, attended: 18 },
    { id: '5', name: 'Machine Learning Lab', conducted: 12, attended: 11 },
    { id: '6', name: 'Web Technologies Lab', conducted: 12, attended: 11 },
  ]);

  // Overall calculations
  const percentage =
    overallConducted > 0
      ? ((overallAttended / overallConducted) * 100).toFixed(1)
      : '0.0';
  const numPercent = parseFloat(percentage);

  // Bunk or Attend calculation
  let bunkStatusMessage = '';
  let bunkCount = 0;
  let attendCount = 0;

  if (numPercent >= 75) {
    // How many classes can be missed: (attended - 0.75 * (conducted + x)) >= 0 => x <= (attended - 0.75 * conducted) / 0.75
    bunkCount = Math.floor((overallAttended - 0.75 * overallConducted) / 0.75);
    bunkStatusMessage =
      bunkCount > 0
        ? `You can safely miss ${bunkCount} class${bunkCount > 1 ? 'es' : ''} and still maintain 75% attendance.`
        : 'You are right on the 75% boundary! Do not miss any upcoming classes.';
  } else {
    // How many classes must be attended: (attended + y) / (conducted + y) >= 0.75 => y >= (0.75 * conducted - attended) / 0.25
    attendCount = Math.ceil((0.75 * overallConducted - overallAttended) / 0.25);
    bunkStatusMessage = `Critical: You must attend the next ${attendCount} consecutive class${
      attendCount > 1 ? 'es' : ''
    } to restore your attendance to 75%.`;
  }

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        id: `sub_${Date.now()}`,
        name: 'New Course / Lab',
        conducted: 20,
        attended: 16,
      },
    ]);
  };

  const updateSubject = (id: string, field: keyof SubjectAttendance, val: any) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const removeSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Sync overall from subjects
  const syncFromSubjects = () => {
    const totalCond = subjects.reduce((acc, s) => acc + s.conducted, 0);
    const totalAtt = subjects.reduce((acc, s) => acc + s.attended, 0);
    setOverallConducted(totalCond);
    setOverallAttended(totalAtt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                IARE Attendance Tracker & Bunk Master
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800">
                  75% Rule Enforced
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Autonomous regulations require 75% attendance to sit for Semester End Examinations (SEE).
              </p>
            </div>
          </div>

          {/* Large Percentage Badge */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Attendance
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-3xl font-extrabold font-mono ${
                    numPercent >= 75
                      ? 'text-emerald-400'
                      : numPercent >= 65
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {percentage}%
                </span>
              </div>
            </div>
            <div className="border-l border-slate-800 pl-3">
              {numPercent >= 75 ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Safe Zone</span>
                </div>
              ) : numPercent >= 65 ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Condonation Needed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <XCircle className="w-4 h-4" />
                  <span>Detained Warning</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Quick Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Total Classes Conducted So Far
            </label>
            <input
              type="number"
              min="1"
              value={overallConducted}
              onChange={(e) => setOverallConducted(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Total Classes Attended
            </label>
            <input
              type="number"
              min="0"
              max={overallConducted}
              value={overallAttended}
              onChange={(e) =>
                setOverallAttended(Math.min(overallConducted, Math.max(0, parseInt(e.target.value, 10) || 0)))
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Bunk Outcome Callout */}
        <div
          className={`mt-4 p-4 rounded-xl border text-sm flex items-start gap-3 ${
            numPercent >= 75
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
              : numPercent >= 65
              ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
              : 'bg-rose-950/20 border-rose-800/40 text-rose-300'
          }`}
        >
          {numPercent >= 75 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold block">IARE Bunk Calculator Insight:</span>
            <p className="mt-0.5 text-xs sm:text-sm font-medium">{bunkStatusMessage}</p>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-white">Subject-Wise Breakdown</h3>
            <p className="text-xs text-slate-400">
              Track attendance per individual theory or lab course.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={syncFromSubjects}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              Sync to Overall
            </button>
            <button
              onClick={addSubject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3 pl-4">Subject Name</th>
                <th className="p-3 w-28 text-center">Conducted</th>
                <th className="p-3 w-28 text-center">Attended</th>
                <th className="p-3 w-28 text-center">Percentage</th>
                <th className="p-3 w-36 text-center">Status</th>
                <th className="p-3 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900">
              {subjects.map((sub) => {
                const subPct = sub.conducted > 0 ? ((sub.attended / sub.conducted) * 100).toFixed(1) : '0.0';
                const subNum = parseFloat(subPct);
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 pl-4 font-medium text-slate-200">
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-teal-500 focus:outline-none w-full"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={sub.conducted}
                        onChange={(e) =>
                          updateSubject(sub.id, 'conducted', Math.max(1, parseInt(e.target.value, 10) || 1))
                        }
                        className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center font-mono text-white text-xs"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max={sub.conducted}
                        value={sub.attended}
                        onChange={(e) =>
                          updateSubject(
                            sub.id,
                            'attended',
                            Math.min(sub.conducted, Math.max(0, parseInt(e.target.value, 10) || 0))
                          )
                        }
                        className="w-16 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-center font-mono text-white text-xs"
                      />
                    </td>
                    <td className="p-3 text-center font-mono font-bold">
                      <span
                        className={
                          subNum >= 75
                            ? 'text-emerald-400'
                            : subNum >= 65
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                      >
                        {subPct}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          subNum >= 75
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : subNum >= 65
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {subNum >= 75 ? 'Safe' : subNum >= 65 ? 'Condone' : 'Shortage'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeSubject(sub.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
