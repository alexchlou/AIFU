import React from 'react';
import { X, ExternalLink, Calendar, MapPin, Gavel, FileText, Scale, Users } from 'lucide-react';

const CaseDetail = ({ caseData }) => {
    if (!caseData) return null;

    return (
        <div className="h-full overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#FFE81F] scrollbar-track-black">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4 border-b border-[#FFE81F]/30 pb-6">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-3xl font-bold text-[#FFE81F] leading-tight tracking-wider uppercase" style={{ textShadow: '0 0 10px rgba(255, 232, 31, 0.3)' }}>
                            {caseData.name}
                        </h2>
                        {caseData.status === 'Settled' && (
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-900/30 text-green-400 border border-green-500/30 whitespace-nowrap uppercase tracking-wider">
                                SETTLED
                            </span>
                        )}
                        {(caseData.status === 'Dismissed' || caseData.status === 'Vol. Dismissed') && (
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-900/30 text-red-400 border border-red-500/30 whitespace-nowrap uppercase tracking-wider">
                                DISMISSED
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-[#FFE81F]/70">
                        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-[#FFE81F]/30">
                            <Gavel className="w-4 h-4 text-[#FFE81F]" />
                            <span>{caseData.court}</span>
                        </div>
                        {caseData.country !== 'CN' && (
                            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-[#FFE81F]/30">
                                <UserIcon className="w-4 h-4 text-[#FFE81F]" />
                                <span>{caseData.judge}</span>
                            </div>
                        )}
                        {caseData.case_number && (
                            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-[#FFE81F]/30">
                                <FileText className="w-4 h-4 text-[#FFE81F]" />
                                <span className="font-mono">{caseData.case_number}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Official Case Record (from Case MCP) */}
                {caseData.pkulaw_case_url && (
                    <div className="bg-indigo-950/30 p-4 rounded-xl border border-indigo-500/30 space-y-2">
                        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                            <Scale className="w-5 h-5" />
                            Official Case Record (via PKUlaw Case MCP)
                        </h3>
                        <p className="text-slate-200 font-medium">{caseData.official_title}</p>
                        <a
                            href={caseData.pkulaw_case_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 inline-flex"
                        >
                            View Full Case Record on PKUlaw <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}

                {/* Summary */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#FFE81F] flex items-center gap-2 uppercase tracking-wide">
                        <FileText className="w-5 h-5" />
                        Case Summary
                    </h3>
                    <p className="text-[#FFE81F]/90 leading-relaxed bg-black/40 p-4 rounded-xl border border-[#FFE81F]/30 font-light">
                        {caseData.summary || "No summary available."}
                    </p>
                </div>

                {/* Relevant Laws (from MCP) */}
                {caseData.relevant_laws && caseData.relevant_laws.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                            <Gavel className="w-5 h-5" />
                            Relevant Laws & Regulations (via PKUlaw MCP)
                        </h3>
                        <div className="grid gap-4">
                            {caseData.relevant_laws.map((law, i) => (
                                <div key={i} className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/50 space-y-2">
                                    <h4 className="font-medium text-slate-200">{law.title}</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed">{law.article}</p>
                                    <a
                                        href={law.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2"
                                    >
                                        View on PKUlaw <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Parties */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#FFE81F] flex items-center gap-2 uppercase tracking-wide">
                            <Users className="w-5 h-5" />
                            Plaintiffs
                        </h3>
                        <ul className="space-y-2">
                            {caseData.plaintiffs.map((p, i) => (
                                <li key={i} className="flex items-center gap-2 text-[#FFE81F]/80 bg-black/40 px-3 py-2 rounded-lg border border-[#FFE81F]/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4BD5EE]" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-[#FFE81F] flex items-center gap-2 uppercase tracking-wide">
                            <Users className="w-5 h-5" />
                            Defendants
                        </h3>
                        <ul className="space-y-2">
                            {caseData.defendants.map((d, i) => (
                                <li key={i} className="flex items-center gap-2 text-[#FFE81F]/80 bg-black/40 px-3 py-2 rounded-lg border border-[#FFE81F]/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
                                    {d}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Links */}
                {caseData.links && caseData.links.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                            <ExternalLink className="w-5 h-5" />
                            Documents & Links
                        </h3>
                        <div className="grid gap-3">
                            {caseData.links.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
                                >
                                    <span className="font-medium text-slate-200 group-hover:text-white">
                                        {link.title}
                                    </span>
                                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timeline & Research */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Case Timeline
                        </h3>
                        <div className="flex gap-2">
                            {caseData.country === 'CN' ? (
                                <>
                                    <a
                                        href="https://www.pkulaw.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        Search PKUlaw
                                        <ExternalLink className="w-3 h-3" />
                                    </a>

                                </>
                            ) : (
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(caseData.name + " lawsuit update")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    Research Updates
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="relative border-l-2 border-slate-800 ml-3 space-y-6 pb-2">
                        {caseData.timeline && caseData.timeline.length > 0 ? (
                            caseData.timeline.map((event, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-mono text-indigo-400">{event.date}</span>
                                        <h4 className="text-sm font-medium text-slate-200">{event.event}</h4>
                                        {event.description && (
                                            <p className="text-xs text-slate-400 leading-relaxed">{event.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="pl-6 text-sm text-slate-500 italic">
                                No timeline events recorded yet. Use the research button to find updates.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

// Helper icon component
const UserIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default CaseDetail;
