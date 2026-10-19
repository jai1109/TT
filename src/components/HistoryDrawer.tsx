import React from 'react';
import { X, Trash2, ArrowUpRight, Clock, FileText, Presentation, Code2, BookOpen, Layers } from 'lucide-react';
import { SavedHistoryItem, TabType } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedHistoryItem[];
  onSelect: (item: SavedHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const getTypeBadge = (type: TabType) => {
    switch (type) {
      case 'ppt':
        return { label: 'PPT Deck', bg: 'bg-indigo-950/80 text-indigo-400 border-indigo-800' };
      case 'lab_record':
        return { label: 'Lab Record', bg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800' };
      case 'assignment':
        return { label: 'Assignment', bg: 'bg-cyan-950/80 text-cyan-400 border-cyan-800' };
      case 'case_study':
        return { label: 'Case Study', bg: 'bg-amber-950/80 text-amber-400 border-amber-800' };
      case 'code_solver':
        return { label: 'Code Solution', bg: 'bg-purple-950/80 text-purple-400 border-purple-800' };
      case 'project_doc':
        return { label: 'Project SRS', bg: 'bg-rose-950/80 text-rose-400 border-rose-800' };
      default:
        return { label: 'Doc', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Generated Materials History</h3>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/40 transition-colors"
                title="Clear all saved history"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <FileText className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-medium text-slate-300">No generated items yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Your generated PPTs, Lab Records, Assignments and Code will appear here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const badge = getTypeBadge(item.type);
              return (
                <div
                  key={item.id}
                  className="group relative p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 rounded transition-opacity"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 mt-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900 text-[11px] text-slate-500">
                    <span>{item.timestamp}</span>
                    <span className="flex items-center gap-1 text-cyan-400 font-medium">
                      Open <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
