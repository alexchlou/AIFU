import React, { useState, useMemo } from 'react';
import CaseList from './components/CaseList';
import CaseMap, { stateMapping } from './components/CaseMap';
import ChinaMap, { provinceMapping } from './components/ChinaMap';
import CaseDetail from './components/CaseDetail';
import StarWarsIntro from './components/StarWarsIntro';
import casesData from './data/cases.json';
import { Layout, Map as MapIcon, List, Globe } from 'lucide-react';

const PROVINCE_KEYWORDS = {
  "guangdong": "广东省",
  "hubei": "湖北省",
  "sichuan": "四川省",
  "hunan": "湖南省",
  "guangxi": "广西壮族自治区",
  "beijing": "北京市",
  "zhejiang": "浙江省",
  "hebei": "河北省",
  "jiangsu": "江苏省",
};

function App() {
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US'); // 'US' or 'CN'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourt, setFilterCourt] = useState('All');
  const [showIntro, setShowIntro] = useState(true);

  const filteredCases = useMemo(() => {
    const filtered = casesData.filter(c => {
      const caseCountry = c.country || 'US';
      const matchesCountry = caseCountry === selectedCountry;

      const lowerSearch = searchTerm.toLowerCase();
      let matchesLocation = false;

      // Check if search term matches a province or state
      if (selectedCountry === 'CN') {
        const targetProvince = PROVINCE_KEYWORDS[lowerSearch];
        if (targetProvince) {
          const caseProvince = provinceMapping[c.court];
          if (caseProvince === targetProvince) {
            matchesLocation = true;
          }
        }
      } else if (selectedCountry === 'US') {
        const caseState = stateMapping[c.court];
        if (caseState && caseState.toLowerCase().includes(lowerSearch)) {
          matchesLocation = true;
        }
      }

      const matchesSearch = matchesLocation ||
        c.name.toLowerCase().includes(lowerSearch) ||
        c.defendants.some(d => d.toLowerCase().includes(lowerSearch));

      const matchesCourt = filterCourt === 'All' || c.court === filterCourt;
      return matchesCountry && matchesSearch && matchesCourt;
    });

    if (selectedCaseId) {
      return filtered.sort((a, b) => {
        if (a.id === selectedCaseId) return -1;
        if (b.id === selectedCaseId) return 1;
        return 0;
      });
    }
    return filtered;
  }, [searchTerm, filterCourt, selectedCountry, selectedCaseId]);

  const selectedCase = casesData.find(c => c.id === selectedCaseId);

  const courts = useMemo(() => {
    const countryCases = casesData.filter(c => (c.country || 'US') === selectedCountry);
    const uniqueCourts = [...new Set(countryCases.map(c => c.court))];
    return ['All', ...uniqueCourts];
  }, [selectedCountry]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-[#FFE81F]/30 selection:text-black relative overflow-hidden">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      {showIntro && <StarWarsIntro onComplete={() => setShowIntro(false)} />}
      {/* Header */}
      <header className="border-b border-[#FFE81F]/30 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#FFE81F] rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(255,232,31,0.3)]">
              <Layout className="w-5 h-5 text-[#FFE81F]" />
            </div>
            <h1 className="text-2xl font-bold text-[#FFE81F] tracking-widest uppercase" style={{ textShadow: '0 0 5px rgba(255, 232, 31, 0.5)' }}>
              AI Fair Use Case Tracker 2025 ©️ Alex Lou
              <a
                href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5458615"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-lg hover:text-white transition-colors border-b border-[#FFE81F] hover:border-white"
              >
                (SSRN)
              </a>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-black/50 rounded-lg p-1 border border-[#FFE81F]/30">
              <button
                onClick={() => { setSelectedCountry('US'); setFilterCourt('All'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all uppercase tracking-wider ${selectedCountry === 'US'
                  ? 'bg-[#FFE81F] text-black shadow-[0_0_10px_rgba(255,232,31,0.4)] font-bold'
                  : 'text-[#FFE81F]/60 hover:text-[#FFE81F]'
                  }`}
              >
                US Cases
              </button>
              <button
                onClick={() => { setSelectedCountry('CN'); setFilterCourt('All'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all uppercase tracking-wider ${selectedCountry === 'CN'
                  ? 'bg-[#FFE81F] text-black shadow-[0_0_10px_rgba(255,232,31,0.4)] font-bold'
                  : 'text-[#FFE81F]/60 hover:text-[#FFE81F]'
                  }`}
              >
                China Cases
              </button>
            </div>
            <div className="text-xs text-slate-500 font-mono border-l border-slate-800 pl-4">
              {casesData.length} CASES TOTAL
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 h-[calc(100vh-64px)] flex gap-6">
        {/* Left Panel: List */}
        <div className={`flex-1 flex flex-col min-w-[350px] max-w-md bg-black/40 rounded-2xl border border-[#FFE81F]/30 overflow-hidden transition-all duration-300 backdrop-blur-sm ${selectedCase ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#FFE81F]/20 space-y-4">
            <input
              type="text"
              placeholder="Search cases, defendants..."
              className="w-full bg-black/60 border border-[#FFE81F]/30 rounded-xl px-4 py-2.5 text-sm text-[#FFE81F] placeholder-[#FFE81F]/40 focus:outline-none focus:border-[#FFE81F] focus:ring-1 focus:ring-[#FFE81F] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {courts.map(court => (
                <button
                  key={court}
                  onClick={() => setFilterCourt(court)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors uppercase tracking-wider ${filterCourt === court
                    ? 'bg-[#FFE81F]/20 text-[#FFE81F] border border-[#FFE81F]'
                    : 'bg-black/40 text-[#FFE81F]/60 hover:bg-black/60 border border-[#FFE81F]/10'
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
          <div className="h-[400px] bg-black/40 rounded-2xl border border-[#FFE81F]/30 p-4 relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,232,31,0.1),_transparent_70%)] pointer-events-none" />

            {selectedCountry === 'US' ? (
              <CaseMap
                cases={filteredCases}
                selectedId={selectedCaseId}
                onSelect={setSelectedCaseId}
              />
            ) : (
              <ChinaMap
                cases={filteredCases}
                selectedId={selectedCaseId}
                onSelect={setSelectedCaseId}
              />
            )}

            <div className="absolute bottom-4 right-4 flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className={`w-2 h-2 rounded-full ${selectedCountry === 'CN' ? 'bg-red-500' : 'bg-indigo-500'} animate-pulse`} />
                Active
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur rounded-lg border border-slate-800 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Settled
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="flex-1 bg-black/40 rounded-2xl border border-[#FFE81F]/30 overflow-hidden relative backdrop-blur-sm">
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
