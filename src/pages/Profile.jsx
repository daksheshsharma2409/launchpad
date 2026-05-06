import { useState } from "react";
import { useApp } from "../context/AppContext";
import { getOpportunityById } from "../data/opportunities";
import FeedSection from "../components/feed/FeedSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

export const Profile = () => {
  const { savedOpportunities, appliedOpportunities, userPreferences, currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState("saved");
  
  const savedOpps = savedOpportunities.map(getOpportunityById).filter(Boolean);
  const appliedOpps = appliedOpportunities.map(getOpportunityById).filter(Boolean);
  const displayedOpps = activeTab === "saved" ? savedOpps : appliedOpps;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col pt-14 bg-[#f5f0e8]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-display font-black text-3xl mb-4">You are not logged in.</h2>
            <Link to="/" className="text-[#2563eb] hover:underline font-medium">Return Home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-14 bg-[#f5f0e8] relative overflow-hidden">
      <Navbar />
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#f5c518] rounded-full filter blur-[120px] opacity-[0.15] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[20vh] left-[-150px] w-[600px] h-[600px] bg-[#2563eb] rounded-full filter blur-[120px] opacity-[0.15] -z-10 pointer-events-none"></div>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-10 relative">
        {/* Profile Header */}
        <div className="bg-white border border-[#d1cdc5] rounded-xl p-8 mb-12 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 bg-[#f5c518] text-[#111111] font-display font-black text-5xl rounded-full flex items-center justify-center border-2 border-[#111111] shadow-[4px_4px_0_#111111] flex-shrink-0">
            {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
          </div>
          <div className="flex-grow">
            <h1 className="font-display font-black text-4xl text-[#111111] mb-2">{currentUser.name || "Student"}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6b7280]">
              {userPreferences.branch && (
                <div><span className="font-bold text-[#111111]">Branch:</span> {userPreferences.branch}</div>
              )}
              {userPreferences.year && (
                <div><span className="font-bold text-[#111111]">Year:</span> {userPreferences.year}</div>
              )}
              {userPreferences.interests?.length > 0 && (
                <div><span className="font-bold text-[#111111]">Interests:</span> {userPreferences.interests.join(", ")}</div>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="md:ml-auto border border-[#111111] text-[#111111] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/5 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs for Saved and Applied */}
        <div className="flex gap-4 mb-8 border-b border-[#d1cdc5]">
          <button 
            onClick={() => setActiveTab("saved")}
            className={`pb-3 text-2xl font-display font-black transition-colors ${activeTab === "saved" ? "text-[#111111] border-b-2 border-[#111111]" : "text-[#6b7280] hover:text-[#111111]"}`}
          >
            Saved ({savedOpps.length})
          </button>
          <button 
            onClick={() => setActiveTab("applied")}
            className={`pb-3 text-2xl font-display font-black transition-colors ${activeTab === "applied" ? "text-[#111111] border-b-2 border-[#111111]" : "text-[#6b7280] hover:text-[#111111]"}`}
          >
            Applied ({appliedOpps.length})
          </button>
        </div>

        <div className="h-px w-full bg-[#d1cdc5] mb-8"></div>

        <FeedSection
          title=""
          description=""
          opportunities={displayedOpps}
          emptyMessage={
            activeTab === "saved" 
              ? "Your saved opportunities will appear here. Start browsing to curate your ideal list."
              : "You haven't marked any opportunities as applied yet."
          }
        />
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
