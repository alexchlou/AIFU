import React from 'react';
import { ExternalLink, Calendar, Gavel, Users, FileText } from 'lucide-react';

const CaseDetail = ({ caseData }) => {
    if (!caseData) return null;

    return (
        <div className="h-full overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-800">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4 border-b border-slate-800 pb-6">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            {caseData.name}
                        </h2>
                        {caseData.status === 'Settled' && (
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                                SETTLED
                            </span>
                        )}
                        {(caseData.status === 'Dismissed' || caseData.status === 'Vol. Dismissed') && (
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 whitespace-nowrap">
                                DISMISSED
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                            <Gavel className="w-4 h-4 text-indigo-400" />
                            <span>{caseData.court}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                            <UserIcon className="w-4 h-4 text-indigo-400" />
                            <span>{caseData.judge}</span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Case Summary
                    </h3>
                    <p className="text-slate-300 leading-relaxed bg-slate-950/30 p-4 rounded-xl border border-slate-800/50">
                        {caseData.summary || "No summary available."}
                    </p>
                </div>

                {/* Parties */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Plaintiffs
                        </h3>
                        <ul className="space-y-2">
                            {caseData.plaintiffs.map((p, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-300 bg-slate-950/30 px-3 py-2 rounded-lg border border-slate-800/50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Defendants
                        </h3>
                        <ul className="space-y-2">
                            {caseData.defendants.map((d, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-300 bg-slate-950/30 px-3 py-2 rounded-lg border border-slate-800/50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
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
                        <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(caseData.name + " lawsuit update")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            Research Updates
                            <ExternalLink className="w-3 h-3" />
                        </a>
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
        </div>
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
