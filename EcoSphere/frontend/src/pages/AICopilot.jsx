import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, AlertTriangle, ShieldCheck, TrendingDown, Target, Building2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useEsg } from '../context/EsgContext';

export const AICopilot = () => {
  const { transactions, kpis, departments, aiInsights } = useEsg();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your EcoSphere AI Copilot. I analyze carbon emission trends, ESG scores, and CSR participation logs to help your organization meet sustainability goals. Ask me any question about your carbon footprints or ESG performance.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dynamic Rule-Based AI Response Engine
  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    
    // Carbon query
    if (q.includes('carbon') || q.includes('emission') || q.includes('co2')) {
      const totalCO2 = transactions.reduce((acc, curr) => acc + curr.total_co2, 0).toFixed(2);
      return `Based on live database records, your total CO₂ emissions stand at ${totalCO2} metric tons. The Manufacturing department is currently the largest contributor. I suggest replacing aging machinery in Plant A, which could reduce emissions by 18% and improve your Overall ESG score by +6.2 points.`;
    }
    
    // ESG Score query
    if (q.includes('esg') || q.includes('score') || q.includes('rank') || q.includes('kpi')) {
      const score = kpis.find(k => k.id === 'overall_score')?.value || '85';
      const env = kpis.find(k => k.id === 'env_score')?.value || '88';
      return `Our overall ESG Score is currently ${score}/100. Environmental sub-score is ${env}/100. IT and HR departments lead with scores of 88 and 95, respectively, while Manufacturing lags at 65. Review your compliance logs or volunteer participation to boost governance metrics.`;
    }

    // Recommendation / Action query
    if (q.includes('recommend') || q.includes('action') || q.includes('improve') || q.includes('save')) {
      const rec = aiInsights[0]?.recommendation || "Replace legacy compressors with energy-efficient models.";
      const reduction = aiInsights[0]?.expected_carbon_reduction || "18%";
      return `My top priority recommendation is: "${rec}". This has an expected carbon reduction of ${reduction} with an estimated cost savings of ${aiInsights[0]?.estimated_cost_savings || '₹24L/yr'}. Click 'Apply' in the Environmental overview to add this action to your corporate log.`;
    }

    // Challenge / Gamification
    if (q.includes('challenge') || q.includes('points') || q.includes('xp') || q.includes('gamif')) {
      return `Active corporate sustainability challenges: "Zero Waste Week" and "Carpooling Initiative". Manufacturing leads the department leaderboard with 4,500 XP. Employees can redeem points for succulent desk planters or reusable double-walled cups in the Gamification panel.`;
    }

    // Default response
    return "I've analyzed your organizational ESG telemetry. Overall, carbon metrics are stable but Manufacturing power efficiency indicates an audit is recommended. Let me know if you would like me to generate a consolidated PDF Report Summary.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reply = generateAIResponse(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'bot' }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      
      {/* Chat Interface */}
      <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden" noPadding>
        <div className="border-b border-gray-150 px-6 py-4 flex items-center gap-2 bg-gray-50/50">
          <Bot className="w-5 h-5 text-primary-600 animate-bounce" />
          <div>
            <h2 className="font-semibold text-sm text-gray-900">ESG Copilot Assistant</h2>
            <p className="text-[10px] text-gray-500">Live Carbon Advisor & ESG Analysis Engine</p>
          </div>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-gray-50 text-gray-800 border border-gray-150 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Bot className="w-4 h-4 animate-spin text-primary-600" />
              <span>Analyzing telemetry...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="border-t border-gray-150 p-4 bg-white flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ask about emissions, ESG score improvements, or pending policy updates..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button type="submit" size="sm" icon={Send} disabled={loading}>Send</Button>
        </form>
      </Card>

      {/* Side Insights Panels */}
      <div className="space-y-6 overflow-y-auto pr-1">
        
        {/* Risk Prediction */}
        <Card>
          <CardHeader title="Predictive Risk Center" subtitle="AI predictive compliance warnings" />
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Logistics Carbon Threshold', text: 'On track to exceed Q1 allocation by 8% if fleet operations continue at current pace.', alert: 'High', icon: AlertTriangle },
                { title: 'ISO Auditing Gap', text: 'Manufacturing ISO certifications require updates by Q2 to preserve compliance credentials.', alert: 'Medium', icon: ShieldCheck },
              ].map(risk => (
                <div key={risk.title} className="border border-gray-150 rounded-lg p-3 bg-white">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-[11px] text-gray-900 flex items-center gap-1.5">
                      <risk.icon className={`w-3.5 h-3.5 ${risk.alert === 'High' ? 'text-red-500' : 'text-blue-500'}`} />
                      {risk.title}
                    </h4>
                    <Badge variant={risk.alert === 'High' ? 'danger' : 'warning'}>{risk.alert}</Badge>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed mt-1.5">{risk.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Predictor */}
        <Card>
          <CardHeader title="ESG Target Simulator" subtitle="Estimated score impacts" />
          <CardContent className="space-y-4">
            <div className="border border-primary-50 bg-primary-50/10 p-3 rounded-lg text-xs">
              <p className="font-semibold text-gray-900">Implement Liquid Cooling</p>
              <div className="flex justify-between text-[11px] text-gray-500 mt-2">
                <span>Carbon Reduction:</span>
                <span className="font-semibold text-green-600">↓ 31% IT CO₂</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>Overall ESG Increase:</span>
                <span className="font-semibold text-primary-600">+3.5 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default AICopilot;
