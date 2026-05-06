import { Link } from "react-router-dom";
import { categories } from "../../data/tags";

export const FilterBar = ({ activeCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={cat.id === "all" ? "/discover" : `/${cat.id}s`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            activeCategory === cat.id
              ? "bg-[#111111] text-white border-[#111111]"
              : "bg-transparent text-[#111111] border-[#d1cdc5] hover:border-[#111111]"
          }`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
};

export default FilterBar;
