import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { getOpportunityById } from "../data/opportunities";
import { useApp } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Badge from "../components/ui/Badge";

export const OpportunityDetail = () => {
  const { id } = useParams();
  const opportunity = getOpportunityById(id);
  const { savedOpportunities, toggleSave, appliedOpportunities, applyOpportunity } = useApp();
  const isSaved = opportunity && savedOpportunities.includes(opportunity.id);
  const isApplied = opportunity && appliedOpportunities.includes(opportunity.id);
  
  const countdownRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (countdownRef.current) {
      // Simple parse to extract days (assuming format like "Closes in 3 days")
      // In a real app we'd compute this from a date string
      let targetNumber = 14; 
      const match = opportunity?.deadlineDisplay?.match(/(\d+)/);
      if (match) {
        targetNumber = parseInt(match[1], 10);
      }

      gsap.fromTo(
        countdownRef.current,
        { innerHTML: 0 },
        {
          innerHTML: targetNumber,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
        }
      );
    }
  }, [opportunity]);

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col pt-14">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display font-black text-4xl mb-4">Opportunity not found</h1>
            <Link to="/discover" className="text-[#2563eb] hover:underline">Return to feed</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-14 relative overflow-hidden" style={{ background: "#f5f0e8" }}>
      <Navbar />

      {/* Background System */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#d1cdc5 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-[-5%] w-[600px] h-[600px] rounded-full bg-[#2563eb] opacity-[0.10] blur-[110px]" />
        <div className="absolute bottom-[10vh] left-[-8%] w-[500px] h-[500px] rounded-full bg-[#f5c518] opacity-[0.12] blur-[100px]" />
      </div>

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Left Graphic Placeholder */}
          <div className="w-full md:w-1/3 aspect-square bg-[#f5f0e8] border border-[#d1cdc5] rounded-lg overflow-hidden flex items-center justify-center relative p-8">
             {opportunity.logoUrl ? (
               <img src={opportunity.logoUrl} alt={opportunity.org} className="w-full h-full object-contain drop-shadow-md rounded-full border-4 border-white" />
             ) : (
               <svg width="60%" height="60%" viewBox="0 0 100 100" fill="none" className="text-[#f5c518]">
                 <path d="M50 0L100 50L50 100L0 50L50 0Z" fill="currentColor" opacity="0.8" />
                 <path d="M20 20L80 20L50 80Z" fill="#111111" opacity="0.9" />
               </svg>
             )}
          </div>

          {/* Right Text */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <div className="flex gap-2 mb-4">
              <Badge variant="outline">{opportunity.category}</Badge>
              {opportunity.isClosingSoon && <Badge variant="black">Urgent</Badge>}
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl text-[#111111] leading-[0.95] tracking-tight mb-6">
              {opportunity.title}
            </h1>
            <p className="text-lg text-[#6b7280] max-w-2xl leading-relaxed">
              {opportunity.description}
            </p>
          </div>
        </div>

        <hr className="border-[#d1cdc5] mb-12" />

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column (Main Details) */}
          <div className="w-full lg:w-2/3 space-y-12">
            
            <section>
              <h2 className="font-display font-black text-3xl text-[#111111] mb-4">About the Opportunity</h2>
              <p className="text-[#111111] leading-relaxed whitespace-pre-line">
                {opportunity.about}
              </p>
            </section>

            <section>
              <h2 className="font-display font-black text-3xl text-[#111111] mb-4">Eligibility</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#111111]">
                {opportunity.eligibility.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {(opportunity.prizeDetails || opportunity.stipend) && (
              <section>
                <h2 className="font-display font-black text-3xl text-[#111111] mb-4">Prize & Stipend</h2>
                <div className="bg-[#f5f0e8] border border-[#d1cdc5] rounded-lg overflow-hidden">
                  {opportunity.prizeDetails?.map((prize, i) => (
                    <div key={i} className={`p-5 flex gap-4 ${i !== 0 ? 'border-t border-[#d1cdc5]' : ''}`}>
                      <div className="text-xl font-medium text-[#d5a500] w-6 flex-shrink-0 text-center">
                        {prize.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#111111] text-lg leading-tight">{prize.label}</h4>
                        {prize.note && <p className="text-sm text-[#6b7280] mt-1">{prize.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display font-black text-3xl text-[#111111] mb-6">Timeline</h2>
              <div className="space-y-6">
                {opportunity.timeline.map((step, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {/* Line connecting dots */}
                    {i !== opportunity.timeline.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-[#d1cdc5]"></div>
                    )}
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 z-10 bg-[#f5f0e8] mt-0.5 ${
                      step.done ? 'border-[#f5c518] bg-[#f5c518]' : 'border-[#d1cdc5]'
                    }`}></div>
                    <div>
                      <h4 className="font-bold text-[#111111] text-sm leading-tight">{step.label}</h4>
                      <p className="text-xs text-[#6b7280] mt-1">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display font-black text-3xl text-[#111111] mb-4">Location</h2>
              <div className="w-full h-64 bg-[#e5e3df] rounded-lg overflow-hidden relative border border-[#d1cdc5]">
                {opportunity.mode === 'remote' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#6b7280]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <span className="font-medium">This is a fully remote opportunity.</span>
                  </div>
                ) : (
                  <iframe 
                    title="map"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, position: 'absolute', inset: 0, zIndex: 1 }} 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(opportunity.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0"
                  ></iframe>
                )}
                <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded text-sm font-medium flex items-center gap-2 shadow-sm z-10 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {opportunity.location}
                </div>
              </div>
            </section>

          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-20 bg-[#f5f0e8] border border-[#d1cdc5] rounded-xl p-6 md:p-8 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold tracking-widest text-[#111111] uppercase mb-2">Deadline In</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span ref={countdownRef} className="font-display font-black text-6xl md:text-7xl tracking-tighter text-[#111111]">
                  0
                </span>
                <span className="font-display font-black text-2xl text-[#111111]">
                  Days
                </span>
              </div>

              <div className="w-full space-y-3 mb-6">
                <a 
                  href={opportunity.url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-[#111111] text-white font-medium py-3 rounded-full hover:bg-[#333] transition-colors shadow-md text-center"
                >
                  Apply on {opportunity.source || "Site"}
                </a>
                
                <button 
                  onClick={() => applyOpportunity(opportunity.id)}
                  disabled={isApplied}
                  className={`w-full font-medium py-3 rounded-full border transition-colors flex items-center justify-center gap-2 ${
                    isApplied 
                      ? 'bg-[#2563eb] text-white border-[#2563eb]' 
                      : 'bg-transparent text-[#111111] border-[#111111] hover:bg-black/5'
                  }`}
                >
                  {isApplied ? "Applied ✓" : "Mark as Applied"}
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: opportunity.title,
                          text: `Check out ${opportunity.title} on Launchpad!`,
                          url: window.location.href,
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                    className="flex-1 bg-transparent border border-[#111111] text-[#111111] font-medium py-3 rounded-full hover:bg-black/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share
                  </button>
                  <button
                    onClick={() => toggleSave(opportunity.id)}
                    className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border transition-colors ${
                      isSaved
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-transparent border-[#111111] text-[#111111] hover:bg-black/5"
                    }`}
                    title={isSaved ? "Unsave" : "Save"}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill={isSaved ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#6b7280] border-t border-[#d1cdc5] pt-4 w-full flex flex-col gap-1">
                <span>Organized by {opportunity.org}</span>
                {opportunity.source && <span>Sourced from {opportunity.source}</span>}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Mobile Fixed Apply Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#f5f0e8]/90 backdrop-blur border-t border-[#d1cdc5] z-40 flex gap-2">
         <a 
            href={opportunity.url || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-[#111111] text-white font-medium py-3.5 rounded-full shadow-lg text-center"
         >
            Apply on {opportunity.source || "Site"}
         </a>
      </div>
    </div>
  );
};

export default OpportunityDetail;
