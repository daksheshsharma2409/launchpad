import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FilterBar from "../components/ui/FilterBar";
import SearchBar from "../components/ui/SearchBar";
import FeedSection from "../components/feed/FeedSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { getOpportunitiesByCategory } from "../data/opportunities";
import { categories } from "../data/tags";

const categoryMeta = {
  all:        { emoji: "✦", accent: "#2563eb", bg: "#eff6ff", label: "All" },
  hackathon:  { emoji: "⚡", accent: "#2563eb", bg: "#eff6ff", label: "Hackathons" },
  workshop:   { emoji: "🛠", accent: "#7c3aed", bg: "#f5f3ff", label: "Workshops" },
  cultural:   { emoji: "🎭", accent: "#dc2626", bg: "#fef2f2", label: "Cultural" },
  internship: { emoji: "💼", accent: "#059669", bg: "#ecfdf5", label: "Internships" },
  job:        { emoji: "🚀", accent: "#ea580c", bg: "#fff7ed", label: "Jobs" },
};

export const Discover = () => {
  const location = useLocation();
  const pathCategory = location.pathname.split("/")[1] || "discover";
  const activeCategoryId = pathCategory === "discover" ? "all" : pathCategory.slice(0, -1);

  const [activeCategory, setActiveCategory] = useState(activeCategoryId);
  const [baseOpportunities, setBaseOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [paidOnly, setPaidOnly] = useState(false);
  const [minAmount, setMinAmount] = useState(0);

  useEffect(() => {
    let currentCat = "all";
    if (pathCategory !== "discover") {
      const match = categories.find((c) => c.id + "s" === pathCategory || c.id === pathCategory);
      if (match) currentCat = match.id;
    }
    setActiveCategory(currentCat);
    setBaseOpportunities(getOpportunitiesByCategory(currentCat));
  }, [pathCategory]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeCategory, modeFilter, paidOnly, minAmount, searchQuery]);

  const filteredOpportunities = useMemo(() => {
    return baseOpportunities.filter((opp) => {
      if (modeFilter !== "all" && opp.mode !== modeFilter) return false;
      if (paidOnly && !opp.prize && !opp.stipend) return false;
      const oppValue = Math.max(opp.prizeNumber || 0, opp.stipendNumber || 0);
      if (minAmount > 0 && oppValue < minAmount) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!opp.title.toLowerCase().includes(q) &&
            !opp.org.toLowerCase().includes(q) &&
            !opp.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [baseOpportunities, modeFilter, paidOnly, minAmount, searchQuery]);

  const categoryLabel = categories.find((c) => c.id === activeCategory)?.label || "Discover";
  const meta = categoryMeta[activeCategory] || categoryMeta.all;
  const hasActiveFilters = modeFilter !== "all" || paidOnly || minAmount > 0 || searchQuery.trim();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "#f5f0e8" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="pt-28 pb-0 relative overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#d1cdc5 1px, transparent 1px)",
          backgroundSize: "24px 24px", opacity: 0.5
        }} />

        {/* Floating shapes */}
        <div
          className="absolute top-10 right-[8%] w-28 h-28 rounded-3xl rotate-12 opacity-70"
          style={{ background: meta.accent, opacity: 0.15 }}
        />
        <div
          className="absolute top-16 right-[14%] w-10 h-10 rounded-full border-4 opacity-50"
          style={{ borderColor: meta.accent }}
        />
        <div className="absolute bottom-0 left-[6%] text-[120px] leading-none font-black text-[#d1cdc5] opacity-30 select-none hidden lg:block" style={{ fontFamily: "Fraunces, serif" }}>
          {meta.emoji}
        </div>
        <div
          className="absolute top-8 left-1/2 w-6 h-6 rotate-45 opacity-60"
          style={{ background: "#f5c518" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-5"
              >
                <span
                  className="text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full text-white"
                  style={{ background: meta.accent }}
                >
                  {meta.emoji} {meta.label}
                </span>
                <span className="text-[10px] font-bold text-[#6b7280] tracking-widest uppercase">
                  · {baseOpportunities.length} opportunities
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-black text-[clamp(3.5rem,9vw,8rem)] text-[#111111] leading-[0.88] tracking-tighter"
              >
                {activeCategory === "all" ? (
                  <>Discover<br /><span style={{ color: meta.accent }}>What's Next</span></>
                ) : (
                  <>{categoryLabel}</>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-[#6b7280] mt-4 text-base max-w-lg"
              >
                {activeCategory === "all"
                  ? "Hackathons, internships, workshops and jobs — curated daily from LinkedIn, Unstop, Devpost & more."
                  : `Explore the latest ${categoryLabel.toLowerCase()} sourced from top platforms, tailored for students.`}
              </motion.p>
            </div>

            {/* Single stat */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-shrink-0"
            >
              <div
                className="rounded-2xl px-8 py-5 text-center border-2"
                style={{ background: meta.bg, borderColor: `${meta.accent}30` }}
              >
                <div className="font-display font-black text-5xl" style={{ color: meta.accent }}>
                  {filteredOpportunities.length}
                </div>
                <div className="text-[10px] font-black tracking-widest uppercase mt-1" style={{ color: `${meta.accent}80` }}>Opportunities</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="flex items-center gap-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-px flex-grow" style={{ background: `linear-gradient(to right, transparent, ${meta.accent}40, transparent)` }} />
        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i === 1 ? meta.accent : `${meta.accent}40` }} />
          ))}
        </div>
        <div className="h-px flex-grow" style={{ background: `linear-gradient(to right, transparent, ${meta.accent}40, transparent)` }} />
      </div>

      {/* ── FILTERS + FEED ───────────────────────────── */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

        {/* Filter row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <FilterBar activeCategory={activeCategory} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                showFilters || hasActiveFilters
                  ? "bg-[#111111] text-white border-[#111111] shadow-lg"
                  : "bg-white text-[#111111] border-[#e5e7eb] hover:border-[#111111]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              {hasActiveFilters ? "● Filters On" : "Filters"}
            </button>
            <div className="w-56">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div
                className="rounded-2xl p-6 border-2"
                style={{ background: meta.bg, borderColor: `${meta.accent}30` }}
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: meta.accent }}>Location Mode</label>
                    <select
                      value={modeFilter}
                      onChange={(e) => setModeFilter(e.target.value)}
                      className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#111111] transition-colors"
                    >
                      <option value="all">Any Location</option>
                      <option value="remote">Remote Only</option>
                      <option value="in-person">In-Person Only</option>
                      <option value="hybrid">Hybrid Only</option>
                    </select>
                  </div>

                  <div className="flex-1 flex items-center pt-4">
                    <label className="flex items-center gap-3 cursor-pointer" onClick={() => setPaidOnly(!paidOnly)}>
                      <div className={`w-11 h-6 rounded-full transition-all duration-200 relative ${paidOnly ? "" : "bg-[#e5e7eb]"}`}
                        style={{ background: paidOnly ? meta.accent : undefined }}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${paidOnly ? "left-6" : "left-1"}`} />
                      </div>
                      <span className="text-sm font-bold text-[#111111]">Paid / Stipend Only</span>
                    </label>
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: meta.accent }}>
                      Min Amount: <span className="text-[#111111]">${minAmount.toLocaleString()}</span>
                    </label>
                    <input
                      type="range" min="0" max="10000" step="500"
                      value={minAmount}
                      onChange={(e) => setMinAmount(Number(e.target.value))}
                      className="w-full"
                      style={{ accentColor: meta.accent }}
                    />
                    <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1 font-semibold">
                      <span>$0</span><span>$10,000+</span>
                    </div>
                  </div>

                  <div className="flex items-center pt-4">
                    <button
                      onClick={() => { setModeFilter("all"); setPaidOnly(false); setMinAmount(0); setSearchQuery(""); }}
                      className="text-sm font-bold underline underline-offset-2 transition-colors"
                      style={{ color: meta.accent }}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <FeedSection
          title=""
          description=""
          opportunities={filteredOpportunities}
          isLoading={isLoading}
          emptyMessage="No opportunities match your filters. Try clearing them!"
        />
      </main>

      <Footer />
    </div>
  );
};

export default Discover;
