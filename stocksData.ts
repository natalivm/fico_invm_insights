
import { Stock } from './types';

export const GLOSSARY: Record<string, string> = {
  "GM": "Gross Margin (Валова маржа) — % прибутку після витрат на виробництво. Низька маржа (як 6.4% у SMCI) означає відсутність цінової влади.",
  "FCF": "Free Cash Flow (Вільний грошовий потік) — реальні гроші, які залишаються після всіх витрат та інвестицій.",
  "RS": "Relative Strength (Відносна сила) — показник того, наскільки акція сильніша за ринок за останні 12 місяців (1-99).",
  "Moat": "Economic Moat (Економічний рів) — конкурентна перевага, що захищає прибутки компанії.",
  "DLP": "Deep Learning Platform / Data Loop — технологічна перевага в обробці даних.",
  "WFE": "Wafer Fab Equipment — обладнання для виробництва напівпровідникових пластин.",
  "Client Conc.": "Концентрація клієнтів — ризик залежності від одного або декількох великих покупців.",
  "Pricing Power": "Цінова влада — здатність компанії підвищувати ціни без втрати частки ринку.",
  "Beta": "Бета — міра волатильності акції відносно ринку. >1.0 означає вищу волатильність.",
  "XPU": "Custom AI Accelerators (TPU/LPU) — спеціалізовані чіпи для ШІ, де Broadcom є лідером проектування.",
};

export const INITIAL_STOCKS: Stock[] = [
  {
    id: 'smci',
    ticker: 'SMCI',
    name: 'Super Micro Computer, Inc.',
    price: '$29.70',
    change: '-2.4%',
    color: '#ef4444',
    logo: 'S',
    rs: 13,
    rating: 'Sell',
    beta: 2.15,
    accelerationProb: "15%",
    timeToMilestone: "5+ Years",
    momentumUpside1Y: "-15%",
    typeLabel: "Cyclical Hardware / Turnaround",
    dnaTags: ["AI-Capex Amplifier", "63% Client Conc.", "GM 6.4% 🔴", "FCF Negative Q2"],
    stats: [
      { label: "ЦІНА", value: "$29.70", color: "text-white" },
      { label: "BASE TARGET", value: "$28.80", color: "text-amber-400" },
      { label: "RS RATING", value: "13", color: "text-rose-500" }
    ],
    hist: [{ y: "Q1 FY26", rev: 5.9, eps: 0.75 }, { y: "Q2 FY26", rev: 12.7, eps: 2.20 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 66, prob: 20, driver: "DCBBS Scaling + GM Recovery" },
      { label: "Base", color: "#f59e0b", price5: 29, prob: 42, driver: "Competitive pressure + thin margins" },
      { label: "Bear", color: "#ef4444", price5: 12, prob: 38, driver: "Client concentration event + de-rating" }
    ],
    risks: [
      { r: "Client Concentration", prob: "High", impact: "Extreme", detail: "One client accounts for ~63% of revenue. Binary risk profile." },
      { r: "Margin Structural Decline", prob: "High", impact: "High", detail: "Gross margins fell to 6.4% at record revenue, indicating zero pricing power." }
    ],
    verdict: "SMCI — це гра на виживання в циклі hardware. RS=13 та падіння маржі до 6.4% сигналізують про структурні проблеми."
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
      { label: "DIV YIELD", value: "1.2%", color: "text-slate-400" }
    ],
    hist: [{ y: "FY23", rev: 35.8, eps: 4.22 }, { y: "FY24", rev: 51.1, eps: 4.85 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 280, prob: 35, driver: "Ethernet scale-out + Custom AI chip explosion" },
      { label: "Base", color: "#f59e0b", price5: 215, prob: 50, driver: "VMware integration success + 15% growth" },
      { label: "Bear", color: "#ef4444", price5: 145, prob: 15, driver: "Enterprise software slowdown" }
    ],
    risks: [{ r: "Integration Risk", prob: "Low", impact: "Medium", detail: "Complexity of fully absorbing VMware operations." }],
    verdict: "AVGO — другий за значимістю гравець в AI після Nvidia завдяки домінуванню в мережевих технологіях та кастомних чіпах (XPU)."
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
      { label: "Bull", color: "#22c55e", price5: 320, prob: 35, driver: "Amazon deal expansion + hyper-scaling" },
      { label: "Base", color: "#f59e0b", price5: 230, prob: 45, driver: "Steady nuclear contract execution" },
      { label: "Bear", color: "#ef4444", price5: 140, prob: 20, driver: "FERC regulatory pushback" }
    ],
    risks: [{ r: "Regulatory", prob: "Moderate", impact: "High", detail: "Grid interconnection rulings remain a key variable." }],
    verdict: "TLN — унікальний актив у секторі енергетики завдяки атомній генерації та прямому підключенню дата-центрів."
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
      { label: "PE RATIO", value: "22.5x", color: "text-slate-400" }
    ],
    hist: [{ y: "FY23", rev: 26.5, eps: 8.05 }, { y: "FY24", rev: 27.2, eps: 8.35 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 350, prob: 30, driver: "N2 node expansion + GAA adoption" },
      { label: "Base", color: "#f59e0b", price5: 245, prob: 50, driver: "Steady WFE growth" },
      { label: "Bear", color: "#ef4444", price5: 155, prob: 20, driver: "China export restriction shock" }
    ],
    risks: [{ r: "Geopolitical", prob: "High", impact: "High", detail: "Restrictions on advanced tool exports to China." }],
    verdict: "AMAT — хребет напівпровідникової галузі. Володіє найширшим портфелем інструментів для наступного покоління чіпів."
  },
  {
    id: 'dash',
    ticker: 'DASH',
    name: 'DoorDash, Inc.',
    price: '$175.40',
    change: '+1.5%',
    color: '#FF3008',
    logo: 'D',
    rs: 17,
    rating: 'Hold',
    beta: 1.55,
    accelerationProb: "25%",
    timeToMilestone: "3.5 Years",
    momentumUpside1Y: "+12%",
    typeLabel: "Logistics & Marketplace",
    dnaTags: ["Market Leader", "Logistic Moat 🟢", "RS Lagging 🔴", "Frequency Driver"],
    stats: [
      { label: "ЦІНА", value: "$175.40", color: "text-white" },
      { label: "BASE TARGET", value: "$225.00", color: "text-emerald-400" },
      { label: "RS RATING", value: "17", color: "text-rose-500" }
    ],
    hist: [{ y: "2023", rev: 8.6, eps: -1.4 }, { y: "2024", rev: 10.1, eps: 0.2 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 350, prob: 30, driver: "Ads revenue scaling + grocery dominance" },
      { label: "Base", color: "#f59e0b", price5: 225, prob: 50, driver: "Steady 15% GOV growth" },
      { label: "Bear", color: "#ef4444", price5: 130, prob: 20, driver: "Consumer slowdown + regulatory pressure" }
    ],
    risks: [{ r: "Technical Breakdown", prob: "High", impact: "Medium", detail: "RS rating of 17 indicates significant relative underperformance." }],
    verdict: "DASH демонструє фундаментальну силу, але технічний RS 17 свідчить про глибоку консолідацію або втрату інтересу покупців."
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
    risks: [{ r: "Concentration", prob: "Low", impact: "High", detail: "Exposure to top 3 cloud giants." }],
    verdict: "ANET — це найякісніший play на AI networking. RS (88) підтверджує лідерство."
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
      { label: "EBITDA", value: "22%", color: "text-slate-400" }
    ],
    hist: [{ y: "FY23", rev: 2.9, eps: 4.1 }, { y: "FY24", rev: 3.3, eps: 5.8 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 320, prob: 25, driver: "Aerospace production surge" },
      { label: "Base", color: "#f59e0b", price5: 245, prob: 50, driver: "Steady margin expansion" },
      { label: "Bear", color: "#ef4444", price5: 160, prob: 25, driver: "Defense budget cuts" }
    ],
    risks: [{ r: "Supply Chain", prob: "Moderate", impact: "Medium", detail: "Lumpy component delivery." }],
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
      { label: "FCF YIELD", value: "4.8%", color: "text-slate-400" }
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
    risks: [{ r: "Cyclical EMS", prob: "Low", impact: "Medium", detail: "Broader cycle exposure." }],
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
    rs: 13,
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
      { label: "EV/FCF", value: "25.2x", color: "text-blue-400" }
    ],
    hist: [{ y: "2023", rev: 13.2, fcf: 0.8 }, { y: "2024", rev: 16.1, fcf: 2.2 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 840, prob: 30, driver: "Gross margin → 35%+" },
      { label: "Base", color: "#f59e0b", price5: 550, prob: 45, driver: "Steady subscription growth" },
      { label: "Bear", color: "#ef4444", price5: 400, prob: 25, driver: "Rev slowdown" }
    ],
    risks: [{ r: "Margin Stagnation", prob: "Moderate", impact: "High", detail: "Content costs variable." }],
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
    rs: 17,
    rating: 'Hold',
    beta: 1.05,
    accelerationProb: "30%",
    timeToMilestone: "3.0 - 4.0 Years",
    momentumUpside1Y: "+10%",
    typeLabel: "Financial Services / Data Analytics",
    dnaTags: ["Pricing Power", "Credit Standard", "DLP Growth", "Industrial Moat"],
    stats: [
      { label: "ЦІНА", value: "$1,351.60", color: "text-white" },
      { label: "BASE TARGET", value: "$1,825.00", color: "text-blue-400" },
      { label: "RS RATING", value: "17", color: "text-rose-500" }
    ],
    hist: [{ y: "FY24", rev: 1.71, eps: 23.7 }, { y: "FY25E", rev: 1.99, eps: 29.8 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 2548, prob: 55, driver: "DLP live + 10T" },
      { label: "Base", color: "#f59e0b", price5: 1825, prob: 32, driver: "Organic growth" },
      { label: "Bear", color: "#ef4444", price5: 1100, prob: 13, driver: "Mortgage cycle delay" }
    ],
    risks: [{ r: "Regulatory", prob: "Low", impact: "High", detail: "FHFA parity risks." }],
    verdict: "Монопольне становище у сфері кредитних рейтингів робить FICO ідеальним compounder."
  }
];
