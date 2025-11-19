import React from 'react';
import { ChevronRight, Scale, User, Users } from 'lucide-react';

const CaseList = ({ cases, selectedId, onSelect }) => {
    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
            {cases.map((c) => (
                <div
                    key={c.id}
                    onClick={() => onSelect(c.id)}
                    className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedId === c.id
                        ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/30 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700'
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold text-sm leading-tight ${selectedId === c.id ? 'text-indigo-300' : 'text-slate-200 group-hover:text-white'
                            }`}>
                            {c.name}
                        </h3>
                        {c.status === 'Settled' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                SETTLED
                            </span>
                        )}
                        {(c.status === 'Dismissed' || c.status === 'Vol. Dismissed') && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                                DISMISSED
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Scale className="w-3 h-3" />
                            <span>{c.court}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <User className="w-3 h-3" />
                            <span className="truncate">{c.judge}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Users className="w-3 h-3" />
                            <span className="truncate">vs. {c.defendants.join(', ')}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CaseList;
