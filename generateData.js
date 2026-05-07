import fs from 'fs';
import path from 'path';

// ── Category-specific title templates ──────────────────────────────────────
const categoryData = {
  hackathon: {
    titleTemplates: [
      "Global AI Hackathon", "Smart City Challenge", "FinTech Build Sprint", "Web3 Weekend",
      "Quantum Code-Off", "Open Source Marathon", "DevHacks", "HackForClimate",
      "Startup Launchpad Hack", "NASA Space Apps Challenge", "SciHack", "DataFest",
      "HackNation", "National Innovation Hackathon", "CyberSec Hack", "HealthHack Summit",
      "AgriTech Challenge", "EduHack", "Design Sprint Challenge", "CodeStorm",
      "BlockchainBuilders Hack", "SocialGood Hack", "MobileFirst Challenge",
      "Cloud Builders Weekend", "RoboHack", "AR/VR Design Hack", "IoT Challenge",
      "GameDev Jam", "API-thon", "24Hr Coding Marathon", "Build with AI",
      "Stanford Hackathon", "MIT Hack", "Google Hackathon", "Microsoft Imagine Cup",
    ],
    orgs: [
      "MLH (Major League Hacking)", "Devfolio", "Unstop", "Google Developers",
      "Microsoft Learn", "GitHub Education", "AWS Student Community", "Pega",
      "IIIT Hyderabad", "IIT Bombay ACM", "BITS Pilani Innovation Club",
      "NIT Trichy IEEE", "Bennett University Tech Club", "Hack Club",
      "Society of Engineers", "OpenAI Builders", "Meta Developers",
    ],
    sources: ["Devfolio", "Devpost", "Unstop", "Lu.ma"],
    hasPrize: 0.85,
    hasModeWeights: { remote: 0.4, hybrid: 0.3, "in-person": 0.3 },
    tags: ["BUILD", "COMPETE", "TEAM", "PRIZE POOL", "MENTORSHIP"],
    descTemplates: [
      "Build innovative solutions and compete against the best minds across the country.",
      "A 48-hour coding marathon bringing together developers, designers and dreamers.",
      "Tackle real-world problems with code and win exciting prizes.",
      "Join hundreds of hackers to ship something meaningful in 36 hours.",
    ],
    eligibility: [
      ["Students from any background", "Team size: 2–4 members", "Valid college ID required", "Laptop mandatory"],
      ["Open to undergrad and postgrad students", "Solo or team participation", "No experience required"],
      ["College students only", "Teams of 1–5", "Bring your own hardware if needed"],
    ],
  },
  workshop: {
    titleTemplates: [
      "Intro to Machine Learning", "Full Stack Web Dev Bootcamp", "Figma UI Design Workshop",
      "Prompt Engineering 101", "Docker & Kubernetes Crash Course", "Git & Open Source Basics",
      "Competitive Programming Workshop", "Data Structures Deep Dive", "System Design for Beginners",
      "Cloud Computing with AWS", "React.js Hands-on Workshop", "Python for Data Science",
      "Mobile App Dev with Flutter", "Cybersecurity Fundamentals", "Blockchain Basics",
      "ChatGPT for Developers", "DSA with Java", "SQL Masterclass", "REST API Design",
      "Agile & Scrum for Students", "No-Code App Building", "UX Research Methods",
      "Product Thinking Workshop", "Technical Writing 101", "Open Source Contribution Guide",
    ],
    orgs: [
      "Google Developer Student Clubs", "Microsoft Learn Student Ambassadors",
      "AWS Educate", "Meta Developer Circles", "GitHub Campus Experts",
      "IIT Delhi Innovation Cell", "NUS Hackers", "Coding Ninjas",
      "GeeksforGeeks Campus", "Internshala Training", "Coursera Campus",
      "Scaler School of Technology", "Boot.dev", "FreeCodeCamp Chapter",
    ],
    sources: ["Lu.ma", "Unstop", "Devfolio", "Eventbrite"],
    hasPrize: 0.05,
    hasStipend: 0.0,
    hasModeWeights: { remote: 0.6, hybrid: 0.25, "in-person": 0.15 },
    tags: ["FREE", "CERTIFICATE", "HANDS-ON", "BEGINNER FRIENDLY", "LIVE"],
    descTemplates: [
      "A practical, hands-on workshop designed to get you up to speed in under a day.",
      "Learn from industry mentors and walk away with real skills you can use immediately.",
      "Join this free online session and level up your technical toolkit.",
      "Interactive workshop with live coding, Q&A, and take-home resources.",
    ],
    eligibility: [
      ["Open to all students", "No prior experience needed", "Stable internet required for online"],
      ["Students from CS, IT, or related fields preferred", "Basic programming knowledge helpful"],
      ["College students and recent graduates", "Laptop required"],
    ],
  },
  cultural: {
    titleTemplates: [
      "Mood Indigo Cultural Fest", "Rendezvous Delhi", "Saarang IIT Madras", "Synchronicity Fest",
      "Springfest IIT KGP", "Antaragni IIT Kanpur", "Fluxus Cultural Night",
      "Inter-College Dance Battle", "Slam Poetry Open Mic", "Stand-Up Comedy Nite",
      "Annual Debate Championship", "Photography Contest", "Short Film Fest",
      "Fashion Show on Campus", "Street Art Competition", "Creative Writing Contest",
      "Classical Music Conclave", "Rock & Jam Fest", "Drama & Theatre Competition",
      "Canvas Painting Contest", "Model United Nations", "Nukkad Natak Festival",
      "Quizzing Championship", "Improv Comedy Show", "Music Band Battle",
    ],
    orgs: [
      "IIT Bombay Cultural Committee", "IIT Delhi Fests", "IIT Madras SAC",
      "BITS Pilani Cultural Society", "NIT Trichy Cultural Council",
      "Delhi University Student Union", "Miranda House Arts Club", "Symbiosis Pune Events",
      "Christ University Cultural Club", "NMIMS Mumbai Fests", "Alliance University Events",
      "Manipal Cultural Club", "SRM University Fests", "VIT Cultural Board",
    ],
    sources: ["Unstop", "Insider.in", "BookMyShow", "Lu.ma"],
    hasPrize: 0.7,
    hasStipend: 0.0,
    hasModeWeights: { remote: 0.1, hybrid: 0.15, "in-person": 0.75 },
    tags: ["PERFORM", "COMPETE", "TROPHY", "CULTURAL", "CAMPUS"],
    descTemplates: [
      "Showcase your creative talent at one of India's most celebrated cultural festivals.",
      "Compete against top performers from colleges across the country.",
      "An annual celebration of art, music, dance, drama and everything in between.",
      "Express yourself and win amazing prizes at this exciting inter-college competition.",
    ],
    eligibility: [
      ["Open to all college students", "Register as individual or group", "Valid college ID required"],
      ["Any student enrolled in a recognised institution", "Team registration available"],
      ["Undergraduate and postgraduate students", "Age 17–26"],
    ],
  },
  internship: {
    titleTemplates: [
      "Software Engineering Intern", "Product Management Intern", "Data Science Intern",
      "Machine Learning Intern", "UI/UX Design Intern", "Frontend Developer Intern",
      "Backend Developer Intern", "Full Stack Intern", "DevOps Intern",
      "Business Analyst Intern", "Growth Marketing Intern", "Content Strategy Intern",
      "Research Analyst Intern", "Cybersecurity Intern", "Cloud Infrastructure Intern",
      "Mobile App Developer Intern", "QA Engineer Intern", "Blockchain Developer Intern",
      "AI Research Intern", "Technical Writing Intern", "Sales Development Intern",
      "Operations Intern", "Finance & Strategy Intern", "HR & People Ops Intern",
      "Social Media Marketing Intern", "Video Editing & Content Intern",
    ],
    orgs: [
      "Google India", "Microsoft India", "Flipkart", "PhonePe", "Razorpay",
      "Zomato", "CRED", "Meesho", "ShareChat", "Swiggy", "Ola Electric",
      "InMobi", "Freshworks", "Zoho", "Infosys BPM", "Wipro Technologies",
      "Deloitte Digital", "PwC India", "McKinsey & Company", "Goldman Sachs",
      "JP Morgan Chase", "Deutsche Bank", "HSBC Technology", "Capgemini",
      "Adobe India", "Amazon SDE", "Atlassian India", "Notion Labs",
    ],
    sources: ["LinkedIn", "Naukri", "Internshala", "Wellfound"],
    hasPrize: 0.0,
    hasStipend: 0.95,
    hasModeWeights: { remote: 0.5, hybrid: 0.35, "in-person": 0.15 },
    tags: ["STIPEND", "PPO", "LETTER OF RECOMMENDATION", "FLEXIBLE HOURS", "MENTORSHIP"],
    descTemplates: [
      "Work on real products, with real impact, alongside world-class engineers and PMs.",
      "A paid internship opportunity where you'll own meaningful work from day one.",
      "Get hands-on experience with cutting-edge technology in a fast-paced startup environment.",
      "Collaborate with senior team members, ship features, and build your portfolio.",
    ],
    eligibility: [
      ["2nd or 3rd year undergraduate students", "Strong DSA fundamentals", "Prior project experience preferred"],
      ["Final year students or recent graduates", "Strong communication skills", "Relevant coursework required"],
      ["B.Tech / BCA / MCA students", "Portfolio or GitHub profile required"],
    ],
  },
  job: {
    titleTemplates: [
      "Software Development Engineer (SDE-1)", "Backend Engineer", "Frontend Engineer",
      "Full Stack Developer", "Data Engineer", "Data Scientist",
      "Machine Learning Engineer", "Cloud Solutions Architect", "DevOps Engineer",
      "Site Reliability Engineer (SRE)", "Product Manager", "Business Development Manager",
      "Digital Marketing Manager", "Sales Engineer", "Pre-Sales Consultant",
      "UX Designer", "UI Designer", "Technical Program Manager",
      "Cybersecurity Analyst", "QA Automation Engineer", "Embedded Systems Engineer",
      "Android Developer", "iOS Developer", "AI Research Engineer",
      "Solutions Engineer", "Customer Success Manager", "Analyst – Strategy & Operations",
    ],
    orgs: [
      "Google India", "Microsoft", "Amazon", "Meta", "Apple India",
      "Goldman Sachs Technology", "Morgan Stanley", "Uber India",
      "Grab", "Airbnb", "Stripe", "Twilio", "HubSpot India",
      "Freshworks", "Chargebee", "Postman", "Browserstack",
      "Dunzo", "Zepto", "Blinkit", "Porter", "Shadowfax",
      "Razorpay", "PhonePe", "BharatPe", "CRED", "Groww", "Zerodha",
    ],
    sources: ["LinkedIn", "Naukri", "Glassdoor", "Wellfound"],
    hasPrize: 0.0,
    hasStipend: 0.98,
    hasModeWeights: { remote: 0.3, hybrid: 0.5, "in-person": 0.2 },
    tags: ["FULL-TIME", "EQUITY", "HEALTH INSURANCE", "WORK FROM HOME", "DAY 0 PLACEMENT"],
    descTemplates: [
      "Join a high-growth team and build products used by millions of users every day.",
      "Shape the future of technology at one of the world's most innovative companies.",
      "Drive impact at scale — own your roadmap and grow fast in this role.",
      "Be part of an ambitious team solving hard problems in a collaborative environment.",
    ],
    eligibility: [
      ["B.Tech / M.Tech / MBA from tier-1/2 colleges", "0–2 years of experience", "Strong problem-solving skills"],
      ["Computer Science or related degree", "Proficiency in at least one programming language", "Open to freshers"],
      ["Final year students eligible", "Strong communication required", "Resume and portfolio required"],
    ],
  },
};

const indianLocations = [
  "Bengaluru, KA", "Mumbai, MH", "New Delhi, DL", "Hyderabad, TS",
  "Pune, MH", "Chennai, TN", "Kolkata, WB", "Ahmedabad, GJ",
  "Noida, UP", "Gurugram, HR",
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

const weightedMode = (weights) => {
  const r = Math.random();
  if (r < weights.remote) return "remote";
  if (r < weights.remote + weights.hybrid) return "hybrid";
  return "in-person";
};

let idCounter = 1;

const generateForCategory = (category, count) => {
  const cd = categoryData[category];
  const opps = [];

  for (let i = 0; i < count; i++) {
    const org = randomElement(cd.orgs);
    const baseName = randomElement(cd.titleTemplates);
    const title = randomInt(0, 3) === 0 ? `${baseName} ${randomInt(2025, 2026)}` : baseName;
    const source = randomElement(cd.sources);
    const mode = weightedMode(cd.hasModeWeights);
    const isNew = Math.random() > 0.55;
    const isClosingSoon = Math.random() > 0.65;
    const hasPrize = Math.random() < (cd.hasPrize || 0);
    const hasStipend = cd.hasStipend !== undefined
      ? Math.random() < cd.hasStipend
      : category === "internship" || category === "job";

    const location = mode === "remote" ? "Remote" : randomElement(indianLocations);
    const url = `https://www.${source.toLowerCase().replace(/[^a-z]/g, "")}.com/`;
    const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(org)}&background=random&color=fff&size=128&font-size=0.35&bold=true`;

    // Tags
    const tags = [];
    if (mode === "remote") tags.push("REMOTE");
    else if (mode === "hybrid") tags.push("HYBRID");
    else tags.push("IN-PERSON");
    const extra = cd.tags.filter(() => Math.random() > 0.45).slice(0, 2);
    tags.push(...extra);

    // Prize / stipend
    const prizeAmt = hasPrize ? randomInt(1, 25) * 1000 : 0;
    const stipendAmt = hasStipend
      ? category === "job"
        ? randomInt(8, 50) * 100000  // ₹ per year
        : randomInt(10, 80) * 1000   // ₹ per month
      : 0;

    const prizeStr = hasPrize
      ? prizeAmt >= 100000 ? `₹${(prizeAmt / 100000).toFixed(1)}L` : `₹${(prizeAmt / 1000).toFixed(0)}K`
      : null;
    const stipendStr = hasStipend
      ? category === "job"
        ? `₹${(stipendAmt / 100000).toFixed(1)}L/year`
        : `₹${(stipendAmt / 1000).toFixed(0)}K/month`
      : null;

    const eligibilitySet = randomElement(cd.eligibility);
    const deadlineDay = randomInt(1, 28);
    const deadlineMonths = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const deadlineMonth = randomElement(deadlineMonths);

    const timeline = [
      { label: "Applications Open", date: "Now", done: true },
      { label: "Review Period", date: `${randomElement(["Apr", "May", "Jun"])} ${randomInt(1, 28)}, 2025`, done: false },
      { label: "Results Announced", date: `${deadlineMonth} ${deadlineDay}, 2025`, done: false },
    ];

    opps.push({
      id: String(idCounter++),
      title,
      org,
      category,
      description: randomElement(cd.descTemplates),
      about: `${title} by ${org} is a ${category}-level opportunity that gives you a chance to learn, grow, and stand out. ${randomElement(cd.descTemplates)}`,
      tags,
      deadline: `${deadlineMonth} ${deadlineDay}, 2025`,
      deadlineDisplay: `${deadlineMonth} ${deadlineDay}`,
      mode,
      location,
      prize: prizeStr,
      stipend: stipendStr,
      prizeNumber: prizeAmt,
      stipendNumber: stipendAmt,
      isNew,
      isClosingSoon,
      logoUrl,
      source,
      url,
      eligibility: eligibilitySet,
      timeline,
      prizeDetails: hasPrize
        ? [{ icon: "🏆", label: `Winner: ${prizeStr}`, note: "Cash prize for winning team." },
           { icon: "🥈", label: `Runner Up: ${prizeStr ? `₹${Math.round(prizeAmt * 0.5 / 1000)}K` : "TBA"}`, note: "Consolation prize." }]
        : hasStipend
          ? [{ icon: "💰", label: `Compensation: ${stipendStr}`, note: "Paid monthly/yearly as applicable." }]
          : [],
    });
  }
  return opps;
};

// Generate per-category counts
const allOpportunities = [
  ...generateForCategory("hackathon",  125),
  ...generateForCategory("workshop",   85),
  ...generateForCategory("cultural",   65),
  ...generateForCategory("internship", 205),
  ...generateForCategory("job",        305),
];

// Shuffle so "all" page mixes categories nicely
for (let i = allOpportunities.length - 1; i > 0; i--) {
  const j = randomInt(0, i);
  [allOpportunities[i], allOpportunities[j]] = [allOpportunities[j], allOpportunities[i]];
}

// Write to public/data/opportunities.json (served as static asset)
const outputDir = 'public/data';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  `${outputDir}/opportunities.json`,
  JSON.stringify(allOpportunities, null, 2)
);

// Also write a meta file with counts
const meta = {
  total: allOpportunities.length,
  byCategory: {
    hackathon:  allOpportunities.filter(o => o.category === "hackathon").length,
    workshop:   allOpportunities.filter(o => o.category === "workshop").length,
    cultural:   allOpportunities.filter(o => o.category === "cultural").length,
    internship: allOpportunities.filter(o => o.category === "internship").length,
    job:        allOpportunities.filter(o => o.category === "job").length,
  }
};
fs.writeFileSync(`${outputDir}/meta.json`, JSON.stringify(meta, null, 2));

console.log(`✅ Generated ${allOpportunities.length} opportunities:`);
Object.entries(meta.byCategory).forEach(([cat, count]) => {
  console.log(`   ${cat.padEnd(12)} → ${count}`);
});
console.log(`📦 Written to ${outputDir}/opportunities.json`);
