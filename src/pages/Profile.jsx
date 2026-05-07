import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { getOpportunityById } from "../data/opportunities";
import FeedSection from "../components/feed/FeedSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { Link } from "react-router-dom";

export const Profile = () => {
  const { savedOpportunities, appliedOpportunities, userPreferences, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");

  const savedOpps = savedOpportunities.map(getOpportunityById).filter(Boolean);
  const appliedOpps = appliedOpportunities.map(getOpportunityById).filter(Boolean);
  const displayedOpps = activeTab === "saved" ? savedOpps : appliedOpps;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f0e8]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-14">
          <div className="text-center">
            <div className="text-7xl mb-5">🔐</div>
            <h2 className="font-display font-black text-5xl mb-3">Not logged in.</h2>
            <p className="text-[#6b7280] mb-8 text-lg">Sign in to access your saved and applied opportunities.</p>
            <Link to="/" className="bg-[#111111] text-white font-bold px-8 py-4 rounded-full hover:bg-[#2563eb] transition-all duration-200 shadow-lg">
              Go to Homepage →
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const initials = currentUser.name
    ? currentUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "#f5f0e8" }}>
      <Navbar />

      {/* ── PROFILE HERO ─────────────────────────────── */}
      <section className="pt-28 pb-0 relative overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(#d1cdc5 1px, transparent 1px)",
          backgroundSize: "24px 24px", opacity: 0.5
        }} />

        {/* Floating decorations — geometric only */}
        <div className="absolute top-10 right-[8%] w-32 h-32 rounded-full bg-[#f5c518] opacity-20 hidden lg:block" />
        <div className="absolute top-24 right-[18%] w-8 h-8 bg-[#2563eb] opacity-25 rotate-45 hidden lg:block" />
        <div className="absolute bottom-0 left-[5%] w-20 h-20 rounded-full border-8 border-[#f5c518] opacity-30 hidden lg:block" />
        <div className="absolute top-8 left-[22%] w-4 h-4 rounded-full bg-[#111111] opacity-10 hidden lg:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
              className="w-28 h-28 bg-[#f5c518] text-[#111111] font-display font-black text-5xl rounded-3xl flex items-center justify-center border-4 border-[#111111] shadow-[6px_6px_0_#111111] flex-shrink-0"
            >
              {initials}
            </motion.div>

            {/* Name + details */}
            <div className="flex-grow">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-[10px] font-black tracking-widest uppercase text-[#6b7280] block mb-2">
                  👤 Student Profile
                </span>
                <h1 className="font-display font-black text-[clamp(2.5rem,7vw,6rem)] text-[#111111] leading-[0.88] tracking-tighter">
                  {currentUser.name || "Student"}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {userPreferences.branch && (
                  <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white border-2 border-[#e5e7eb] text-[#374151]">
                    📚 {userPreferences.branch}
                  </span>
                )}
                {userPreferences.year && (
                  <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white border-2 border-[#e5e7eb] text-[#374151]">
                    🎓 {userPreferences.year}
                  </span>
                )}
                {userPreferences.interests?.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[#f5c518]/20 border-2 border-[#f5c518]/40 text-[#92690a]">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Stats + actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 flex-shrink-0"
            >
              {/* Stats */}
              <div className="flex gap-3">
                <div
                  className="rounded-2xl px-8 py-5 text-center cursor-pointer border-4 transition-all duration-200"
                  style={{
                    background: activeTab === "saved" ? "#111111" : "white",
                    borderColor: activeTab === "saved" ? "#111111" : "#e5e7eb"
                  }}
                  onClick={() => setActiveTab("saved")}
                >
                  <div className="font-display font-black text-4xl" style={{ color: activeTab === "saved" ? "#f5c518" : "#111111" }}>
                    {savedOpps.length}
                  </div>
                  <div className="text-[9px] font-black tracking-widest uppercase mt-1" style={{ color: activeTab === "saved" ? "rgba(255,255,255,0.5)" : "#6b7280" }}>
                    Saved
                  </div>
                </div>
                <div
                  className="rounded-2xl px-8 py-5 text-center cursor-pointer border-4 transition-all duration-200"
                  style={{
                    background: activeTab === "applied" ? "#111111" : "white",
                    borderColor: activeTab === "applied" ? "#111111" : "#e5e7eb"
                  }}
                  onClick={() => setActiveTab("applied")}
                >
                  <div className="font-display font-black text-4xl" style={{ color: activeTab === "applied" ? "#f5c518" : "#2563eb" }}>
                    {appliedOpps.length}
                  </div>
                  <div className="text-[9px] font-black tracking-widest uppercase mt-1" style={{ color: activeTab === "applied" ? "rgba(255,255,255,0.5)" : "#6b7280" }}>
                    Applied
                  </div>
                </div>
              </div>

              <button
                onClick={() => { logout(); navigate("/"); }}
                className="border-2 border-[#e5e7eb] bg-white text-[#6b7280] px-6 py-2.5 rounded-full text-sm font-bold hover:border-[#111111] hover:text-[#111111] transition-all duration-200"
              >
                Logout
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="flex items-center gap-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#d1cdc5] to-transparent" />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#d1cdc5]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#d1cdc5]" />
        </div>
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#d1cdc5] to-transparent" />
      </div>

      {/* ── FEED ─────────────────────────────────────── */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display font-black text-4xl text-[#111111] flex-shrink-0">
            {activeTab === "saved" ? "Saved" : "Applied"}
          </h2>
          <div className="h-1 flex-grow rounded-full bg-[#e5e7eb]" />
          <div className="flex gap-2 flex-shrink-0">
            {[
              { id: "saved", label: `Saved (${savedOpps.length})` },
              { id: "applied", label: `Applied (${appliedOpps.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#111111] hover:text-[#111111]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <FeedSection
          title=""
          description=""
          opportunities={displayedOpps}
          emptyMessage={
            activeTab === "saved"
              ? "Nothing saved yet. Explore opportunities and hit the bookmark icon!"
              : "You haven't marked anything as applied yet."
          }
        />
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
