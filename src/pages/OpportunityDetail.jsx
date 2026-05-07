import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { fetchOpportunityById } from "../data/opportunitiesApi";
import { useApp } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


const categoryConfig = {
  hackathon:  { accent: "#2563eb", bg: "#eff6ff", label: "Hackathon",  emoji: "⚡" },
  workshop:   { accent: "#7c3aed", bg: "#f5f3ff", label: "Workshop",   emoji: "🛠" },
  cultural:   { accent: "#dc2626", bg: "#fef2f2", label: "Cultural",   emoji: "🎭" },
  internship: { accent: "#059669", bg: "#ecfdf5", label: "Internship", emoji: "💼" },
  job:        { accent: "#ea580c", bg: "#fff7ed", label: "Job",        emoji: "🚀" },
};

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="bg-[#111111] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full flex-shrink-0">
      {children}
    </span>
    <div className="h-px flex-grow bg-[#e5e7eb]" />
  </div>
);

export const OpportunityDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { savedOpportunities, toggleSave, appliedOpportunities, applyOpportunity } = useApp();
  const isSaved = opportunity && savedOpportunities.includes(opportunity.id);
  const isApplied = opportunity && appliedOpportunities.includes(opportunity.id);
  const countdownRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    fetchOpportunityById(id).then((opp) => {
      setOpportunity(opp);
      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (opportunity && countdownRef.current) {
      let targetNumber = 14;
      const match = opportunity.deadlineDisplay?.match(/(\d+)/);
      if (match) targetNumber = parseInt(match[1], 10);
      gsap.fromTo(countdownRef.current, { innerHTML: 0 }, {
        innerHTML: targetNumber, duration: 2, ease: "power2.out", snap: { innerHTML: 1 }
      });
    }
  }, [opportunity]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col pt-14 bg-[#f5f0e8]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" className="opacity-20" />
            <path d="M4 12a8 8 0 018-8" className="opacity-80" />
          </svg>
        </main>
        <Footer />
      </div>
    );
  }
  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col pt-14 bg-[#f5f0e8]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-7xl mb-5">🔍</div>
            <h1 className="font-display font-black text-5xl mb-4">Not found.</h1>
            <Link to="/discover" className="bg-[#111111] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#2563eb] transition-all">
              Back to Discover →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const config = categoryConfig[opportunity.category] || { accent: "#2563eb", bg: "#eff6ff", label: opportunity.category, emoji: "📌" };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "#f5f0e8" }}>
      <Navbar />

      {/* ── HERO (cream, editorial) ───────────────────── */}
      <section className="pt-28 pb-0 relative overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#d1cdc5 1px, transparent 1px)",
          backgroundSize: "24px 24px", opacity: 0.5
        }} />

        {/* Floating decorative shapes */}
        <motion.div
          initial={{ rotate: 0 }} animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-12 right-[6%] w-20 h-20 rounded-2xl hidden lg:block"
          style={{ background: config.accent, opacity: 0.12 }}
        />
        <div className="absolute top-20 right-[14%] w-8 h-8 rounded-full border-4 hidden lg:block" style={{ borderColor: config.accent, opacity: 0.3 }} />
        <div className="absolute bottom-4 left-[5%] text-[100px] leading-none select-none hidden lg:block" style={{ opacity: 0.06, fontFamily: "Fraunces, serif" }}>
          {config.emoji}
        </div>
        <div className="absolute top-10 left-1/3 w-6 h-6 rotate-45 bg-[#f5c518] hidden lg:block" style={{ opacity: 0.5 }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#9ca3af] mb-5">
            <Link to="/discover" className="hover:text-[#111111] transition-colors">Discover</Link>
            <span>›</span>
            <span style={{ color: config.accent }}>{config.label}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white shadow-[4px_4px_0_#111111]"
              style={{ background: config.bg }}
            >
              {opportunity.logoUrl
                ? <img src={opportunity.logoUrl} alt={opportunity.org} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-4xl">{config.emoji}</div>
              }
            </motion.div>

            <div className="flex-grow min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border-2"
                  style={{ background: config.bg, color: config.accent, borderColor: `${config.accent}30` }}
                >
                  {config.emoji} {config.label}
                </span>
                {opportunity.isClosingSoon && (
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-red-100 text-red-600 border-2 border-red-200 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                    Urgent
                  </span>
                )}
                {opportunity.isNew && (
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-200 uppercase tracking-widest">
                    ✦ New
                  </span>
                )}
                {opportunity.source && (
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white border-2 border-[#e5e7eb] text-[#6b7280] uppercase tracking-widest">
                    via {opportunity.source}
                  </span>
                )}
              </div>

              <h1 className="font-display font-black text-[clamp(2.5rem,6vw,5.5rem)] text-[#111111] leading-[0.88] tracking-tighter mb-4">
                {opportunity.title}
              </h1>

              <p className="text-[#6b7280] text-base leading-relaxed max-w-2xl mb-5">{opportunity.description}</p>

              {/* Quick info pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white border-2 border-[#e5e7eb] text-[#374151]">
                  📍 {opportunity.location}
                </span>
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white border-2 border-[#e5e7eb] text-[#374151] capitalize">
                  🌐 {opportunity.mode}
                </span>
                {opportunity.prize && (
                  <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[#f5c518]/20 border-2 border-[#f5c518]/40 text-[#92690a]">
                    🏆 {opportunity.prize}
                  </span>
                )}
                {opportunity.stipend && (
                  <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-700">
                    💰 {opportunity.stipend}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="flex items-center gap-3 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-px flex-grow" style={{ background: `linear-gradient(to right, transparent, ${config.accent}40, transparent)` }} />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${config.accent}50` }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: config.accent }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${config.accent}50` }} />
        </div>
        <div className="h-px flex-grow" style={{ background: `linear-gradient(to right, transparent, ${config.accent}40, transparent)` }} />
      </div>

      {/* ── CONTENT ──────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT */}
          <div className="w-full lg:w-2/3 space-y-10">

            <section>
              <SectionLabel>About the Opportunity</SectionLabel>
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e5e7eb] shadow-sm">
                <p className="text-[#374151] leading-relaxed">{opportunity.about}</p>
              </div>
            </section>

            <section>
              <SectionLabel>Eligibility</SectionLabel>
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e5e7eb] shadow-sm space-y-3">
                {opportunity.eligibility.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: `${config.accent}18` }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={config.accent} strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#374151] leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {opportunity.prizeDetails?.length > 0 && (
              <section>
                <SectionLabel>Rewards</SectionLabel>
                <div className="rounded-2xl overflow-hidden border-2 border-[#e5e7eb] shadow-sm" style={{ background: config.bg }}>
                  {opportunity.prizeDetails.map((prize, i) => (
                    <div key={i} className={`p-5 flex gap-4 items-center ${i !== 0 ? "border-t-2 border-white/60" : ""}`}>
                      <div className="text-3xl flex-shrink-0">{prize.icon}</div>
                      <div>
                        <h4 className="font-bold text-[#111111] text-base">{prize.label}</h4>
                        {prize.note && <p className="text-sm text-[#6b7280] mt-0.5">{prize.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionLabel>Timeline</SectionLabel>
              <div className="bg-white rounded-2xl p-6 border-2 border-[#e5e7eb] shadow-sm space-y-5">
                {opportunity.timeline.map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== opportunity.timeline.length - 1 && (
                      <div className="absolute left-[9px] top-5 bottom-[-20px] w-px bg-[#e5e7eb]" />
                    )}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 z-10 mt-0.5 ${
                        step.done ? "" : "border-[#e5e7eb] bg-white"
                      }`}
                      style={step.done ? { background: config.accent, borderColor: config.accent } : {}}
                    />
                    <div>
                      <h4 className="font-bold text-[#111111] text-sm">{step.label}</h4>
                      <p className="text-xs text-[#6b7280] mt-0.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>Location</SectionLabel>
              <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-[#e5e7eb] shadow-sm relative">
                {opportunity.mode === "remote" ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-[#eff6ff]">🌐</div>
                    <div className="text-center">
                      <p className="font-bold text-[#111111] text-lg">Fully Remote</p>
                      <p className="text-[#6b7280] text-sm">Work from anywhere</p>
                    </div>
                  </div>
                ) : (
                  <iframe
                    title="map" width="100%" height="100%"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(opportunity.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    frameBorder="0" scrolling="no"
                  />
                )}
                {opportunity.mode !== "remote" && (
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow border border-[#e5e7eb]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {opportunity.location}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT — sticky sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-20 space-y-4">

              {/* Deadline */}
              <div
                className="rounded-2xl p-6 text-center border-4 relative overflow-hidden"
                style={{ background: config.bg, borderColor: `${config.accent}25` }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px]"
                  style={{ background: config.accent, opacity: 0.15 }}
                />
                <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: config.accent }}>Deadline In</p>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span ref={countdownRef} className="font-display font-black text-6xl text-[#111111] tracking-tighter">0</span>
                  <span className="font-display font-black text-2xl text-[#6b7280]">Days</span>
                </div>
                <p className="text-[10px] text-[#6b7280] font-semibold">{opportunity.deadline}</p>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl p-5 border-2 border-[#e5e7eb] shadow-sm space-y-3">
                <a
                  href={opportunity.url || "#"}
                  target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${config.accent}, ${config.accent}cc)` }}
                >
                  Apply on {opportunity.source || "Site"} →
                </a>

                <button
                  onClick={() => applyOpportunity(opportunity.id)}
                  disabled={isApplied}
                  className={`w-full font-bold py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                    isApplied
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-transparent text-[#374151] border-[#e5e7eb] hover:border-[#111111] hover:text-[#111111]"
                  }`}
                >
                  {isApplied ? "✓ Applied" : "Mark as Applied"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: opportunity.title, text: `Check out ${opportunity.title} on Launchpad!`, url: window.location.href }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied!");
                      }
                    }}
                    className="flex-1 bg-transparent border-2 border-[#e5e7eb] text-[#374151] font-semibold py-2.5 rounded-xl hover:border-[#111111] transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    Share
                  </button>
                  <button
                    onClick={() => toggleSave(opportunity.id)}
                    className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                      isSaved ? "text-white border-[#111111]" : "border-[#e5e7eb] text-[#9ca3af] hover:border-[#111111] hover:text-[#111111]"
                    }`}
                    style={isSaved ? { background: "#111111" } : {}}
                    title={isSaved ? "Unsave" : "Save"}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border-2 border-[#e5e7eb] text-[#6b7280]">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-center text-[11px] text-[#9ca3af] font-medium">
                By <span className="font-bold text-[#374151]">{opportunity.org}</span>
                {opportunity.source && <> · via <span className="font-bold text-[#374151]">{opportunity.source}</span></>}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t-2 border-[#e5e7eb] z-40 flex gap-2">
        <a
          href={opportunity.url || "#"} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-white font-bold py-3.5 rounded-xl text-center shadow-lg"
          style={{ background: config.accent }}
        >
          Apply on {opportunity.source || "Site"}
        </a>
        <button
          onClick={() => toggleSave(opportunity.id)}
          className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border-2 ${
            isSaved ? "bg-[#111111] border-[#111111] text-white" : "border-[#e5e7eb] text-[#374151]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OpportunityDetail;
