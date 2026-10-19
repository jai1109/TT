import React from 'react';
import { ExternalLink, Globe, BookOpen, GraduationCap, School, FileText, CheckCircle2 } from 'lucide-react';
import { IARE_PORTAL_LINKS } from '../../data/iareData';

export const QuickLinksView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              IARE Official Portals & Academic Gateways
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Verified Links
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              One-click direct access to Institute of Aeronautical Engineering official portals, ERP, LMS, and result gateways.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {IARE_PORTAL_LINKS.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {link.badge}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                {link.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {link.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span className="font-mono text-[11px] text-slate-500">{link.category}</span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Launch Portal →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Campus Info & Contacts */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
        <h4 className="font-bold text-white text-sm">About Institute of Aeronautical Engineering (IARE)</h4>
        <p>
          Established in 2000, IARE is an autonomous engineering institution in Dundigal, Hyderabad, accredited by NAAC with 'A+' grade and NBA. CheatCode IARE 2.0 is an independent academic productivity suite created to accelerate engineering students' coursework, lab records, seminar slide decks, and exam preparations.
        </p>
      </div>
    </div>
  );
};
