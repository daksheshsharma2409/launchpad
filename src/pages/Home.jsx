import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MarqueeTicker from "../components/ui/MarqueeTicker";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { label: "Hackathons", to: "/hackathons", bg: "#2563eb", text: "white", emoji: "⚡", desc: "Build, ship, win.", count: "120+" },
  { label: "Workshops", to: "/workshops", bg: "#7c3aed", text: "white", emoji: "🛠", desc: "Level up your skills.", count: "80+" },
  { label: "Cultural Fests", to: "/cultural", bg: "#f5c518", text: "#111111", emoji: "🎭", desc: "Celebrate & compete.", count: "60+" },
  { label: "Internships", to: "/internships", bg: "#111111", text: "white", emoji: "💼", desc: "Real-world XP.", count: "200+" },
  { label: "Jobs", to: "/jobs", bg: "#059669", text: "white", emoji: "🚀", desc: "Your first role awaits.", count: "300+" },
];

const painPoints = [
  { tag: "Missed Deadline", color: "#2563eb", icon: "📅", title: "\"I swear it was next week...\"", sub: "Buried under 40 WhatsApp forwards." },
  { tag: "Information Overload", color: "#7c3aed", icon: "🤯", title: "10 websites. Zero results.", sub: "Unstop, LinkedIn, Devpost, Naukri... all open at once." },
  { tag: "Wrong Link Applied", color: "#dc2626", icon: "💀", title: "5-page form. Last year's event.", sub: "Wasted 2 hours. Never again." },
];

const sources = [
  { name: "LinkedIn", color: "#0077b5" },
  { name: "Naukri", color: "#e01e26" },
  { name: "Unstop", color: "#6d28d9" },
  { name: "Devpost", color: "#003e54" },
  { name: "Devfolio", color: "#3770ff" },
  { name: "Wellfound", color: "#000000" },
  { name: "Lu.ma", color: "#111111" },
  { name: "Glassdoor", color: "#0caa41" },
];

export const Home = () => {
  const headingRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll(".word");
      gsap.fromTo(
        words,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: "power3.out", delay: 0.1 }
      );
    }

    if (statsRef.current) {
      const numbers = statsRef.current.querySelectorAll(".stat-num");
      numbers.forEach((num) => {
        const target = parseFloat(num.getAttribute("data-target"));
        const suffix = num.getAttribute("data-suffix") || "";
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
              },
            });
          },
        });
      });
    }
  }, []);

  const splitText = (text) =>
    text.split(" ").map((word, i) => (
      <span key={i} className="word inline-block overflow-hidden mr-[0.3em]">
        {word}
      </span>
    ));

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-grow pt-14">
        {/* ── HERO ─────────────────────────────────────── */}
        <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#2563eb] opacity-10 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#f5c518] opacity-15 blur-[100px]" />
            <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#7c3aed] opacity-10 blur-[100px]" />
          </div>

          {/* Floating decorative shapes */}
          <div className="absolute top-[15%] right-[8%] w-14 h-14 rounded-full border-4 border-[#2563eb] opacity-70 hidden lg:block" />
          <div className="absolute top-[25%] left-[6%] text-5xl opacity-60 hidden lg:block rotate-12">★</div>
          <div className="absolute bottom-[20%] right-[12%] w-8 h-8 bg-[#f5c518] rounded opacity-80 rotate-45 hidden lg:block" />
          <div className="absolute bottom-[30%] left-[10%] w-5 h-5 bg-[#2563eb] rounded-full opacity-60 hidden lg:block" />

          <div className="text-center max-w-6xl mx-auto relative z-10">
            {/* Live pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-lg"
            >
              <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse" />
              Live Opportunities · Updated Daily
            </motion.div>

            {/* Main heading */}
            <h1
              ref={headingRef}
              className="font-display font-black text-[clamp(3.5rem,10vw,8.5rem)] text-[#111111] leading-[0.88] tracking-tighter uppercase flex flex-wrap justify-center mb-8"
            >
              {splitText("Find Your")}
              <span className="word inline-block overflow-hidden mr-[0.3em] text-[#2563eb]">
                Next&nbsp;Big
              </span>
              {splitText("Opportunity")}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg md:text-xl text-[#6b7280] max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Hackathons, internships, workshops, cultural fests and jobs — all sourced from{" "}
              <span className="font-semibold text-[#111111]">LinkedIn, Unstop, Devpost & more</span>{" "}
              in one clean feed built for students.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                to="/discover"
                className="group inline-flex items-center justify-center gap-2 bg-[#111111] text-white font-bold px-8 py-4 rounded-full hover:bg-[#2563eb] transition-all duration-300 shadow-xl hover:shadow-[#2563eb]/30 hover:-translate-y-0.5 text-base"
              >
                Browse Opportunities
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/70 backdrop-blur border border-[#d1cdc5] text-[#111111] font-semibold px-8 py-4 rounded-full hover:border-[#111111] transition-all duration-200 text-base"
              >
                How it works
              </a>
            </motion.div>

            {/* Source pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.7 }}
              className="flex flex-wrap justify-center gap-2 mt-10"
            >
              <span className="text-[11px] text-[#6b7280] uppercase tracking-widest font-bold self-center mr-1">Sources:</span>
              {sources.map((s) => (
                <span
                  key={s.name}
                  className="text-[11px] font-bold px-3 py-1 rounded-full border border-[#d1cdc5] bg-white/80 text-[#374151] tracking-wide"
                >
                  {s.name}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6b7280]"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ── MARQUEE ──────────────────────────────────── */}
        <MarqueeTicker variant="dark" />

        {/* ── PAIN POINTS ──────────────────────────────── */}
        <section className="py-28 px-4 sm:px-6 bg-[#f5f0e8] relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="inline-block bg-[#f5c518] text-[#111111] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-5">
                😤 the struggle is real
              </span>
              <h2 className="font-display font-black text-5xl md:text-7xl text-[#111111] leading-[0.92] tracking-tight mb-5">
                Every student's<br />
                <span className="text-[#6b7280]">Sunday night.</span>
              </h2>
              <p className="text-[#6b7280] text-lg max-w-lg">
                Opportunities are everywhere. That's the problem. We fix it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {painPoints.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  className="bg-white border-2 border-[#e5e7eb] rounded-2xl p-7 shadow-sm relative overflow-hidden"
                  style={{ transformOrigin: "center bottom" }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ background: p.color }}
                  />
                  <span
                    className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full mb-4 tracking-widest uppercase"
                    style={{ background: `${p.color}15`, color: p.color }}
                  >
                    {p.tag}
                  </span>
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3 className="font-display font-black text-xl text-[#111111] mb-2 leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{p.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section id="how-it-works" className="bg-[#111111] py-28 px-4 sm:px-6 relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563eb] opacity-10 rounded-full blur-[100px]" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <span className="inline-block border border-white/20 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-white/60 mb-5">
                ⚡ HOW IT WORKS
              </span>
              <h2 className="font-display font-black text-5xl md:text-7xl text-white tracking-tight leading-[0.92]">
                Three steps to<br />
                <span className="text-[#f5c518]">never missing out.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px border-t border-dashed border-white/20" />
              {[
                { num: "01", icon: "👤", title: "Tell us who you are", desc: "Set your interests, branch, and year. Takes 60 seconds." },
                { num: "02", icon: "🔍", title: "We aggregate everything", desc: "We pull from LinkedIn, Unstop, Devpost, Naukri & more daily." },
                { num: "03", icon: "✅", title: "You just apply", desc: "One click straight to the original source. Track your progress here." },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-6 relative z-10 shadow-xl"
                    style={{ background: i === 1 ? "#f5c518" : i === 2 ? "#2563eb" : "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                  >
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-2">{step.num}</span>
                  <h3 className="font-display font-black text-xl text-white mb-3">{step.title}</h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ───────────────────────────────── */}
        <section className="py-28 px-4 sm:px-6 bg-[#f5f0e8]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block border border-[#111111] rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase mb-5 bg-white">
                📂 WHAT'S INSIDE
              </span>
              <h2 className="font-display font-black text-5xl md:text-7xl text-[#111111] tracking-tight leading-[0.92]">
                Everything.<br />
                <span className="text-[#6b7280]">In one place.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={i === 3 ? "lg:col-span-2" : ""}
                >
                  <Link
                    to={cat.to}
                    className="flex flex-col justify-between p-8 rounded-2xl h-52 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl"
                    style={{ background: cat.bg, color: cat.text }}
                  >
                    {/* Bg decoration */}
                    <div className="absolute top-4 right-4 text-[80px] opacity-10 leading-none select-none">
                      {cat.emoji}
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-10"
                      style={{ background: cat.text === "white" ? "white" : "#111" }}
                    />
                    <div>
                      <span className="text-3xl mb-3 block">{cat.emoji}</span>
                      <h3 className="font-display font-black text-3xl leading-tight">{cat.label}</h3>
                      <p className="text-sm opacity-60 mt-1">{cat.desc}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black opacity-70">{cat.count} listed</span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform"
                        style={{ background: cat.text === "white" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── YELLOW MARQUEE ───────────────────────────── */}
        <MarqueeTicker variant="yellow" />

        {/* ── CTA ──────────────────────────────────────── */}
        <section className="bg-[#111111] py-32 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: "radial-gradient(#ffffff08 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2563eb] opacity-10 rounded-full blur-[80px]" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display font-black text-[clamp(3rem,9vw,8rem)] text-white uppercase tracking-tighter leading-[0.88] mb-6">
                Stop.<br />
                <span className="text-[#f5c518]">Missing Out.</span>
              </h2>
              <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto mb-10">
                Join thousands of students already finding their next big thing on Launchpad.
              </p>
              <Link
                to="/discover"
                className="inline-flex items-center gap-3 bg-[#f5c518] text-[#111111] font-black px-10 py-5 rounded-full hover:bg-white transition-all duration-300 hover:scale-105 text-lg shadow-2xl shadow-[#f5c518]/20 mb-24"
              >
                Find My Opportunities
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
              {[
                { target: 10, suffix: "k+", label: "Active Students", color: "#f5c518" },
                { target: 65, suffix: "+", label: "Opportunities Listed", color: "#2563eb" },
                { target: 8, suffix: "", label: "Source Platforms", color: "#7c3aed" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="font-display font-black text-5xl md:text-6xl mb-2 tracking-tighter" style={{ color: stat.color }}>
                    <span className="stat-num" data-target={stat.target} data-suffix={stat.suffix}>0</span>
                  </div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
