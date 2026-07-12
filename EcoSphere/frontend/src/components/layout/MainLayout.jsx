import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useEsg } from '../../context/EsgContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Walkthrough from '../common/Walkthrough';
import { 
  Bot, Send, X, Sparkles, Layout, TreePine, Users, Scale, Trophy, FileBarChart, 
  ShieldCheck, Presentation, Settings, Play, Square, RefreshCw, ChevronUp 
} from 'lucide-react';

export const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { toasts } = useNotifications();
  const { 
    presentationMode, setPresentationMode, 
    demoMode, setDemoMode, resetDemoData, 
    executiveBrief, recordReportGeneration, recordVerificationEvent,
    simSpeed, setSimSpeed,
    scenarioMode, setScenarioMode,
    sensorsCount,
    carbonEventsToday,
    aiRecsCount,
    lastUpdateSeconds,
    floatingBadges
  } = useEsg();
  const location = useLocation();

  // Floating Assistant State
  const [isOpenAssistant, setIsOpenAssistant] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: `Welcome to EcoSphere ESG Intelligence. ${executiveBrief?.summary || 'Ask me anything or select a quick action below.'}`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const assistantEndRef = useRef(null);

  // Auto scroll assistant
  useEffect(() => {
    if (isOpenAssistant) {
      assistantEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpenAssistant]);

  // Protected route logic
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Floating AI response engine helper
  const handleQuickAction = (actionText) => {
    const userMsg = { id: Date.now(), text: actionText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setAiLoading(true);

    setTimeout(() => {
      let replyText = "";
      let structured = null;

      if (actionText === "Generate Report") {
        replyText = "Consolidated Report Summary compiled! I have updated the Smart Report Center. You can download the completed Q1 ESG Master Report PDF now.";
        recordReportGeneration({
          description: 'Executive report generated from the floating AI assistant quick action.'
        });
      } else if (actionText === "Predict compliance risks") {
        structured = {
          executiveSummary: "Logistics fuel usage trends present a medium-term compliance alert. Manufacturing ISO auditing is on track.",
          reasoning: "Current fleet routes are 78% dependent on diesel operations, exceeding the baseline by 8%.",
          impact: "+4.8 ESG points improvement if 5 routes convert to CNG.",
          savings: "₹18,50,000/year projected fuel offset.",
          priority: "High",
          risk: "Medium",
          confidence: "87%",
          actions: "Implement CNG green shipping partners on Tier-1 routes immediately."
        };
      } else if (actionText === "Generate Executive ESG Summary") {
        structured = {
          executiveSummary: "Overall ESG rating stands at A+ (Score 85/100). Carbon emissions are down 4% month-on-month.",
          reasoning: "Recent IT data center compressor upgrades offset Manufacturing power grid spikes.",
          impact: "Sustained +1.2 overall score uplift this quarter.",
          savings: "₹12,00,000 annualized IT cooling saving.",
          priority: "Critical",
          risk: "Low",
          confidence: "94%",
          actions: "Acknowledge outstanding ISO 14001 policies and scale IT green cooling."
        };
      } else if (actionText === "Verify Transaction") {
        replyText = "Initiated cryptographical proof verification. The next ledger seal is scheduled in 2.5 seconds on-chain.";
        recordVerificationEvent({
          txId: 'selected-ledger-entry',
          description: 'Floating assistant initiated a blockchain verification request.'
        });
      } else if (actionText === "Create Goal") {
        replyText = "I can draft a sustainability goal for renewable energy, waste reduction, or governance completion. Use the Goals modules to save it immediately.";
      }

      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: replyText, 
          structured,
          sender: 'bot' 
        }
      ]);
      setAiLoading(false);
    }, 1000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input;
    setInput('');
    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setAiLoading(true);

    setTimeout(() => {
      let replyText = `I have analyzed your request regarding "${text}". Our current ESG Overall Rating is A+ with an 85/100 index. Manufacturing is the highest emitting division. I recommend switching IT servers to green hosting.`;
      setMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot' }]);
      setAiLoading(false);
    }, 1000);
  };

  return (
    <div className={`flex h-screen bg-background font-sans overflow-hidden transition-all duration-300 ${presentationMode ? 'presentation-mode' : ''}`}>
      {/* Sidebar - hidden in Presentation Mode */}
      {!presentationMode && <Sidebar />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Top Navbar / Presentation Panel */}
        {presentationMode ? (
          <header className="bg-slate-900 text-white h-16 flex items-center px-4 md:px-6 justify-between sticky top-0 z-50 border-b border-slate-800 shadow-xl animate-slide-down">
            <div className="flex items-center space-x-3">
              <span className="bg-primary-500 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase animate-pulse">PRESENTATION MODE</span>
              <span className="font-semibold text-sm tracking-wide hidden sm:inline">EcoSphere AI Command Center</span>
            </div>

            {/* Quick presentation navigation links */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs">
              {[
                { name: 'Executive Dashboard', path: '/' },
                { name: 'Environmental', path: '/environmental' },
                { name: 'Social', path: '/social' },
                { name: 'Governance', path: '/governance' },
                { name: 'Gamification', path: '/gamification' },
                { name: 'Reports', path: '/reports' },
                { name: 'Trust Center', path: '/trust-center' }
              ].map(tab => {
                const active = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
                return (
                  <Link 
                    key={tab.name} 
                    to={tab.path} 
                    className={`px-3 py-1.5 rounded transition-all duration-200 ${
                      active ? 'bg-primary-500/20 text-primary-400 font-bold border border-primary-500/30' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {tab.name}
                  </Link>
                );
              })}
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-3 text-xs">
              {/* Demo Mode Toggle */}
              <button 
                onClick={() => setDemoMode(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  demoMode 
                    ? 'bg-green-500/10 text-green-400 border-green-500/30 animate-pulse' 
                    : 'bg-slate-800 text-gray-400 border-slate-700 hover:text-white'
                }`}
              >
                {demoMode ? <Play className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                <span>{demoMode ? 'Demo Active' : 'Start Live Sim'}</span>
              </button>

              <button 
                onClick={resetDemoData}
                className="bg-slate-800 text-gray-300 p-2 rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                title="Reset Metrics Baseline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => setPresentationMode(false)}
                className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Exit Show
              </button>
            </div>
          </header>
        ) : (
          <Navbar />
        )}

        {/* Content Outlet */}
        <main className={`flex-1 overflow-y-auto focus:outline-none p-4 md:p-6 pb-24 transition-all duration-300 ${
          presentationMode ? 'bg-slate-950 presentation-mode-active-layout' : 'bg-background'
        }`}>
          {/* Active Demo Mode Status Bar */}
          {demoMode && !presentationMode && (
            <div className="mb-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-wrap gap-4 items-center justify-between text-xs text-white shadow-xl backdrop-blur relative overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="font-extrabold uppercase text-[10px] tracking-wider text-green-400">TELEMETRY STREAM:</span>
                <span className="text-slate-300 hidden sm:inline">Monitoring live enterprise ESG data</span>
              </div>

              {/* Tickers */}
              <div className="flex items-center gap-4 flex-wrap text-[11px] font-semibold">
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">SYNC:</span>
                  <span className="text-primary-400">{lastUpdateSeconds}s ago</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">SENSORS:</span>
                  <span className="text-sky-400">{sensorsCount} online</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">CARBON EVENTS:</span>
                  <span className="text-green-400">{carbonEventsToday} logs</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">AI ADVISORIES:</span>
                  <span className="text-indigo-400">{aiRecsCount} files</span>
                </div>
              </div>

              {/* Toggles and buttons */}
              <div className="flex items-center gap-3">
                {/* Speed Controls */}
                <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                  {['slow', 'normal', 'fast'].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setSimSpeed(speed)}
                      type="button"
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-all ${
                        simSpeed === speed ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>

                {/* Scenario Toggle */}
                <button
                  onClick={() => setScenarioMode(v => !v)}
                  type="button"
                  className={`px-2.5 py-1 rounded-lg border text-[10px] uppercase font-extrabold transition-all ${
                    scenarioMode 
                      ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/20' 
                      : 'bg-slate-850 text-slate-400 border-slate-800'
                  }`}
                  title={scenarioMode ? 'Switch to Randomized Events' : 'Switch to Scripted Enterprise Demo Scenario'}
                >
                  {scenarioMode ? 'Scenario Mode' : 'Random Mode'}
                </button>

                <button 
                  onClick={() => setDemoMode(false)} 
                  type="button"
                  className="bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-extrabold px-3 py-1 rounded-lg text-[10px] uppercase transition-colors"
                >
                  Stop
                </button>
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {!presentationMode && <Footer />}

        {/* Global Toast Stack */}
        <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
          {toasts.map(toast => (
            <div key={toast.id} className={`p-3 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur animate-slide-in flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-50/90 text-green-800 border-green-200' :
              toast.type === 'error' ? 'bg-red-50/90 text-red-800 border-red-200' :
              toast.type === 'warning' ? 'bg-yellow-50/90 text-yellow-800 border-yellow-200' :
              'bg-blue-50/90 text-blue-800 border-blue-200'
            }`}>
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>{toast.message}</span>
            </div>
          ))}
        </div>

        {/* Global Expandable AI Assistant */}
        <div className="fixed bottom-6 right-6 z-40">
          {isOpenAssistant ? (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 sm:w-96 h-[460px] flex flex-col overflow-hidden animate-slide-up">
              {/* Header */}
              <div className="bg-primary-600 text-white p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <div>
                    <h3 className="font-bold text-xs">ESG Executive Assistant</h3>
                    <p className="text-[9px] text-primary-100">Analyzing corporate telemetry</p>
                  </div>
                </div>
                <button onClick={() => setIsOpenAssistant(false)} className="text-white hover:text-gray-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 text-xs">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-150 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}

                      {/* Render Structured ESG advisory summary */}
                      {msg.structured && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-150 space-y-2 text-[10px] text-gray-700">
                          <div className="bg-primary-50 p-2 rounded border border-primary-100">
                            <span className="font-bold block text-primary-800">Executive Summary:</span>
                            {msg.structured.executiveSummary}
                          </div>
                          <div><span className="font-bold text-gray-600">Reasoning:</span> {msg.structured.reasoning}</div>
                          <div className="grid grid-cols-2 gap-1.5 text-[9px] mt-1">
                            <div><span className="font-bold text-gray-600">Expected Impact:</span> {msg.structured.impact}</div>
                            <div><span className="font-bold text-gray-600">Cost Savings:</span> {msg.structured.savings}</div>
                            <div><span className="font-bold text-gray-600">Priority:</span> {msg.structured.priority}</div>
                            <div><span className="font-bold text-gray-600">Confidence:</span> {msg.structured.confidence}</div>
                          </div>
                          <div className="bg-slate-50 p-1.5 rounded font-mono text-[9px]">
                            <span className="font-bold text-gray-800 block mb-0.5">Recommended Actions:</span>
                            {msg.structured.actions}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-1.5 text-gray-500 italic text-[11px]">
                    <Bot className="w-3.5 h-3.5 animate-spin text-primary-500" />
                    <span>Analyzing ESG matrix...</span>
                  </div>
                )}
                <div ref={assistantEndRef} />
              </div>

              {/* Quick actions row */}
              <div className="p-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin">
                <button onClick={() => handleQuickAction("Generate Executive ESG Summary")} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-[10px] font-semibold hover:bg-primary-100">ESG Summary</button>
                <button onClick={() => handleQuickAction("Predict compliance risks")} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-[10px] font-semibold hover:bg-primary-100">Risk Assessment</button>
                <button onClick={() => handleQuickAction("Create Goal")} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-[10px] font-semibold hover:bg-primary-100">Create Goal</button>
                <button onClick={() => handleQuickAction("Generate Report")} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-[10px] font-semibold hover:bg-primary-100">Compile Report</button>
                <button onClick={() => handleQuickAction("Verify Transaction")} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-[10px] font-semibold hover:bg-primary-100">Verify Audit</button>
              </div>

              {/* Input bar */}
              <form onSubmit={handleSend} className="p-2 border-t border-gray-200 flex gap-1 bg-white">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask advisor..."
                  className="flex-1 px-2.5 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:outline-none"
                />
                <button type="submit" className="p-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <button 
              onClick={() => setIsOpenAssistant(true)}
              className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 hover:scale-105 transition-all z-40 group relative"
              title="ESG Executive Assistant"
            >
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary-500 border-2 border-white"></span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Event Badges Overlay */}
      {floatingBadges && floatingBadges.map(badge => (
        <div
          key={badge.id}
          style={badge.style}
          className="fixed z-50 bg-slate-900 border border-slate-700 text-primary-400 font-extrabold px-3 py-1.5 rounded-full text-xs shadow-2xl pointer-events-none animate-float-up"
        >
          {badge.text}
        </div>
      ))}

      {/* Guided Presentation Walkthrough overlay */}
      {presentationMode && <Walkthrough />}
    </div>
  );
};

export default MainLayout;
