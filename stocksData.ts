import { Stock } from './types';

const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

export const INITIAL_STOCKS: Stock[] = [
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
    verdict: "AMAT — хребет напівпровідникової галузі. Ціна значно нижча за Base Target, що робить її привабливою для входу.",
    buyThesis: LOREM_IPSUM
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
    verdict: "ANET демонструє високу відносну силу. Значний дисконт до Base Target ($520) підтверджує рейтинг Buy.",
    buyThesis: LOREM_IPSUM
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
    rating: 'Strong Buy',
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
    risks: [{ r: "Multiple Compression", prob: "High", impact: "Extreme", detail: "Derating risk if AI cycle fades." }],
    verdict: "Винятковий RS (91) та позиція близько до Base Target роблять APH пріоритетним вибором (Strong Buy).",
    buyThesis: "It's a BUY! RS 91, 38% organic growth, 77% EPS growth, 26%+ margins expanding, and a 1.31x book-to-bill pointing into 2026. The AI infrastructure cycle is the tailwind — APH makes the physical connectors inside every hyperscaler rack. That's not going away.\n\nEPS at $5+ by 2028 is realistic without heroic assumptions. At 35–38x that's $175–190. The stock does the work through earnings, not hope.\n\nOne thing to watch: IT Datacom quarterly growth rate. If that decelerates, get out early. Everything else is noise."
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
    rating: 'Buy',
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
    verdict: "AVGO торгується з дисконтом ~20% до базової цілі. Фундаментальний лідер у мережевих технологіях.",
    buyThesis: LOREM_IPSUM
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
    verdict: "Поєднання екстремального RS (94) та позиції значно нижче Base Target роблять CLS Strong Buy.",
    buyThesis: LOREM_IPSUM
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
    rating: 'Buy',
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
    risks: [{ r: "Profitability", prob: "Moderate", impact: "Medium", detail: "Margin compression." }],
    verdict: "DASH має значний дисконт до Base Target ($225). Логістична монополія створює запас міцності.",
    buyThesis: LOREM_IPSUM
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
    rating: 'Strong Buy',
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
    verdict: "Високий RS (91) та монопольне становище при ціні нижче Base Target роблять FICO Strong Buy.",
    buyThesis: LOREM_IPSUM
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
    rating: 'Buy',
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
    verdict: "Ціна значно нижча за Base Target. FN залишається ключовим бенефіціаром оптичного буму.",
    buyThesis: LOREM_IPSUM
  },
  {
    id: 'meli',
    ticker: 'MELI',
    name: 'MercadoLibre, Inc.',
    price: '$2,035.00',
    change: '-1.2%',
    color: '#f59e0b',
    logo: 'M',
    rs: 22,
    rating: 'Buy',
    beta: 1.62,
    accelerationProb: "45–55%",
    timeToMilestone: "3.0 - 5.0 Years",
    momentumUpside1Y: "+41%",
    typeLabel: "A) Structural Compounder / LATAM Giant",
    dnaTags: ["E-commerce Moat", "Fintech Leader 🟢", "RS Lagging 🔴", "FCF Machine 🟢"],
    stats: [
      { label: "ЦІНА", value: "$2,035.00", color: "text-white" },
      { label: "BASE TARGET", value: "$2,878.00", color: "text-amber-400" },
      { label: "RS RATING", value: "22", color: "text-rose-500" }
    ],
    hist: [{ y: "FY23", rev: 14.5, eps: 19.46 }, { y: "FY24", rev: 20.8, eps: 38.40 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 3500, prob: 25, driver: "Margin inflection + re-rating" },
      { label: "Base", color: "#f59e0b", price5: 2878, prob: 45, driver: "Execution holds, margin delay" },
      { label: "Bear", color: "#ef4444", price5: 2136, prob: 30, driver: "Decel + multiple compression" }
    ],
    risks: [
      { r: "Margin Compression", prob: "High", impact: "High", detail: "Extended investment mode depressing EPS." },
      { r: "LATAM Macro", prob: "High", impact: "Moderate", detail: "FX volatility in Brazil/Argentina." }
    ],
    verdict: "При ціні $2,035 MELI торгується нижче Bear Case ($2,136), що створює значну недооціненість попри слабкий RS. Це довгострокова ставка на екосистему LATAM.",
    buyThesis: "yes! A stable AI narrative keeps growth multiples elevated and risk appetite open — that's the environment where MELI's 49x P/E is tolerable and institutional money rotates back into quality compounders with weak momentum. RS 22 stops being a problem when the macro tide turns.\n\nMELI's own AI deployment — logistics, credit underwriting, ad targeting — is a real margin lever that's currently invisible in the numbers because the market is fixated on EPS misses. When it shows up, the \"investment mode\" story reframes as an efficiency story, and the multiple holds or expands.\n\nThe bet: decent AI narrative + Q4'25 margin inflection = RS recovery + P/E holds at 38–42x = base case 15%+ CAGR. Size it small now, add when RS crosses 50."
  },
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
      { label: "Bull", color: "#22c55e", price5: 350, prob: 40, driver: "Blackwell cycle acceleration" },
      { label: "Base", color: "#f59e0b", price5: 210, prob: 45, driver: "Sustained AI capex" },
      { label: "Bear", color: "#ef4444", price5: 95, prob: 15, driver: "Cloud client digestion" }
    ],
    risks: [{ r: "Cyclical Peak", prob: "Moderate", impact: "High", detail: "Risk of CapEx overbuild." }],
    verdict: "Екстремальний RS (98) та величезний дисконт до Base Target ($210) роблять NVDA безальтернативним Strong Buy.",
    buyThesis: LOREM_IPSUM
  },
  {
    id: 'smci',
    ticker: 'SMCI',
    name: 'Super Micro Computer, Inc.',
    price: '$31.80',
    change: '+9.7%',
    color: '#3b82f6',
    logo: 'S',
    rs: 11,
    rating: 'Buy',
    beta: 2.10,
    accelerationProb: "15%",
    timeToMilestone: "5.0+ Years",
    momentumUpside1Y: "+40%",
    typeLabel: "AI Hardware / High-Density Storage",
    dnaTags: ["Recovering Momentum 🟢", "Audit Risk 🔴", "RS Lagging 🔴", "Growth Cushion"],
    stats: [
      { label: "ЦІНА", value: "$31.80", color: "text-white" },
      { label: "FWD P/E", value: "7.1x", color: "text-blue-400" },
      { label: "RS RATING", value: "11", color: "text-rose-500" }
    ],
    hist: [{ y: "FY23", rev: 7.1, eps: 1.18 }, { y: "FY24", rev: 14.9, eps: 2.21 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 110, prob: 10, driver: "Clean audit + liquid cooling shift" },
      { label: "Base", color: "#f59e0b", price5: 55, prob: 30, driver: "Avoids delisting, low multiple" },
      { label: "Bear", color: "#ef4444", price5: 32, prob: 60, driver: "Floor is found despite structural issues" }
    ],
    risks: [{ r: "Regulatory/Legal", prob: "Extreme", impact: "Extreme", detail: "Audit crisis." }],
    verdict: "Навіть при рості до $31.80 акція торгується нижче Bear Case ($32) та значно нижче Base Target ($55). Математично це Buy через колосальний асиметричний потенціал.",
    buyThesis: LOREM_IPSUM
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
    verdict: "Високий RS (96) та позиція біля Base Target підтверджують преміальний статус Strong Buy.",
    buyThesis: LOREM_IPSUM
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
    rating: 'Strong Buy',
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
      { label: "Base", color: "#f59e0b", price5: 230, prob: 45, driver: "Steady nuclear execution" },
      { label: "Bear", color: "#ef4444", price5: 140, prob: 20, driver: "Regulatory pushback" }
    ],
    risks: [{ r: "Regulatory", prob: "Moderate", impact: "High", detail: "Grid rulings." }],
    verdict: "Енергетичний лідер з RS 92. Торгується з дисконтом до Base Target, що робить акцію Strong Buy.",
    buyThesis: LOREM_IPSUM
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
      { label: "Bull", color: "#22c55e", price5: 320, prob: 25, driver: "Aerospace surge" },
      { label: "Base", color: "#f59e0b", price5: 245, prob: 50, driver: "Steady expansion" },
      { label: "Bear", color: "#ef4444", price5: 160, prob: 25, driver: "Defense cuts" }
    ],
    risks: [{ r: "Supply Chain", prob: "Moderate", impact: "Medium", detail: "Delivery issues." }],
    verdict: "Ціна суттєво нижча за внутрішню вартість (Fair Value $210) та Base Target ($245).",
    buyThesis: LOREM_IPSUM
  }
];