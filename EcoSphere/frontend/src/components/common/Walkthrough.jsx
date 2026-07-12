import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Play, Award, Sparkles, Layers } from 'lucide-react';
import { useEsg } from '../../context/EsgContext';

const steps = [
  {
    title: "Executive Command Center",
    description: "This dashboard provides a real-time overview of enterprise ESG performance, AI insights, and sustainability KPIs.",
    importance: "Acts as the unified operations console for ESG directors and board members.",
    value: "Simplifies complex reporting and enables instant, data-driven decisions.",
    path: "/",
    selector: "#walkthrough-dashboard-hero"
  },
  {
    title: "AI Executive Assessment",
    description: "Advanced machine learning algorithms scan real-time carbon data to compile immediate sustainability strategies.",
    importance: "Pinpoints high-emission outliers and automatically charts corrective plans.",
    value: "Automates consulting workflows, saving significant resource hours.",
    path: "/",
    selector: "#walkthrough-exec-ai"
  },
  {
    title: "Organization ESG Grade",
    description: "A synthesized score badge representing corporate compliance and environmental stewardship rankings.",
    importance: "Standardized grading aggregate across the E, S, and G metrics.",
    value: "Increases brand valuation and satisfies capital investor ESG criteria.",
    path: "/",
    selector: "#walkthrough-esg-grade"
  },
  {
    title: "Live ESG Risk Meter",
    description: "Real-time compliance risk indicators mapping operational outputs against global regulatory baselines.",
    importance: "Provides visual warning cues when metrics fall behind goals.",
    value: "Minimizes regulatory liabilities and prevents compliance penalty fees.",
    path: "/",
    selector: "#walkthrough-risk-meter"
  },
  {
    title: "Environmental Ledger",
    description: "Log carbon emissions, track energy efficiency coefficients, and solid waste metrics across all plants.",
    importance: "Detailed carbon footprint indexes mapping to Greenhouse Gas Protocol scopes.",
    value: "Secures audit-ready tracking with verifiable blockchain data reliability.",
    path: "/environmental",
    selector: "#walkthrough-environmental-content"
  },
  {
    title: "Social Responsibility Hub",
    description: "Organize employee volunteer drives, log CSR contribution hours, and allocate community impact points.",
    importance: "Centralizes tracking for corporate charity campaigns and employee safety training.",
    value: "Improves corporate talent retention, community outreach, and social index branding.",
    path: "/social",
    selector: "#walkthrough-social-content"
  },
  {
    title: "Governance & Policies",
    description: "Track board compliance certifications, publish compliance protocols, and monitor whistleblower safety records.",
    importance: "Enforces executive audits, supply chain reviews, and policy alignment.",
    value: "Mitigates administrative liability and protects standard operating compliance.",
    path: "/governance",
    selector: "#walkthrough-governance-content"
  },
  {
    title: "Smart Reporting Center",
    description: "Generate investor-ready reporting folders matching GRI, SASB, and custom stakeholder compliance frameworks.",
    importance: "Exportable spreadsheets, automated templates, and printable certificates.",
    value: "Reduces audit report compilation times from weeks to minutes.",
    path: "/reports",
    selector: "#walkthrough-reports-content"
  },
  {
    title: "Blockchain Trust Center",
    description: "Audit public cryptographic transaction ledger hashes to verify proof of sustainability seals.",
    importance: "Provides third-party auditor ledger access showing immutable sealing records.",
    value: "Provides ironclad mathematical protection against greenwashing allegations.",
    path: "/trust-center",
    selector: "#walkthrough-trust-content"
  },
  {
    title: "AI Advisory Copilot",
    description: "Chat with our fine-tuned ESG assistant to draft policies, review guidelines, and analyze telemetry datasets.",
    importance: "Natural language interface trained on deep corporate datasets and environmental policies.",
    value: "Instant, conversational intelligence on regulatory files without external advisory fees.",
    path: "/ai-copilot",
    selector: "#walkthrough-ai-copilot-content"
  },
  {
    title: "Gamification & Badges",
    description: "Boost employee engagement via environmental challenges, badges, score multiplier cards, and items shop.",
    importance: "Acknowledges and rewards grassroots green contributions across teams.",
    value: "Cultivates sustainability culture from the ground up, boosting employee net promoter scores.",
    path: "/gamification",
    selector: "#walkthrough-gamification-content"
  },
  {
    title: "Enterprise Configuration",
    description: "Adjust emission baseline parameters, configure notification thresholds, select sync intervals, and manage permissions.",
    importance: "Provides granular control over the application's underlying scoring rules.",
    value: "Configures system variables to match local compliance structures easily.",
    path: "/settings",
    selector: "#walkthrough-settings-content"
  }
];

export const Walkthrough = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPresentationMode } = useEsg();

  // Restore step from localStorage or default to 0
  const [stepIndex, setStepIndex] = useState(() => {
    const saved = localStorage.getItem('eco_walkthrough_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [targetRect, setTargetRect] = useState(null);
  const activeStep = steps[stepIndex];

  // Persist current step index
  useEffect(() => {
    localStorage.setItem('eco_walkthrough_step', String(stepIndex));
  }, [stepIndex]);

  // Navigate and find highlighted target
  useEffect(() => {
    if (!activeStep) return;

    // Trigger navigation if the current path doesn't match the step path
    if (location.pathname !== activeStep.path) {
      navigate(activeStep.path);
      return;
    }

    let attempts = 0;
    const findAndCalculate = () => {
      const el = document.querySelector(activeStep.selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Brief timeout for scroll completion
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          });
        }, 300);
      } else if (attempts < 15) {
        attempts++;
        setTimeout(findAndCalculate, 150);
      } else {
        setTargetRect(null); // Reset if element not available
      }
    };

    findAndCalculate();
  }, [stepIndex, location.pathname, activeStep, navigate]);

  // Recalculate target positions on window resizing and scrolling
  useEffect(() => {
    const updatePosition = () => {
      if (!activeStep) return;
      const el = document.querySelector(activeStep.selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        });
      }
    };
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true); // capture phase for layout scrolls
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [activeStep]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleFinish = () => {
    localStorage.removeItem('eco_walkthrough_step');
    setPresentationMode(false);
  };

  const handleSkip = () => {
    handleFinish();
  };

  // Build the overlay spotlight coordinates
  const padding = 6;

  // Derive placement coordinates of tooltip based on the target position
  const getTooltipStyle = () => {
    if (!targetRect) {
      return {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999
      };
    }

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const pad = 16;
    const tooltipWidth = 380;
    const tooltipHeight = 360; // Estimated height of tooltip details

    const spaceBelow = viewportHeight - (targetRect.top + targetRect.height + pad);
    const spaceAbove = targetRect.top - pad;
    const spaceRight = viewportWidth - (targetRect.left + targetRect.width + pad);
    const spaceLeft = targetRect.left - pad;

    let bestTop = targetRect.top + targetRect.height + 15;
    let bestLeft = targetRect.left;

    if (spaceBelow >= tooltipHeight) {
      // Below target
      bestTop = targetRect.top + targetRect.height + 15;
      bestLeft = targetRect.left;
    } else if (spaceAbove >= tooltipHeight) {
      // Above target
      bestTop = targetRect.top - tooltipHeight - 15;
      bestLeft = targetRect.left;
    } else if (spaceRight >= tooltipWidth) {
      // Right of target
      bestTop = targetRect.top;
      bestLeft = targetRect.left + targetRect.width + 15;
    } else if (spaceLeft >= tooltipWidth) {
      // Left of target
      bestTop = targetRect.top;
      bestLeft = targetRect.left - tooltipWidth - 15;
    } else {
      // Fallback center of screen
      bestTop = (viewportHeight - tooltipHeight) / 2;
      bestLeft = (viewportWidth - tooltipWidth) / 2;
    }

    // Clip to safe borders inside the visible area
    const leftVal = Math.max(pad, Math.min(bestLeft, viewportWidth - tooltipWidth - pad));
    const topVal = Math.max(pad, Math.min(bestTop, viewportHeight - tooltipHeight - pad));

    return {
      position: 'fixed',
      left: `${leftVal}px`,
      top: `${topVal}px`,
      zIndex: 9999
    };
  };

  return (
    <>
      {/* 4-Panel Backdrop with pointer-events-none to let scroll pass through */}
      {targetRect ? (
        <>
          <div 
            className="fixed bg-slate-950/78 backdrop-blur-[1px] transition-all duration-300 pointer-events-none" 
            style={{ 
              zIndex: 9998, 
              top: 0, 
              left: 0, 
              right: 0, 
              height: `${Math.max(0, targetRect.top - padding)}px` 
            }} 
          />
          <div 
            className="fixed bg-slate-950/78 backdrop-blur-[1px] transition-all duration-300 pointer-events-none" 
            style={{ 
              zIndex: 9998, 
              top: `${targetRect.top + targetRect.height + padding}px`, 
              left: 0, 
              right: 0, 
              bottom: 0 
            }} 
          />
          <div 
            className="fixed bg-slate-950/78 backdrop-blur-[1px] transition-all duration-300 pointer-events-none" 
            style={{ 
              zIndex: 9998, 
              top: `${Math.max(0, targetRect.top - padding)}px`, 
              left: 0, 
              width: `${Math.max(0, targetRect.left - padding)}px`, 
              height: `${targetRect.height + padding * 2}px` 
            }} 
          />
          <div 
            className="fixed bg-slate-950/78 backdrop-blur-[1px] transition-all duration-300 pointer-events-none" 
            style={{ 
              zIndex: 9998, 
              top: `${Math.max(0, targetRect.top - padding)}px`, 
              left: `${targetRect.left + targetRect.width + padding}px`, 
              right: 0, 
              height: `${targetRect.height + padding * 2}px` 
            }} 
          />
          
          {/* Accent border highlighting targetRect */}
          <div 
            className="fixed border-2 border-primary-500 rounded-xl pointer-events-none transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            style={{
              zIndex: 9998,
              top: `${targetRect.top - padding}px`,
              left: `${targetRect.left - padding}px`,
              width: `${targetRect.width + padding * 2}px`,
              height: `${targetRect.height + padding * 2}px`
            }}
          />
        </>
      ) : (
        <div className="fixed inset-0 bg-slate-950/78 backdrop-blur-[1px] z-[9998] pointer-events-none" />
      )}

      {/* Floating Tooltip Card */}
      <div 
        style={getTooltipStyle()} 
        className="w-[380px] bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-5 select-none animate-slide-up flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-1.5 text-xs text-primary-400 font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-primary-500 animate-pulse" />
            <span>Product Walkthrough</span>
          </div>
          <button 
            onClick={handleSkip} 
            className="text-slate-400 hover:text-white rounded p-1 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <h3 className="text-base font-black text-white tracking-tight">{activeStep.title}</h3>
          <p className="text-xs text-slate-300 leading-normal">{activeStep.description}</p>
        </div>

        {/* Feature Importance & Business Value callouts */}
        <div className="space-y-2.5 mb-5 pt-3 border-t border-slate-800/80 text-[11px]">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex gap-2">
            <Layers className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-400 block uppercase tracking-wider text-[9px]">Platform Feature</span>
              <p className="text-slate-300 leading-normal mt-0.5">{activeStep.importance}</p>
            </div>
          </div>

          <div className="bg-primary-500/10 p-2.5 rounded-lg border border-primary-500/10 flex gap-2">
            <Award className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-primary-400 block uppercase tracking-wider text-[9px]">Business Value</span>
              <p className="text-slate-200 leading-normal mt-0.5">{activeStep.value}</p>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-500 font-bold uppercase">
            Step {stepIndex + 1} of {steps.length}
          </span>
          <div className="flex items-center gap-1.5">
            {stepIndex > 0 && (
              <button 
                onClick={handlePrev} 
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
            )}
            <button 
              onClick={handleNext} 
              className="px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-lg shadow-primary-500/15"
            >
              {stepIndex === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Walkthrough;
