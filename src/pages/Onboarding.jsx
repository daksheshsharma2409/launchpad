import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { interestTags, branchOptions, yearOptions } from "../data/tags";

export const Onboarding = () => {
  const navigate = useNavigate();
  const { updatePreferences, completeOnboarding, userPreferences, login, signup } = useApp();
  
  const [step, setStep] = useState(0); // 0: Auth choice, 1: Login/Signup form, 2: Interests, 3: Details, 4: Done
  const [authMode, setAuthMode] = useState(""); // "login" or "signup"
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [interests, setInterests] = useState(userPreferences.interests || []);
  const [branch, setBranch] = useState(userPreferences.branch || "");
  const [year, setYear] = useState(userPreferences.year || "");

  const handleInterestToggle = (tag) => {
    setInterests(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };



  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    if (authMode === "signup" && !fullname.trim()) {
      setAuthError("Please fill in your full name.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setAuthError("Please fill in all fields.");
      return;
    }

    if (authMode === "login") {
      const res = login(email, password);
      if (res.success) {
        completeOnboarding();
        navigate("/discover");
      } else {
        setAuthError(res.error);
      }
    } else {
      const res = signup(fullname, email, password);
      if (res.success) {
        setStep(2); // move to interests
      } else {
        setAuthError(res.error);
      }
    }
  };

  const finish = () => {
    updatePreferences({ interests, branch, year });
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
      
      {/* Progress Dots (only show during preferences steps) */}
      {step >= 2 && (
        <div className="absolute top-12 flex gap-2">
          {[2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-colors ${i <= step ? 'bg-[#111111]' : 'border border-[#d1cdc5] bg-transparent'}`}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-xl relative h-[400px]">
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <h1 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-3">
                Welcome to Launchpad <span className="text-4xl inline-block -translate-y-2">🚀</span>
              </h1>
              <p className="text-[#6b7280] mb-10 max-w-sm mx-auto">
                Your portal to the best hackathons, internships, and opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs mx-auto">
                <button 
                  onClick={() => { setAuthMode("signup"); setStep(1); }}
                  className="w-full bg-[#111111] text-white px-8 py-3 rounded-full font-medium hover:bg-[#333] transition-colors"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => { setAuthMode("login"); setStep(1); }}
                  className="w-full bg-transparent border border-[#111111] text-[#111111] px-8 py-3 rounded-full font-medium hover:bg-black/5 transition-colors"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center w-full max-w-xs mx-auto"
            >
              <h1 className="font-display font-black text-4xl text-[#111111] mb-6 text-center">
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              
              <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
                {authError && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded border border-red-200">
                    {authError}
                  </div>
                )}
                {authMode === "signup" && (
                  <div>
                    <label className="block text-xs font-medium text-[#111111] mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={fullname}
                      onChange={e => setFullname(e.target.value)}
                      className="w-full bg-white border border-[#d1cdc5] rounded p-2.5 text-sm outline-none focus:border-[#111111]"
                      placeholder="John Doe"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#d1cdc5] rounded p-2.5 text-sm outline-none focus:border-[#111111]"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#d1cdc5] rounded p-2.5 text-sm outline-none focus:border-[#111111]"
                    placeholder="••••••••"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-[#111111] text-white px-8 py-3 rounded-full font-medium mt-2 transition-colors hover:bg-[#333]"
                >
                  {authMode === "login" ? "Login" : "Sign Up"}
                </button>
                
                <button 
                  type="button"
                  onClick={() => { setStep(0); setAuthError(""); setFullname(""); setEmail(""); setPassword(""); }}
                  className="w-full text-sm text-[#6b7280] hover:text-[#111111] mt-2 underline underline-offset-4"
                >
                  Go back
                </button>
              </form>
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
                  onClick={() => setStep(3)}
                  disabled={interests.length === 0}
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


              </div>

              <div className="mt-auto flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-transparent border border-[#111111] text-[#111111] px-8 py-3 rounded-full font-medium transition-colors hover:bg-black/5"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(4)}
                  disabled={!branch || !year}
                  className="bg-[#111111] text-white px-8 py-3 rounded-full font-medium disabled:opacity-50 transition-opacity"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
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
