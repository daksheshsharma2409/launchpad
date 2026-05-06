import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";

const categoryConfig = {
  hackathon:   { accent: "#2563eb", label: "Hackathon",   emoji: "⚡" },
  workshop:    { accent: "#7c3aed", label: "Workshop",    emoji: "🛠" },
  cultural:    { accent: "#dc2626", label: "Cultural",    emoji: "🎭" },
  internship:  { accent: "#059669", label: "Internship",  emoji: "💼" },
  job:         { accent: "#ea580c", label: "Job",         emoji: "🚀" },
};

const sourceLogos = {
  linkedin:  "https://cdn.simpleicons.org/linkedin/0077b5",
  naukri:    "https://cdn.simpleicons.org/naukri/0a66c2",
  wellfound: "https://cdn.simpleicons.org/angellist/000000",
  glassdoor: "https://cdn.simpleicons.org/glassdoor/0caa41",
  unstop:    "https://ui-avatars.com/api/?name=U&background=6d28d9&color=fff&size=32",
  devfolio:  "https://cdn.simpleicons.org/devfolio/3770ff",
  devpost:   "https://cdn.simpleicons.org/devpost/003e54",
  "lu.ma":   "https://ui-avatars.com/api/?name=L&background=111111&color=fff&size=32",
};

export const OpportunityCard = ({ opportunity, index }) => {
  const { savedOpportunities, toggleSave } = useApp();
  const isSaved = savedOpportunities.includes(opportunity.id);
  const config = categoryConfig[opportunity.category] || { accent: "#111111", label: opportunity.category, emoji: "📌" };
  const sourceLogo = opportunity.source ? sourceLogos[opportunity.source.toLowerCase()] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col h-full"
    >
      {/* Card */}
      <div
        className="relative flex flex-col h-full rounded-2xl overflow-hidden border border-[#d1cdc5] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        style={{ "--accent": config.accent }}
      >
        {/* Top colour stripe */}
        <div
          className="h-1 w-full flex-shrink-0 transition-all duration-300 group-hover:h-1.5"
          style={{ background: `linear-gradient(90deg, ${config.accent}, ${config.accent}99)` }}
        />

        {/* Body */}
        <div className="flex flex-col flex-grow p-5">
          {/* Header row */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2.5">
              {opportunity.logoUrl && (
                <img
                  src={opportunity.logoUrl}
                  alt={opportunity.org}
                  className="w-9 h-9 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] object-cover shadow-sm"
                />
              )}
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold tracking-wider text-[#374151] uppercase truncate max-w-[120px]">
                  {opportunity.org}
                </span>
                {opportunity.source && (
                  <span className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: config.accent }}>
                    via {opportunity.source}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {opportunity.isNew && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 tracking-wider uppercase">
                  New
                </span>
              )}
              {opportunity.isClosingSoon && !opportunity.isNew && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 tracking-wider uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block"></span>
                  Urgent
                </span>
              )}
            </div>
          </div>

          {/* Category pill */}
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: `${config.accent}15`, color: config.accent }}
            >
              {config.emoji} {config.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-black text-xl text-[#111111] leading-tight mb-2 group-hover:text-[--accent] transition-colors relative">
            <Link to={`/opportunity/${opportunity.id}`} className="before:absolute before:inset-0 before:z-10">
              {opportunity.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-sm text-[#6b7280] mb-4 flex-grow line-clamp-2 leading-relaxed">
            {opportunity.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#e5e7eb] text-[#6b7280] tracking-wide bg-[#f9fafb]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-xs text-[#dc2626] font-semibold mb-4 border-t border-[#f3f4f6] pt-3">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Closes {opportunity.deadlineDisplay}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto relative z-10">
            <Link
              to={`/opportunity/${opportunity.id}`}
              className="flex-1 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${config.accent}, ${config.accent}cc)` }}
            >
              View Details
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSave(opportunity.id);
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                isSaved
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-[#e5e7eb] bg-transparent text-[#9ca3af] hover:border-[#111111] hover:text-[#111111]"
              }`}
              aria-label={isSaved ? "Unsave" : "Save"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
