import "./MarqueeTicker.css";

const items = [
  "⚡ Hackathons",
  "💼 Internships",
  "🛠 Workshops",
  "🚀 Jobs",
  "🎭 Cultural Fests",
  "🏆 Prize Money",
  "🌐 Remote Opportunities",
  "🤝 Networking",
  "📚 Workshops",
  "💡 Innovation",
  "⚡ Hackathons",
  "💼 Internships",
  "🛠 Workshops",
  "🚀 Jobs",
  "🎭 Cultural Fests",
  "🏆 Prize Money",
  "🌐 Remote Opportunities",
  "🤝 Networking",
  "📚 Workshops",
  "💡 Innovation",
];

const MarqueeTicker = ({ variant = "dark" }) => {
  const isDark = variant === "dark";
  return (
    <div
      className={`w-full overflow-hidden py-3 border-y ${
        isDark
          ? "bg-[#111111] border-[#333]"
          : "bg-[#f5c518] border-[#d4a915]"
      }`}
    >
      <div className="marquee-track flex items-center gap-0">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`text-xs font-bold tracking-widest uppercase whitespace-nowrap flex-shrink-0 ${
              isDark ? "text-white/60" : "text-[#111111]"
            }`}
          >
            {item}
            <span className={`mx-6 ${isDark ? "text-white/20" : "text-[#111111]/30"}`}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeTicker;
