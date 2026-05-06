import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import FilterBar from "../components/ui/FilterBar";
import SearchBar from "../components/ui/SearchBar";
import FeedSection from "../components/feed/FeedSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getOpportunitiesByCategory } from "../data/opportunities";
import { categories } from "../data/tags";

export const Discover = () => {
  const location = useLocation();
  const pathCategory = location.pathname.split("/")[1] || "discover";
  const activeCategoryId = pathCategory === "discover" ? "all" : pathCategory.slice(0, -1);
  
  const [activeCategory, setActiveCategory] = useState(activeCategoryId);
  const [baseOpportunities, setBaseOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all"); // "all", "remote", "in-person", "hybrid"
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
    return baseOpportunities.filter(opp => {
      // Mode Filter
      if (modeFilter !== "all" && opp.mode !== modeFilter) return false;
      
      // Paid Only
      if (paidOnly && !opp.prize && !opp.stipend) return false;

      // Min Amount Filter
      const oppValue = Math.max(opp.prizeNumber || 0, opp.stipendNumber || 0);
      if (minAmount > 0 && oppValue < minAmount) return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!opp.title.toLowerCase().includes(query) && 
            !opp.org.toLowerCase().includes(query) &&
            !opp.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [baseOpportunities, modeFilter, paidOnly, minAmount, searchQuery]);

  const categoryLabel = categories.find((c) => c.id === activeCategory)?.label || "Discover";

  return (
    <div className="min-h-screen flex flex-col pt-14 bg-[#f5f0e8]">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex-1">
            <FilterBar activeCategory={activeCategory} />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters || modeFilter !== 'all' || paidOnly || minAmount > 0 
                  ? "bg-[#111111] text-white border-[#111111]" 
                  : "bg-white text-[#111111] border-[#d1cdc5] hover:border-[#111111]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Filters
            </button>
            <div className="flex-1 md:w-64">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-[#d1cdc5] rounded-xl p-6 mb-10 shadow-sm flex flex-col md:flex-row gap-8">
            {/* Mode */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">Location Mode</label>
              <select 
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full bg-[#f5f0e8] border border-[#d1cdc5] rounded p-2 text-sm outline-none focus:border-[#111111]"
              >
                <option value="all">Any Location</option>
                <option value="remote">Remote Only</option>
                <option value="in-person">In-Person Only</option>
                <option value="hybrid">Hybrid Only</option>
              </select>
            </div>

            {/* Paid Toggle */}
            <div className="flex-1 flex items-center justify-start md:justify-center pt-2 md:pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#111111]">
                <input 
                  type="checkbox" 
                  checked={paidOnly}
                  onChange={(e) => setPaidOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d1cdc5] accent-[#111111]"
                />
                Paid / Stipend Only
              </label>
            </div>

            {/* Min Amount */}
            <div className="flex-1">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
                Min Amount: ${minAmount.toLocaleString()}
              </label>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="500"
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                className="w-full accent-[#111111]"
              />
              <div className="flex justify-between text-xs text-[#6b7280] mt-1">
                <span>$0</span>
                <span>$10,000+</span>
              </div>
            </div>
            
            {/* Reset */}
            <div className="flex items-center pt-4">
              <button 
                onClick={() => { setModeFilter("all"); setPaidOnly(false); setMinAmount(0); }}
                className="text-sm font-medium text-[#6b7280] hover:text-[#111111] underline underline-offset-2"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <FeedSection
          title={activeCategory === "all" ? "Discover" : categoryLabel}
          description={
            activeCategory === "all"
              ? "Find your next big thing. Curated opportunities for those who refuse to wait in line."
              : `Explore the latest ${categoryLabel.toLowerCase()} tailored for you.`
          }
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
