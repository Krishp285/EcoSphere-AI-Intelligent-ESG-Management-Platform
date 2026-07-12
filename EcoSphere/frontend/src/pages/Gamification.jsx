import React, { useState } from 'react';
import { Trophy, Award, Gift, Zap, Star, CheckCircle, ShieldAlert } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Progress from '../components/common/Progress';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useEsg } from '../context/EsgContext';

const INITIAL_CHALLENGES = [
  { id: 'CHALL-01', title: 'Zero Waste Week', description: 'Minimize single-use plastics and packaging items corporate-wide.', xp: 300, category: 'Waste Management', current: 75, target: 100, active: true },
  { id: 'CHALL-02', title: 'Carpooling Initiative', description: 'Log commuter carpooling days to earn extra eco-volunteering XP.', xp: 150, category: 'Carbon Offset', current: 20, target: 50, active: true },
  { id: 'CHALL-03', title: 'Paperless Office Goal', description: 'Reduce local printer activity by 50% across IT department.', xp: 200, category: 'Resource Conservation', current: 95, target: 100, active: true },
];

const LEADERBOARD = [
  { name: 'Manufacturing', rank: 1, xp: 4500, badges: 8, color: 'text-yellow-500' },
  { name: 'IT', rank: 2, xp: 3800, badges: 6, color: 'text-gray-400' },
  { name: 'Logistics', rank: 3, xp: 2900, badges: 4, color: 'text-amber-600' },
  { name: 'HR', rank: 4, xp: 1500, badges: 2, color: 'text-gray-500' },
];

const REWARDS = [
  { id: 'RWD-01', title: 'Eco-Friendly Plant Pot', description: 'Succulent plant in a fully biodegradable pot for your desk.', xp_cost: 400, stock: 24 },
  { id: 'RWD-02', title: 'Reusable Coffee Tumbler', description: 'EcoSphere branded double-walled steel thermal flask.', xp_cost: 800, stock: 15 },
  { id: 'RWD-03', title: 'Tree Planted in Your Name', description: 'Verification certificate generated via green forest foundation.', xp_cost: 1200, stock: 999 },
];

export const Gamification = () => {
  const { recordChallengeCompletion } = useEsg();
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [rewards, setRewards] = useState(REWARDS);
  const [userXP, setUserXP] = useState(1250);
  const [activeTab, setActiveTab] = useState('Challenges');
  const [redemptions, setRedemptions] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [redemptionSuccessMsg, setRedemptionSuccessMsg] = useState('');

  const handleJoinChallenge = (id) => {
    setChallenges(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nextCurrent = Math.min(c.target, c.current + 10);
      if (nextCurrent >= c.target && c.current < c.target) {
        recordChallengeCompletion({
          challenge: c.title,
          description: `${c.title} completed and reflected in the live ESG scoreboard.`,
          toast: `Challenge completed: ${c.title}`
        });
      }
      return { ...c, current: nextCurrent };
    }));
  };

  const handleRedeem = (reward) => {
    if (userXP < reward.xp_cost) {
      alert('Insufficient XP to redeem this reward.');
      return;
    }
    setUserXP(prev => prev - reward.xp_cost);
    setRewards(prev => prev.map(r => r.id === reward.id ? { ...r, stock: Math.max(0, r.stock - 1) } : r));
    setRedemptions(prev => [reward.title, ...prev]);
    setRedemptionSuccessMsg(`Successfully redeemed your points for: "${reward.title}"! We'll send it to your desk shortly.`);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gamification & Rewards</h1>
          <p className="text-sm text-gray-500 mt-1">Earn corporate sustainability XP, badges, and redeem eco-friendly rewards</p>
        </div>
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 px-4 py-2.5 rounded-xl">
          <Zap className="w-6 h-6 text-primary-600 fill-primary-600 animate-pulse" />
          <div>
            <p className="text-xs text-primary-700 font-medium">Your Active XP</p>
            <p className="text-lg font-bold text-primary-900">{userXP} XP</p>
          </div>
        </div>
      </div>

      {/* Local Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4">
          {['Challenges', 'Leaderboards', 'Redeem Rewards'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Contents */}
      {activeTab === 'Challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map(c => {
            const pct = Math.round((c.current / c.target) * 100);
            return (
              <Card key={c.id} className="hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="primary">{c.category}</Badge>
                    <span className="text-xs font-bold text-primary-700">+{c.xp} XP</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 mb-4 leading-relaxed">{c.description}</p>
                </div>
                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between text-xs font-semibold text-gray-600">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={c.current} max={c.target} color="bg-primary-500" size="sm" />
                  <Button size="sm" variant="outline" fullWidth onClick={() => handleJoinChallenge(c.id)}>Log Action (+10%)</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'Leaderboards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Standings */}
          <Card className="lg:col-span-2">
            <CardHeader title="Department Leaderboard" subtitle="Sustainability ranking by total accumulated points" />
            <CardContent>
              <div className="space-y-4">
                {LEADERBOARD.map((dept, idx) => (
                  <div key={dept.name} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                        idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-gray-400 text-white' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        #{dept.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{dept.name}</p>
                        <p className="text-xs text-gray-400">{dept.badges} Badges Unlocked</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{dept.xp} XP</p>
                      <p className="text-xs text-gray-500">Corporate Contribution</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges Unlocked */}
          <Card>
            <CardHeader title="Unlocking Achievements" subtitle="Earn awards for target completions" />
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Carbon Champion', desc: 'Reduce department carbon footprint by 15% in Q1.', icon: Trophy, active: true },
                  { name: 'Volunteer Pioneer', desc: 'Log more than 40 CSR volunteer hours.', icon: Award, active: true },
                  { name: 'Governance Guardian', desc: 'Acknowledge all policies without reminders.', icon: Star, active: false },
                ].map(badge => (
                  <div key={badge.name} className={`flex items-start gap-3 p-3 rounded-lg border ${badge.active ? 'border-primary-100 bg-primary-50/20' : 'border-gray-100 opacity-60'}`}>
                    <badge.icon className={`w-8 h-8 ${badge.active ? 'text-primary-600' : 'text-gray-400'}`} />
                    <div>
                      <h4 className="font-semibold text-xs text-gray-900">{badge.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-1">{badge.desc}</p>
                      {badge.active && <Badge variant="success" className="mt-2 text-[9px] py-0">Unlocked</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'Redeem Rewards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rewards.map(r => (
              <Card key={r.id} className="flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div>
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-3">
                    <Gift className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{r.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 mb-4 leading-relaxed">{r.description}</p>
                </div>
                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between items-center text-xs text-gray-600 font-semibold">
                    <span>Stock: {r.stock} left</span>
                    <span className="text-primary-600">{r.xp_cost} XP</span>
                  </div>
                  <Button size="sm" fullWidth disabled={userXP < r.xp_cost || r.stock === 0} onClick={() => handleRedeem(r)}>Redeem</Button>
                </div>
              </Card>
            ))}
          </div>

          {redemptions.length > 0 && (
            <Card>
              <CardHeader title="Your Redemption Logs" />
              <CardContent>
                <div className="space-y-2">
                  {redemptions.map((title, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
                      <span className="text-gray-700">{title}</span>
                      <Badge variant="success">Redeemed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Redemption Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} title="Redemption Successful"
        footer={<Button onClick={() => setIsSuccessModalOpen(false)}>Done</Button>}
      >
        <div className="text-center p-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm text-gray-600">{redemptionSuccessMsg}</p>
        </div>
      </Modal>
    </div>
  );
};

export default Gamification;
