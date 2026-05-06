import { Link } from "react-router-dom";

const footerLinks = {
  Explore: [
    { label: "Discover", to: "/discover" },
    { label: "About", to: "/" },
    { label: "Categories", to: "/discover" },
  ],
  GitHub: [
    { label: "GitHub", to: "https://github.com", external: true },
    { label: "Twitter", to: "https://twitter.com", external: true },
    { label: "Discord", to: "https://discord.com", external: true },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#f5f0e8] border-t border-[#d1cdc5] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 font-display font-black text-xl text-[#111111] mb-2">
              Launchpad <span>🚀</span>
            </div>
            <p className="text-sm text-[#6b7280] max-w-xs">
              Built for students who are tired of missing out.
            </p>
          </div>

          {/* Explore links */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.Explore.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-[#6b7280] hover:text-[#111111] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect links */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-3">Connect</h4>
            <ul className="space-y-2">
              {footerLinks.GitHub.map(({ label, to, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#6b7280] hover:text-[#111111] transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link to={to} className="text-sm text-[#6b7280] hover:text-[#111111] transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#d1cdc5] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#6b7280]">© 2024 Launchpad. All rights reserved.</p>
          <p className="text-xs text-[#6b7280]">Made with ❤️ for students</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
