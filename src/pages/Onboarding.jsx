import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { interestTags, branchOptions, yearOptions } from "../data/tags";

export const Onboarding = () => {
  const navigate = useNavigate();
  const { updatePreferences, completeOnboarding, userPreferences } = useApp();
  
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState(userPreferences.interests || []);
  const [branch, setBranch] = useState(userPreferences.branch || "");
  const [year, setYear] = useState(userPreferences.year || "");
  const [skills, setSkills] = useState(userPreferences.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const handleInterestToggle = (tag) => {
    setInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const nextStep = () => {
    if (step === 1 && interests.length === 0) return; // simple validation
    if (step === 2 && (!branch || !year)) return;
    setStep(s => s + 1);
  };

  const finish = () => {
    updatePreferences({ interests, branch, year, skills });
    completeOnboarding();
    navigate("/discover");
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center p-4">
      
      {/* Progress Dots */}
      <div className="absolute top-12 flex gap-2">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-colors ${i <= step ? 'bg-[#111111]' : 'border border-[#d1cdc5] bg-transparent'}`}
          />
        ))}
      </div>

      <div className="w-full max-w-xl relative h-[400px]">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center text-center"
            >
              <h1 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-3">
                What are you chasing?
              </h1>
              <p className="text-[#6b7280] mb-10">Select the areas you want to see on your Launchpad.</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {interestTags.map((tag, i) => {
                  const isSelected = interests.includes(tag);
                  return (
                    <motion.button
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleInterestToggle(tag)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        isSelected 
                          ? 'bg-[#111111] text-white border-[#111111] shadow-md' 
                          : 'bg-transparent text-[#111111] border-[#111111] hover:bg-black/5'
                      }`}
                    >
                      {tag}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-auto">
                <button 
                  onClick={nextStep}
                  disabled={interests.length === 0}
                  className="bg-[#111111] text-white px-8 py-3 rounded-full font-medium disabled:opacity-50 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center text-center w-full max-w-md mx-auto"
            >
              <h1 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-3">
                Tell us about you
              </h1>
              <p className="text-[#6b7280] mb-8">Help us tailor your experience.</p>
              
              <div className="w-full space-y-4 text-left">
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">Branch of Study</label>
                  <select 
                    value={branch} 
                    onChange={e => setBranch(e.target.value)}
                    className="w-full bg-white border border-[#d1cdc5] rounded p-2.5 text-sm outline-none focus:border-[#111111]"
                  >
                    <option value="" disabled>Select branch...</option>
                    {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">Year</label>
                  <select 
                    value={year} 
                    onChange={e => setYear(e.target.value)}
                    className="w-full bg-white border border-[#d1cdc5] rounded p-2.5 text-sm outline-none focus:border-[#111111]"
                  >
                    <option value="" disabled>Select year...</option>
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">Key Skills</label>
                  <div className="w-full bg-white border border-[#d1cdc5] rounded p-2 text-sm flex flex-wrap gap-2 focus-within:border-[#111111]">
                    {skills.map(skill => (
                      <span key={skill} className="bg-[#f5f0e8] border border-[#d1cdc5] px-2 py-0.5 rounded text-xs flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="text-[#6b7280] hover:text-[#111111]">×</button>
                      </span>
                    ))}
                    <input 
                      type="text" 
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillAdd}
                      placeholder={skills.length === 0 ? "Type and press enter..." : ""}
                      className="flex-grow outline-none bg-transparent min-w-[120px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={nextStep}
                  disabled={!branch || !year}
                  className="bg-[#111111] text-white px-8 py-3 rounded-full font-medium disabled:opacity-50 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center text-center"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                className="w-24 h-24 bg-[#f5c518] rounded-full border-2 border-[#111111] flex items-center justify-center text-5xl shadow-[4px_4px_0_#111111] mb-6"
              >
                🚀
              </motion.div>
              
              <h1 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-8">
                You're all set
              </h1>
              
              <div className="bg-white border border-[#d1cdc5] rounded-xl p-6 w-full max-w-sm text-left mb-8 shadow-sm">
                <div className="mb-3">
                  <span className="text-xs font-bold text-[#6b7280] uppercase tracking-wider block mb-1">Looking for</span>
                  <p className="text-sm text-[#111111] font-medium">{interests.join(", ")}</p>
                </div>
                <div className="mb-3">
                  <span className="text-xs font-bold text-[#6b7280] uppercase tracking-wider block mb-1">Studying</span>
                  <p className="text-sm text-[#111111] font-medium">{branch}</p>
                </div>
                {skills.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-[#6b7280] uppercase tracking-wider block mb-1">Skills</span>
                    <p className="text-sm text-[#111111] font-medium">{skills.join(", ")}</p>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <button 
                  onClick={finish}
                  className="bg-[#111111] text-white px-8 py-3 rounded-full font-medium hover:bg-[#333] transition-colors"
                >
                  Take me to my feed
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Brand logo at bottom */}
      <div className="absolute bottom-6 left-6 hidden md:block">
        <div className="font-display font-black text-xl text-[#111111] flex items-center gap-1 mb-1">
          Launchpad <span>🚀</span>
        </div>
        <p className="text-[10px] text-[#6b7280] uppercase tracking-wide">
          Built for students who are tired of missing out.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
