import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8] border-b border-[#d1cdc5]"
      style={{ transform: "translateY(0)" }}
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
            <Link
              to="/saved"
              className="hidden sm:inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#333] transition-colors"
            >
              Save an opportunity
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded text-[#111111]"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#f5f0e8] border-t border-[#d1cdc5] px-4 py-3 flex flex-col gap-2">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`py-2 text-sm font-medium ${isActive(to) ? "text-[#111111] font-semibold" : "text-[#6b7280]"}`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/saved"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center bg-[#111111] text-white text-sm font-medium px-4 py-2 rounded-full"
          >
            Save an opportunity
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
