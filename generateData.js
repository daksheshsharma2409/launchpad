import fs from 'fs';

const categories = ["hackathon", "workshop", "cultural", "internship", "job"];
const tagsPool = ["REMOTE", "HYBRID", "IN-PERSON", "$10K PRIZE POOL", "STIPEND", "FREE FOOD", "ON-CAMPUS", "EXHIBITION", "AI/ML", "STARTUP", "UI/UX", "FULL-TIME", "DANCE", "$5K PRIZE", "FREE ENTRY", "DESIGN", "DEVELOPMENT", "MARKETING"];

const orgs = [
  "Tech Rebels Org", "Studio Oblique", "Cultural Atelier", "Quantum Labs", 
  "Nexus Innovation", "OpenMind Foundation", "Figma Studio", "Type Society",
  "Velocity Tech", "Launchbase Inc.", "BITS Pilani Arts Club", "Google EMEA",
  "Q-Lab Initiative", "Venture Builders", "Aura Systems", "Streamline Inc",
  "Street Arts Club", "Designers Den", "FinTech Gurus", "EduTech Solutions",
  "Code Ninjas", "Creative Minds", "Innovate X", "Global Tech", "Artisan Guild"
];

const titles = [
  "Global Hackathon", "Design Internship", "Underground Art Exhibition", 
  "AI Ethics Workshop", "Frontend Developer", "Product Manager", 
  "Cultural Fest", "UX Research Internship", "Quantum Computing Hack",
  "Startup Weekend Challenge", "Backend Engineer", "Dance Battle",
  "Marketing Intern", "Data Science Workshop", "Music Festival",
  "Blockchain Bootcamp", "UI/UX Designer", "Full Stack Developer"
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

const generateOpportunities = (count) => {
  const opps = [];
  for (let i = 1; i <= count; i++) {
    const category = randomElement(categories);
    const org = randomElement(orgs);
    const title = randomElement(titles) + (randomInt(0, 1) ? ` ${randomInt(2024, 2026)}` : "");
    const mode = randomElement(["remote", "hybrid", "in-person"]);
    const isNew = Math.random() > 0.5;
    const isClosingSoon = Math.random() > 0.7;
    const hasPrize = Math.random() > 0.5;
    const hasStipend = category === "internship" || category === "job" || Math.random() > 0.7;
    
    let source = "";
    if (category === "job" || category === "internship") {
      source = randomElement(["LinkedIn", "Naukri", "Wellfound", "Glassdoor"]);
    } else {
      source = randomElement(["Unstop", "Devfolio", "Devpost", "Lu.ma"]);
    }
    const url = `https://${source.toLowerCase()}.com/`;

    // Generate distinct logo based on org name using ui-avatars
    const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(org)}&background=random&color=fff&size=128&font-size=0.4`;

    // Ensure tags make sense
    let tags = [];
    if (mode === "remote") tags.push("REMOTE");
    else if (mode === "hybrid") tags.push("HYBRID");
    else tags.push("IN-PERSON");

    if (hasPrize && (category === "hackathon" || category === "cultural")) tags.push(`$${randomInt(1, 20)}K PRIZE`);
    if (hasStipend) tags.push("STIPEND");
    
    while(tags.length < randomInt(2, 4)) {
      const t = randomElement(tagsPool);
      if (!tags.includes(t)) tags.push(t);
    }

    const prizeAmount = hasPrize ? `$${randomInt(1, 20)},000 USD` : null;
    const stipendAmount = hasStipend ? `$${randomInt(1, 10)},000/${category === 'job' ? 'year' : 'month'}` : null;
    
    const prizeNumber = hasPrize ? parseInt(prizeAmount.replace(/\D/g, '')) : 0;
    const stipendNumber = hasStipend ? parseInt(stipendAmount.replace(/\D/g, '')) : 0;

    opps.push({
      id: i.toString(),
      title,
      org,
      category,
      description: `Join ${org} for this amazing ${category}. We are looking for passionate individuals to be part of our upcoming event.`,
      tags,
      deadline: `December ${randomInt(1, 31)}, 2024`,
      deadlineDisplay: `Dec ${randomInt(1, 31)}`,
      mode,
      location: mode === "remote" ? "Remote" : "San Francisco, CA",
      prize: prizeAmount,
      stipend: stipendAmount,
      prizeNumber, // added for slider filtering
      stipendNumber, // added for slider filtering
      isNew,
      isClosingSoon,
      logoUrl,
      source,
      url,
      about: `This is an amazing opportunity provided by ${org}. Whether you are a beginner or a pro, you will find immense value in this ${category}.`,
      eligibility: ["Currently enrolled students", "Passion for learning", "Strong communication skills"],
      timeline: [
        { label: "Applications Open", date: "Now", done: true },
        { label: "Deadline", date: `Dec ${randomInt(1, 31)}, 2024`, done: false }
      ],
      prizeDetails: hasPrize ? [{ icon: "🏆", label: `First Place: ${prizeAmount}`, note: "Cash prize." }] : (hasStipend ? [{ icon: "$", label: `Compensation: ${stipendAmount}`, note: "Paid regularly." }] : [])
    });
  }
  return opps;
};

const opportunities = generateOpportunities(65);

const fileContent = `export const opportunities = ${JSON.stringify(opportunities, null, 2)};

export const getOpportunityById = (id) => opportunities.find((o) => o.id === id);

export const getOpportunitiesByCategory = (category) =>
  category === "all" ? opportunities : opportunities.filter((o) => o.category === category);
`;

fs.writeFileSync('src/data/opportunities.js', fileContent);
console.log("Generated 65 opportunities successfully!");
