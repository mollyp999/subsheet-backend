const { useState, useRef, useCallback, useEffect } = React;

const KNOWN_FUNDERS = [
  "1ST MERCHANT FUNDING","ACH CAPITAL","CAPITAL STACK LLC","ACCORD BUSINESS FUNDING",
  "ADVANCE CAPITAL 247","ADVANCEME","AMAZON CAPITAL","AMAZON LENDING","AMAZON CAPITAL SERVICES",
  "AMERICAN ALLIED FUNDING","AMERICAN CAPITAL ADVANCE","AMERICAN FINANCE SOLUTIONS",
  "NECTAR ADVANCES","AMERICAN STIMULUS FUNDING","ASF CAPITAL","AMERIFI CAPITAL","AMERIMERCHANT","CAPIFY",
  "APEX ADVANCE","ARF FINANCIAL","VWM GROUP",
  "BALBOA CAPITAL","RECEIVABLES ADVANCE","BANKERS HEALTHCARE","BHG","BANKCARD FUNDING","BC FUNDING",
  "BEHALF","BHB FUNDING","BIG THINK CAPITAL","BITTY ADVANCE","BIZFI","BIZFUND",
  "BLUEVINE","BLUE VINE","BOCA CAPITAL","BREAKOUT CAPITAL","BRITECAP","BRITE CAP",
  "BUSHWICK MERCHANT","BUSINESS BACKER","BUSINESS CREDIT AND CAPITAL",
  "BUSINESS FINANCIAL SERVICES","FATON INC","BFS WEST","BYZFUNDER",
  "CAN CAPITAL","MINGLEWOOD","MINGLEWOOD SERVICES","SOUND GARDEN","RHINO SERVICES",
  "BIRDSONG","BIRDSONG SERVICES","AUREOLIN SERVICES","APZB INDUSTRIES","VCE ENTERPRISES","CAPCALL",
  "CAPITAL DOMAIN","CAPITAL FOR MERCHANTS","WINDSHADOW","GARDEN VENTURES","250 VENTURES",
  "THE BENJAMINS","CAPYTAL","CASH COW CAPITAL","CASHABLE","CASHABLE FUNDING",
  "CENTERBOARD FUNDING","CFG MERCHANT","CFG MERCHANT SOLUTIONS","CFGMS","CLEARCO","COBALT FUNDING",
  "COLONIAL FUNDING NETWORK","COMPLETE BUSINESS SOLUTIONS","PAR FUNDING",
  "CORONA ADVANCES","CREDIBLY","RETAILCAPITAL","RETAIL CAPITAL","DEATH VALLEY LLC","RED RIVER RIDGE",
  "DB SQUARED","DELTA BRIDGE","DF MERCHANT ADVANCE","DUVERA BILLING","DIRECT MERCHANT FUNDING","NEXUS PAYMENT",
  "ELEVATE FUNDING","EMPIRE FUNDING","EMPIRE MERCHANT ADVANCE","EPIC ADVANCE","EVEREST BUSINESS",
  "EXPRESS WORKING CAPITAL","FACTOR FUNDING","FENIX CAPITAL","FENIX CAPITAL FUNDING",
  "FIND BUSINESS CAPITAL","FIND BUSINESS","FBC","FINISH LINE CAPITAL","FLC",
  "FORA FINANCIAL","FORWARD FINANCING","FORWARD FIN",
  "FOX BUSINESS FUNDING","FOX CAPITAL","FUNDATION","FUNDING CIRCLE","FUNDBOX","FUNDKITE","FUNDX",
  "GBR FUNDING","GENESIS CAPITAL","GENESIS CAPITAL ENTERPRISES","NEXTWAVE ENTERPRISES",
  "GIBRALTAR CAPITAL","GLOBAL MERCHANT CASH","WALL FUNDING",
  "GRANTLY","GREEN GROWTH FUNDING","GREENBOX CAPITAL","GREENBOX","MERCHANT CAPITAL GROUP","GUIDANCE FUNDING",
  "HAPPY ROCK MERCHANT","HEADWAY CAPITAL","HIGHLAND HILL CAPITAL","HOP CAPITAL",
  "IN ADVANCE CAPITAL","INFINITY CAPITAL FUNDING","INSTAGREEN CAPITAL","IOU FINANCIAL","IOU CENTRAL","IRON HORSE","IRONWOOD FINANCE",
  "IRN PAYMENT","MERCHANT REWARDS NETWORK",
  "KABBAGE","AMEX KABBAGE","KALAMATA CAPITAL","KASH CAPITAL","KINGS CASH GROUP","KNIGHT CAPITAL FUNDING",
  "LAST CHANCE FUNDING","LCF GROUP","THE LCF GROUP","LEGEND FUNDING",
  "LENDIE CAPITAL","LENDIE","LENDING CLUB","LENDINGCLUB","LENDIO","LENDVO",
  "LIBERTAS","LIBERTAS FUNDING","LIQUIDIBEE","LOANME",
  "MANTIS FUNDING","MATRIX ADVANCE","MAX ADVANCE","MAX MERCHANT FUNDING",
  "MERCHANT ADVANCE FUNDING","MERCHANT ADVANCE PARTNERS","MERCHANT BUSINESS CREDIT",
  "MERCHANT CAPITAL SOURCE","MERCHANT CASH AND CAPITAL","MERCHANT CASH FUNDING",
  "MERCHANT CASH GROUP","STRATEGIC FUNDING PARTNERS","MERCHANT RESOURCES INTERNATIONAL",
  "MERIT BUSINESS FUNDING","MERK FUNDING","ML FACTORS","MONDAY FUNDING","MONEY FOR MERCHANTS",
  "MOTHER FUNDING","ROCKWALL CAPITAL","MULLIGAN FUNDING",
  "NATIONAL FUNDING","NEW ERA LENDING","NEWCO CAPITAL",
  "ONDECK","ON DECK","ON DECK CAPITAL",
  "PEARL CAPITAL","PEARL CASH","PEARL BETA FUNDING","HORIZON BUSINESS FUNDING",
  "PINNACLE MERCHANT ADVANCE","PLATINUM RAPID","POWERUP LENDING","POWER UP LENDING",
  "PREMIUM MERCHANT FUNDING","PREMIUM MERCHANT","PMF","PRINCIPIS CAPITAL","FIRST FUNDS","SMART STEP FUNDING",
  "PROSPERITY GOLD CAPITAL","PROSPERITY CAPITAL",
  "QFS CAPITAL","QUARTERSPOT","QUIK CAPITAL","STERLING FUNDING",
  "RAPID ADVANCE","RAPID FINANCE","RAPIDADVANCE","SBFN","SBFS LLC","MOPSLEY SOLUTIONS",
  "RAPID CAPITAL FUNDING","RELIANT FUNDING","ROK FINANCIAL",
  "ROMI MERCHANT","UNIVERSAL FUNDS","UNIVERSAL MERCHANT SOLUTIONS",
  "SAMSON MCA","SKYINANCE","SMART BUSINESS FUNDING","SMARTER MERCHANT","THE SMARTER MERCHANT",
  "SNAP ADVANCES","TANGO CAPITAL","ZULU CAPITAL","SOUTH END CAPITAL","SPARTAN CAPITAL","SPLASH ADVANCE",
  "STRATEGIC FUNDING SOURCE","COLONIAL FUNDING","SUPERIOR CAPITAL",
  "TORRO","TOTAL MERCHANT RESOURCES","TMR","TRUE ADVANCE","TVP CAPITAL",
  "UNIQUE FUNDING","UNITED FIRST","UF CAPITAL","UPWISE",
  "VELOCITY CAPITAL GROUP","VCG","VIKING FUNDING","VOX FUNDING",
  "WORLD BUSINESS LENDERS","WBL","XUPER FUNDING",
  "YALBER","H CAPITAL","YELLOWSTONE CAPITAL","YELLOWSTONE","EZ BUSINESS CASH",
  "ACACIA FUNDING","CASHREADY","DEALSTRUCK","FAST CAPITAL",
  "GLOBAL SWIFT FUNDING","INFINICAP","MERIT CAPITAL ADVANCE","REACH FINANCIAL","ROYAL ADVANCE","WINDSET CAPITAL",
  "SHOPIFY CAPITAL","SQUARE CAPITAL","PAYPAL WORKING CAPITAL","STRIPE CAPITAL",
  "EIDL","SBA LOAN","SBA DISB","PPP LOAN","PPP DEPOSIT","WOMPLY","BENETRENDS",
  "CORPORATION SERVICE COMPANY","CSC","CT CORPORATION"
];
const NSF_KW = ["NSF","NON-SUFFICIENT","OVERDRAFT","OD FEE","RETURNED ITEM","INSUF FUNDS","INSUFFICIENT"];
const XFER_KW = ["TRANSFER FROM","TRANSFER TO","XFER","TFR","INTERNAL TRANSFER","ONLINE TRANSFER"];
const EXCL_KW = ["TAX REFUND","IRS TREAS","INSURANCE PAYOUT","CAPITAL CONTRIBUTION","OWNER DEPOSIT","LOAN PROCEED","REVERSAL"];

const fmt = v => (v == null || v === "") ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(v);
const pct = v => (v == null || v === "") ? "—" : Math.round(v) + "%";

/* ===== STYLES ===== */
const C = { teal: "#12948A", mint: "#0fb9a0", red: "#f87171", yellow: "#fbbf24", t1: "#f1f5f9", t2: "#e2e8f0", t3: "#94a3b8", t4: "#64748b", t5: "#475569" };
const crd = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 };
const btnBase = { padding: "11px 22px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" };
const btnP = { ...btnBase, background: `linear-gradient(135deg,${C.teal},${C.mint})`, color: "#fff" };
const btnS = { ...btnBase, background: "rgba(255,255,255,0.06)", color: C.t3, border: "1px solid rgba(255,255,255,0.08)" };
const inpS = { width: "100%", padding: "10px 12px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", background: "rgba(255,255,255,0.05)", color: C.t2, boxSizing: "border-box" };
const tdS = { padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12, whiteSpace: "nowrap" };
const thS = { padding: "7px 10px", fontWeight: 600, color: C.t4, fontSize: 9, textTransform: "uppercase", letterSpacing: ".05em", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" };
const CSS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}*{box-sizing:border-box;margin:0;padding:0}input:focus,textarea:focus{border-color:#12948A!important;box-shadow:0 0 0 3px rgba(18,148,138,0.15)}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}`;

/* ===== PDF VIEWER (canvas) ===== */
function PdfViewer({ files, pdfLib }) {
  const [idx, setIdx] = useState(0);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!pdfLib || !files.length) return;
    let dead = false; setLoading(true); setPages([]);
    (async () => {
      try {
        const buf = await files[idx].arrayBuffer();
        const pdf = await pdfLib.getDocument({ data: buf }).promise;
        const imgs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          if (dead) return;
          const pg = await pdf.getPage(i);
          const vp = pg.getViewport({ scale: 1.3 });
          const cv = document.createElement("canvas"); cv.width = vp.width; cv.height = vp.height;
          await pg.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
          imgs.push(cv.toDataURL());
        }
        if (!dead) { setPages(imgs); setLoading(false); }
      } catch { if (!dead) { setPages([]); setLoading(false); } }
    })();
    return () => { dead = true; };
  }, [idx, files, pdfLib]);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [idx]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "6px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 4, overflowX: "auto", flexShrink: 0, background: "rgba(0,0,0,0.15)" }}>
        {files.map((f, i) => <button key={i} onClick={() => setIdx(i)} style={{ padding: "4px 10px", borderRadius: 5, fontSize: 10, fontWeight: idx === i ? 700 : 400, border: idx === i ? "1px solid " + C.teal : "1px solid rgba(255,255,255,0.08)", background: idx === i ? "rgba(18,148,138,0.15)" : "rgba(255,255,255,0.04)", color: idx === i ? C.mint : C.t3, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>{f.name.length > 22 ? f.name.substring(0, 20) + "…" : f.name}</button>)}
      </div>
      <div ref={ref} style={{ flex: 1, overflow: "auto", padding: 10, background: "rgba(0,0,0,0.1)" }}>
        {loading && <div style={{ textAlign: "center", padding: 40, color: C.t4 }}>Rendering PDF…</div>}
        {!loading && pages.map((src, i) => <img key={i} src={src} alt={"Page " + (i + 1)} style={{ width: "100%", marginBottom: 6, borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }} />)}
        {!loading && !pages.length && <div style={{ textAlign: "center", padding: 40, color: C.t4 }}>No pages</div>}
      </div>
    </div>
  );
}

/* ===== MAIN ===== */
function SubSheetBuilder() {
  const [step, setStep] = useState(0);
  const [stmtFiles, setStmtFiles] = useState([]);
  const [appFiles, setAppFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [appData, setAppData] = useState({ businessName: "", state: "", startDate: "", industry: "", credit: "", creditLeary: "No", notes: "" });
  const [autoFilled, setAutoFilled] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragStmt, setDragStmt] = useState(false);
  const [dragApp, setDragApp] = useState(false);
  const [showFunders, setShowFunders] = useState(false);
  const [fSearch, setFSearch] = useState("");
  const [showFlagged, setShowFlagged] = useState(null);
  const [pdfLib, setPdfLib] = useState(null);
  const [xlsxReady, setXlsxReady] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [copied, setCopied] = useState(false);
  const stmtRef = useRef(null);
  const appRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const ld = src => new Promise((res, rej) => { if (document.querySelector(`script[src="${src}"]`)) { res(); return; } const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    ld("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js").then(() => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; setPdfLib(window.pdfjsLib); }).catch(() => setError("Failed to load PDF.js"));
    ld("https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js").then(() => setXlsxReady(true)).catch(() => setError("Failed to load SheetJS"));
  }, []);

  const extractPdf = useCallback(async (file) => {
    if (!pdfLib) return "";
    const buf = await file.arrayBuffer();
    const pdf = await pdfLib.getDocument({ data: buf }).promise;
    let t = "";
    for (let i = 1; i <= pdf.numPages; i++) { const pg = await pdf.getPage(i); const c = await pg.getTextContent(); t += "\n--- PAGE " + i + " ---\n" + c.items.map(x => x.str).join(" "); }
    return t;
  }, [pdfLib]);

  const addFiles = (files, type) => {
    const pdfs = Array.from(files).filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) { setError("PDF files only"); return; }
    setError(null);
    if (type === "stmt") setStmtFiles(p => [...p, ...pdfs]); else setAppFiles(p => [...p, ...pdfs]);
  };

  const buildPrompt = (hasApp) => {
    const appExtra = hasApp ? '\n\nAPPLICATION: Extract businessName, ownerName (first and last of primary owner/guarantor), state, businessStartDate (MM/YYYY), industry, estimatedCredit, creditLeary ("Yes"/"No"), additionalNotes. Use "" if unknown.' : "";
    const appJ = hasApp ? '"applicationInfo":{"businessName":"","ownerName":"","state":"","businessStartDate":"","industry":"","estimatedCredit":"","creditLeary":"No","additionalNotes":""},' : "";
    return `You are an MCA underwriting analyst building sub sheets.

CLASSIFICATION:
1. REVENUE (include): Customer payments, CC settlements, POS, invoices, cash/check deposits, Zelle/Venmo/PayPal business receipts
2. EXCLUDE: Internal transfers, MCA funding deposits, SBA/EIDL/PPP, tax refunds, insurance, owner contributions, reversals
3. Known funders (${KNOWN_FUNDERS.length}): ${KNOWN_FUNDERS.join(",")}
4. ALIASES: CAN Capital=Minglewood/Sound Garden/Rhino/Birdsong/Aureolin; Credibly=Death Valley/Red River Ridge; Capital For Merchants=WindShadow/Garden Ventures/250 Ventures/The Benjamins; RapidAdvance=SBFN/SBFS/Mopsley; Pearl Capital=Pearl Beta/Pearl Cash/Horizon Business; Snap=Tango/Zulu Capital
5. NSF: ${NSF_KW.join(",")}
6. Transfers: ${XFER_KW.join(",")}
7. Exclude: ${EXCL_KW.join(",")}

MULTI-ACCOUNT DETECTION: Statements often contain MULTIPLE bank accounts (different account numbers like XXXXXX3106 and XXXXXX3114). You MUST detect each unique account. For each month:
- The TOP-LEVEL month fields are COMBINED TOTALS across all accounts
- Include an "accounts" array with per-account breakdowns (use last 4 digits as accountId like "3106")
- If only 1 account exists, still include it in accounts array

CRITICAL FIELDS PER MONTH (combined totals):
- startBalance, endBalance: sum across accounts
- totalDeposits, trueRevenue, depositCount, avgDailyBalance, negativeDays, nsfCount, ndbCount

AVERAGE DAILY BALANCE CALCULATION (CRITICAL — do NOT estimate):
- Most bank statements include a "Balance Summary" section with ending balances for days with activity
- You MUST scan for this section and use it to calculate ADB
- ADB = sum of ALL listed ending balances in the Balance Summary / number of listed days
- Do NOT carry forward balances to fill calendar days — just use the days given
- Example: Balance Summary lists 15 days with ending balances → sum those 15 values / 15 = ADB
- ONLY if NO daily balance data exists anywhere in the statement, fall back to (startBalance + endBalance) / 2
- Look for keywords: "Balance Summary", "Daily Balance", "Ending Balance", "Average Daily Balance", "Average Collected Balance"
- If the bank prints its own "Average Daily Balance" line, USE THAT EXACT NUMBER

FREQUENCY CLASSIFICATION (CRITICAL — follow strictly by debit COUNT per month):
- 18-22 debits/month to same funder = DAILY MCA → paymentFrequency: "daily-MCA"
- 8-12 debits/month to same funder = TWICE-WEEKLY MCA → paymentFrequency: "2x-weekly-MCA"  
- 4-6 debits/month to same funder = WEEKLY → paymentFrequency: "weekly-MCA"
- 2-3 debits/month to same funder = BI-WEEKLY → paymentFrequency: "biweekly-loan"
- 1 debit/month to same funder = MONTHLY → paymentFrequency: "monthly-loan"
- DO NOT call something "daily" if there are only 4-6 debits per month — that is WEEKLY
- DO NOT call something "weekly" if there are only 1-2 debits per month — that is monthly or bi-weekly
- The COUNT of debits per month determines frequency, not your assumption about the funder

LEVERAGE CALCULATION (IMPORTANT):
Leverage = PROJECTED full-month debit burden / trueRevenue × 100
- ONLY count MCA advance repayments and loan repayments toward leverage
- Do NOT count PSF (Payment Split Funding), processing fees, merchant processing debits, or service fees
- "PREMIUM MERCHANT FUNDING", "PMF", "PREMIUM MERCHANT" debits are PSF/processing splits, NOT lending. Exclude from leverage and do NOT list as active advances.
- For each active MCA/loan funder, determine payment frequency (daily/weekly/monthly)
- Project to full month: daily payment × 22 business days, weekly × 4.33, monthly × 1
- Sum ALL projected MCA/loan funder debit burdens for the month
- Divide by trueRevenue and multiply by 100
- Example: $777/day funder → $777 × 22 = $17,094 projected → $17,094 / $187,505 revenue = 9.1% ≈ 10%

MULTI-ACCOUNT LEVERAGE RULE (CRITICAL):
- The TOP-LEVEL monthly leverage must be calculated against the PRIMARY OPERATING ACCOUNT's trueRevenue only — the account with the highest deposit volume where MCA debits actually hit
- Do NOT average leverage across accounts or use combined revenue as the denominator
- Secondary/savings accounts with minimal activity should NOT dilute the leverage calculation
- Example: If operating acct has $187K revenue and $17K in MCA debits = 10% leverage. A savings acct with $12 deposits and 0 debits should NOT bring the average down to 3%. The correct top-level leverage is 10%.
- Per-account leverage in the accounts array: calculate individually for each account
- summary.avgLeverage should reflect the primary operating account leverage averaged across months

ACTIVE ADVANCE THRESHOLD (IMPORTANT):
- Daily MCA (18-22 debits/month): ACTIVE if present in most recent month
- Weekly MCA (4-6 debits/month): ACTIVE if present in most recent month
- Bi-weekly loan (2-3 debits/month): ACTIVE if present in most recent month
- Monthly loan (1 debit/month): ACTIVE if seen across 2+ consecutive months
- If a funder has debits in the MOST RECENT statement month, it IS active regardless of history
- A single one-time debit with no recurring pattern = NOT active, just noted
- PSF/processing pulls (PREMIUM MERCHANT, PMF) are NEVER active advances

FUNDED AMOUNT RULES (CRITICAL):
- You CANNOT determine funded amounts from bank statements alone
- Set fundedAmount to 0 (zero) — do NOT guess round numbers like $50K, $75K, $100K
- The only way to know funded amount is from the application or funding contract, not from payment patterns
- estimatedBalance: set to "unknown" — do NOT calculate balance from guessed funded amounts
- Focus on what IS visible: payment amount, frequency, and count

LOAN vs MCA CLASSIFICATION (CRITICAL):
- JPMorgan Chase, Wells Fargo, US Bank, Bank of America, TD Bank, etc. = BANK LOANS/LINES, not MCA
- Westlake Financial, Balboa Capital, CIT = EQUIPMENT/AUTO FINANCE, not MCA
- OnDeck, Kabbage, BlueVine, Fundbox = FINTECH LENDING (term loans or LOC)
- Set paymentFrequency to include type: "weekly-MCA", "daily-MCA", "monthly-loan", "monthly-equipment", "monthly-bank-loan"
- This distinction matters for underwriting — MCAs and bank loans are weighted differently

REFINANCE DETECTION (CRITICAL):
- If a funder's per-payment amount CHANGES between months, flag as potential refinance
- If a funder disappears for 1+ months then reappears with different payment amount = REFI
- If a funder's debit count suddenly increases AND a large deposit from same/related funder appears = REFI (they got new funding)
- If payments to a funder stop AND a new funder with similar payment pattern starts in same period = POSSIBLE PAYOFF + NEW POSITION
- Add "refiSuspected": true/false to each advance
- Add "refiNotes": "" explaining why (e.g., "Payment changed from $1,500 to $2,215 in Nov 2025, no visible funding deposit — likely refinanced")
- In notedTransactions, if payment amounts change between periods for same funder, note the change

PAYMENT COUNT RULES:
- paymentsMade must ONLY count payments actually visible in the provided statements
- Do NOT extrapolate payments before the first statement month
- If statements cover Oct-Jan and you see 19 payments, paymentsMade = 19, not a guess of total lifetime payments

PER-ACCOUNT FIELDS (inside accounts array):
- accountId (last 4 digits), startBalance, endBalance, totalDeposits, trueRevenue, depositCount, avgDailyBalance, negativeDays, leverage (projected for that account only), nsfCount, ndbCount

NOTED TRANSACTIONS: For EVERY funder/lender debit pattern per month, create entry with:
- period, accountId, funderName, debitCount (number of pulls that month)
- perPayment: the INDIVIDUAL payment amount per pull (e.g. $2,215.27), NOT the total
- totalDebited: debitCount × perPayment (for reference only)
- Example: CFGMS pulls 5 times at $2,215.27 each → debitCount:5, perPayment:2215.27, totalDebited:11076.35

MISSED/BOUNCED PAYMENT DETECTION (IMPORTANT):
- Look for NSF or return entries that reference a known funder name (e.g. "NSF CFGMS", "RETURN SBFS", "ACH RETURN")
- Look for debit attempts followed by same-amount credits within 1-2 days (failed ACH → returned)
- Look for gaps in otherwise consistent payment patterns (e.g. funder pulls weekly but skips a week)
- For each detected miss/bounce, add to "missedPayments" array in the advance object:
  missedPayments: [{"date":"2025-11-15","amount":2215.27,"reason":"NSF return"}]
- Also flag in notedTransactions with a note field: "1 NSF return on 11/15"
- In the AI notes, call out any missed/bounced payments explicitly — this is a major underwriting red flag

DETECTION: Classify frequency STRICTLY by debits-per-month: 18-22=daily, 8-12=2x-weekly, 4-6=weekly, 2-3=biweekly, 1=monthly. Count ONLY visible payments as paymentsMade.${appExtra}

RESPOND ONLY VALID JSON — no comments, no trailing commas, all keys double-quoted, all strings double-quoted, no JavaScript syntax. Output MUST parse with JSON.parse():
{${appJ}"months":[{"month":"Jun 2025","startBalance":76360,"endBalance":35123,"totalDeposits":187517,"trueRevenue":187517,"depositCount":53,"avgDailyBalance":107000,"negativeDays":0,"leverage":10,"nsfCount":0,"ndbCount":0,"accounts":[{"accountId":"3106","startBalance":66894,"endBalance":21907,"totalDeposits":12,"trueRevenue":12,"depositCount":1,"avgDailyBalance":71421,"negativeDays":0,"leverage":0,"nsfCount":0,"ndbCount":0},{"accountId":"3114","startBalance":9465,"endBalance":13216,"totalDeposits":187505,"trueRevenue":187505,"depositCount":52,"avgDailyBalance":35578,"negativeDays":0,"leverage":10,"nsfCount":0,"ndbCount":0}],"excludedDeposits":[],"flaggedDeposits":[]}],"notedTransactions":[{"period":"06/01/2025-06/30/2025","accountId":"3114","funderName":"SBFS LLC","debitCount":5,"perPayment":777.01,"totalDebited":3885.07,"note":""}],"activeAdvances":[{"funderName":"SBFS LLC (RapidAdvance)","fundedDate":"unknown","fundedAmount":0,"paymentAmount":777,"paymentFrequency":"weekly-MCA","paymentsMade":5,"estimatedBalance":"unknown","isActive":true,"refiSuspected":false,"refiNotes":"","missedPayments":[]}],"pastAdvances":[],"summary":{"totalMonths":6,"avgMonthlyDeposits":42000,"avgMonthlyRevenue":40000,"avgDailyBalance":35000,"totalNSFs":0,"totalNDBs":0,"avgNegativeDays":0,"activePositionCount":2,"totalDailyDebitLoad":700,"avgLeverage":8,"notes":"Observations"}}`;
  };

  const analyze = async () => {
    if (!stmtFiles.length || !pdfLib) return;
    setStep(1); setError(null); setProgress(0);
    try {
      setStatus("Extracting bank statement text…");
      let stmtText = "";
      for (let i = 0; i < stmtFiles.length; i++) { setProgress(Math.round((i / stmtFiles.length) * 25)); stmtText += "\n\n=== BANK STATEMENT: " + stmtFiles[i].name + " ===\n" + await extractPdf(stmtFiles[i]); }
      let appText = "";
      if (appFiles.length) { setStatus("Extracting application…"); for (let i = 0; i < appFiles.length; i++) { setProgress(28 + Math.round((i / appFiles.length) * 7)); appText += "\n\n=== APPLICATION: " + appFiles[i].name + " ===\n" + await extractPdf(appFiles[i]); } }
      setProgress(35); setStatus("AI analyzing transactions…");
      const full = stmtText + appText;
      const trunc = full.length > 180000 ? full.substring(0, 180000) + "\n[TRUNCATED]" : full;
      const resp = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, system: buildPrompt(appFiles.length > 0), messages: [{ role: "user", content: "Analyze:\n\n" + trunc }] }) });
      setProgress(75);
      if (!resp.ok) { const e = await resp.json().catch(() => ({})); throw new Error("API " + resp.status + ": " + (e.error?.message || "Unknown")); }
      const data = await resp.json();
      const txt = data.content.find(c => c.type === "text")?.text || "";
      let js = txt; const mm = txt.match(/```(?:json)?\s*([\s\S]*?)```/); if (mm) js = mm[1];
      js = js.trim(); const si = js.indexOf("{"); const ei = js.lastIndexOf("}");
      if (si === -1 || ei === -1) throw new Error("No JSON in AI response. Try again.");
      let raw = js.substring(si, ei + 1);
      console.log("AI JSON length:", raw.length, "\nFirst 500:", raw.substring(0, 500));

      // Robust JSON repair function
      const repairJSON = (s) => {
        // Phase 1: Strip comments
        let out = "", inStr = false, strCh = null, esc = false;
        for (let i = 0; i < s.length; i++) {
          const ch = s[i];
          if (esc) { out += ch; esc = false; continue; }
          if (ch === "\\") { out += ch; esc = true; continue; }
          if (inStr) {
            if (ch === strCh) { inStr = false; out += '"'; } // close with double-quote
            else if (ch === "\n" || ch === "\r") { out += "\\n"; } // escape newlines in strings
            else { out += ch; }
            continue;
          }
          // Not in string
          if (ch === '"' || ch === "'") { inStr = true; strCh = ch; out += '"'; continue; } // open with double-quote
          if (ch === "/" && s[i+1] === "/") { while (i < s.length && s[i] !== "\n") i++; continue; }
          if (ch === "/" && s[i+1] === "*") { i += 2; while (i < s.length && !(s[i] === "*" && s[i+1] === "/")) i++; i++; continue; }
          out += ch;
        }
        // Phase 2: Fix unquoted keys and trailing commas
        out = out.replace(/([{,])(\s*)([a-zA-Z_$]\w*)(\s*):/g, '$1$2"$3"$4:');
        // Phase 3: Fix double-double quotes from already-quoted keys getting re-quoted
        out = out.replace(/""([^"]+)""/g, '"$1"');
        // Phase 4: Trailing commas
        out = out.replace(/,(\s*[}\]])/g, "$1");
        // Phase 5: Remove any BOM or zero-width chars
        out = out.replace(/[\uFEFF\u200B-\u200D\u2060]/g, "");
        return out;
      };

      let parsed;
      try { parsed = JSON.parse(raw); } catch (e1) {
        console.warn("Direct parse failed:", e1.message);
        const repaired = repairJSON(raw);
        console.log("Repaired JSON first 500:", repaired.substring(0, 500));
        try { parsed = JSON.parse(repaired); } catch (e2) {
          console.warn("Repair parse failed:", e2.message);
          // Last resort: flatten to single line
          const flat = repaired.replace(/[\n\r]/g, " ").replace(/\s+/g, " ");
          try { parsed = JSON.parse(flat); } catch (e3) {
            console.error("ALL parse attempts failed.\nOriginal error:", e1.message, "\nRepair error:", e2.message, "\nFlat error:", e3.message, "\nRaw first 1000:", raw.substring(0, 1000));
            throw new Error("JSON parse failed: " + e1.message + ". Check browser console (F12) for raw AI output.");
          }
        }
      }
      setResult(parsed);
      if (parsed.applicationInfo) { const ai = parsed.applicationInfo; setAppData(p => ({ businessName: ai.businessName || p.businessName, state: ai.state || p.state, startDate: ai.businessStartDate || p.startDate, industry: ai.industry || p.industry, credit: ai.estimatedCredit || p.credit, creditLeary: ai.creditLeary || p.creditLeary, notes: ai.additionalNotes || p.notes })); setAutoFilled(true); }

      // Background court/judgment screening
      setProgress(85); setStatus("Screening public records…");
      const bizName = parsed.applicationInfo?.businessName || appData.businessName || "";
      const ownerName = parsed.applicationInfo?.ownerName || "";
      if (bizName) {
        try {
          const screenResp = await fetch("/api/screen", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514", max_tokens: 4000,
              tools: [{ type: "web_search_20250305", name: "web_search" }],
              messages: [{ role: "user", content: `You are a merchant cash advance underwriting screener. Search for public records on this business to identify risk factors.

Business: "${bizName}"
${ownerName ? 'Owner/Principal: "' + ownerName + '"' : ""}

Run these searches and report findings:
1. Search for: ${bizName} MCA lawsuit judgment
2. Search for: ${bizName} UCC filing lien
3. Search for: ${bizName} default breach
4. Search for: "${bizName}" New York court
${ownerName ? '5. Search for: "' + ownerName + '" merchant cash advance judgment\n6. Search for: "' + ownerName + '" UCC filing' : ""}

RESPOND ONLY VALID JSON:
{
  "businessName": "${bizName}",
  "searchesRun": 4,
  "findings": [
    {"type": "judgment|ucc|lawsuit|default|tax_lien|other", "source": "where found", "summary": "brief description", "severity": "high|medium|low", "date": "if known"}
  ],
  "riskLevel": "clear|low|medium|high|critical",
  "riskSummary": "One sentence overall assessment",
  "rawNotes": "Any additional context from search results"
}

If no negative findings, return findings as empty array and riskLevel as "clear".
Do NOT fabricate findings. Only report what you actually find in search results.` }]
            })
          });
          if (screenResp.ok) {
            const screenData = await screenResp.json();
            const screenTxt = screenData.content.filter(c => c.type === "text").map(c => c.text).join("\n");
            let screenJs = screenTxt; const sm = screenTxt.match(/```(?:json)?\s*([\s\S]*?)```/); if (sm) screenJs = sm[1];
            screenJs = screenJs.trim();
            const ssi = screenJs.indexOf("{"); const sei = screenJs.lastIndexOf("}");
            if (ssi !== -1 && sei !== -1) {
              let screenRaw = screenJs.substring(ssi, sei + 1);
              let screenParsed;
              try { screenParsed = JSON.parse(screenRaw); } catch(e) {
                try { screenParsed = JSON.parse(repairJSON(screenRaw)); } catch(e2) { screenParsed = null; }
              }
              if (screenParsed) setScreening(screenParsed);
            }
          }
        } catch (e) { console.warn("Screening failed (non-critical):", e.message); }
      }

      setProgress(100); setStatus("Complete!");
      setTimeout(() => setStep(2), 600);
    } catch (e) { console.error(e); setError("Processing failed: " + e.message); setStep(0); }
  };

  const buildSheetData = () => {
    if (!result) return [];
    const months = result.months || [], adv = result.activeAdvances || [], past = result.pastAdvances || [], noted = result.notedTransactions || [];
    const $ = v => (v == null || v === "" || v === 0) ? "$0" : "$" + Math.round(Number(v)).toLocaleString("en-US");
    const d = [];

    // Title
    d.push(["Name of Business:", "", "", "", appData.businessName || ""]);
    d.push([]);

    // Statement Analysis section
    d.push(["BANK STATEMENT ANALYSIS"]);
    d.push(["Statements", "Period", "Start Balance", "End Balance", "Total Deposits", "True Revenue", "Leverage", "# Deposit", "ADB", "# Negs", "# NSF"]);

    // Per month: account rows then combined
    let totStartBal = 0, totEndBal = 0, totDep = 0, totRev = 0, totAvgBal = 0, totNegs = 0, totNsf = 0, totNdb = 0, totDeps = 0, monthCount = 0;
    months.forEach(m => {
      const accts = m.accounts || [];
      // Individual account rows
      accts.forEach(a => {
        d.push([
          "XXXXXXX" + (a.accountId || "????"),
          m.month,
          $(a.startBalance), $(a.endBalance), $(a.totalDeposits), $(a.trueRevenue),
          a.leverage ? a.leverage + "%" : "",
          a.depositCount || 0,
          $(a.avgDailyBalance),
          a.negativeDays || 0,
          a.nsfCount || 0
        ]);
      });
      // If no accounts array, just show combined
      if (accts.length === 0) {
        d.push([
          "",
          m.month,
          $(m.startBalance), $(m.endBalance), $(m.totalDeposits), $(m.trueRevenue),
          m.leverage ? m.leverage + "%" : "0%",
          m.depositCount || 0,
          $(m.avgDailyBalance),
          m.negativeDays || 0,
          m.nsfCount || 0
        ]);
      }
      // Combined total row (only if multiple accounts)
      if (accts.length > 1) {
        const mLabel = m.month.split(" ")[0].toUpperCase();
        d.push([
          "",
          mLabel,
          $(m.startBalance), $(m.endBalance), $(m.totalDeposits), $(m.trueRevenue),
          m.leverage ? m.leverage + "%" : "0%",
          m.depositCount || 0,
          $(m.avgDailyBalance),
          m.negativeDays || 0,
          m.nsfCount || 0
        ]);
      }
      totStartBal += (m.startBalance || 0);
      totEndBal += (m.endBalance || 0);
      totDep += (m.totalDeposits || 0);
      totRev += (m.trueRevenue || 0);
      totAvgBal += (m.avgDailyBalance || 0);
      totNegs += (m.negativeDays || 0);
      totNsf += (m.nsfCount || 0);
      totNdb += (m.ndbCount || 0);
      totDeps += (m.depositCount || 0);
      monthCount++;
    });

    // Averages row
    if (monthCount > 0) {
      d.push([
        "Averages", "",
        $(totStartBal / monthCount), $(totEndBal / monthCount), $(totDep / monthCount), $(totRev / monthCount),
        "",
        Math.round(totDeps / monthCount),
        $(totAvgBal / monthCount),
        Math.round(totNegs / monthCount * 10) / 10,
        Math.round(totNsf / monthCount * 10) / 10
      ]);
    }
    d.push([]);

    // Additional Docs
    d.push(["ADDITIONAL DOCS"]);
    d.push([]);

    // Noted Transactions
    d.push(["NOTED TRANSACTIONS"]);
    d.push(["Period", "Account Number", "", "Funder", "Count × Payment", "Notes"]);
    if (noted.length) {
      noted.forEach(n => {
        d.push([n.period, n.accountId || "", "", n.funderName, n.debitCount + " × " + $(n.perPayment || n.totalDebited), n.note || ""]);
      });
    }
    d.push([]);

    // Detected Advances
    d.push(["DETECTED ADVANCES"]);
    d.push(["Active?", "Type", "Funder", "Payment", "Frequency", "# Pmts", "Est Balance", "Refi?"]);
    const all = [...adv, ...past];
    if (all.length) {
      all.forEach(a => {
        const freq = a.paymentFrequency || "";
        const isMCA = freq.includes("MCA") || freq === "daily" || freq === "weekly";
        const typeLabel = freq.includes("bank") ? "Bank Loan" : freq.includes("equipment") ? "Equipment" : freq.includes("loan") ? "Term Loan" : isMCA ? "MCA" : "Advance";
        const bal = (a.estimatedBalance === "unknown" || !a.estimatedBalance) ? "Unknown" : $(a.estimatedBalance);
        d.push([
          a.isActive ? "YES" : "NO",
          typeLabel,
          a.funderName || "",
          $(a.paymentAmount),
          freq.replace(/-MCA|-loan|-bank-loan|-equipment/g, ""),
          a.paymentsMade || "",
          a.isActive ? bal : "$0",
          a.refiSuspected ? "YES - " + (a.refiNotes || "") : ""
        ]);
      });
    } else {
      d.push(["None detected"]);
    }
    d.push([]);

    // Application Info
    d.push(["FROM APPLICATION"]);
    d.push(["State", appData.state || ""]);
    d.push(["Start Date", appData.startDate || ""]);
    d.push(["Industry", appData.industry || ""]);
    d.push(["Credit", appData.credit || ""]);
    d.push(["Credit Leary", appData.creditLeary || ""]);
    d.push([]);
    d.push(["Notes:", appData.notes || ""]);
    d.push([]);

    // Excluded
    d.push(["EXCLUDED DEPOSITS"]);
    d.push(["Month", "Amount", "Description", "Reason"]);
    months.forEach(m => (m.excludedDeposits || []).forEach(e => d.push([m.month, $(e.amount), e.description, e.reason])));
    d.push([]);

    // Flagged
    d.push(["FLAGGED DEPOSITS"]);
    d.push(["Month", "Amount", "Description", "Reason"]);
    months.forEach(m => (m.flaggedDeposits || []).forEach(f => d.push([m.month, $(f.amount), f.description, f.reason])));
    d.push([]);

    // AI Notes
    if (result.summary?.notes) {
      d.push(["AI ANALYSIS NOTES"]);
      d.push([result.summary.notes]);
    }
    d.push([]);

    // Public Records Screen
    if (screening) {
      d.push(["PUBLIC RECORDS SCREEN"]);
      d.push(["Risk Level", (screening.riskLevel || "unknown").toUpperCase()]);
      d.push(["Summary", screening.riskSummary || ""]);
      if (screening.findings && screening.findings.length > 0) {
        d.push(["Type", "Severity", "Summary", "Source", "Date"]);
        screening.findings.forEach(f => d.push([f.type || "", f.severity || "", f.summary || "", f.source || "", f.date || ""]));
      } else { d.push(["No negative findings"]); }
      d.push(["", "Web search only — verify with JudyRecords, UniCourt, or NY eCourts"]);
    }
    return d;
  };

  const [htmlReport, setHtmlReport] = useState(null);
  const [screening, setScreening] = useState(null);

  const download = () => {
    if (!result) return;
    setStep(4);
  };

  const generateHTML = () => {
    if (!result) return;
    const months = result.months || [], adv = result.activeAdvances || [], past = result.pastAdvances || [], noted = result.notedTransactions || [];
    const $ = v => (v == null || v === "" || isNaN(v)) ? "$0" : "$" + Math.round(Number(v)).toLocaleString("en-US");
    const mc = months.length;
    const avg = (fn) => mc ? Math.round(months.reduce((s, m) => s + (fn(m) || 0), 0) / mc) : 0;
    const allAdv = [...adv, ...past];

    const acctRows = months.map(m => {
      const accts = m.accounts || [];
      let rows = "";
      accts.forEach(a => {
        rows += "<tr class='acct'><td>XXXXXXX" + (a.accountId || "????") + "</td><td>" + m.month + "</td><td>" + $(a.startBalance) + "</td><td>" + $(a.endBalance) + "</td><td>" + $(a.totalDeposits) + "</td><td class='rev'>" + $(a.trueRevenue) + "</td><td class='lev" + ((a.leverage||0)>12?" hi":(a.leverage||0)>6?" med":"") + "'>" + (a.leverage ? a.leverage+"%" : "") + "</td><td>" + (a.depositCount||0) + "</td><td>" + $(a.avgDailyBalance) + "</td><td class='" + ((a.negativeDays||0)>0?"neg":"") + "'>" + (a.negativeDays||0) + "</td><td class='" + (a.nsfCount>0?"neg":"") + "'>" + (a.nsfCount||0) + "</td></tr>";
      });
      if (!accts.length) {
        rows += "<tr><td></td><td>" + m.month + "</td><td>" + $(m.startBalance) + "</td><td>" + $(m.endBalance) + "</td><td>" + $(m.totalDeposits) + "</td><td class='rev'>" + $(m.trueRevenue) + "</td><td class='lev'>" + (m.leverage?m.leverage+"%":"0%") + "</td><td>" + (m.depositCount||0) + "</td><td>" + $(m.avgDailyBalance) + "</td><td>" + (m.negativeDays||0) + "</td><td>" + (m.nsfCount||0) + "</td></tr>";
      }
      if (accts.length > 1) {
        rows += "<tr class='combined'><td></td><td>" + m.month.split(" ")[0].toUpperCase() + "</td><td>" + $(m.startBalance) + "</td><td>" + $(m.endBalance) + "</td><td>" + $(m.totalDeposits) + "</td><td class='rev'>" + $(m.trueRevenue) + "</td><td class='lev" + ((m.leverage||0)>12?" hi":(m.leverage||0)>6?" med":"") + "'>" + (m.leverage?m.leverage+"%":"0%") + "</td><td>" + (m.depositCount||0) + "</td><td>" + $(m.avgDailyBalance) + "</td><td>" + (m.negativeDays||0) + "</td><td>" + (m.nsfCount||0) + "</td></tr>";
      }
      return rows;
    }).join("");

    const notedRows = noted.length ? noted.map(n => "<tr><td>"+(n.period||"")+"</td><td>"+(n.accountId||"")+"</td><td>"+(n.funderName||"")+"</td><td class='noted-amt'>"+(n.debitCount||0)+" × "+$(n.perPayment||n.totalDebited)+"</td><td>"+(n.note||"")+"</td></tr>").join("") : "<tr><td colspan='5' style='color:#999'>None</td></tr>";
    const advRows = allAdv.length ? allAdv.map(a => { const freq = a.paymentFrequency || ""; const isMCA = freq.includes("MCA") || freq === "daily" || freq === "weekly"; const typeLabel = freq.includes("bank") ? "Bank Loan" : freq.includes("equipment") ? "Equipment" : freq.includes("loan") ? "Term Loan" : isMCA ? "MCA" : "Advance"; const bal = (a.estimatedBalance === "unknown" || !a.estimatedBalance) ? "Unknown" : $(a.estimatedBalance); const freqClean = freq.replace(/-MCA|-loan|-bank-loan|-equipment/g, ""); let row = "<tr><td class='"+(a.isActive?"yes":"no")+"'>"+(a.isActive?"YES":"NO")+(a.refiSuspected?" <span style='color:#B45309;font-size:8px'>REFI?</span>":"")+"</td><td class='funder'>"+typeLabel+"</td><td>"+(a.funderName||"")+"</td><td>"+$(a.paymentAmount)+"/"+freqClean+"</td><td>"+(a.paymentsMade||"")+"</td><td>"+(a.isActive?bal:"$0")+"</td></tr>"; if(a.refiSuspected&&a.refiNotes) row+="<tr><td colspan='6' style='font-size:9px;color:#B45309;padding-left:20px;border-top:none'>⚠️ "+a.refiNotes+"</td></tr>"; if(a.missedPayments&&a.missedPayments.length) row+="<tr><td colspan='6' style='font-size:9px;color:#CC0000;padding-left:20px;border-top:none;font-weight:700'>🚨 "+a.missedPayments.length+" MISSED/BOUNCED: "+a.missedPayments.map(mp=>mp.date+" "+$(mp.amount)+" ("+mp.reason+")").join(", ")+"</td></tr>"; return row; }).join("") : "<tr><td colspan='6' style='color:#999'>None</td></tr>";
    const exclRows = months.flatMap(m => (m.excludedDeposits||[]).map(e => "<tr><td>"+m.month+"</td><td>"+$(e.amount)+"</td><td>"+(e.description||"")+"</td><td>"+(e.reason||"")+"</td></tr>")).join("") || "<tr><td colspan='4' style='color:#999'>None</td></tr>";
    const flagRows = months.flatMap(m => (m.flaggedDeposits||[]).map(f => "<tr><td>"+m.month+"</td><td>"+$(f.amount)+"</td><td>"+(f.description||"")+"</td><td>"+(f.reason||"")+"</td></tr>")).join("") || "<tr><td colspan='4' style='color:#999'>None</td></tr>";

    const css = "body{font-family:Arial,sans-serif;margin:0;padding:20px 28px;background:#fff;color:#333;font-size:11px}" +
      "h1{color:#12948A;font-size:18px;margin:0 0 2px;border-bottom:3px solid #12948A;padding-bottom:6px}" +
      "h2{color:#12948A;font-size:13px;margin:22px 0 6px;border-bottom:2px solid #12948A;padding-bottom:4px}" +
      ".biz{font-size:14px;color:#333;margin-bottom:16px}.date{font-size:9px;color:#999;margin-bottom:12px}" +
      "table{width:100%;border-collapse:collapse;margin-bottom:8px}" +
      "th{background:#4A4A6A;color:#fff;padding:5px 8px;font-size:9px;text-transform:uppercase;text-align:center}" +
      "td{padding:4px 8px;border:1px solid #e0e0e0;text-align:right;font-size:10px}" +
      "td:first-child,td:nth-child(2){text-align:left}tr:nth-child(even){background:#f8f9fa}" +
      "tr.acct td{color:#666;font-size:9px}" +
      "tr.combined{background:#e8f5f3!important;font-weight:700;color:#12948A}" +
      "tr.combined td{border-top:2px solid #12948A;font-size:10px}" +
      ".avg{background:#f3e8ff!important;font-weight:700;color:#6B21A8}" +
      ".rev{color:#006600;font-weight:700}" +
      ".lev{font-weight:700}.lev.hi{color:#CC0000}.lev.med{color:#B45309}" +
      ".neg{color:#CC0000;font-weight:700}" +
      ".yes{color:#006600;font-weight:700;text-align:center}.no{color:#999;text-align:center}" +
      ".funder{font-weight:600}.noted-amt{color:#CC0000;font-weight:600}" +
      ".app-grid{display:grid;grid-template-columns:120px 1fr;gap:2px 12px;margin:6px 0}" +
      ".app-lbl{font-weight:700;color:#555;padding:3px 0}.app-val{padding:3px 0}" +
      ".notes{background:#f8f9fa;border:1px solid #e0e0e0;border-left:3px solid #12948A;padding:8px 12px;font-size:10px;line-height:1.6;margin:8px 0;border-radius:4px}" +
      "@media print{.no-print{display:none!important}body{padding:10px 16px}}";

    const body =
      "<h1>Sub Sheet Analysis</h1>" +
      "<div class='biz'>" + (appData.businessName||"") + "</div>" +
      "<div class='date'>Generated: " + new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}) + "</div>" +
      "<h2>Bank Statement Analysis</h2>" +
      "<table><thead><tr><th>Statements</th><th>Period</th><th>Start Bal</th><th>End Bal</th><th>Total Dep</th><th>True Revenue</th><th>Leverage</th><th># Dep</th><th>Avg Daily Bal</th><th># Negs</th><th># NSF</th></tr></thead><tbody>" + acctRows +
      "<tr class='avg'><td>Averages</td><td></td><td>"+$(avg(m=>m.startBalance))+"</td><td>"+$(avg(m=>m.endBalance))+"</td><td>"+$(avg(m=>m.totalDeposits))+"</td><td>"+$(avg(m=>m.trueRevenue))+"</td><td></td><td>"+avg(m=>m.depositCount)+"</td><td>"+$(avg(m=>m.avgDailyBalance))+"</td><td>"+avg(m=>m.negativeDays)+"</td><td>"+avg(m=>m.nsfCount)+"</td></tr></tbody></table>" +
      "<h2>Noted Transactions</h2><table><thead><tr><th>Period</th><th>Account</th><th>Funder</th><th>Count × Payment</th><th>Notes</th></tr></thead><tbody>" + notedRows + "</tbody></table>" +
      "<h2>Detected Advances</h2><table><thead><tr><th>Active?</th><th>Type</th><th>Funder</th><th>Payment</th><th># Pmts</th><th>Est Balance</th></tr></thead><tbody>" + advRows + "</tbody></table>" +
      "<h2>From Application</h2><div class='app-grid'>" +
      "<span class='app-lbl'>State</span><span class='app-val'>"+(appData.state||"")+"</span>" +
      "<span class='app-lbl'>Start Date</span><span class='app-val'>"+(appData.startDate||"")+"</span>" +
      "<span class='app-lbl'>Industry</span><span class='app-val'>"+(appData.industry||"")+"</span>" +
      "<span class='app-lbl'>Credit</span><span class='app-val'>"+(appData.credit||"")+"</span>" +
      "<span class='app-lbl'>Credit Leary</span><span class='app-val'>"+(appData.creditLeary||"")+"</span></div>" +
      (appData.notes ? "<div class='notes'><strong>Notes:</strong> "+appData.notes.replace(/</g,"&lt;")+"</div>" : "") +
      "<h2>Excluded Deposits</h2><table><thead><tr><th>Month</th><th>Amount</th><th>Description</th><th>Reason</th></tr></thead><tbody>" + exclRows + "</tbody></table>" +
      "<h2>Flagged Deposits</h2><table><thead><tr><th>Month</th><th>Amount</th><th>Description</th><th>Reason</th></tr></thead><tbody>" + flagRows + "</tbody></table>" +
      (result.summary?.notes ? "<h2>AI Analysis Notes</h2><div class='notes'>"+result.summary.notes.replace(/</g,"&lt;")+"</div>" : "") +
      (screening && screening.findings ? "<h2>Public Records Screen</h2><div class='notes' style='border-left-color:" + (screening.riskLevel === "clear" ? "#006600" : screening.riskLevel === "low" ? "#B45309" : "#CC0000") + "'><strong>Risk Level: " + (screening.riskLevel || "unknown").toUpperCase() + "</strong><br>" + (screening.riskSummary || "") + (screening.findings.length ? "<br><br>" + screening.findings.map(f => "<strong>" + (f.type || "").toUpperCase().replace("_"," ") + "</strong>: " + (f.summary || "") + (f.source ? " <em>(Source: " + f.source + ")</em>" : "") + (f.date ? " [" + f.date + "]" : "")).join("<br>") : "<br>No negative findings.") + "<br><br><em style='font-size:8px;color:#999'>Web search screen only — verify with JudyRecords, UniCourt, or NY eCourts.</em></div>" : "");

    setHtmlReport({ css, body });
  };

  const copyCSV = () => {
    const d = buildSheetData();
    const csv = d.map(r => r.map(c => { const s = String(c == null ? "" : c); return s.includes(",") || s.includes('"') || s.includes("\t") ? '"' + s.replace(/"/g, '""') + '"' : s; }).join("\t")).join("\n");
    try {
      const ta = document.createElement("textarea"); ta.value = csv; ta.style.cssText = "position:fixed;left:-9999px;top:-9999px"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
      setCopied(true);
    } catch (e) {
      navigator.clipboard.writeText(csv).then(() => setCopied(true)).catch(() => {});
    }
    setTimeout(() => setCopied(false), 4000);
  };

  const reset = () => { setStep(0); setStmtFiles([]); setAppFiles([]); setResult(null); setAppData({ businessName: "", state: "", startDate: "", industry: "", credit: "", creditLeary: "No", notes: "" }); setAutoFilled(false); setError(null); setViewerOpen(false); setCopied(false); setHtmlReport(null); setScreening(null); };

  const filteredFunders = KNOWN_FUNDERS.filter(f => f.toLowerCase().includes(fSearch.toLowerCase()));

  const StepDots = () => <div style={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>{["Upload", "Analyze", "Review", "Export"].map((l, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 22, height: 22, borderRadius: "50%", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: step > i ? C.teal : step === i ? "rgba(18,148,138,0.3)" : "rgba(255,255,255,0.06)", color: step > i ? "#fff" : step === i ? C.mint : C.t5, border: step === i ? "2px solid " + C.teal : "2px solid transparent" }}>{i + 1}</div><span style={{ fontSize: 10, color: step >= i ? C.t2 : C.t5, fontWeight: step === i ? 700 : 400 }}>{l}</span>{i < 3 && <div style={{ width: 12, height: 2, background: step > i ? C.teal : "rgba(255,255,255,0.06)", borderRadius: 1 }} />}</div>)}</div>;

  const Header = () => <div style={{ padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, flexShrink: 0 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg," + C.teal + "," + C.mint + ")", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>SS</div><div><div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Sub Sheet Builder</div><div style={{ fontSize: 9, color: C.t4 }}>{KNOWN_FUNDERS.length} funders</div></div></div><StepDots /></div>;

  const DZ = ({ dragging, onDrag, onFiles, inputRef, icon, title, sub, small }) => <div onDragOver={e => { e.preventDefault(); onDrag(true); }} onDragLeave={() => onDrag(false)} onDrop={e => { e.preventDefault(); onDrag(false); onFiles(e.dataTransfer.files); }} onClick={() => inputRef.current?.click()} style={{ ...crd, border: "2px dashed " + (dragging ? C.teal : small ? "rgba(18,148,138,0.2)" : "rgba(255,255,255,0.1)"), padding: small ? "22px 18px" : "36px 18px", textAlign: "center", cursor: "pointer", background: dragging ? "rgba(18,148,138,0.06)" : "rgba(255,255,255,0.02)", marginBottom: 6 }}><input ref={inputRef} type="file" multiple accept=".pdf" onChange={e => onFiles(e.target.files)} style={{ display: "none" }} /><div style={{ fontSize: small ? 22 : 30, marginBottom: 4, opacity: .8 }}>{icon}</div><p style={{ fontSize: small ? 11 : 12, fontWeight: 600, color: C.t2, marginBottom: 1 }}>{title}</p><p style={{ fontSize: small ? 9 : 10, color: C.t4 }}>{sub}</p></div>;

  const Chip = ({ name, size, icon, onRemove }) => <div style={{ ...crd, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 11px", marginBottom: 3 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 12 }}>{icon}</span><span style={{ fontSize: 11, fontWeight: 500 }}>{name}</span>{size && <span style={{ fontSize: 9, color: C.t4 }}>({(size / 1048576).toFixed(1)}MB)</span>}</div><button onClick={onRemove} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 14 }}>&times;</button></div>;

  /* ===== STEP 0: UPLOAD ===== */
  if (step === 0) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg,#0c1220 0%,#162032 50%,#0f2b2a 100%)", fontFamily: "'DM Sans',sans-serif", color: C.t2 }}><style>{CSS}</style><Header />
      <div style={{ padding: "32px 18px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}><h2 style={{ fontSize: 24, fontWeight: 700, color: C.t1, marginBottom: 4 }}>Upload Documents</h2><p style={{ color: C.t4, fontSize: 12 }}>Bank statements + optional application for auto-fill</p></div>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>📄 Bank Statements <span style={{ color: C.red }}>*required</span></div>
        <DZ inputRef={stmtRef} dragging={dragStmt} onDrag={setDragStmt} onFiles={f => addFiles(f, "stmt")} icon="🏦" title="Drop PDF bank statements here" sub="3–12 months • click to browse" />
        {stmtFiles.map((f, i) => <Chip key={i} name={f.name} size={f.size} icon="📑" onRemove={() => setStmtFiles(p => p.filter((_, j) => j !== i))} />)}
        <div style={{ fontSize: 9, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5, marginTop: 14 }}>📋 Application <span style={{ color: C.t4 }}>(optional)</span></div>
        <DZ inputRef={appRef} dragging={dragApp} onDrag={setDragApp} onFiles={f => addFiles(f, "app")} icon="📝" title="Drop application PDF" sub="Auto-fills business name, state, industry, credit" small />
        {appFiles.length > 0 && <div style={{ fontSize: 9, fontWeight: 700, color: C.mint, marginBottom: 3 }}>✓ Application attached</div>}
        {appFiles.map((f, i) => <Chip key={i} name={f.name} size={f.size} icon="📋" onRemove={() => setAppFiles(p => p.filter((_, j) => j !== i))} />)}
        {error && <div style={{ padding: "9px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#fca5a5", fontSize: 11, marginTop: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}><button onClick={analyze} disabled={!stmtFiles.length || !pdfLib} style={{ ...btnP, flex: 1, opacity: stmtFiles.length && pdfLib ? 1 : .4 }}>🔍 Analyze{appFiles.length ? " + App" : ""}</button><button onClick={() => setShowFunders(true)} style={{ ...btnS, whiteSpace: "nowrap" }}>📋 Funders ({KNOWN_FUNDERS.length})</button></div>
      </div>
      {showFunders && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowFunders(false)}><div style={{ ...crd, padding: 18, maxWidth: 660, width: "92%", maxHeight: "80vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><h3 style={{ fontSize: 15, fontWeight: 700 }}>Funder Database ({KNOWN_FUNDERS.length})</h3><button onClick={() => setShowFunders(false)} style={{ background: "none", border: "none", color: C.t3, fontSize: 18, cursor: "pointer" }}>&times;</button></div><input value={fSearch} onChange={e => setFSearch(e.target.value)} placeholder="Search…" style={{ ...inpS, marginBottom: 8, fontSize: 12 }} /><div style={{ flex: 1, overflow: "auto" }}><div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{filteredFunders.map((f, i) => <span key={i} style={{ padding: "2px 7px", background: "rgba(18,148,138,0.1)", border: "1px solid rgba(18,148,138,0.2)", borderRadius: 5, fontSize: 9, color: C.mint, fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>{f}</span>)}</div></div></div></div>}
    </div>
  );

  /* ===== STEP 1: PROCESSING ===== */
  if (step === 1) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg,#0c1220 0%,#162032 50%,#0f2b2a 100%)", fontFamily: "'DM Sans',sans-serif", color: C.t2 }}><style>{CSS}</style>
      <div style={{ maxWidth: 440, margin: "0 auto", textAlign: "center", padding: "90px 18px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(18,148,138,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pulse 2s ease-in-out infinite" }}><span style={{ fontSize: 28 }}>🤖</span></div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{status}</h3>
        <p style={{ color: C.t4, fontSize: 11, marginBottom: 22 }}>30–90 seconds depending on statement length</p>
        <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", background: "linear-gradient(90deg," + C.teal + "," + C.mint + ")", borderRadius: 3, width: progress + "%", transition: "width .5s" }} /></div>
        <p style={{ fontSize: 10, color: C.t4, marginTop: 5 }}>{progress}%</p>
      </div>
    </div>
  );

  /* ===== STEP 2: REVIEW (FIXED LEFT / SCROLLABLE PDF RIGHT) ===== */
  if (step === 2 && result) {
    const months = result.months || [], adv = result.activeAdvances || [], past = result.pastAdvances || [], sum = result.summary || {}, noted = result.notedTransactions || [];
    const hasMultiAcct = months.some(m => (m.accounts || []).length > 1);
    const nFlag = months.reduce((s, m) => s + (m.flaggedDeposits?.length || 0), 0);
    const nExcl = months.reduce((s, m) => s + (m.excludedDeposits?.length || 0), 0);
    const allAdv = [...adv, ...past];
    const stats = [
      { i: "💰", v: fmt(sum.avgMonthlyRevenue || sum.avgMonthlyDeposits), l: "Avg Revenue" },
      { i: "🏦", v: fmt(sum.avgDailyBalance || sum.avgMonthlyBalance), l: "ADB" },
      { i: "📊", v: pct(sum.avgLeverage), l: "Avg Leverage", c: (sum.avgLeverage || 0) > 15 ? C.red : (sum.avgLeverage || 0) > 8 ? C.yellow : "" },
      { i: "⚠️", v: sum.totalNSFs ?? 0, l: "NSFs", c: sum.totalNSFs > 0 ? C.red : "" },
      { i: "📉", v: Math.round(sum.avgNegativeDays || 0), l: "Avg Neg Days", c: (sum.avgNegativeDays || 0) > 0 ? C.red : "" },
      { i: "🔄", v: sum.activePositionCount ?? adv.length, l: "Active Pos", c: adv.length > 0 ? C.yellow : "" },
    ];

    const hasMcaDefault = screening && screening.findings && screening.findings.some(f => f.type === "default" || f.type === "judgment" || ((f.summary || "").toLowerCase().includes("mca") && (f.summary || "").toLowerCase().match(/default|breach|judgment/)));

    const ScreeningCard = () => <div style={{ ...crd, overflow: "hidden", marginBottom: 12, borderLeft: "3px solid " + (screening.riskLevel === "clear" ? "#4ade80" : screening.riskLevel === "low" ? C.yellow : screening.riskLevel === "medium" ? "#f97316" : C.red) }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>{hasMcaDefault ? "🚨" : "🔍"} Public Records Screen</span>
        <span style={{ padding: "2px 10px", borderRadius: 8, fontSize: 9, fontWeight: 700, textTransform: "uppercase",
          background: screening.riskLevel === "clear" ? "rgba(34,197,94,0.12)" : screening.riskLevel === "low" ? "rgba(251,191,36,0.12)" : screening.riskLevel === "medium" ? "rgba(249,115,22,0.12)" : "rgba(239,68,68,0.15)",
          color: screening.riskLevel === "clear" ? "#4ade80" : screening.riskLevel === "low" ? C.yellow : screening.riskLevel === "medium" ? "#f97316" : C.red
        }}>{screening.riskLevel === "clear" ? "✓ CLEAR" : screening.riskLevel?.toUpperCase() + " RISK"}</span>
      </div>
      <div style={{ padding: "10px 14px" }}>
        {screening.riskSummary && <p style={{ fontSize: 11, color: C.t3, marginBottom: 8, lineHeight: 1.5 }}>{screening.riskSummary}</p>}
        {screening.findings && screening.findings.length > 0 && <div>
          {screening.findings.map((f, fi) => <div key={fi} style={{ padding: "6px 10px", marginBottom: 4, borderRadius: 6, background: f.severity === "high" ? "rgba(239,68,68,0.08)" : f.severity === "medium" ? "rgba(249,115,22,0.06)" : "rgba(255,255,255,0.03)", border: "1px solid " + (f.severity === "high" ? "rgba(239,68,68,0.2)" : f.severity === "medium" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.06)") }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: f.severity === "high" ? C.red : f.severity === "medium" ? "#f97316" : C.t3 }}>
                {f.type === "judgment" ? "⚖️" : f.type === "ucc" ? "📄" : f.type === "lawsuit" ? "🏛️" : f.type === "tax_lien" ? "🏦" : f.type === "default" ? "🚨" : "⚠️"} {f.type?.replace("_", " ")}
              </span>
              <span style={{ fontSize: 9, color: C.t4 }}>{f.date || ""}</span>
            </div>
            <p style={{ fontSize: 10, color: C.t3, lineHeight: 1.4, margin: 0 }}>{f.summary}</p>
            {f.source && <p style={{ fontSize: 8, color: C.t5, margin: "2px 0 0" }}>Source: {f.source}</p>}
          </div>)}
        </div>}
        {(!screening.findings || screening.findings.length === 0) && <p style={{ fontSize: 10, color: "#4ade80" }}>No judgments, UCC liens, or MCA defaults found in public records.</p>}
        {screening.rawNotes && <p style={{ fontSize: 9, color: C.t4, marginTop: 6, fontStyle: "italic" }}>{screening.rawNotes}</p>}
        <p style={{ fontSize: 8, color: C.t5, marginTop: 6 }}>⚠️ Web search only — not a comprehensive court records check. Verify with JudyRecords, UniCourt, or NY eCourts.</p>
      </div>
    </div>;

    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(170deg,#0c1220 0%,#162032 50%,#0f2b2a 100%)", fontFamily: "'DM Sans',sans-serif", color: C.t2, overflow: "hidden" }}>
        <style>{CSS}</style>
        <Header />
        <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
          {/* LEFT PANEL - scrolls independently */}
          <div style={{ flex: viewerOpen ? "0 0 50%" : "1 1 100%", overflowY: "auto", overflowX: "hidden", padding: "20px 16px", transition: "flex .25s" }}>
            <div style={{ maxWidth: viewerOpen ? undefined : 920, margin: viewerOpen ? undefined : "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <div><h2 style={{ fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 2 }}>Analysis Review</h2><p style={{ color: C.t4, fontSize: 11 }}>{months.length} months • {nExcl} excluded • {nFlag} flagged</p></div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={() => setViewerOpen(p => !p)} style={{ ...btnS, padding: "8px 14px", fontSize: 11 }}>{viewerOpen ? "✕ Close PDF" : "📄 View Statements"}</button>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(" + (viewerOpen ? 95 : 120) + "px,1fr))", gap: 6, marginBottom: 14 }}>
                {stats.map((s, si) => <div key={si} style={{ ...crd, padding: 10, textAlign: "center" }}><div style={{ fontSize: 16 }}>{s.i}</div><div style={{ fontSize: viewerOpen ? 14 : 17, fontWeight: 700, color: s.c || C.t2, fontFamily: "'DM Mono',monospace" }}>{s.v}</div><div style={{ fontSize: 8, color: C.t4, textTransform: "uppercase", letterSpacing: ".05em", marginTop: 1 }}>{s.l}</div></div>)}
              </div>

              {/* Public Records - TOP if MCA default */}
              {screening && hasMcaDefault && <ScreeningCard />}

              {/* Monthly table with multi-account expand */}
              <div style={{ ...crd, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ fontSize: 11, fontWeight: 700 }}>Monthly Financial Data</span>{hasMultiAcct && <span style={{ fontSize: 9, color: C.mint, marginLeft: 8 }}>▸ Click months to expand per-account</span>}</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>
                      {["Month", "Start Bal", "End Bal", "Total Dep", "True Rev", "# Dep", "ADB", "Lev%", "Neg Days", "NSFs", "NDBs", "Excl", "Flag"].map((h, hi) => <th key={h} style={{ ...thS, textAlign: hi ? "right" : "left" }}>{h}</th>)}
                    </tr></thead>
                    <tbody>{months.map((m, mi) => {
                      const accts = m.accounts || [];
                      const multi = accts.length > 1;
                      const expanded = expandedMonths[mi];
                      return [
                        <tr key={mi} onClick={() => multi && setExpandedMonths(p => ({ ...p, [mi]: !p[mi] }))} style={{ cursor: multi ? "pointer" : "default", background: expanded ? "rgba(18,148,138,0.04)" : "transparent" }}>
                          <td style={{ ...tdS, fontWeight: 700, textAlign: "left" }}>
                            {multi && <span style={{ color: C.mint, marginRight: 4, fontSize: 9 }}>{expanded ? "▾" : "▸"}</span>}
                            {m.month}
                            {multi && <span style={{ fontSize: 8, color: C.t4, marginLeft: 4 }}>{accts.length} accts</span>}
                          </td>
                          <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{fmt(m.startBalance)}</td>
                          <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{fmt(m.endBalance)}</td>
                          <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{fmt(m.totalDeposits)}</td>
                          <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 11, color: C.mint, fontWeight: 600 }}>{fmt(m.trueRevenue)}</td>
                          <td style={{ ...tdS, textAlign: "right" }}>{m.depositCount}</td>
                          <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>{fmt(m.avgDailyBalance)}</td>
                          <td style={{ ...tdS, textAlign: "right", color: (m.leverage || 0) > 15 ? C.red : (m.leverage || 0) > 8 ? C.yellow : C.t3, fontWeight: (m.leverage || 0) > 8 ? 700 : 400 }}>{pct(m.leverage)}</td>
                          <td style={{ ...tdS, textAlign: "right", color: (m.negativeDays || 0) > 0 ? C.red : C.t4, fontWeight: (m.negativeDays || 0) > 0 ? 700 : 400 }}>{m.negativeDays || 0}</td>
                          <td style={{ ...tdS, textAlign: "right", color: m.nsfCount > 0 ? C.red : C.t4, fontWeight: m.nsfCount > 0 ? 700 : 400 }}>{m.nsfCount}</td>
                          <td style={{ ...tdS, textAlign: "right", color: m.ndbCount > 0 ? C.red : C.t4 }}>{m.ndbCount}</td>
                          <td style={{ ...tdS, textAlign: "right" }}>{(m.excludedDeposits?.length || 0) > 0 && <span style={{ background: "rgba(251,191,36,0.15)", color: C.yellow, padding: "1px 6px", borderRadius: 8, fontSize: 9, fontWeight: 600 }}>{m.excludedDeposits.length}</span>}</td>
                          <td style={{ ...tdS, textAlign: "right" }}>{(m.flaggedDeposits?.length || 0) > 0 && <span onClick={e => { e.stopPropagation(); setShowFlagged(mi); }} style={{ background: "rgba(239,68,68,0.15)", color: C.red, padding: "1px 6px", borderRadius: 8, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{m.flaggedDeposits.length} ⚡</span>}</td>
                        </tr>,
                        ...(expanded ? accts.map((a, ai) => (
                          <tr key={mi + "-" + ai} style={{ background: "rgba(18,148,138,0.02)" }}>
                            <td style={{ ...tdS, textAlign: "left", paddingLeft: 28, fontSize: 11, color: C.t3 }}>
                              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: C.teal, marginRight: 6, verticalAlign: "middle" }}></span>
                              Acct …{a.accountId}
                            </td>
                            <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.t3 }}>{fmt(a.startBalance)}</td>
                            <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.t3 }}>{fmt(a.endBalance)}</td>
                            <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.t3 }}>{fmt(a.totalDeposits)}</td>
                            <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.t3 }}>{fmt(a.trueRevenue)}</td>
                            <td style={{ ...tdS, textAlign: "right", fontSize: 10, color: C.t3 }}>{a.depositCount}</td>
                            <td style={{ ...tdS, textAlign: "right", fontFamily: "'DM Mono',monospace", fontSize: 10, color: C.t3 }}>{fmt(a.avgDailyBalance)}</td>
                            <td style={{ ...tdS, textAlign: "right", fontSize: 10, color: (a.leverage || 0) > 15 ? C.red : (a.leverage || 0) > 8 ? C.yellow : C.t4 }}>{a.leverage ? pct(a.leverage) : "—"}</td>
                            <td style={{ ...tdS, textAlign: "right", fontSize: 10, color: (a.negativeDays || 0) > 0 ? C.red : C.t4 }}>{a.negativeDays || 0}</td>
                            <td style={{ ...tdS, textAlign: "right", fontSize: 10, color: a.nsfCount > 0 ? C.red : C.t4 }}>{a.nsfCount}</td>
                            <td style={{ ...tdS, textAlign: "right", fontSize: 10, color: C.t4 }}>{a.ndbCount}</td>
                            <td style={{ ...tdS, textAlign: "right" }}></td>
                            <td style={{ ...tdS, textAlign: "right" }}></td>
                          </tr>
                        )) : [])
                      ];
                    })}</tbody>
                  </table>
                </div>
              </div>

              {/* Advances */}
              {allAdv.length > 0 && <div style={{ ...crd, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ fontSize: 11, fontWeight: 700 }}>Detected Advances</span></div>
                <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Status", "Funder", "Type", "Payment", "# Pmts", "Balance"].map(h => <th key={h} style={{ ...thS, textAlign: "left" }}>{h}</th>)}</tr></thead>
                  <tbody>{allAdv.map((a, ai) => {
                    const freq = a.paymentFrequency || "";
                    const isMCA = freq.includes("MCA") || freq === "daily" || freq === "weekly";
                    const typeLabel = freq.includes("bank") ? "Bank Loan" : freq.includes("equipment") ? "Equipment" : freq.includes("loan") ? "Term Loan" : isMCA ? "MCA" : "Advance";
                    const bal = a.estimatedBalance === "unknown" || a.estimatedBalance === 0 || !a.estimatedBalance ? "Unknown" : fmt(a.estimatedBalance);
                    return [
                      <tr key={ai}>
                        <td style={tdS}>
                          <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 8, fontWeight: 700, textTransform: "uppercase", background: a.isActive ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)", color: a.isActive ? "#4ade80" : C.t4 }}>{a.isActive ? "Active" : "Paid Off"}</span>
                          {a.refiSuspected && <span style={{ padding: "2px 6px", borderRadius: 8, fontSize: 7, fontWeight: 700, background: "rgba(251,191,36,0.15)", color: C.yellow, marginLeft: 4 }}>REFI?</span>}
                        </td>
                        <td style={{ ...tdS, fontWeight: 600 }}>{a.funderName}</td>
                        <td style={{ ...tdS, fontSize: 10, color: isMCA ? C.t3 : "#a78bfa" }}>{typeLabel}</td>
                        <td style={{ ...tdS, fontSize: 11 }}>{fmt(a.paymentAmount)}/{freq.replace(/-MCA|-loan|-bank-loan|-equipment/g, "")}</td>
                        <td style={{ ...tdS, fontFamily: "'DM Mono',monospace", fontWeight: 700, color: C.mint }}>{a.paymentsMade || "—"}</td>
                        <td style={{ ...tdS, fontFamily: "'DM Mono',monospace", fontSize: 11, color: bal === "Unknown" ? C.t4 : C.t2 }}>{a.isActive ? bal : "$0"}</td>
                      </tr>,
                      a.refiSuspected && a.refiNotes ? <tr key={ai + "-refi"}><td colSpan={6} style={{ ...tdS, fontSize: 9, color: C.yellow, paddingLeft: 28, borderTop: "none", paddingTop: 0 }}>⚠️ {a.refiNotes}</td></tr> : null,
                      (a.missedPayments && a.missedPayments.length > 0) ? <tr key={ai + "-missed"}><td colSpan={6} style={{ ...tdS, fontSize: 9, color: C.red, paddingLeft: 28, borderTop: "none", paddingTop: 0 }}>🚨 {a.missedPayments.length} MISSED/BOUNCED: {a.missedPayments.map(mp => mp.date + " " + fmt(mp.amount) + " (" + mp.reason + ")").join(", ")}</td></tr> : null
                    ];
                  })}</tbody>
                </table></div>
              </div>}

              {/* NOTED TRANSACTIONS - new section */}
              {noted.length > 0 && <div style={{ ...crd, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><span style={{ fontSize: 11, fontWeight: 700 }}>Noted Transactions</span><span style={{ fontSize: 9, color: C.t4, marginLeft: 8 }}>Funder debits by period</span></div>
                <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Period", "Funder", "Count × Payment", "Notes"].map(h => <th key={h} style={{ ...thS, textAlign: "left" }}>{h}</th>)}</tr></thead>
                  <tbody>{noted.map((n, ni) => <tr key={ni}>
                    <td style={{ ...tdS, color: C.t3, fontSize: 11 }}>{n.period}</td>
                    <td style={{ ...tdS, fontWeight: 600 }}>{n.funderName}</td>
                    <td style={{ ...tdS, fontFamily: "'DM Mono',monospace", color: C.red }}>{n.debitCount} × {fmt(n.perPayment || n.totalDebited)}</td>
                    <td style={{ ...tdS, fontSize: 10, color: n.note ? C.yellow : C.t4 }}>{n.note || ""}</td>
                  </tr>)}</tbody>
                </table></div>
              </div>}

              {/* Public Records - normal position (after noted, before AI notes) */}
              {screening && !hasMcaDefault && <ScreeningCard />}

              {sum.notes && <div style={{ ...crd, padding: "10px 14px", borderLeft: "3px solid " + C.teal, marginBottom: 12 }}><div style={{ fontSize: 9, fontWeight: 700, color: C.teal, textTransform: "uppercase", marginBottom: 2 }}>AI Notes</div><p style={{ fontSize: 11, color: C.t3, lineHeight: 1.6 }}>{sum.notes}</p></div>}

              {/* APP DETAILS - inline editable */}
              <div style={{ ...crd, overflow: "hidden", marginBottom: 12 }}>
                <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>Application Details</span>
                  {autoFilled && <span style={{ fontSize: 8, color: C.mint, fontWeight: 600 }}>✓ AUTO-FILLED</span>}
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                    {[{ k: "businessName", l: "Business Name", p: "ABC Company LLC", full: true }, { k: "state", l: "State", p: "NY" }, { k: "startDate", l: "Start Date", p: "03/2018" }, { k: "industry", l: "Industry", p: "Restaurant" }, { k: "credit", l: "Credit Score", p: "650" }].map(f => (
                      <div key={f.k} style={f.full ? { gridColumn: "1 / -1" } : {}}>
                        <label style={{ display: "block", fontSize: 9, fontWeight: 600, color: C.t4, marginBottom: 2, textTransform: "uppercase", letterSpacing: ".05em" }}>{f.l}</label>
                        <input value={appData[f.k]} onChange={e => setAppData(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.p} style={{ ...inpS, padding: "6px 10px", fontSize: 11 }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 600, color: C.t4, marginBottom: 2, textTransform: "uppercase", letterSpacing: ".05em" }}>Credit Leary</label>
                      <div style={{ display: "flex", gap: 4 }}>{["No", "Yes"].map(o => <button key={o} onClick={() => setAppData(p => ({ ...p, creditLeary: o }))} style={{ ...(appData.creditLeary === o ? btnP : btnS), padding: "5px 14px", fontSize: 10, flex: 1 }}>{o}</button>)}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label style={{ display: "block", fontSize: 9, fontWeight: 600, color: C.t4, marginBottom: 2, textTransform: "uppercase", letterSpacing: ".05em" }}>Notes</label>
                    <textarea value={appData.notes} onChange={e => setAppData(p => ({ ...p, notes: e.target.value }))} placeholder="Deal notes…" rows={2} style={{ ...inpS, resize: "vertical", fontSize: 11, padding: "6px 10px" }} />
                  </div>
                </div>
              </div>

              {/* Export button */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <button onClick={() => { generateHTML(); setStep(3); }} style={{ ...btnP, flex: 1, padding: "14px 20px", fontSize: 14, borderRadius: 10 }}>🖨️ Export Sub Sheet</button>
              </div>
            </div>
          </div>

          {/* RIGHT: PDF VIEWER - scrolls independently */}
          {viewerOpen && <div style={{ flex: "0 0 50%", borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", minHeight: 0 }}><PdfViewer files={[...stmtFiles, ...appFiles]} pdfLib={pdfLib} /></div>}
        </div>

        {showFlagged !== null && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowFlagged(null)}><div style={{ ...crd, padding: 18, maxWidth: 500, width: "90%", maxHeight: "70vh", overflow: "auto" }} onClick={e => e.stopPropagation()}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Flagged — {months[showFlagged]?.month}</h3>{(months[showFlagged]?.flaggedDeposits || []).map((t, ti) => <div key={ti} style={{ padding: 9, border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, marginBottom: 5, background: "rgba(239,68,68,0.04)" }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ fontWeight: 600, fontSize: 11 }}>{t.description}</span><span style={{ fontWeight: 700, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{fmt(t.amount)}</span></div><div style={{ fontSize: 10, color: C.red }}>{t.reason}</div></div>)}<button onClick={() => setShowFlagged(null)} style={{ ...btnP, marginTop: 8, width: "100%" }}>Close</button></div></div>}
      </div>
    );
  }

  /* ===== STEP 3: EXPORT ===== */
  if (step === 3) {
    if (!htmlReport) generateHTML();
    const printReport = () => {
      try { iframeRef.current?.contentWindow?.print(); } catch (e) { window.print(); }
    };
    const copyHTML = () => {
      if (!htmlReport) return;
      const full = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Sub Sheet - " + (appData.businessName||"Deal") + "</title><style>" + htmlReport.css + "</style></head><body>" + htmlReport.body + "</body></html>";
      try { const ta = document.createElement("textarea"); ta.value = full; ta.style.cssText = "position:fixed;left:-9999px"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 3000); } catch(e) {}
    };
    return (
      <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 16px", background: "linear-gradient(135deg,#0c1220,#162032)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,"+C.teal+","+C.mint+")", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 10 }}>SS</div>
            <span style={{ color: C.t1, fontSize: 13, fontWeight: 700 }}>{appData.businessName || "Sub Sheet"}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={printReport} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: "linear-gradient(135deg,"+C.teal+","+C.mint+")", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🖨️ Save as PDF</button>
            <button onClick={copyHTML} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: copied ? "rgba(15,185,160,0.3)" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{copied ? "✅ Copied!" : "📋 Copy HTML"}</button>
            <button onClick={() => { setHtmlReport(null); setStep(2); }} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>← Review</button>
            <button onClick={reset} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>🔄 New</button>
          </div>
        </div>
        {copied && <div style={{ padding: "6px 16px", background: "#e8f5f3", fontSize: 11, color: "#12948A", fontWeight: 600 }}>HTML copied! Paste into Notepad → Save As → name.html → Upload to Drive</div>}
        {htmlReport && <div style={{ flex: 1 }}>
          <iframe
            ref={iframeRef}
            srcDoc={"<!DOCTYPE html><html><head><meta charset='utf-8'><style>" + htmlReport.css + "</style></head><body>" + htmlReport.body + "</body></html>"}
            style={{ width: "100%", height: "100%", border: "none", minHeight: "calc(100vh - 50px)" }}
            title="Sub Sheet Report"
          />
        </div>}
      </div>
    );
  }

  return null;
}

// Render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(SubSheetBuilder));
