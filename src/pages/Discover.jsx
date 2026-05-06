import { useEffect, useState } from "react";
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
  const activeCategoryId = pathCategory === "discover" ? "all" : pathCategory.slice(0, -1); // remove 's' (e.g. hackathons -> hackathon)
  
  const [activeCategory, setActiveCategory] = useState(activeCategoryId);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    // Map path back to valid category ID
    let currentCat = "all";
    if (pathCategory !== "discover") {
      const match = categories.find((c) => c.id + "s" === pathCategory || c.id === pathCategory);
      if (match) currentCat = match.id;
    }
    setActiveCategory(currentCat);
    setOpportunities(getOpportunitiesByCategory(currentCat));
  }, [pathCategory]);

  const categoryLabel = categories.find((c) => c.id === activeCategory)?.label || "Discover";

  return (
    <div className="min-h-screen flex flex-col pt-14">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex-1">
            <FilterBar activeCategory={activeCategory} />
          </div>
          <div className="w-full md:w-auto">
            <SearchBar />
          </div>
        </div>

        <FeedSection
          title={activeCategory === "all" ? "Discover" : categoryLabel}
          description={
            activeCategory === "all"
              ? "Find your next big thing. Curated opportunities for those who refuse to wait in line."
              : `Explore the latest ${categoryLabel.toLowerCase()} tailored for you.`
          }
          opportunities={opportunities}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Discover;
