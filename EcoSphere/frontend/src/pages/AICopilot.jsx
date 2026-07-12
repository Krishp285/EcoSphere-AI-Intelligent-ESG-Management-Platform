import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, Sparkles, AlertTriangle, ShieldCheck, 
  Target, Info, ArrowRight, TrendingUp, TrendingDown 
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useEsg } from '../context/EsgContext';
import { useNotifications } from '../context/NotificationContext';

export const AICopilot = () => {
  const { transactions, kpis, departments, aiInsights, executiveBrief } = useEsg();
  const { showToast } = useNotifications();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I am your EcoSphere AI Copilot. I analyze carbon emission trends, ESG scores, and CSR participation logs to help your organization meet sustainability goals. Ask me any question about your carbon footprints or ESG performance.", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const presetQuestions = [
    "How can we reduce emissions?",
    "Generate Executive ESG Summary",
    "Predict compliance risks",
    "Highest emitting department",
    "Suggest sustainability improvements",
    "How can we improve ESG score?",
    "Top governance issues",
    "Generate board presentation summary"
  ];

  // Dynamic Rule-Based AI Response Engine with structured data support
  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('reduce emissions') || q.includes('sustainability improvements')) {
      return {
        executiveSummary: "Transitioning 30% of energy consumption to solar grids and replacing legacy factory motors represents the highest impact path.",
        reasoning: "Manufacturing operations account for 45% of total carbon footprint, leaving substantial room for machinery efficiency improvements.",
        impact: "+6.2 Environmental points improvement.",
        savings: "₹24,00,000/year annualized electricity savings.",
        priority: "Critical",
        risk: "Medium",
        confidence: "94%",
        actions: "1. Order energy auditors to index Plant A.\n2. Apply for ISO 50001 certification grant."
      };
    }
    
    if (q.includes('executive esg summary') || q.includes('board presentation')) {
      return {
        executiveSummary: "Overall ESG Score stands at A+ (85/100) with IT leading (95) and Manufacturing trailing (65). Emissions down 4% month-on-month.",
        reasoning: "Solid progress on Social volunteering offsets slight delays in Governance compliance auditing updates.",
        impact: "+1.2 overall ESG index uplift.",
        savings: "₹12,00,000 cooling optimization saving.",
        priority: "High",
        risk: "Low",
        confidence: "92%",
        actions: "Present green IT cooling and carbon baseline compliance ledger logs to the board."
      };
    }

    if (q.includes('compliance risk') || q.includes('predict')) {
      return {
        executiveSummary: "Logistics fuel usage trends present a medium compliance alert. Manufacturing certification audit is due in Q2.",
        reasoning: "Fleet routes are 78% dependent on diesel operations, exceeding standard baselines by 8%.",
        impact: "+4.8 ESG points score recovery.",
        savings: "₹18,50,000/year projected fuel offset.",
        priority: "High",
        risk: "Medium",
        confidence: "87%",
        actions: "Transition 5 high-emission routes to CNG partners and complete compliance acknowledgement logs."
      };
    }

    if (q.includes('highest emitting')) {
      return {
        executiveSummary: "Manufacturing is the highest emitting department, currently contributing 56% of corporate carbon footprints.",
        reasoning: "Grid power consumption on heavy production lines is running at 5,000 kWh monthly.",
        impact: "Target reduction of 18% CO₂ possible.",
        savings: "₹24,00,000 annualized potential savings.",
        priority: "Critical",
        risk: "High",
        confidence: "94%",
        actions: "Deploy smart grid sensors and switch to clean electricity sources."
      };
    }

    if (q.includes('improve esg score') || q.includes('governance issues')) {
      return {
        executiveSummary: "Boost governance audit completion rate from 78% to 95%+ by completing policy checks.",
        reasoning: "Governance scores are currently low due to un-acknowledged compliance documents in HR departments.",
        impact: "+3.8 Governance index points.",
        savings: "Protects brand equity against penalty fees.",
        priority: "High",
        risk: "Low",
        confidence: "91%",
        actions: "Enable email notification compliance reminders for department managers in Platform Settings."
      };
    }

    // Default response string
    return {
      text: "I have analyzed your corporate ESG matrix records. Currently, carbon indicators are stable with verified blockchain trust validations. Ask me about compliance forecasts or digital twin parameters to simulate modifications."
    };
  };

  const handleSendQuery = (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const reply = generateAIResponse(text);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: reply.text, 
          structured: reply.executiveSummary ? reply : null,
          sender: 'bot' 
        }
      ]);
      setLoading(false);
      showToast('AI Advisory evaluation complete.', 'success');
    }, 800000 && 1000); // 1s simulation delay
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSendQuery(input);
    setInput('');
  };

  return (
    <div id="walkthrough-ai-copilot-content" className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* Chat Interface */}
      <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden border border-gray-250" noPadding>
        <div className="border-b border-gray-150 px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-600 animate-bounce" />
            <div>
              <h2 className="font-bold text-sm text-gray-900">ESG Copilot Assistant</h2>
              <p className="text-[10px] text-gray-500 font-semibold">Live Carbon Advisor & ESG Analysis Engine</p>
            </div>
          </div>
          <Badge variant="primary">AI LLaMA 3.1 Finetuned</Badge>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 max-w-[90%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'bg-primary-600 text-white rounded-tr-none shadow-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-md'
              }`}>
                {msg.text}

                {/* Structured Data output for premium presentation */}
                {msg.structured && (
                  <div className="mt-4 pt-3 border-t border-gray-150 space-y-3 text-slate-700">
                    <div className="bg-primary-50 border border-primary-100 p-3 rounded-xl">
                      <span className="font-extrabold text-primary-850 block mb-1 uppercase tracking-wider text-[10px]">AI Executive Summary</span>
                      <p className="text-gray-700 font-medium leading-relaxed">{msg.structured.executiveSummary}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {[
                        { label: 'Priority', val: msg.structured.priority, col: 'text-red-600 font-bold' },
                        { label: 'Confidence', val: msg.structured.confidence, col: 'text-green-600 font-bold' },
                        { label: 'Cost Savings', val: msg.structured.savings, col: 'text-blue-600 font-bold' },
                        { label: 'Expected ESG Impact', val: msg.structured.impact, col: 'text-primary-600 font-bold' }
                      ].map(item => (
                        <div key={item.label} className="bg-slate-50 p-2.5 rounded-lg border border-gray-150">
                          <span className="block text-4xs text-gray-500 uppercase tracking-wider font-bold">{item.label}</span>
                          <span className={`block text-2xs mt-1 leading-tight ${item.col}`}>{item.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-indigo-50/20 border border-indigo-100 p-3 rounded-xl">
                      <span className="font-bold text-indigo-900 block mb-1 text-[10px] uppercase tracking-wider">Reasoning Logic</span>
                      <p className="text-gray-600 leading-normal">{msg.structured.reasoning}</p>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[10px]">
                      <span className="font-bold text-green-400 block mb-1.5 uppercase tracking-wider text-[9px]">Next Recommended Actions</span>
                      <div className="whitespace-pre-line leading-relaxed">
                        {msg.structured.actions}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 italic">
              <Bot className="w-4 h-4 animate-spin text-primary-600" />
              <span>Analyzing carbon database matrices...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleFormSubmit} className="border-t border-gray-150 p-4 bg-white flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ask about emissions, ESG score improvements, or pending policy updates..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button type="submit" size="sm" icon={Send} disabled={loading}>Send</Button>
        </form>
      </Card>
      
      {/* Quick Prompts Panel */}
      <div className="space-y-6 overflow-y-auto pr-1">
        <Card className="border border-gray-250 bg-slate-950 text-white overflow-hidden">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400 font-semibold">Live Executive Brief</p>
                <h3 className="text-lg font-black tracking-tight mt-1">Executive ESG Assistant</h3>
              </div>
              <Badge variant="success" className="bg-emerald-500/15 text-emerald-300 border-emerald-500/20">Realtime</Badge>
            </div>

            <p className="text-xs leading-relaxed text-slate-300">{executiveBrief?.summary || 'Executive-level AI analysis is ready.'}</p>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {[
                { label: 'Priority', value: executiveBrief?.priority || 'Corporate Risk' },
                { label: 'Confidence', value: executiveBrief?.confidence || '92%' },
                { label: 'Risk', value: executiveBrief?.riskLevel || 'LOW' },
                { label: 'Savings', value: executiveBrief?.estimatedSavings || '₹0/yr' },
              ].map(item => (
                <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <span className="block text-slate-400 uppercase tracking-wider font-semibold">{item.label}</span>
                  <span className="block mt-1 font-bold text-white leading-tight">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-250">
          <CardHeader title="AI Executive Prompts" subtitle="Quick actions for live audit presentation" />
          <CardContent className="flex flex-col gap-2">
            {presetQuestions.map(q => (
              <button 
                key={q} 
                onClick={() => handleSendQuery(q)}
                className="w-full text-left p-2.5 rounded-lg border border-gray-150 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-all text-xs font-semibold text-gray-700 flex items-center justify-between"
              >
                <span>{q}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default AICopilot;
