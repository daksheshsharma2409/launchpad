import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fetchOpportunityById } from "../data/opportunitiesApi";
import FeedSection from "../components/feed/FeedSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const Saved = () => {
  const { savedOpportunities } = useApp();
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all(savedOpportunities.map(id => fetchOpportunityById(id))).then(results => {
      setOpportunities(results.filter(Boolean));
      setIsLoading(false);
    });
  }, [savedOpportunities]);

  return (
    <div className="min-h-screen flex flex-col pt-14">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-end justify-between mb-8">
          <h1 className="font-display font-black text-4xl md:text-5xl text-[#111111]">
            Saved Opportunities
          </h1>
          <span className="text-sm font-medium text-[#6b7280]">
            {opportunities.length} items
          </span>
        </div>

        {/* Custom Divider */}
        <div className="h-px w-full bg-[#d1cdc5] mb-8"></div>

        <FeedSection
          title="" // Handled above
          description=""
          opportunities={opportunities}
          emptyMessage="Your saved opportunities will appear here. Start browsing to curate your ideal list."
        />
      </main>

      <Footer />
    </div>
  );
};

export default Saved;
