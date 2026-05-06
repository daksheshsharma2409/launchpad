import { Link } from "react-router-dom";
import OpportunityCard from "../cards/OpportunityCard";

export const FeedSection = ({ title, description, opportunities, emptyMessage = "No opportunities found." }) => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-display font-black text-5xl md:text-6xl text-[#111111] mb-2 tracking-tight">
          {title}
        </h1>
        {description && <p className="text-lg text-[#6b7280] max-w-2xl">{description}</p>}
      </div>

      {opportunities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp, index) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-[#f5f0e8] border border-[#d1cdc5] rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 mb-4 text-[#d1cdc5]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className="font-display font-bold text-2xl text-[#111111] mb-2">Nothing here yet.</h3>
          <p className="text-[#6b7280] mb-6 max-w-md mx-auto">{emptyMessage}</p>
          <Link
            to="/discover"
            className="bg-[#111111] text-white font-medium px-6 py-2.5 rounded-full hover:bg-[#333] transition-colors"
          >
            Start Exploring
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeedSection;
