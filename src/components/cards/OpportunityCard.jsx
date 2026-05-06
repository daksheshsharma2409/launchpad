import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import Badge from "../ui/Badge";

export const OpportunityCard = ({ opportunity, index }) => {
  const { savedOpportunities, toggleSave } = useApp();
  const isSaved = savedOpportunities.includes(opportunity.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[#f5f0e8] border border-[#d1cdc5] rounded-lg p-5 flex flex-col h-full hover:border-[#111111] transition-colors group relative"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[11px] font-bold tracking-wider text-[#6b7280] uppercase">
          {opportunity.org}
        </span>
        {opportunity.isNew && <Badge variant="green">NEW</Badge>}
        {opportunity.isClosingSoon && !opportunity.isNew && <Badge variant="red">CLOSING SOON</Badge>}
      </div>

      <h3 className="font-display font-bold text-2xl text-[#111111] leading-tight mb-2 group-hover:text-[#2563eb] transition-colors">
        <Link to={`/opportunity/${opportunity.id}`} className="before:absolute before:inset-0">
          {opportunity.title}
        </Link>
      </h3>

      <p className="text-sm text-[#111111] mb-4 flex-grow line-clamp-3">
        {opportunity.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
        {opportunity.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-[10px] bg-transparent rounded-full px-2">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-[#dc2626] font-medium mb-5 border-t border-[#d1cdc5] pt-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        {opportunity.deadlineDisplay}
      </div>

      <div className="flex gap-2 relative z-10 mt-auto">
        <Link
          to={`/opportunity/${opportunity.id}`}
          className="flex-1 bg-[#111111] text-white text-sm font-medium py-2 rounded-full text-center hover:bg-[#333] transition-colors"
        >
          Apply Now
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSave(opportunity.id);
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
            isSaved
              ? "bg-[#111111] border-[#111111] text-white"
              : "bg-transparent border-[#d1cdc5] text-[#111111] hover:border-[#111111]"
          }`}
          aria-label={isSaved ? "Unsave" : "Save"}
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
    </motion.div>
  );
};

export default OpportunityCard;
