import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FilterBar from "../components/ui/FilterBar";
import SearchBar from "../components/ui/SearchBar";
import OpportunityCard from "../components/cards/OpportunityCard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { fetchOpportunities } from "../data/opportunitiesApi";
import { categories } from "../data/tags";

const PAGE_SIZE = 15;

const categoryMeta = {
  all:        { emoji: "✦", accent: "#2563eb", bg: "#eff6ff", label: "All" },
  hackathon:  { emoji: "⚡", accent: "#2563eb", bg: "#eff6ff", label: "Hackathons" },
  workshop:   { emoji: "🛠", accent: "#7c3aed", bg: "#f5f3ff", label: "Workshops" },
  cultural:   { emoji: "🎭", accent: "#dc2626", bg: "#fef2f2", label: "Cultural" },
  internship: { emoji: "💼", accent: "#059669", bg: "#ecfdf5", label: "Internships" },
  job:        { emoji: "🚀", accent: "#ea580c", bg: "#fff7ed", label: "Jobs" },
};

const SkeletonCard = () => (
  <div className="rounded-2xl bg-white border-2 border-[#e5e7eb] p-5 space-y-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#e5e7eb]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#e5e7eb] rounded w-2/3" />
        <div className="h-2 bg-[#e5e7eb] rounded w-1/3" />
      </div>
    </div>
    <div className="h-2.5 bg-[#e5e7eb] rounded" />
    <div className="h-2.5 bg-[#e5e7eb] rounded w-5/6" />
    <div className="flex gap-2 pt-1">
      <div className="h-5 w-16 bg-[#e5e7eb] rounded-full" />
      <div className="h-5 w-20 bg-[#e5e7eb] rounded-full" />
    </div>
  </div>
);

export const Discover = () => {
  const location = useLocation();
  const pathCategory = location.pathname.split("/")[1] || "discover";
  const activeCategoryId = pathCategory === "discover" ? "all" : pathCategory.slice(0, -1);

  const [activeCategory, setActiveCategory] = useState(activeCategoryId);
  const [opportunities, setOpportunities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [paidOnly, setPaidOnly] = useState(false);
  const [minAmount, setMinAmount] = useState(0);

  const filters = { searchQuery, modeFilter, paidOnly, minAmount };

  // Reset and load page 1 on category/filter change
  const loadPage1 = useCallback(async (cat) => {
    setIsLoading(true);
    setOpportunities([]);
    setPage(1);
    try {
      const res = await fetchOpportunities(cat, 1, filters);
      setOpportunities(res.items);
      setTotalCount(res.totalCount);
      setHasMore(res.hasMore);
      setPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, modeFilter, paidOnly, minAmount]);

  useEffect(() => {
    let currentCat = "all";
    if (pathCategory !== "discover") {
      const match = categories.find((c) => c.id + "s" === pathCategory || c.id === pathCategory);
      if (match) currentCat = match.id;
    }
    setActiveCategory(currentCat);
    loadPage1(currentCat);
  }, [pathCategory, searchQuery, modeFilter, paidOnly, minAmount]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const goToPage = async (pageNumber) => {
    if (pageNumber === page || pageNumber < 1 || pageNumber > totalPages) return;
    setIsLoading(true);
    try {
      const res = await fetchOpportunities(activeCategory, pageNumber, filters);
      setOpportunities(res.items);
      setHasMore(res.hasMore);
      setPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryLabel = categories.find((c) => c.id === activeCategory)?.label || "Discover";
  const meta = categoryMeta[activeCategory] || categoryMeta.all;
  const hasActiveFilters = modeFilter !== "all" || paidOnly || minAmount > 0 || searchQuery.trim();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "#f5f0e8" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="pt-28 pb-0 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#d1cdc5 1px, transparent 1px)",
          backgroundSize: "24px 24px", opacity: 0.5
        }} />
        <motion.div
          animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-[8%] w-24 h-24 rounded-2xl hidden lg:block"
          style={{ background: meta.accent, opacity: 0.12 }}
        />
        <div className="absolute top-20 right-[16%] w-8 h-8 rounded-full border-4 hidden lg:block"
          style={{ borderColor: meta.accent, opacity: 0.3 }} />
        <div className="absolute top-8 left-1/2 w-5 h-5 rotate-45 bg-[#f5c518] hidden lg:block opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <span className="text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full text-white"
                  style={{ background: meta.accent }}>
                  {meta.emoji} {meta.label}
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
                className="font-display font-black text-[clamp(3.5rem,9vw,8rem)] text-[#111111] leading-[0.88] tracking-tighter"
              >
                {activeCategory === "all" ? (
                  <>Discover<br /><span style={{ color: meta.accent }}>What's Next</span></>
                ) : categoryLabel}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="text-[#6b7280] mt-3 text-base max-w-lg"
              >
                {activeCategory === "all"
                  ? "Hackathons, internships, workshops and jobs — curated daily from LinkedIn, Unstop, Devpost & more."
                  : `Explore the latest ${categoryLabel.toLowerCase()} sourced from top platforms.`}
              </motion.p>
            </div>

            {/* Single stat box */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="flex-shrink-0"
            >
              <div className="rounded-2xl px-8 py-5 text-center border-2"
                style={{ background: meta.bg, borderColor: `${meta.accent}30` }}>
                <div className="font-display font-black text-5xl" style={{ color: meta.accent }}>
                  {isLoading ? "—" : totalCount}
                </div>
                <div className="text-[10px] font-black tracking-widest uppercase mt-1"
                  style={{ color: `${meta.accent}80` }}>
                  Opportunities
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="h-px flex-grow" style={{ background: `linear-gradient(to right, transparent, ${meta.accent}40, transparent)` }} />
        <div className="flex items-center gap-2">
          {[0,1,2].map(i => <div key={i} className="rounded-full" style={{ width: i===1?"10px":"6px", height: i===1?"10px":"6px", background: i===1?meta.accent:`${meta.accent}45` }} />)}
        </div>
        <div className="h-px flex-grow" style={{ background: `linear-gradient(to right, transparent, ${meta.accent}40, transparent)` }} />
      </div>

      {/* ── FILTERS + FEED ───────────────────────────── */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">

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
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="rounded-2xl p-6 border-2" style={{ background: meta.bg, borderColor: `${meta.accent}30` }}>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: meta.accent }}>Location Mode</label>
                    <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}
                      className="w-full bg-white border-2 border-[#e5e7eb] rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-[#111111]">
                      <option value="all">Any Location</option>
                      <option value="remote">Remote Only</option>
                      <option value="in-person">In-Person Only</option>
                      <option value="hybrid">Hybrid Only</option>
                    </select>
                  </div>
                  <div className="flex-1 flex items-center pt-4">
                    <label className="flex items-center gap-3 cursor-pointer" onClick={() => setPaidOnly(!paidOnly)}>
                      <div className="w-11 h-6 rounded-full relative transition-all duration-200"
                        style={{ background: paidOnly ? meta.accent : "#e5e7eb" }}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${paidOnly ? "left-6" : "left-1"}`} />
                      </div>
                      <span className="text-sm font-bold text-[#111111]">Paid / Stipend Only</span>
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: meta.accent }}>
                      Min Amount: <span className="text-[#111111]">₹{minAmount.toLocaleString()}</span>
                    </label>
                    <input type="range" min="0" max="100000" step="5000" value={minAmount}
                      onChange={(e) => setMinAmount(Number(e.target.value))}
                      className="w-full" style={{ accentColor: meta.accent }} />
                    <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1 font-semibold">
                      <span>₹0</span><span>₹1L+</span>
                    </div>
                  </div>
                  <div className="flex items-center pt-4">
                    <button onClick={() => { setModeFilter("all"); setPaidOnly(false); setMinAmount(0); setSearchQuery(""); }}
                      className="text-sm font-bold underline underline-offset-2" style={{ color: meta.accent }}>
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        {!isLoading && (
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-grow bg-[#e5e7eb]" />
            <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest flex-shrink-0">
              showing {opportunities.length} of {totalCount}
            </span>
            <div className="h-px flex-grow bg-[#e5e7eb]" />
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(PAGE_SIZE)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white border-2 border-[#e5e7eb] rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-black text-3xl text-[#111111] mb-2">No results</h3>
            <p className="text-[#6b7280] mb-6">Try clearing your filters or adjusting your search.</p>
            <button onClick={() => { setModeFilter("all"); setPaidOnly(false); setMinAmount(0); setSearchQuery(""); }}
              className="bg-[#111111] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#2563eb] transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp, index) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index % PAGE_SIZE * 0.04, 0.5) }}
                >
                  <OpportunityCard opportunity={opp} index={index} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button 
                  onClick={() => goToPage(page - 1)} 
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#e5e7eb] text-[#111111] hover:border-[#111111] disabled:opacity-50 disabled:hover:border-[#e5e7eb] transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                
                {(() => {
                  const maxPagesToShow = 5;
                  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
                  let endPage = startPage + maxPagesToShow - 1;

                  if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                  }

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) pages.push(i);

                  return (
                    <>
                      {pages[0] > 1 && (
                        <>
                          <button onClick={() => goToPage(1)} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#e5e7eb] text-[#111111] hover:border-[#111111] transition-all font-bold">1</button>
                          {pages[0] > 2 && <span className="px-1 text-[#9ca3af]">...</span>}
                        </>
                      )}

                      {pages.map(p => (
                        <button 
                          key={p} 
                          onClick={() => goToPage(p)}
                          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all font-bold ${
                            p === page 
                              ? "bg-[#111111] border-[#111111] text-white" 
                              : "border-[#e5e7eb] text-[#111111] hover:border-[#111111]"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      {pages[pages.length - 1] < totalPages && (
                        <>
                          {pages[pages.length - 1] < totalPages - 1 && <span className="px-1 text-[#9ca3af]">...</span>}
                          <button onClick={() => goToPage(totalPages)} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#e5e7eb] text-[#111111] hover:border-[#111111] transition-all font-bold">{totalPages}</button>
                        </>
                      )}
                    </>
                  );
                })()}

                <button 
                  onClick={() => goToPage(page + 1)} 
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#e5e7eb] text-[#111111] hover:border-[#111111] disabled:opacity-50 disabled:hover:border-[#e5e7eb] transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Discover;
