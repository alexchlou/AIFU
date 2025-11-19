import React, { useState, useMemo } from 'react';
import CaseList from './components/CaseList';
import CaseMap from './components/CaseMap';
import CaseDetail from './components/CaseDetail';
import casesData from './data/cases.json';
import { Layout, Map as MapIcon, List } from 'lucide-react';

function App() {
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'list', 'map', 'both'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourt, setFilterCourt] = useState('All');

  const filteredCases = useMemo(() => {
    return casesData.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.defendants.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCourt = filterCourt === 'All' || c.court === filterCourt;
      return matchesSearch && matchesCourt;
    });
  }, [searchTerm, filterCourt]);

  const selectedCase = casesData.find(c => c.id === selectedCaseId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AIFU Case Tracker
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 font-mono">
              {casesData.length} CASES TRACKED
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 h-[calc(100vh-64px)] flex gap-6">
        {/* Left Panel: List */}
        <div className={`flex-1 flex flex-col min-w-[350px] max-w-md bg-slate-900/30 rounded-2xl border border-slate-800 overflow-hidden transition-all duration-300 ${selectedCase ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-800 space-y-4">
            <input
              type="text"
              placeholder="Search cases, defendants..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'ND California', 'SDNY', 'D. Mass.', 'D. Col.', 'ND Illinois', 'CD California', 'Delaware'].map(court => (
                <button
                  key={court}
                  onClick={() => setFilterCourt(court)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterCourt === court 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {court}
                </button>
              ))}
            </div>
          </div>
          
          <CaseList 
            cases={filteredCases} 
            selectedId={selectedCaseId} 
            onSelect={setSelectedCaseId} 
          />
        </div>

        {/* Right Panel: Map & Details */}
        <div className="flex-[2] flex flex-col gap-6 overflow-hidden">
          {/* Map Visualization */}
          <div className="h-[400px] bg-slate-900/30 rounded-2xl border border-slate-800 p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            <CaseMap 
              cases={filteredCases} 
              selectedId={selectedCaseId}
              onSelect={setSelectedCaseId}
            />
            
            <div className="absolute bottom-4 right-4 flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Active
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Settled
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="flex-1 bg-slate-900/30 rounded-2xl border border-slate-800 overflow-hidden relative">
            {selectedCase ? (
              <CaseDetail caseData={selectedCase} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                  <List className="w-8 h-8 opacity-50" />
                </div>
                <p>Select a case to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
