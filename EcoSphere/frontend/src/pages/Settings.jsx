import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Users, Database } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const SETTINGS_KEY = 'eco_platform_settings';

export const Settings = () => {
  const [activeSection, setActiveSection] = useState('Organization Settings');
  
  // Settings forms State
  const [orgName, setOrgName] = useState('Acme Corp (Global)');
  const [adminEmail, setAdminEmail] = useState('admin@ecosphere.ai');
  const [carbonTarget, setCarbonTarget] = useState('3.0');
  const [currency, setCurrency] = useState('INR (₹)');
  const [multiplier, setMultiplier] = useState('1.0x (Standard)');
  const [syncPolicy, setSyncPolicy] = useState('Continuous on transaction creation');
  const [interval, setIntervalVal] = useState('90 days (Quarterly)');
  
  // Success states
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.orgName) setOrgName(parsed.orgName);
        if (parsed.adminEmail) setAdminEmail(parsed.adminEmail);
        if (parsed.carbonTarget) setCarbonTarget(parsed.carbonTarget);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.multiplier) setMultiplier(parsed.multiplier);
        if (parsed.syncPolicy) setSyncPolicy(parsed.syncPolicy);
        if (parsed.interval) setIntervalVal(parsed.interval);
      }
    } catch (_) {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const config = { orgName, adminEmail, carbonTarget, currency, multiplier, syncPolicy, interval };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
    } catch (_) {}
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure ESG targets, department maps, API bindings, and notification alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {[
            { name: 'Organization Settings', icon: Users },
            { name: 'ESG Target Configurations', icon: Database },
            { name: 'Compliance & Auditing', icon: Shield },
            { name: 'Alerts & Notifications', icon: Bell },
          ].map(sec => {
            const Icon = sec.icon;
            return (
              <button key={sec.name} type="button" onClick={() => setActiveSection(sec.name)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-semibold rounded-lg transition-colors ${
                  activeSection === sec.name ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <Icon className="w-4 h-4" />
                {sec.name}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <Card className="lg:col-span-3">
          <CardHeader title={activeSection} subtitle="Modify configuration properties" />
          <CardContent>
            
            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                ✓ Configuration settings updated successfully!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {activeSection === 'Organization Settings' && (
                <div className="space-y-4">
                  <Input label="Organization Name" value={orgName} onChange={e => setOrgName(e.target.value)} />
                  <Input label="Primary Administrator Email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Company Reporting Currency</label>
                    <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                      value={currency} onChange={e => setCurrency(e.target.value)}>
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'ESG Target Configurations' && (
                <div className="space-y-4">
                  <Input label="Monthly Carbon Baseline (tCO₂)" type="number" step="0.1" value={carbonTarget} onChange={e => setCarbonTarget(e.target.value)} />
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Volunteering Points Multiplier</label>
                    <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                      value={multiplier} onChange={e => setMultiplier(e.target.value)}>
                      <option>1.0x (Standard)</option>
                      <option>1.5x (Promo volunteering month)</option>
                      <option>2.0x (Double Points)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'Compliance & Auditing' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Blockchain Ledger Sync Policy</label>
                    <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                      value={syncPolicy} onChange={e => setSyncPolicy(e.target.value)}>
                      <option>Continuous on transaction creation</option>
                      <option>Weekly bulk anchors</option>
                      <option>Manual trigger only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Audit Policy Verification Interval</label>
                    <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none"
                      value={interval} onChange={e => setIntervalVal(e.target.value)}>
                      <option>30 days</option>
                      <option>90 days (Quarterly)</option>
                      <option>365 days (Annual)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'Alerts & Notifications' && (
                <div className="space-y-3">
                  {[
                    { id: 'remind', title: 'Carbon threshold warnings', desc: 'Email notification when monthly emissions exceed 90% target baseline.' },
                    { id: 'remind_policy', title: 'Acknowledge policy alerts', desc: 'Send daily warning notifications for un-acknowledged compliance policies.' },
                    { id: 'badge', title: 'Badge milestone notifications', desc: 'Alert entire department when milestone badges are unlocked.' },
                  ].map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                      <input id={item.id} type="checkbox" defaultChecked className="mt-1 h-3.5 w-3.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer" />
                      <label htmlFor={item.id} className="cursor-pointer">
                        <span className="block text-xs font-semibold text-gray-800">{item.title}</span>
                        <span className="block text-[10px] text-gray-500 mt-0.5">{item.desc}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button type="submit">Save Configurations</Button>
              </div>
            </form>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
