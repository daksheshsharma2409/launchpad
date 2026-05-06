export const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-[#f5f0e8] border border-[#d1cdc5] text-[#111111]",
    blue: "bg-[#2563eb] text-white",
    yellow: "bg-[#f5c518] text-[#111111]",
    red: "bg-[#dc2626] text-white",
    green: "bg-[#16a34a] text-white",
    black: "bg-[#111111] text-white",
    outline: "border border-[#111111] text-[#111111]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
