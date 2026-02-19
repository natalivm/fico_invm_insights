import { Stock } from './types';

export const INITIAL_STOCKS: Stock[] = [
  {
    id: 'nvda',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    price: '$132.50',
    change: '+2.8%',
    color: '#76b900',
    logo: 'N',
    rs: 98,
    rating: 'Strong Buy',
    beta: 1.85,
    accelerationProb: "85%",
    timeToMilestone: "1.0 Year",
    momentumUpside1Y: "+45%",
    typeLabel: "AI Compute / Data Center Standard",
    dnaTags: ["AI Sovereign Moat 🟢", "CUDA Ecosystem", "85% Data Center Share", "Margin Leader 🟢"],
    stats: [
      { label: "ЦІНА", value: "$132.50", color: "text-white" },
      { label: "FWD P/E", value: "35.2x", color: "text-slate-400" },
      { label: "RS RATING", value: "98", color: "text-emerald-400" }
    ],
    hist: [{ y: "FY24", rev: 60.9, eps: 1.19 }, { y: "FY25E", rev: 125.8, eps: 2.84 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 350, prob: 40, driver: "Blackwell cycle acceleration + Software rev" },
      { label: "Base", color: "#f59e0b", price5: 210, prob: 45, driver: "Sustained AI capex at 15% growth" },
      { label: "Bear", color: "#ef4444", price5: 95, prob: 15, driver: "Major cloud client digestion phase" }
    ],
    risks: [{ r: "Cyclical Peak", prob: "Moderate", impact: "High", detail: "Risk of hyperscaler CapEx overbuild." }],
    verdict: "NVDA залишається безальтернативним лідером AI-епохи. Blackwell — це не просто чіп, а нова обчислювальна платформа."
  },
  {
    id: 'avgo',
    ticker: 'AVGO',
    name: 'Broadcom Inc.',
    price: '$174.50',
    change: '+1.2%',
    color: '#3b82f6',
    logo: 'B',
    rs: 84,
    rating: 'Strong Buy',
    beta: 1.48,
    accelerationProb: "70%",
    timeToMilestone: "2.0 Years",
    momentumUpside1Y: "+25%",
    typeLabel: "AI Infrastructure / Custom Silicon",
    dnaTags: ["AI Networking Giant", "Custom Silicon Moat", "VMware Synergy", "RS Leader 🟢"],
    stats: [
      { label: "ЦІНА", value: "$174.50", color: "text-white" },
      { label: "BASE TARGET", value: "$215.00", color: "text-blue-400" },
      { label: "RS RATING", value: "84", color: "text-emerald-400" }
    ],
    hist: [{ y: "FY23", rev: 35.8, eps: 4.22 }, { y: "FY24", rev: 51.1, eps: 4.85 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 280, prob: 35, driver: "Custom AI chip explosion" },
      { label: "Base", color: "#f59e0b", price5: 215, prob: 50, driver: "VMware integration success" },
      { label: "Bear", color: "#ef4444", price5: 145, prob: 15, driver: "Enterprise software slowdown" }
    ],
    risks: [{ r: "Integration Risk", prob: "Low", impact: "Medium", detail: "VMware complexity." }],
    verdict: "AVGO — другий за значимістю гравець в AI після Nvidia завдяки домінуванню в мережевих технологіях."
  },
  {
    id: 'tln',
    ticker: 'TLN',
    name: 'Talen Energy Corporation',
    price: '$185.20',
    change: '+3.4%',
    color: '#f59e0b',
    logo: 'T',
    rs: 92,
    rating: 'Buy',
    beta: 1.35,
    accelerationProb: "60%",
    timeToMilestone: "2.0 Years",
    momentumUpside1Y: "+30%",
    typeLabel: "Independent Power / Data Center",
    dnaTags: ["Nuclear Base Load", "Data Center Co-location", "Regulatory Moat", "RS Leader 🟢"],
    stats: [
      { label: "ЦІНА", value: "$185.20", color: "text-white" },
      { label: "BASE TARGET", value: "$230.00", color: "text-amber-400" },
      { label: "RS RATING", value: "92", color: "text-emerald-400" }
    ],
    hist: [{ y: "2023", rev: 2.1, eps: 4.5 }, { y: "2024", rev: 2.4, eps: 6.8 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 320, prob: 35, driver: "Amazon deal expansion" },
      { label: "Base", color: "#f59e0b", price5: 230, prob: 45, driver: "Steady nuclear contract execution" },
      { label: "Bear", color: "#ef4444", price5: 140, prob: 20, driver: "FERC regulatory pushback" }
    ],
    risks: [{ r: "Regulatory", prob: "Moderate", impact: "High", detail: "Grid interconnection rulings." }],
    verdict: "TLN — унікальний актив у секторі енергетики завдяки атомній генерації."
  },
  {
    id: 'amat',
    ticker: 'AMAT',
    name: 'Applied Materials, Inc.',
    price: '$198.50',
    change: '+0.8%',
    color: '#3b82f6',
    logo: 'A',
    rs: 68,
    rating: 'Buy',
    beta: 1.45,
    accelerationProb: "40%",
    timeToMilestone: "3.0 Years",
    momentumUpside1Y: "+18%",
    typeLabel: "Semi CapEx / WFE Leader",
    dnaTags: ["WFE Leader", "Foundry/Logic Strength", "High ROIC", "Semi Cycle Play"],
    stats: [
      { label: "ЦІНА", value: "$198.50", color: "text-white" },
      { label: "BASE TARGET", value: "$245.00", color: "text-blue-400" },
      { label: "RS RATING", value: "68", color: "text-slate-400" }
    ],
    hist: [{ y: "FY23", rev: 26.5, eps: 8.05 }, { y: "FY24", rev: 27.2, eps: 8.35 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 350, prob: 30, driver: "N2 node expansion + GAA adoption" },
      { label: "Base", color: "#f59e0b", price5: 245, prob: 50, driver: "Steady WFE growth" },
      { label: "Bear", color: "#ef4444", price5: 155, prob: 20, driver: "China export restriction shock" }
    ],
    risks: [{ r: "Geopolitical", prob: "High", impact: "High", detail: "Restrictions on tools." }],
    verdict: "AMAT — хребет напівпровідникової галузі з найширшим портфелем інструментів."
  },
  {
    id: 'dash',
    ticker: 'DASH',
    name: 'DoorDash, Inc.',
    price: '$175.40',
    change: '+1.5%',
    color: '#FF3008',
    logo: 'D',
    rs: 57,
    rating: 'Hold',
    beta: 1.55,
    accelerationProb: "25%",
    timeToMilestone: "3.5 Years",
    momentumUpside1Y: "+12%",
    typeLabel: "Logistics & Marketplace",
    dnaTags: ["Market Leader", "Logistic Moat 🟢", "RS Average", "Frequency Driver"],
    stats: [
      { label: "ЦІНА", value: "$175.40", color: "text-white" },
      { label: "BASE TARGET", value: "$225.00", color: "text-emerald-400" },
      { label: "RS RATING", value: "57", color: "text-slate-400" }
    ],
    hist: [{ y: "2023", rev: 8.6, eps: -1.4 }, { y: "2024", rev: 10.1, eps: 0.2 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 350, prob: 30, driver: "Ads revenue scaling" },
      { label: "Base", color: "#f59e0b", price5: 225, prob: 50, driver: "Steady 15% GOV growth" },
      { label: "Bear", color: "#ef4444", price5: 130, prob: 20, driver: "Consumer slowdown" }
    ],
    risks: [{ r: "Profitability", prob: "Moderate", impact: "Medium", detail: "Margin compression in logistics." }],
    verdict: "DASH демонструє силу в логістиці, але потребує вищої маржинальності."
  },
  {
    id: 'anet',
    ticker: 'ANET',
    name: 'Arista Networks, Inc.',
    price: '$405.00',
    change: '+1.2%',
    color: '#10b981',
    logo: 'A',
    rs: 88,
    rating: 'Buy',
    beta: 1.42,
    accelerationProb: "40%",
    timeToMilestone: "1.8 - 2.5 Years",
    momentumUpside1Y: "+35%",
    typeLabel: "Structural Compounder / AI Networking",
    dnaTags: ["Cloud Giant Partner", "Software-Driven", "Margin Leader", "RS Leader 🟢"],
    stats: [
      { label: "ЦІНА", value: "$405.00", color: "text-white" },
      { label: "BASE TARGET", value: "$520.00", color: "text-emerald-400" },
      { label: "RS RATING", value: "88", color: "text-emerald-400" }
    ],
    hist: [{ y: "FY23", rev: 5.8, eps: 6.9 }, { y: "FY24", rev: 7.1, eps: 8.4 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 750, prob: 30, driver: "AI Networking dominance" },
      { label: "Base", color: "#f59e0b", price5: 520, prob: 45, driver: "Steady 20% CAGR" },
      { label: "Bear", color: "#ef4444", price5: 310, prob: 25, driver: "Hyperscale digestion" }
    ],
    risks: [{ r: "Concentration", prob: "Low", impact: "High", detail: "Exposure to cloud giants." }],
    verdict: "ANET — це найякісніший play на AI networking. RS 88 підтверджує лідерство."
  },
  {
    id: 'wwd',
    ticker: 'WWD',
    name: 'Woodward, Inc.',
    price: '$182.40',
    change: '+0.4%',
    color: '#3b82f6',
    logo: 'W',
    rs: 72,
    rating: 'Buy',
    beta: 1.15,
    accelerationProb: "35%",
    timeToMilestone: "3.5 Years",
    momentumUpside1Y: "+15%",
    typeLabel: "Aerospace & Energy Cycle",
    dnaTags: ["Aerospace Cycle", "High OE Exposure", "Margin Expansion", "Industrial Moat"],
    stats: [
      { label: "ЦІНА", value: "$182.40", color: "text-white" },
      { label: "FAIR VALUE", value: "$210.00", color: "text-blue-400" },
      { label: "RS RATING", value: "72", color: "text-slate-400" }
    ],
    hist: [{ y: "FY23", rev: 2.9, eps: 4.1 }, { y: "FY24", rev: 3.3, eps: 5.8 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 320, prob: 25, driver: "Aerospace production surge" },
      { label: "Base", color: "#f59e0b", price5: 245, prob: 50, driver: "Steady margin expansion" },
      { label: "Bear", color: "#ef4444", price5: 160, prob: 25, driver: "Defense budget cuts" }
    ],
    risks: [{ r: "Supply Chain", prob: "Moderate", impact: "Medium", detail: "Component delivery issues." }],
    verdict: "WWD — стійкий промисловий гравець з високою часткою оригінального обладнання."
  },
  {
    id: 'fn',
    ticker: 'FN',
    name: 'Fabrinet',
    price: '$245.00',
    change: '-0.3%',
    color: '#a855f7',
    logo: 'F',
    rs: 58,
    rating: 'Hold',
    beta: 1.65,
    accelerationProb: "50%",
    timeToMilestone: "2.0 Years",
    momentumUpside1Y: "+25%",
    typeLabel: "Optical Communications / AI",
    dnaTags: ["AI Transceiver Play", "NVDA Supply Chain", "Execution Leader"],
    stats: [
      { label: "ЦІНА", value: "$245.00", color: "text-white" },
      { label: "BASE TARGET", value: "$295.00", color: "text-purple-400" },
      { label: "RS RATING", value: "58", color: "text-slate-400" }
    ],
    hist: [{ y: "FY23", rev: 2.6, eps: 7.7 }, { y: "FY24", rev: 2.8, eps: 8.3 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 410, prob: 35, driver: "800G/1.6T hyper-adoption" },
      { label: "Base", color: "#f59e0b", price5: 295, prob: 45, driver: "Steady NVDA partnership" },
      { label: "Bear", color: "#ef4444", price5: 190, prob: 20, driver: "Tech transition lag" }
    ],
    risks: [{ r: "Customer Concentration", prob: "High", impact: "High", detail: "Nvidia dependency." }],
    verdict: "FN — ключовий партнер Nvidia в оптиці. Має чудовий FCF."
  },
  {
    id: 'cls',
    ticker: 'CLS',
    name: 'Celestica Inc.',
    price: '$92.10',
    change: '+2.1%',
    color: '#06b6d4',
    logo: 'C',
    rs: 94,
    rating: 'Strong Buy',
    beta: 1.90,
    accelerationProb: "75%",
    timeToMilestone: "1.5 Years",
    momentumUpside1Y: "+40%",
    typeLabel: "EMS / AI Infrastructure",
    dnaTags: ["Hyperscale Demand", "Connectivity Leader", "Margin Rerating", "RS Leader 🟢"],
    stats: [
      { label: "ЦІНА", value: "$92.10", color: "text-white" },
      { label: "BASE TARGET", value: "$135.00", color: "text-cyan-400" },
      { label: "RS RATING", value: "94", color: "text-emerald-400" }
    ],
    hist: [{ y: "FY23", rev: 8.0, eps: 2.4 }, { y: "FY24", rev: 9.5, eps: 3.8 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 220, prob: 40, driver: "Hyper-growth in connectivity" },
      { label: "Base", color: "#f59e0b", price5: 135, prob: 45, driver: "Sustained high margins" },
      { label: "Bear", color: "#ef4444", price5: 75, prob: 15, driver: "Industrial segment drag" }
    ],
    risks: [{ r: "Cyclical EMS", prob: "Low", impact: "Medium", detail: "Cycle exposure." }],
    verdict: "CLS переживає фундаментальне переосмислення ринком — до AI-партнера з високою маржею."
  },
  {
    id: 'spot',
    ticker: 'SPOT',
    name: 'Spotify Technology S.A.',
    price: '$478.00',
    change: '+0.5%',
    color: '#1DB954',
    logo: 'S',
    rs: 96,
    rating: 'Strong Buy',
    beta: 1.25,
    accelerationProb: "65%",
    timeToMilestone: "2.5 - 3.5 Years",
    momentumUpside1Y: "+20%",
    typeLabel: "Consumer Subscription",
    dnaTags: ["Pricing Power", "Podcasting Moat", "User Stickiness", "Margin Expansion"],
    stats: [
      { label: "ЦІНА", value: "$478.00", color: "text-white" },
      { label: "BASE TARGET", value: "$550.00", color: "text-emerald-400" },
      { label: "RS RATING", value: "96", color: "text-emerald-400" }
    ],
    hist: [{ y: "2023", rev: 13.2, fcf: 0.8 }, { y: "2024", rev: 16.1, fcf: 2.2 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 840, prob: 30, driver: "Gross margin → 35%+" },
      { label: "Base", color: "#f59e0b", price5: 550, prob: 45, driver: "Steady subscription growth" },
      { label: "Bear", color: "#ef4444", price5: 400, prob: 25, driver: "Rev slowdown" }
    ],
    risks: [{ r: "Margin Stagnation", prob: "Moderate", impact: "High", detail: "Content costs." }],
    verdict: "SPOT — фундаментальна ракета. База клієнтів монолітна."
  },
  {
    id: 'fico', 
    ticker: 'FICO', 
    name: 'Fair Isaac Corp', 
    price: '$1,351.60', 
    change: '+1.2%', 
    color: '#3b82f6', 
    logo: 'F',
    rs: 91,
    rating: 'Hold',
    beta: 1.05,
    accelerationProb: "30%",
    timeToMilestone: "3.0 - 4.0 Years",
    momentumUpside1Y: "+10%",
    typeLabel: "Financial Services / Data Analytics",
    dnaTags: ["Pricing Power", "Credit Standard", "DLP Growth", "RS Leader 🟢"],
    stats: [
      { label: "ЦІНА", value: "$1,351.60", color: "text-white" },
      { label: "BASE TARGET", value: "$1,825.00", color: "text-blue-400" },
      { label: "RS RATING", value: "91", color: "text-emerald-400" }
    ],
    hist: [{ y: "FY24", rev: 1.71, eps: 23.7 }, { y: "FY25E", rev: 1.99, eps: 29.8 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 2548, prob: 55, driver: "DLP live + 10T" },
      { label: "Base", color: "#f59e0b", price5: 1825, prob: 32, driver: "Organic growth" },
      { label: "Bear", color: "#ef4444", price5: 1100, prob: 13, driver: "Mortgage cycle delay" }
    ],
    risks: [{ r: "Regulatory", prob: "Low", impact: "High", detail: "FHFA parity risks." }],
    verdict: "Монопольне становище у сфері кредитних рейтингів робить FICO ідеальним compounder."
  },
  {
    id: 'smci',
    ticker: 'SMCI',
    name: 'Super Micro Computer, Inc.',
    price: '$45.20',
    change: '-2.4%',
    color: '#ef4444',
    logo: 'S',
    rs: 13,
    rating: 'Sell',
    beta: 2.10,
    accelerationProb: "15%",
    timeToMilestone: "5.0+ Years",
    momentumUpside1Y: "-20%",
    typeLabel: "AI Hardware / High-Density Storage",
    dnaTags: ["Governance Concerns 🔴", "Audit Risk 🔴", "RS Lagging 🔴", "Margin Pressure"],
    stats: [
      { label: "ЦІНА", value: "$45.20", color: "text-white" },
      { label: "FWD P/E", value: "8.5x", color: "text-rose-500" },
      { label: "RS RATING", value: "13", color: "text-rose-500" }
    ],
    hist: [{ y: "FY23", rev: 7.1, eps: 1.18 }, { y: "FY24", rev: 14.9, eps: 2.21 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 110, prob: 10, driver: "Clean audit + massive liquid cooling shift" },
      { label: "Base", color: "#f59e0b", price5: 55, prob: 30, driver: "Ongoing volatility, low multiple" },
      { label: "Bear", color: "#ef4444", price5: 20, prob: 60, driver: "Exchange delisting + forensic audit findings" }
    ],
    risks: [{ r: "Regulatory/Legal", prob: "Extreme", impact: "Extreme", detail: "SEC investigations and auditor resignation." }],
    verdict: "SMCI залишається найбільш ризикованим активом. Поки корпоративне управління не буде виправлено, це пастка для покупців."
  },
  {
    id: 'aph',
    ticker: 'APH',
    name: 'Amphenol Corporation',
    price: '$147.70',
    change: '+0.2%',
    color: '#38bdf8',
    logo: 'A',
    rs: 91,
    rating: 'Buy',
    beta: 0.95,
    accelerationProb: "55%",
    timeToMilestone: "3.0 Years",
    momentumUpside1Y: "+18%",
    typeLabel: "Electronic Components / AI Infrastructure",
    dnaTags: ["IT Datacom (AI) 36%", "B2B Leader 1.31x", "Margin Expansion 🟢", "RS Leader 🟢"],
    stats: [
      { label: "ЦІНА", value: "$147.70", color: "text-white" },
      { label: "FWD P/E", value: "44.2x", color: "text-slate-400" },
      { label: "RS RATING", value: "91", color: "text-emerald-400" }
    ],
    hist: [{ y: "FY25A", rev: 23.1, eps: 3.34 }, { y: "FY26E", rev: 27.2, eps: 3.49 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 254, prob: 30, driver: "AI supercycle + defense, premium multiple" },
      { label: "Base", color: "#f59e0b", price5: 168, prob: 50, driver: "AI datacom sustains, stable margins" },
      { label: "Bear", color: "#ef4444", price5: 97, prob: 20, driver: "AI cycle fades, multiple derating to 22x" }
    ],
    risks: [{ r: "Multiple Compression", prob: "High", impact: "Extreme", detail: "Derating from 44x to 22x is a 50% price risk." }],
    verdict: "APH — це високоякісний бенефіціар AI-інфраструктури. 36% доходу від Datacom та рекордний Book-to-Bill (1.31x) роблять її стійкою до циклів."
  }
];
