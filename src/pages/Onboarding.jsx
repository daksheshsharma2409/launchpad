import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";
import { interestTags, branchOptions, yearOptions } from "../data/tags";

const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

const stepMeta = [
  null, // 0 = auth choice (no indicator)
  null, // 1 = form
  { label: "Interests", num: "01" },
  { label: "About You", num: "02" },
  { label: "Done!", num: "03" },
];

const BlobBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2563eb] opacity-[0.12] blur-[100px]" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#f5c518] opacity-[0.15] blur-[90px]" />
    <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-[#7c3aed] opacity-[0.08] blur-[80px]" />
    {/* Dot grid */}
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage: "radial-gradient(#d1cdc5 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  </div>
);

export const Onboarding = () => {
  const navigate = useNavigate();
  const { updatePreferences, completeOnboarding, userPreferences, login, signup } = useApp();

  const [step, setStep] = useState(0);
  const [authMode, setAuthMode] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [interests, setInterests] = useState(userPreferences.interests || []);
  const [branch, setBranch] = useState(userPreferences.branch || "");
  const [year, setYear] = useState(userPreferences.year || "");

  const handleInterestToggle = (tag) =>
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");
    if (authMode === "signup" && !fullname.trim()) { setAuthError("Please fill in your full name."); return; }
    if (!email.trim() || !password.trim()) { setAuthError("Please fill in all fields."); return; }

    if (authMode === "login") {
      const res = login(email, password);
      if (res.success) { completeOnboarding(); navigate("/discover"); }
      else setAuthError(res.error);
    } else {
      const res = signup(fullname, email, password);
      if (res.success) setStep(2);
      else setAuthError(res.error);
    }
  };

  const finish = () => {
    updatePreferences({ interests, branch, year });
    completeOnboarding();
    navigate("/discover");
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] relative flex">
      <BlobBg />

      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative">
        {/* Logo */}
        <div className="font-display font-black text-2xl text-[#111111] flex items-center gap-2">
          Launchpad <span className="text-2xl">🚀</span>
        </div>

        {/* Big headline */}
        <div>
          <p className="text-[11px] font-black tracking-widest uppercase text-[#6b7280] mb-4">
            ⚡ Your student launchpad
          </p>
          <h2 className="font-display font-black text-6xl xl:text-7xl text-[#111111] leading-[0.9] tracking-tight mb-6">
            Every<br />
            opportunity<br />
            <span className="text-[#2563eb]">you've been<br />missing.</span>
          </h2>
          <p className="text-[#6b7280] text-base leading-relaxed max-w-xs">
            Aggregated from LinkedIn, Unstop, Devpost, Naukri and more — filtered just for you.
          </p>
        </div>

        {/* Source tags */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#6b7280] mb-3">SOURCES:</p>
          <div className="flex flex-wrap gap-2">
            {["LinkedIn", "Naukri", "Unstop", "Devpost", "Devfolio", "Wellfound", "Lu.ma"].map((s) => (
              <span key={s} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white border border-[#d1cdc5] text-[#374151]">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">

        {/* Progress indicator for preference steps */}
        {step >= 2 && (
          <div className="absolute top-8 left-0 right-0 flex justify-center gap-2">
            {[2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i <= step ? "w-10 bg-[#111111]" : "w-6 bg-[#d1cdc5]"
                }`}
              />
            ))}
          </div>
        )}

        <div className="w-full max-w-sm relative">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Auth Choice */}
            {step === 0 && (
              <motion.div
                key="step0"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-[#f5c518] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[4px_4px_0_#111111] border-2 border-[#111111]">
                  🚀
                </div>
                <h1 className="font-display font-black text-4xl md:text-5xl text-[#111111] mb-2">
                  Welcome aboard
                </h1>
                <p className="text-[#6b7280] mb-8 text-sm leading-relaxed max-w-xs">
                  Your portal to hackathons, internships, workshops, and more — all in one feed.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => { setAuthMode("signup"); setStep(1); }}
                    className="w-full bg-[#111111] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#2563eb] transition-all duration-200 shadow-lg"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => { setAuthMode("login"); setStep(1); }}
                    className="w-full bg-white border-2 border-[#111111] text-[#111111] px-8 py-3.5 rounded-full font-semibold hover:bg-black/5 transition-colors"
                  >
                    I already have an account
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1 — Login / Signup */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col w-full"
              >
                <h1 className="font-display font-black text-4xl text-[#111111] mb-1">
                  {authMode === "login" ? "Welcome back 👋" : "Create your account"}
                </h1>
                <p className="text-[#6b7280] text-sm mb-7">
                  {authMode === "login"
                    ? "Sign in to access your personalized feed."
                    : "Takes 30 seconds. No credit card needed."}
                </p>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authError && (
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-200 font-medium">
                      {authError}
                    </div>
                  )}
                  {authMode === "signup" && (
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text" value={fullname} onChange={(e) => setFullname(e.target.value)}
                        className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111111] transition-colors"
                        placeholder="Jane Smith"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111111] transition-colors"
                      placeholder="student@college.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wider">Password</label>
                    <input
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111111] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#111111] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#2563eb] transition-all duration-200 mt-2 shadow-lg">
                    {authMode === "login" ? "Login →" : "Create Account →"}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => { setStep(0); setAuthError(""); setFullname(""); setEmail(""); setPassword(""); }}
                  className="w-full text-sm text-[#6b7280] hover:text-[#111111] mt-4 underline underline-offset-4"
                >
                  ← Go back
                </button>
              </motion.div>
            )}

            {/* STEP 2 — Interests */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <h1 className="font-display font-black text-4xl text-[#111111] mb-1">
                  What are you chasing?
                </h1>
                <p className="text-[#6b7280] text-sm mb-7">Pick the areas you want in your feed.</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {interestTags.map((tag, i) => {
                    const isSelected = interests.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleInterestToggle(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 border-2 ${
                          isSelected
                            ? "bg-[#111111] text-white border-[#111111] shadow-md scale-105"
                            : "bg-white text-[#374151] border-[#e5e7eb] hover:border-[#111111]"
                        }`}
                      >
                        {tag}
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={interests.length === 0}
                  className="w-full bg-[#111111] text-white px-8 py-3.5 rounded-full font-semibold disabled:opacity-40 hover:bg-[#2563eb] transition-all duration-200 shadow-lg"
                >
                  Continue ({interests.length} selected) →
                </button>
              </motion.div>
            )}

            {/* STEP 3 — Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col w-full"
              >
                <h1 className="font-display font-black text-4xl text-[#111111] mb-1">
                  Tell us about you
                </h1>
                <p className="text-[#6b7280] text-sm mb-7">We'll tailor everything to your profile.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wider">Branch of Study</label>
                    <select
                      value={branch} onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111111] transition-colors appearance-none"
                    >
                      <option value="" disabled>Select your branch...</option>
                      {branchOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5 uppercase tracking-wider">Year</label>
                    <select
                      value={year} onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111111] transition-colors appearance-none"
                    >
                      <option value="" disabled>Select your year...</option>
                      {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-white border-2 border-[#e5e7eb] text-[#374151] px-6 py-3 rounded-full font-semibold hover:border-[#111111] transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!branch || !year}
                    className="flex-1 bg-[#111111] text-white px-6 py-3 rounded-full font-semibold disabled:opacity-40 hover:bg-[#2563eb] transition-all duration-200 shadow-lg"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Done */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.55, duration: 0.7 }}
                  className="w-20 h-20 bg-[#f5c518] rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-[4px_4px_0_#111111] border-2 border-[#111111]"
                >
                  🚀
                </motion.div>

                <h1 className="font-display font-black text-5xl text-[#111111] mb-2">You're all set!</h1>
                <p className="text-[#6b7280] text-sm mb-8">Your personalized feed is ready.</p>

                {/* Summary card */}
                <div className="w-full bg-white border-2 border-[#e5e7eb] rounded-2xl p-5 text-left mb-8 space-y-3">
                  <div>
                    <p className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-1">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {interests.map((t) => (
                        <span key={t} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#111111] text-white">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-0.5">Branch</p>
                      <p className="text-sm font-semibold text-[#111111]">{branch}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest mb-0.5">Year</p>
                      <p className="text-sm font-semibold text-[#111111]">{year}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={finish}
                  className="w-full bg-[#111111] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#2563eb] transition-all duration-200 shadow-lg text-base"
                >
                  Take me to my feed →
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
