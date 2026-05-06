export const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex items-center w-full max-w-sm">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full bg-[#f5f0e8] border border-[#d1cdc5] rounded-full px-9 py-2 text-sm focus:outline-none focus:border-[#111111] transition-colors"
        />
      </div>
    </div>
  );
};

export default SearchBar;
