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
                        ? 'bg-[#FFE81F]/10 border-[#FFE81F] shadow-[0_0_15px_rgba(255,232,31,0.2)]'
                        : 'bg-black/40 border-[#FFE81F]/20 hover:bg-[#FFE81F]/5 hover:border-[#FFE81F]/50'
                        }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold text-sm leading-tight tracking-wide ${selectedId === c.id ? 'text-[#FFE81F]' : 'text-[#FFE81F]/80 group-hover:text-[#FFE81F]'
                            }`}>
                            {c.name}
                        </h3>
                        {c.status === 'Settled' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-900/30 text-green-400 border border-green-500/30 uppercase tracking-wider">
                                SETTLED
                            </span>
                        )}
                        {(c.status === 'Dismissed' || c.status === 'Vol. Dismissed') && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-900/30 text-red-400 border border-red-500/30 uppercase tracking-wider">
                                DISMISSED
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-[#FFE81F]/60">
                            <Scale className="w-3 h-3" />
                            <span>{c.court}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#FFE81F]/50">
                            <User className="w-3 h-3" />
                            <span className="truncate">{c.judge}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#FFE81F]/50">
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
