import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const headingRef = useRef(null);
  const problemRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Hero Text Animation
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll('.word');
      gsap.fromTo(
        words,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.2 }
      );
    }

    // Problem Cards Scroll Animation
    if (problemRef.current) {
      const cards = problemRef.current.querySelectorAll('.problem-card');
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: problemRef.current,
            start: "top 80%",
          }
        }
      );
    }

    // Stats Number Counter Animation
    if (statsRef.current) {
      const numbers = statsRef.current.querySelectorAll('.stat-num');
      numbers.forEach((num) => {
        const target = parseFloat(num.getAttribute('data-target'));
        const suffix = num.getAttribute('data-suffix') || '';
        
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(num, {
              innerHTML: target,
              duration: 2,
              snap: { innerHTML: 1 },
              onUpdate: function () {
                num.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
              }
            });
          }
        });
      });
    }
  }, []);

  // Split text helper for animation
  const splitText = (text) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="word inline-block overflow-hidden mr-[0.3em]">
        {word}
      </span>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e8] overflow-hidden">
      <Navbar />

      <main className="flex-grow pt-14">
        
        {/* HERO SECTION */}
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 flex flex-col items-center text-center">
          {/* Decorative Elements */}
          <div className="absolute top-10 right-1/4 w-16 h-16 rounded-full border-8 border-[#2563eb] opacity-80 -z-10"></div>
          <div className="absolute bottom-20 left-1/4 text-8xl text-[#f5c518] opacity-90 -z-10 rotate-12 leading-none" style={{ filter: "drop-shadow(0 0 40px rgba(245,197,24,0.3))" }}>
            ★
          </div>
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#2563eb] rounded-full filter blur-[80px] opacity-20 -z-10"></div>

          <div className="inline-flex items-center gap-2 bg-[#f5c518] text-[#111111] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-8 shadow-sm">
            <span className="w-2 h-2 bg-[#111111] rounded-full animate-pulse"></span>
            live opportunities
          </div>

          <h1 ref={headingRef} className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-[110px] text-[#111111] leading-[0.9] tracking-tighter max-w-5xl mb-8 uppercase flex flex-wrap justify-center">
            {splitText("FIND YOUR NEXT BIG OPPORTUNITY")}
          </h1>

          <p className="text-xl text-[#6b7280] max-w-2xl mb-10">
            Hackathons, internships, workshops and more — all in one feed built for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/discover" className="bg-[#111111] text-white font-medium px-8 py-3.5 rounded-full hover:bg-[#333] transition-colors text-center shadow-lg">
              Browse Opportunities
            </Link>
            <a href="#how-it-works" className="bg-transparent border border-[#111111] text-[#111111] font-medium px-8 py-3.5 rounded-full hover:bg-black/5 transition-colors text-center">
              How it works
            </a>
          </div>
        </section>


        {/* PROBLEM SECTION */}
        <section className="border-t border-[#d1cdc5] py-24 bg-[#f5f0e8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-[#d5a500] font-bold tracking-widest text-sm uppercase mb-4 block">
                😤 the struggle is real
              </span>
              <h2 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-4">
                Every student's Sunday night.
              </h2>
              <p className="text-[#6b7280] text-lg max-w-xl">
                Opportunities are everywhere. That's the problem.
              </p>
            </div>

            <div ref={problemRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="problem-card bg-white border border-[#d1cdc5] p-8 rounded shadow-sm relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="inline-block bg-[#2563eb] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-4">MISSED DEADLINE</span>
                <h3 className="font-display font-black text-2xl mb-2">Missed the deadline</h3>
                <p className="text-[#6b7280] text-sm mb-12">"I swear I thought it was due next week..."</p>
                <div className="absolute bottom-4 right-4 flex items-center justify-between w-[calc(100%-2rem)] text-[#d1cdc5]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  <span className="text-[10px] italic text-[#6b7280] uppercase">STORY OF MY LIFE</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="problem-card bg-white border border-[#d1cdc5] p-8 rounded shadow-sm relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform mt-4 md:mt-0">
                <span className="inline-block bg-[#f5c518] text-[#111111] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-4">LOST IN CHAT</span>
                <h3 className="font-display font-black text-2xl mb-2">Found it on WhatsApp</h3>
                <p className="text-[#6b7280] text-sm mb-12">Buried under 400 "gm" messages in the group chat.</p>
                <div className="absolute bottom-4 right-4 flex items-center justify-between w-[calc(100%-2rem)] text-[#d1cdc5]">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  <span className="text-[10px] italic text-[#6b7280] uppercase">SCROLLED FOREVER</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="problem-card bg-white border border-[#d1cdc5] p-8 rounded shadow-sm relative overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform md:mt-8">
                <span className="inline-block bg-[#dc2626] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-4">BAD LINK</span>
                <h3 className="font-display font-black text-2xl mb-2">Applied to wrong link</h3>
                <p className="text-[#6b7280] text-sm mb-12">Filled a 10-page form just to find out it was for last year.</p>
                <div className="absolute bottom-4 right-4 flex items-center justify-between w-[calc(100%-2rem)] text-[#d1cdc5]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  <span className="text-[10px] italic text-[#6b7280] uppercase">PAIN</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-t border-[#d1cdc5] py-24 bg-[#f5f0e8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block border border-[#111111] rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-6 bg-white">
              ⚡ HOW IT WORKS
            </span>
            <h2 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-20">
              Three steps to never missing out.
            </h2>

            <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-4 relative max-w-4xl mx-auto">
              
              {/* Desktop dashed line */}
              <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px border-t-2 border-dashed border-[#d1cdc5] -z-10"></div>

              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white border border-[#111111] flex items-center justify-center mb-6 z-10 relative">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h4 className="font-display font-bold text-xl text-[#111111] mb-2">1. Tell us your interests</h4>
                <p className="text-[#6b7280] text-sm">Set your preferences once.</p>
              </div>

              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#f5c518] flex items-center justify-center mb-6 z-10 shadow-[0_0_0_8px_#f5f0e8]">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h4 className="font-display font-bold text-xl text-[#111111] mb-2">2. We find everything</h4>
                <p className="text-[#6b7280] text-sm">Our engine scours the web.</p>
              </div>

              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#2563eb] text-white flex items-center justify-center mb-6 z-10 shadow-[0_0_0_8px_#f5f0e8]">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14.899A7 7 0 1 1 15.62 16.5l3.85 3.85a1 1 0 0 1-1.414 1.414l-3.85-3.85A7 7 0 0 1 4 14.9"></path><path d="M6.5 6.5h.01"></path><path d="M9 9h.01"></path></svg>
                </div>
                <h4 className="font-display font-bold text-xl text-[#111111] mb-2">3. You just apply</h4>
                <p className="text-[#6b7280] text-sm">One-click straight to the source.</p>
              </div>

            </div>
          </div>
        </section>


        {/* CATEGORIES GRID */}
        <section className="py-24 bg-[#f5f0e8] overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            
            <span className="inline-block border border-[#111111] rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-6 bg-white">
              📂 WHAT'S INSIDE
            </span>
            <h2 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-12 text-center">
              Everything in one place.
            </h2>

            {/* asymmetric grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]">
              
              {/* Hackathons - Blue */}
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }} className="md:col-span-1 bg-[#2563eb] rounded p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-sm">
                <div className="absolute top-6 right-6 text-white/30">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                </div>
                <div className="mt-auto">
                  <h3 className="font-display font-black text-3xl text-white mb-1">Hackathons</h3>
                </div>
              </motion.div>

              {/* Workshops - Yellow */}
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }} className="md:col-span-1 bg-[#f5c518] border border-[#111111] rounded p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-[4px_4px_0_#111111]">
                <div className="absolute top-6 right-6 text-[#111111]/30">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                </div>
                <div className="mt-auto">
                  <h3 className="font-display font-black text-3xl text-[#111111] mb-1">Workshops</h3>
                </div>
              </motion.div>

              {/* Cultural - White Bordered */}
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }} className="md:col-span-1 bg-white border border-[#d1cdc5] rounded p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-sm">
                <div className="absolute top-6 right-6 text-[#d1cdc5]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"></path></svg>
                </div>
                <div className="mt-auto">
                  <h3 className="font-display font-black text-3xl text-[#111111] mb-1">Cultural Fests</h3>
                </div>
              </motion.div>

              {/* Internships - Black wide */}
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }} className="md:col-span-2 bg-[#111111] rounded p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-md">
                <div className="absolute top-6 right-6 text-white/10">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <div className="mt-auto relative z-10">
                  <h3 className="font-display font-black text-4xl text-white mb-2">Internships</h3>
                  <p className="text-[#a1a1aa] text-sm">Get real-world experience before you graduate.</p>
                </div>
              </motion.div>

              {/* Jobs - White Bordered */}
              <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }} className="md:col-span-1 bg-white border border-[#d1cdc5] rounded p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-sm">
                <div className="absolute top-6 right-6 text-[#d1cdc5]">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div className="mt-auto">
                  <h3 className="font-display font-black text-3xl text-[#111111] mb-1">Jobs</h3>
                </div>
              </motion.div>

            </div>

          </div>
        </section>


        {/* CTA SECTION */}
        <section className="bg-[#111111] py-32 mt-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <h2 className="font-display font-black text-6xl md:text-8xl text-white uppercase tracking-tighter mb-6">
              STOP MISSING OUT.
            </h2>
            <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto mb-10">
              Join thousands of students who are already finding their next big thing on Launchpad.
            </p>
            <Link to="/discover" className="inline-flex items-center gap-2 bg-[#f5c518] text-[#111111] font-bold px-8 py-4 rounded-full hover:bg-white transition-colors mb-24">
              Find My Opportunities
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>

            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full border-t border-white/10 pt-16">
              <div>
                <div className="font-display font-black text-5xl md:text-6xl text-[#f5c518] mb-2 tracking-tighter">
                  <span className="stat-num" data-target="10" data-suffix="k+">0</span>
                </div>
                <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Active Students</div>
              </div>
              <div>
                <div className="font-display font-black text-5xl md:text-6xl text-[#2563eb] mb-2 tracking-tighter">
                  <span className="stat-num" data-target="500" data-suffix="+">0</span>
                </div>
                <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest">New Posts Weekly</div>
              </div>
              <div>
                <div className="font-display font-black text-5xl md:text-6xl text-[#2563eb] mb-2 tracking-tighter">
                  <span className="stat-num" data-target="50" data-suffix="+">0</span>
                </div>
                <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Partner Colleges</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
