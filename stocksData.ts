import { Stock } from './types';

const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

export const INITIAL_STOCKS: Stock[] = [
  {
    id: 'amat',
    ticker: 'AMAT',
    name: 'Applied Materials, Inc.',
    price: '$366.00',
    change: '+1.4%',
    color: '#3b82f6',
    logo: 'A',
    rs: 97,
    rating: 'Strong Buy',
    beta: 1.45,
    accelerationProb: "25% (Hurdle 15%)",
    timeToMilestone: "5.0 Years",
    momentumUpside1Y: "+22%",
    typeLabel: "WFE Leader / Structural AI Compounder",
    dnaTags: ["WFE Leader", "GAA/HBM Share Gains", "Equip GM ~54%", "RS 97"],
    stats: [
      { label: "ЦІНА", value: "$366.00", color: "text-white" },
      { label: "BASE TARGET", value: "$483.00", color: "text-blue-400" },
      { label: "RS RATING", value: "97", color: "text-emerald-400" }
    ],
    hist: [
      { y: "FY25A", rev: 27.2, eps: 9.52 },
      { y: "FY26E", rev: 31.35, eps: 11.10 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 638, prob: 25, driver: "AI supercycle extends past CY27. EPS beats consensus ($22). Multiple holds on structural premium." },
      { label: "Base", color: "#f59e0b", price5: 483, prob: 45, driver: "Consensus delivers ($21). CY26-27 strong, then normalization. Partial P/E compression to 23x." },
      { label: "Bear", color: "#ef4444", price5: 360, prob: 30, driver: "Cycle breaks, consensus slightly missed ($20). Full multiple compression to historical 18x." }
    ],
    risks: [
      { r: "P/E Compression", prob: "High", impact: "Extreme", detail: "The main risk is valuation derating, not earnings failure. Current 33x Fwd is demanding." },
      { r: "Metering Constraints", prob: "High", impact: "Medium", detail: "Growth metered by cleanroom, supply chain, and engineer supply." },
      { r: "China Exposure", prob: "Moderate", impact: "High", detail: "27% of revenue combined; rising China mix is a GM headwind." }
    ],
    verdict: "Очікувана дохідність від $366 становить ~6–7% CAGR. Сильний бізнес, реальна траєкторія прибутку, але ринок вже заклав це в ціну. Для 12% потрібен вхід по $270–290.",
    buyThesis: "Кваліфікований buy при 12% таргеті. \n\nБізнес сильний — AGS дає подлогу, equipment GM 54%, GAA/HBM структурні. Ризик не в бізнесі, а в мультиплікаторі — і це краща проблема ніж навпаки. \n\nНе входити на всю позицію одразу. 3-4% портфеля, докуповувати при $300-320 якщо мультиплікаторі стиснеться. При 12% hurdle ймовірність ~45-50% — прийнятно для циклічного growth з moat."
  },
  {
    id: 'anet',
    ticker: 'ANET',
    name: 'Arista Networks, Inc.',
    price: '$135.90',
    change: '+0.4%',
    color: '#10b981',
    logo: 'A',
    rs: 80,
    rating: 'Hold',
    beta: 1.42,
    accelerationProb: "38%",
    timeToMilestone: "3.0 Years",
    momentumUpside1Y: "+12%",
    typeLabel: "AI Networking Leader / Post-Earnings",
    dnaTags: ["AI Networking $3.25B", "Cloud Giant Partner", "Software-Driven", "RS 80"],
    stats: [
      { label: "ЦІНА", value: "$135.90", color: "text-white" },
      { label: "BASE TARGET", value: "$135.50", color: "text-amber-400" },
      { label: "RS RATING", value: "80", color: "text-emerald-400" }
    ],
    hist: [
      { y: "FY25A", rev: 7.1, eps: 2.75 },
      { y: "FY26E", rev: 11.25, eps: 3.19 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 195, prob: 25, driver: "AI supercycle extends + 1.6T ramps in 2027 + margin recovery" },
      { label: "Base", color: "#f59e0b", price5: 135, prob: 50, driver: "Execution holds but P/E compresses from 49x to 30x (flat return)" },
      { label: "Bear", color: "#ef4444", price5: 95, prob: 25, driver: "Growth halves + memory/silicon squeeze + market re-rates to 25x" }
    ],
    risks: [
      { r: "Multiple Compression", prob: "High", impact: "Extreme", detail: "P/E derating from 49x to 30x can erase all EPS growth gains." },
      { r: "Concentration", prob: "Moderate", impact: "High", detail: "Heavy reliance on hyperscaler CapEx cycles." },
      { r: "Memory Pricing", prob: "Moderate", impact: "Medium", detail: "Supply chain costs impacting gross margins (62-64% guide)." }
    ],
    verdict: "ANET — це циклічне зростання + структурний рів. Проблема не в бізнесі, а в оцінці: стиснення мультиплікатора з 49x до 30x може обнулити весь ріст EPS. Базовий сценарій — флет.",
    buyThesis: "the base case gives you ~0% CAGR over 3 years. EPS grows from $3.19 to $4.51 — solid business execution — but P/E compression from 49x to 30x eats all of it. You hold for three years and get your money back.\n\nEven the bull case only delivers ~8-9% on a 3Y hold, and that requires the AI supercycle to extend, 1.6T to hit production on time, margins to recover, AND the market to keep paying 35x. That's a lot of \"ands\" for single-digit returns. Becomes interesting at $100–110. Until then, watchlist."
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
    price: '$335.00',
    change: '+1.2%',
    color: '#3b82f6',
    logo: 'B',
    rs: 76,
    rating: 'Buy',
    beta: 1.48,
    accelerationProb: "40-50% (P(15%+))",
    timeToMilestone: "5.0 Years",
    momentumUpside1Y: "+12-16%",
    typeLabel: "Structural Compounder / AI Infrastructure",
    dnaTags: ["AI Infra + VMware", "$73B AI Backlog", "Q1 AI +100% YoY", "RS 76"],
    stats: [
      { label: "ЦІНА", value: "$335.00", color: "text-white" },
      { label: "BASE TARGET", value: "$582.00", color: "text-blue-400" },
      { label: "RS RATING", value: "76", color: "text-emerald-400" }
    ],
    hist: [
      { y: "FY26E", rev: 97.0, eps: 10.27 },
      { y: "FY30E", rev: 135.0, eps: 23.27 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 698, prob: 30, driver: "EPS beats street ($25+), P/E holds 30x. AI backlog extends and accelerates." },
      { label: "Base", color: "#f59e0b", price5: 582, prob: 45, driver: "Street delivers ($23.27), P/E normalizes to 25x. Steady VMware synergy." },
      { label: "Bear", color: "#ef4444", price5: 465, prob: 25, driver: "EPS miss ($19.7), P/E crushes to 20x. Cycle turns, hyperscaler pause." }
    ],
    risks: [
      { r: "Multiple Compression", prob: "High", impact: "Extreme", detail: "At 15x FY30 EPS: $349. Valuation is the primary risk." },
      { r: "GM Decline", prob: "Moderate", impact: "High", detail: "Mix shift to system-level AI sales is a margin headwind." },
      { r: "Capex Cycle", prob: "Moderate", impact: "High", detail: "Hyperscaler pause could derail the 22.8% CAGR path." }
    ],
    verdict: "The debate is no longer 'will growth happen?' — it's 'how much multiple for 22.8% EPS CAGR at mega-cap scale?' Street numbers are now credible. At $335, you get natural P/E compression from 32.6x to 18.7x by FY28 through earnings alone. The biggest risk is the exit multiple, not the business.",
    buyThesis: "Earnings growth has order-book validation ($73B backlog). Street numbers are now credible. Q1 AI revenue grew ~100% YoY, proving structural demand. The thesis is supported by VMware's sticky recurring software revenue which provides margin floors. \n\nRisk is almost entirely multiple compression — at 20x FY30 EPS, return drops to 6-7% CAGR. However, the probability of 10-12% returns is high (60-70%) given the clear 22.8% EPS growth path. RS 76 suggests the tape is consolidating, not yet leading, offering an entry before the next breakout."
  },
  {
    id: 'cls',
    ticker: 'CLS',
    name: 'Celestica Inc.',
    price: '$284.84',
    change: '+2.1%',
    color: '#06b6d4',
    logo: 'C',
    rs: 94,
    rating: 'Hold',
    beta: 1.90,
    accelerationProb: "<50% (P(15%+))",
    timeToMilestone: "5.0 Years",
    momentumUpside1Y: "+12%",
    typeLabel: "Cyclical Growth (B) + Momentum (C)",
    dnaTags: ["63% Concentration", "CapEx 5x Jump", "800G/1.6T Ramp", "RS 94"],
    stats: [
      { label: "ЦІНА", value: "$284.84", color: "text-white" },
      { label: "FWD P/E '26", value: "32.6x", color: "text-amber-400" },
      { label: "RS RATING", value: "94", color: "text-emerald-400" }
    ],
    hist: [
      { y: "FY25A", rev: 12.4, eps: 6.05 }, 
      { y: "FY26G", rev: 17.0, eps: 8.75 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 427, prob: 25, driver: "AI super-cycle sustains + multiple holds 22x. EPS beats consensus." },
      { label: "Base", color: "#f59e0b", price5: 275, prob: 50, driver: "Street execution ($15.3 EPS), P/E compression to 18x. Steady EMS returns." },
      { label: "Bear", color: "#ef4444", price5: 179, prob: 25, driver: "Cycle peak, CapEx drag restricts FCF, multiple crushes to 15x." }
    ],
    risks: [
      { r: "CapEx Jump", prob: "Extreme", impact: "Extreme", detail: "5x jump to $1.0B in FY26 restricts FCF growth (only +9% guide)." },
      { r: "Concentration", prob: "Extreme", impact: "High", detail: "Top-3 clients = 63% of revenue. Not sole-source on TPU (confirmed)." },
      { r: "Valuation Risk", prob: "High", impact: "High", detail: "P/E 47x trailing for EMS manufacturer is extremely demanding." }
    ],
    verdict: "Execution is excellent — but price already reflects it. You're buying the cycle phase, not a structural moat. At 47x trailing for EMS, this is priced well beyond perfection.",
    buyThesis: "Model shows ~0–2% annual return to 2030 in the base case. Even after strong earnings, the current price embeds very optimistic assumptions. \n\nYou are buying the cycle phase, not a structural moat. Key risk is the massive CapEx jump ($201M -> $1.0B) which restricts FCF conversion significantly. Additionally, the extreme 63% client concentration poses a permanent risk of multiple compression if any client diversifies. CEO confirmation that CLS is not sole-source on major programs (TPU) limits long-term valuation premium."
  },
  {
    id: 'dash',
    ticker: 'DASH',
    name: 'DoorDash, Inc.',
    price: '$179.60',
    change: '+1.5%',
    color: '#FF3008',
    logo: 'D',
    rs: 17,
    rating: 'Buy',
    beta: 1.55,
    accelerationProb: "20-40% (P(15%+))",
    timeToMilestone: "5.0 Years",
    momentumUpside1Y: "+12-19%",
    typeLabel: "Execution Compounder / Logistics Leader",
    dnaTags: ["NV Unit Econ+ 2H'26", "Ads 2x/3x Growth", "RS 17 🔴", "Execution Story"],
    stats: [
      { label: "ЦІНА", value: "$179.60", color: "text-white" },
      { label: "BASE TARGET", value: "$343.00", color: "text-emerald-400" },
      { label: "RS RATING", value: "17", color: "text-rose-500" }
    ],
    hist: [
      { y: "2025E", rev: 13.7, eps: 1.25 },
      { y: "2030E", rev: 35.0, eps: 13.70 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 525, prob: 25, driver: "Blue Sky: NV margin ≥8% · Ads ≥6% rev · Revenue CAGR ≥20% · 30x exit multiple." },
      { label: "Base", color: "#f59e0b", price5: 343, prob: 50, driver: "Consensus margin ramp · Standard execution path · 25x exit multiple." },
      { label: "Bear", color: "#ef4444", price5: 170, prob: 25, driver: "Revenue growth slowing → 12-14% · Multiple compression to 18-20x." }
    ],
    risks: [
      { r: "Valuation Risk", prob: "High", impact: "Extreme", detail: "RS 17 unchanged. Significant P/E compression risk if execution falters." },
      { r: "Extended OpEx", prob: "Moderate", impact: "High", detail: "Platform + autonomy costs could linger longer than modeled." },
      { r: "Competition", prob: "Moderate", impact: "High", detail: "Dasher pay model + promo pressure on take rate across verticals." }
    ],
    verdict: "DASH торгується біля Base Target ($343) за консенсусом, що дає ~14% CAGR. Проте реальна цінність закладена в 'важелях виконання': прибутковість New Verticals та масштабування реклами можуть вивести EPS на рівень $17.5. RS 17 свідчить про скепсис ринку, що створює вікно для входу до розвороту імпульсу.",
    buyThesis: "Execution is the story. TIKR consensus $13.7 EPS for 2030 at 25x delivers a 13.8% CAGR - decent, but doesn't clear the high-conviction hurdle. The alpha comes from the three levers: New Verticals (NV) profitability, Ads scaling, and Tech Stack consolidation.\n\nThe Q4'25 call de-risked the NV story significantly with the 'unit economics positive in 2H'26' guide. If NV hits 8% margins and Ads scale to 6% of revenue, EPS targets jump towards $17.5. That's a 24%+ CAGR profile in the Bull case ($525).\n\nRS 17 is the primary near-term headwind; institutional flow hasn't turned yet. However, for a long-term compounder, buying when the execution path is de-risking but the tape is still skeptical is a classic alpha setup. 3-4% position, add on RS recovery >40."
  },
  {
    id: 'fico', 
    ticker: 'FICO', 
    name: 'Fair Isaac Corp', 
    price: '$1,341.00', 
    change: '+1.2%', 
    color: '#3b82f6', 
    logo: 'F',
    rs: 17,
    rating: 'Strong Buy',
    beta: 1.05,
    accelerationProb: "55-70% (P(15%+))",
    timeToMilestone: "5.0 Years",
    momentumUpside1Y: "+12%",
    typeLabel: "Structural Compounder / Financial Data",
    dnaTags: ["Pricing Power", "Credit Standard", "DLP Growth", "RS 17 🔴", "Platform +33% ARR"],
    stats: [
      { label: "ЦІНА", value: "$1,341.00", color: "text-white" },
      { label: "BASE TARGET (5Y)", value: "$2,950.00", color: "text-blue-400" },
      { label: "RS RATING", value: "17", color: "text-rose-500" }
    ],
    hist: [
      { y: "FY24A", rev: 1.71, eps: 23.7 }, 
      { y: "FY26E", rev: 1.99, eps: 41.22 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 3600, prob: 25, driver: "Strong scenario: 20.5% EPS CAGR (High-conviction platform scaling + Mortgage cycle tailwind) @ 35x multiple." },
      { label: "Base", color: "#f59e0b", price5: 2950, prob: 55, driver: "Organic pricing power + steady buybacks. 19% EPS CAGR @ 30x multiple." },
      { label: "Bear", color: "#ef4444", price5: 1736, prob: 20, driver: "Mortgage cycle delay + regulatory pushback. 11% EPS CAGR @ 25x multiple." }
    ],
    risks: [
      { r: "Mortgage Cycle", prob: "Moderate", impact: "High", detail: "Heavy sensitivity to loan origination volumes and FHFA parity rulings." },
      { r: "Regulatory Risk", prob: "Moderate", impact: "High", detail: "Ongoing scrutiny of scoring monopolies and data privacy standards." },
      { r: "Pricing Pressure", prob: "Low", impact: "Medium", detail: "Potential for competitive scoring models to gain niche traction." }
    ],
    verdict: "Compounder + cyclical tailwind. At ~32.5x forward EPS, a 15%+ CAGR is achievable even with significant P/E compression to 28-30x. Fundamental/Technical divergence creates entry for high-conviction holders.",
    buyThesis: "The risk/reward is skewed in your favor at ~32x forward. The moat is real, the pricing power is structural, and Q1 showed both segments working. If you have a 3–5 year horizon and can stomach the weak tape, this is a quality compounder at a reasonable entry.\n\nI'd size it as a core position, not a max-conviction bet — and I wouldn't try to time the technical bottom. FICO is the ultimate pricing power story; scores revenue grew 29% in Q1'26, and the platform side is the hidden engine with 33% ARR growth and 122% NRR.\n\nTechnicals (RS 17) reflect a massive divergence from the underlying earnings momentum. While the tape is cold, the execution is at record highs."
  },
  {
    id: 'fn',
    ticker: 'FN',
    name: 'Fabrinet',
    price: '$513.00',
    change: '+1.2%',
    color: '#a855f7',
    logo: 'F',
    rs: 95,
    rating: 'Strong Buy',
    beta: 1.65,
    accelerationProb: "60%",
    timeToMilestone: "5.0 Years",
    momentumUpside1Y: "+25%",
    typeLabel: "Optical Communications / AI Infrastructure",
    dnaTags: ["RS 95 🟢", "AI/Optical Leader", "HPC Ramp ($86M)", "GM 12.4%", "Record Q2 EPS"],
    stats: [
      { label: "ЦІНА", value: "$513.00", color: "text-white" },
      { label: "FWD P/E (FY26)", value: "37.8x", color: "text-purple-400" },
      { label: "RS RATING", value: "95", color: "text-emerald-400" }
    ],
    hist: [
      { y: "FY25A", rev: 3.2, eps: 10.17 }, 
      { y: "FY26E", rev: 4.54, eps: 13.58 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 1076, prob: 25, driver: "AI cycle extends 3+ years · HPC >$150M/qtr sustained · Datacom supply unlocked · Op margin 11.5%+" },
      { label: "Base", color: "#f59e0b", price5: 725, prob: 45, driver: "Moderate AI spend · HPC at $150M plateau · Margins stable 11% · P/E 28x mean" },
      { label: "Bear", color: "#ef4444", price5: 414, prob: 30, driver: "AI capex slows · HPC doesn't scale · FCF remains pressured · P/E 20x" }
    ],
    risks: [
      { r: "AI Cycle Cooling", prob: "High", impact: "High", detail: "Primary revenue driver; no structural moat if spend declines." },
      { r: "Valuation Reversion", prob: "High", impact: "High", detail: "Trading ~38x vs hist mean 28x; mean reversion is significant downside." },
      { r: "Negative FCF", prob: "Elevated", impact: "Medium", detail: "OCF $46M vs Capex $52M in Q2. Building 10 expansion ongoing." }
    ],
    verdict: "Record Q2 results confirm the HPC ramp thesis ($15M -> $86M). While FCF is temporarily pressured by Building 10 capex, the earnings trajectory is accelerating. RS 95 shows leadership.",
    buyThesis: "The risk/reward is skewed in your favor if you believe the AI cycle extends. HPC ramp is the real deal, moving from $15M to $86M in a single quarter. Management is targeting $150M+ per quarter. While P/E is near historical highs, the EPS acceleration justifies the premium.\n\nQ2 showed record revenue and EPS with margins expanding. Sizing: Core position, expect volatility during the capex build phase (Building 10). Technicals are exceptionally strong with RS 95."
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
    accelerationProb: "50%",
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
    id: 'panw',
    ticker: 'PANW',
    name: 'Palo Alto Networks, Inc.',
    price: '$150.11',
    change: '-0.45%',
    color: '#3b82f6',
    logo: 'P',
    rs: 15,
    rating: 'Buy',
    beta: 1.22,
    accelerationProb: "25% (Bull requires 30x+)",
    timeToMilestone: "4.0 Years",
    momentumUpside1Y: "+8-11%",
    typeLabel: "Maturing Compounder / Cybersecurity",
    dnaTags: ["Platformization Flywheel", "A/D Hybrid", "76% Gross Margin", "RS 15 🔴"],
    stats: [
      { label: "ЦІНА", value: "$150.11", color: "text-white" },
      { label: "FWD P/E (FY26)", value: "40.1x", color: "text-slate-400" },
      { label: "RS RATING", value: "15", color: "text-rose-500" }
    ],
    hist: [
      { y: "FY26E", rev: 11.3, eps: 3.74 },
      { y: "FY30E", rev: 18.2, eps: 6.66 }
    ],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 283, prob: 25, driver: "EPS beats consensus by 12% ($7.46), P/E holds 38x. AI security tailwind." },
      { label: "Base", color: "#f59e0b", price5: 200, prob: 50, driver: "EPS in-line with consensus ($6.66), P/E normalizes to 30x. Steady execution." },
      { label: "Bear", color: "#ef4444", price5: 132, prob: 25, driver: "EPS misses consensus by 10% ($6.00), P/E compresses to 22x. Integration bottlenecks." }
    ],
    risks: [
      { r: "P/E Compression", prob: "High", impact: "Extreme", detail: "Analysts expect 40x to 23x compression by FY30. If it hits 23x, return is near-flat." },
      { r: "Revenue Deceleration", prob: "Moderate", impact: "High", detail: "Growth slows to 12-13% post-M&A bump. Maturity phase risk." },
      { r: "Consensus Path", prob: "High", impact: "Medium", detail: "Consensus path ($6.66 x 23x) leads to $153, essentially flat from current $150." }
    ],
    verdict: "Картина змінилася: при консенсусі ~15% EPS CAGR та стисненні P/E до 23x, базовий сценарій дає 8–11% річних. Це гібрид A/D — структурний компаундер на стадії зрілості.",
    buyThesis: "Palo Alto is now an A/D hybrid — a structural compounder entering its maturity phase. With consensus EPS CAGR at ~15% and analysts embedding P/E compression from 40x to 23x, the base case return has flattened to 8–11%/yr.\n\nAt $150, you are paying fair value for a top-tier cybersecurity platform (76% Gross Margin, 38% FCF margin) with optionality if AI security or platform execution outperforms. However, the 15%+ CAGR target now requires the 'Bull' scenario where the exit multiple stays above 30x. It is no longer a high-conviction momentum play, but a core strategic holding for a long-term compounder portfolio."
  },
  {
    id: 'smci',
    ticker: 'SMCI',
    name: 'Super Micro Computer, Inc.',
    price: '$29.70',
    change: '-6.6%',
    color: '#3b82f6',
    logo: 'S',
    rs: 11,
    rating: 'Buy',
    beta: 2.10,
    accelerationProb: "25%",
    timeToMilestone: "5.0 Years",
    momentumUpside1Y: "+22%",
    typeLabel: "AI Hardware / Post-Earnings Cycle",
    dnaTags: ["63% Client Conc.", "Margin Pressure", "RS 11 🔴", "Audit Risk 🔴"],
    stats: [
      { label: "ЦІНА", value: "$29.70", color: "text-white" },
      { label: "FWD P/E (FY26)", value: "14.4x", color: "text-blue-400" },
      { label: "RS RATING", value: "11", color: "text-rose-500" }
    ],
    hist: [{ y: "FY23", rev: 7.1, eps: 1.18 }, { y: "FY24", rev: 2.21, eps: 2.21 }],
    scenarios: [
      { label: "Bull", color: "#22c55e", price5: 133, prob: 15, driver: "Rev CAGR 18% + OpM 7.5% + Exit P/E 17x. Client diversification success." },
      { label: "Base", color: "#f59e0b", price5: 65, prob: 52.5, driver: "Rev CAGR 13% + OpM 6.0% + Exit P/E 13x. Steady AI infrastructure adoption." },
      { label: "Bear", color: "#ef4444", price5: 26, prob: 32.5, driver: "Rev CAGR 7% + OpM 4.5% + Exit P/E 9x. Margin stagnation + client loss." }
    ],
    risks: [
      { r: "Client Concentration", prob: "Extreme", impact: "Extreme", detail: "63% single-client concentration is the largest revenue risk." },
      { r: "Margin Compression", prob: "High", impact: "Extreme", detail: "Q2 GM at 6.4% — bull case requires recovery to 8%+." },
      { r: "Audit/Delisting", prob: "High", impact: "Extreme", detail: "Ongoing governance and regulatory uncertainty." }
    ],
    verdict: "Після звіту: 'гіперзростання + тиск на маржу + 63% концентрації'. Історія виручки сильна, історія якості слабка. Це контрольована циклічна ставка, а не довгостроковий компаундер.",
    buyThesis: "Post-Earnings Verdict: Before the report: \"hypergrowth + margin upside\". After: \"hypergrowth + margin pressure + 63% concentration\". Revenue story is strong. Quality story is weak. This limits multiple expansion. Bull scenario has narrowed — needs margin recovery beyond consensus, real DCBBS contribution, and client diversification. Base case (~$55–65) is now the anchor. This is a controlled cyclical bet, not deep value, not a compounder. Three catalysts that change the math: GM back to 8%+, DCBBS double-digit profit share, client concentration below 50%."
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
    hist: [{ y: "2023", rev: 2.1, fcf: 4.5 }, { y: "2024", rev: 2.4, fcf: 6.8 }],
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