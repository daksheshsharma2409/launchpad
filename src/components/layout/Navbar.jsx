import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { to: "/discover", label: "Discover" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/workshops", label: "Workshops" },
  { to: "/cultural", label: "Cultural" },
  { to: "/internships", label: "Internships" },
  { to: "/jobs", label: "Jobs" },
];

const Navbar = () => {
  const navRef = useRef(null);
  const location = useLocation();
  const { currentUser, login } = useApp();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        gsap.to(nav, { y: "-100%", duration: 0.3, ease: "power2.in" });
      } else {
        gsap.to(nav, { y: "0%", duration: 0.3, ease: "power2.out" });
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* ── DESKTOP NAVBAR ─────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-[#d1cdc5]/60"
        style={{ transform: "translateY(0)", background: "rgba(245,240,232,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 font-display font-black text-lg text-[#111111]">
            Launchpad <span className="text-xl">🚀</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive(to)
                    ? "text-[#111111] underline underline-offset-4"
                    : "text-[#6b7280] hover:text-[#111111]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="w-8 h-8 rounded-full bg-[#f5c518] text-[#111111] font-bold flex items-center justify-center shadow-sm border border-[#111111] hover:scale-105 transition-transform"
                  title="Profile"
                >
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </Link>
              </div>
            ) : (
              <button
                onClick={() => login({ name: "Student Demo" })}
                className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#333] transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>

      {/* ── MOBILE BOTTOM DOCK (Instagram style) ────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-[#e5e7eb] flex justify-around items-center px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        <Link to="/" className={`p-2 flex flex-col items-center gap-1 transition-colors ${isActive("/") ? "text-[#111111]" : "text-[#9ca3af]"}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive("/") ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isActive("/") ? "0" : "2"}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <Link to="/discover" className={`p-2 flex flex-col items-center gap-1 transition-colors ${isActive("/discover") ? "text-[#111111]" : "text-[#9ca3af]"}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive("/discover") ? "3" : "2"}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>
        <Link to="/saved" className={`p-2 flex flex-col items-center gap-1 transition-colors ${isActive("/saved") ? "text-[#111111]" : "text-[#9ca3af]"}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isActive("/saved") ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isActive("/saved") ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Link>
        {currentUser ? (
          <Link to="/profile" className={`p-1 flex flex-col items-center gap-1`}>
            <div className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs transition-colors border-2 ${isActive("/profile") ? "border-[#111111] text-[#111111] bg-[#f5c518]" : "border-transparent text-[#111111] bg-[#f5c518]"}`}>
              {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
            </div>
          </Link>
        ) : (
          <button onClick={() => login({ name: "Student Demo" })} className="p-2 flex flex-col items-center gap-1 text-[#9ca3af]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
