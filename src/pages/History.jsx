import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { History as HistoryIcon, Trash2, Search, CheckCircle2, XCircle, AlertTriangle, HelpCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { history, clearUserHistory } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.verdict === filter;
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getVerdictStyle = (v) => {
    switch (v) {
      case 'VERIFIED': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'FAKE': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
      case 'MISLEADING': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
      default: return { bg: 'bg-slate-800/40', text: 'text-slate-400', border: 'border-slate-700/40' };
    }
  };

  return (
    <div className="min-h-screen bg-[#080c18] p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HistoryIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-syne font-bold text-2xl text-white">Fact Checking History</h1>
            <p className="text-slate-400 text-xs">Review all your previous claim verifications and credibility scores.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearUserHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'VERIFIED', 'FAKE', 'MISLEADING', 'UNVERIFIED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative flex items-center w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved claims..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-400 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
          <HistoryIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-syne font-bold text-lg text-slate-300">No Fact Checks Found</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            {history.length === 0 
              ? 'You have not performed any fact checks yet.' 
              : 'No results match your selected filter criteria.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 transition-all mt-2"
          >
            Verify a Claim Now →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div key={item.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 glass-panel-hover">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getVerdictStyle(item.verdict).bg} ${getVerdictStyle(item.verdict).text} ${getVerdictStyle(item.verdict).border}`}>
                    {item.verdict}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Credibility: {item.score}/100</span>
                </div>
                <span className="text-xs text-slate-500">{item.timestamp}</span>
              </div>

              <p className="text-slate-100 text-sm font-medium leading-relaxed">
                "{item.text}"
              </p>

              {item.summary && (
                <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-800/60 pt-2.5">
                  {item.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default History;
