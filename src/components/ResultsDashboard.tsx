import { useState } from "react";
import { JapaReport, CountryResult } from "../types";
import { 
  Lock, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Stars, CreditCard, 
  MapPin, Landmark, BookOpen, Clock, Globe2, Briefcase, FileText, Compass, Download, CheckSquare,
  DollarSign, Mail
} from "lucide-react";
import PaystackSim from "./PaystackSim";
import { generateReportPDF, getReportId } from "../utils/pdfGenerator";

interface ResultsDashboardProps {
  report: JapaReport;
  email: string;
}

export default function ResultsDashboard({ report, email }: ResultsDashboardProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const [activeCountryTab, setActiveCountryTab] = useState<number>(0);
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailPDF = async () => {
    setIsEmailing(true);
    setEmailSuccess(null);
    setEmailError(null);
    try {
      // 1. Generate the PDF on the client silently
      const doc = generateReportPDF(report, email, false);
      
      // 2. Output the document as dataurlstring (Actual PDF bytes in Base64)
      const dataUri = doc.output("dataurlstring");

      if (!dataUri || !dataUri.includes("base64,")) {
        throw new Error("Unable to encode the generated PDF document correctly.");
      }

      // 3. Extract Name/ID details
      const reportId = getReportId(email);

      // 4. Post to our backend Express endpoint
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          pdfBase64: dataUri,
          reportId: reportId,
          userName: "Scholar"
        }),
      });

      // Avoid parsing as JSON if the response content is HTML (e.g. server reboots or hot-reloading)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("The application server is briefly rebooting or hot-reloading keys. Please wait 10 seconds and click 'Send to My Gmail' again to deliver!");
      }

      const resData = await response.json();
      if (resData.success) {
        setEmailSuccess(resData.message || `Successfully sent report to ${email}!`);
      } else {
        setEmailError(resData.error || "Could not send email to Gmail.");
      }
    } catch (err: any) {
      console.error("Email sending failure:", err);
      // Clean, actionable error message for reboots or parsing failures
      if (err.message && (err.message.includes("Unexpected token") || err.message.includes("is not valid JSON") || err.message.includes("Unexpected character"))) {
        setEmailError("The email delivery handler is briefly re-establishing connection after backend synchronization. Please wait 5 seconds and click 'Send to My Gmail' again!");
      } else {
        setEmailError(`${err.message || err}`);
      }
    } finally {
      setIsEmailing(false);
    }
  };

  const getCountryFlagImg = (country: string, fallbackEmoji: string, sizeClass = "w-[1.5em] h-[1.125em]") => {
    const norm = country.trim().toLowerCase();
    let code = "";
    if (norm.includes("germany")) code = "de";
    else if (norm.includes("united kingdom") || norm.includes("uk") || norm.includes("gbr")) code = "gb";
    else if (norm.includes("canada")) code = "ca";
    else if (norm.includes("united states") || norm.includes("usa") || norm.includes("america")) code = "us";
    else if (norm.includes("ireland")) code = "ie";
    else if (norm.includes("netherlands") || norm.includes("holland")) code = "nl";
    else if (norm.includes("france")) code = "fr";
    else if (norm.includes("italy")) code = "it";
    else if (norm.includes("australia")) code = "au";
    else if (norm.includes("new zealand")) code = "nz";
    else if (norm.includes("finland")) code = "fi";
    else if (norm.includes("sweden")) code = "se";
    else if (norm.includes("spain")) code = "es";
    else if (norm.includes("portugal")) code = "pt";
    else if (norm.includes("uae") || norm.includes("emirates")) code = "ae";
    else if (norm.includes("malaysia")) code = "my";
    else if (norm.includes("korea")) code = "kr";
    else if (norm.includes("china")) code = "cn";
    else if (norm.includes("poland")) code = "pl";
    else if (norm.includes("hungary")) code = "hu";
    else if (norm.includes("russia")) code = "ru";
    else if (norm.includes("japan")) code = "jp";
    else if (norm.includes("singapore")) code = "sg";
    else if (norm.includes("norway")) code = "no";
    else if (norm.includes("denmark")) code = "dk";
    else if (norm.includes("switzerland")) code = "ch";
    else if (norm.includes("belgium")) code = "be";
    else if (norm.includes("austria")) code = "at";
    else if (norm.includes("turkey")) code = "tr";
    else if (norm.includes("south africa")) code = "za";
    else if (norm.includes("brazil")) code = "br";
    else if (norm.includes("india")) code = "in";
    else if (norm.includes("cyprus")) code = "cy";
    else if (norm.includes("greece")) code = "gr";
    else if (norm.includes("czech")) code = "cz";
    else if (norm.includes("luxembourg")) code = "lu";
    else if (norm.includes("egypt")) code = "eg";
    else if (norm.includes("estonia")) code = "ee";
    else if (norm.includes("qatar")) code = "qa";
    else if (norm.includes("saudi")) code = "sa";

    if (code) {
      return (
        <span className="inline-flex items-center justify-center">
          <img
            src={`https://flagcdn.com/w80/${code}.png`}
            srcSet={`https://flagcdn.com/w160/${code}.png 2x`}
            alt={country}
            className={`inline-block ${sizeClass} object-cover rounded-xs align-middle shadow-xs`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              const sib = e.currentTarget.parentElement?.querySelector('.fallback-emoji');
              if (sib) (sib as HTMLElement).style.display = 'inline-block';
            }}
          />
          <span className="fallback-emoji hidden">{fallbackEmoji}</span>
        </span>
      );
    }
    return <span className="fallback-emoji">{fallbackEmoji}</span>;
  };

  const handlePaymentSuccess = (reference: string) => {
    setIsPaid(true);
    setShowPaystack(false);
    // Smooth scroll down to full content
    setTimeout(() => {
      const el = document.getElementById("full-unlocked-report");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200 stroke-emerald-600";
    if (score >= 40) return "text-amber-500 bg-amber-50 border-amber-200 stroke-amber-500";
    return "text-rose-600 bg-rose-50 border-rose-200 stroke-rose-600";
  };

  const renderStars = (rating: number, colorClass = "text-yellow-400") => {
    return (
      <div className="flex items-center gap-0.5" id={`stars-rating-${rating}`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span 
            key={s} 
            className={`text-base ${s <= rating ? colorClass : "text-gray-200"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // The countries shown. On Free, show top 2. On Paid, show all matched (typically 3).
  const visibleCountries = isPaid ? report.countries : report.countries.slice(0, 2);
  const currentCountry = visibleCountries[activeCountryTab] || visibleCountries[0];

  return (
    <div className="space-y-10 animate-fade-in" id="results-dashboard-root">
      
      {/* 1. JAPA PROBABILITY SCORE CONTAINER */}
      <div className="bg-white rounded-3xl border border-light-gold/30 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        
        {/* Circle dial */}
        <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle 
              cx="72" cy="72" r="62" 
              className="stroke-gray-100 fill-none" 
              strokeWidth="10" 
            />
            <circle 
              cx="72" cy="72" r="62" 
              className={`fill-none transition-all duration-1000 ${
                report.score >= 70 ? "stroke-emerald-600" : report.score >= 40 ? "stroke-amber-500" : "stroke-rose-600"
              }`} 
              strokeWidth="12" 
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - report.score / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-3xl font-bold text-dark-text leading-none">{report.score}%</span>
            <span className="text-[10px] font-mono leading-none text-light-text font-semibold uppercase tracking-wider mt-1">SUCCESS SCORE</span>
          </div>
        </div>

        {/* Evaluation report summary text */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getScoreColor(report.score)}`}>
              {report.score >= 70 ? "Strong Japa Passport Match" : report.score >= 40 ? "Moderate Chance Profile" : "Difficult Relocation Matrix"}
            </span>
            <span className="text-[11px] font-mono text-light-text">{new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long" })}  |  REPORT ID: {getReportId(email)}</span>
          </div>
          <p className="text-xs font-semibold text-light-text uppercase tracking-wider block font-mono">PROFILE SUMMARY MATRIX</p>
          <p className="text-body-text text-sm md:text-base leading-relaxed">
            {report.profileSummaryText}
          </p>
          <div className="bg-cream-bg/40 border border-light-gold/15 rounded-xl p-4 text-xs font-semibold text-dark-text flex items-start gap-2.5">
            <Stars className="w-5 h-5 text-nigerian-gold animate-pulse flex-shrink-0" />
            <p className="leading-snug">
              {report.scoreText}
            </p>
          </div>
        </div>
      </div>

      {/* 2. MATCHED COUNTRIES HEADER (TAB NAVIGATION) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-light-gold/20 pb-4 mb-6 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-primary-green uppercase tracking-wider">PRIMARY DISCOVERY BLUEPRINTS</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-dark-text">Your Best Study Destination Matches</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isPaid ? (
              <>
                <button
                  onClick={() => {
                    generateReportPDF(report, email);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-green hover:bg-light-green text-white text-xs font-bold rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-md cursor-pointer font-serif text-[11px]"
                  id="download-pdf-report-btn"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>
                <button
                  onClick={handleEmailPDF}
                  disabled={isEmailing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-royal-blue text-white text-xs font-bold rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-serif text-[11px]"
                  id="email-pdf-report-btn"
                  style={{ backgroundColor: "#1d4ed8" }}
                >
                  {isEmailing ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Sending to Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send to My Gmail</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowPaystack(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-md cursor-pointer border border-amber-600 font-bold"
                id="lock-pdf-report-btn"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock PDF Report (₦5,000)</span>
              </button>
            )}
            {!isPaid && (
              <span className="text-xs bg-amber-50 border border-amber-200 text-amber-600 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
                <Lock className="w-3.5 h-3.5" /> 1 Matched Option Blurred
              </span>
            )}
          </div>
        </div>

        {/* Real-time Email notifications success and failure indicators */}
        {(emailSuccess || emailError) && (
          <div className="mb-5 max-w-xl animate-fade-in transition-all">
            {emailSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2.5 shadow-xs animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-dark-text block mb-0.5 font-serif font-bold text-sm">Dossier Emailed Successfully!</strong>
                  <p className="text-emerald-700 font-normal leading-relaxed">{emailSuccess}</p>
                </div>
              </div>
            )}
            {emailError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2.5 shadow-xs animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-950 block mb-0.5 font-serif font-bold text-sm font-bold">Delivery Unsuccessful</strong>
                  <p className="text-rose-700 font-normal leading-relaxed">{emailError}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab switch buttons */}
        <div className="flex flex-wrap gap-2.5">
          {visibleCountries.map((c, idx) => (
            <button
              key={c.country}
              onClick={() => setActiveCountryTab(idx)}
              className={`px-5 py-3 cursor-pointer rounded-2xl flex items-center gap-2 font-serif font-bold text-sm md:text-base border transition-all ${
                idx === activeCountryTab 
                  ? "bg-primary-green text-white border-primary-green shadow-md" 
                  : "bg-white text-dark-text border-light-gold/30 hover:bg-cream-bg/40"
              }`}
              id={`tab-country-${idx}`}
            >
              <span className="text-xl md:text-2xl leading-none flex items-center justify-center">
                {getCountryFlagImg(c.country, c.flag)}
              </span>
              <span>{c.country}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${idx === activeCountryTab ? "bg-white/20 text-white" : "bg-cream-bg text-primary-green border border-light-gold/10"}`}>
                {c.matchPercentage}% Fit
              </span>
            </button>
          ))}
          {!isPaid && (
            <button
              onClick={() => setShowPaystack(true)}
              className="px-5 py-3 hover:bg-yellow-100 rounded-2xl flex items-center gap-2 font-serif font-bold text-sm md:text-base border border-dashed border-light-gold/50 bg-white/40 text-left cursor-pointer text-light-text group transition-all"
              id="blur-country-tab"
            >
              <Lock className="w-4 h-4 text-nigerian-gold" />
              <span className="blur-[3px] group-hover:blur-0 transition-all font-sans">Canada...</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 border border-yellow-200 px-2 py-0.5 rounded-full leading-relaxed">Locked</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. DETAILED COUNTRY PROFILE ACCORDION SCREEN */}
      {currentCountry && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-stretch">
          
          {/* LEFT PANEL: Meta, Ratings card, Pros / Cons */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Country Identity Block */}
            <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm flex flex-col justify-between" style={{ minHeight: "260px" }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-6xl font-serif flex items-center justify-center">
                    {getCountryFlagImg(currentCountry.country, currentCountry.flag)}
                  </span>
                  <span className="text-3xl font-serif font-bold text-primary-green">{currentCountry.matchPercentage}% <span className="text-xs text-light-text font-sans block text-right uppercase tracking-[0.2em] font-mono">MATCH RATE</span></span>
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold text-dark-text">{currentCountry.country}</h4>
                  <p className="text-xs text-light-text font-mono mt-1">SUITABILITY PREFERENCE BLUEPRINT</p>
                </div>
                <p className="text-sm text-body-text leading-relaxed italic border-l-2 border-nigerian-gold pl-3">
                  {currentCountry.whyForYou.matchReason}
                </p>
              </div>
            </div>

            {/* Reality check warning flag */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs flex gap-3 text-amber-900 leading-relaxed shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <strong className="block text-amber-950 uppercase mb-1 tracking-wider font-mono">REALITY CHECK FOR NIGERIANS</strong>
                {currentCountry.realityCheck}
              </div>
            </div>

            {/* Pros / Cons list */}
            <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
              <h5 className="font-serif font-bold text-dark-text text-base md:text-lg border-b border-light-gold/10 pb-2 flex items-center gap-1">
                <Compass className="w-4 h-4 text-[#10b068]" /> Honest Pros & Cons
              </h5>
              
              <div className="space-y-4 text-xs font-semibold uppercase tracking-wider text-light-text font-mono">
                <div className="space-y-2">
                  <span className="text-emerald-700 text-[10px] tracking-widest font-bold">PROS / HIGHLIGHTS</span>
                  <ul className="space-y-2 text-body-text text-sm lowercase tracking-normal font-sans" style={{ textTransform: "none" }}>
                    {currentCountry.whyForYou.pros.map((p, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-rose-700 text-[10px] tracking-widest font-bold">CHALLENGES / CONS</span>
                  <ul className="space-y-2 text-body-text text-sm lowercase tracking-normal font-sans" style={{ textTransform: "none" }}>
                    {currentCountry.whyForYou.cons.map((c, i) => (
                      <li key={i} className="flex gap-2 items-start text-dark-text/95">
                        <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 text-[10px] text-center flex-shrink-0 font-mono mt-0.5 leading-4">!</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Reality Star Ratings, Path choices & Requirements */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* UNLOCKED VS LOCKED CONTAINER WITH BLUR COVERS */}
            <div className="space-y-6 relative">
              
              {/* Blur Cover Overlay for Free Members */}
              {!isPaid && (
                <div className="absolute inset-x-0 top-0 bottom-0 z-30 flex items-center justify-center bg-transparent" id="premium-blur-overlay">
                  {/* Backdrop blur */}
                  <div className="absolute inset-0 bg-white/25 backdrop-blur-[7px] pointer-events-none rounded-3xl" />
                  
                  {/* Glowing, premium CTA card */}
                  <div className="relative z-40 max-w-lg bg-white/95 border-2 border-nigerian-gold mx-6 p-6 md:p-8 rounded-2xl shadow-2xl text-center space-y-6 scale-95 md:scale-100">
                    <div className="w-14 h-14 rounded-full bg-yellow-50 text-nigerian-gold flex items-center justify-center mx-auto shadow-md scale-up-pulse">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-nigerian-gold uppercase tracking-widest font-mono">COMPLETE RELOCATION BLUEPRINT</span>
                      <h4 className="font-serif font-black text-dark-text text-xl md:text-2xl mt-1.5">
                        Unlock Your Full Japa Roadmap
                      </h4>
                      <p className="text-xs leading-relaxed text-light-text max-w-sm mx-auto mt-2 font-sans">
                        Retreive 100% complete actual scholarships, verified visa requirements, full living cost in Naira, physical Nigerian authentication embassies, and checklists starting from today.
                      </p>
                    </div>

                    <div className="space-y-4 pt-1">
                      <button
                        onClick={() => setShowPaystack(true)}
                        className="w-full py-4 bg-primary-green text-white text-base font-bold rounded-full border border-nigerian-gold shadow-[0_4px_15px_rgba(13,107,63,0.3)] hover:shadow-[0_15px_40px_rgba(13,107,63,0.4)] hover:bg-light-green hover:-translate-y-0.5 active:translate-y-0 transform transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        id="unlock-full-report-btn"
                      >
                        <CreditCard className="w-5 h-5" />
                        Unlock Full Roadmap — ₦5,000
                      </button>
                      <p className="text-[10.5px] text-light-text flex items-center justify-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> INSTANT HIGH FIDELITY SECURED VIA PAYSTACK
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reality Stars Matrix */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 mb-4 flex items-center gap-2">
                  <Stars className="w-5 h-5 text-nigerian-gold" />
                  Study Abroad Feasibility Matrix (Ratings out of 5)
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-2xl bg-cream-bg/30 text-center flex flex-col items-center justify-between min-h-[110px] border border-light-gold/10">
                    <span className="text-[10px] font-bold text-light-text uppercase font-mono block">Scholarships</span>
                    {renderStars(currentCountry.ratings.scholarship, "text-emerald-500")}
                    <span className="text-xs font-bold text-dark-text pr-1">{currentCountry.ratings.scholarship}/5</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-cream-bg/30 text-center flex flex-col items-center justify-between min-h-[110px] border border-light-gold/10">
                    <span className="text-[10px] font-bold text-light-text uppercase font-mono block">Visa Easiness</span>
                    {renderStars(currentCountry.ratings.visa, "text-amber-500")}
                    <span className="text-xs font-bold text-dark-text pr-1">{currentCountry.ratings.visa}/5</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-cream-bg/30 text-center flex flex-col items-center justify-between min-h-[110px] border border-light-gold/10">
                    <span className="text-[10px] font-bold text-light-text uppercase font-mono block">Tuition Cost</span>
                    {renderStars(currentCountry.ratings.tuition, "text-primary-green")}
                    <span className="text-xs font-bold text-primary-green pr-1">{currentCountry.ratings.tuition}/5</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-cream-bg/30 text-center flex flex-col items-center justify-between min-h-[110px] border border-light-gold/10">
                    <span className="text-[10px] font-bold text-light-text uppercase font-mono block">Cost of Living</span>
                    {renderStars(currentCountry.ratings.living)}
                    <span className="text-xs font-bold text-dark-text pr-1">{currentCountry.ratings.living}/5</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-cream-bg/30 text-center flex flex-col items-center justify-between min-h-[110px] border border-light-gold/10">
                    <span className="text-[10px] font-bold text-light-text uppercase font-mono block">PR Pathway</span>
                    {renderStars(currentCountry.ratings.pr, "text-indigo-500")}
                    <span className="text-xs font-bold text-indigo-500 pr-1">{currentCountry.ratings.pr}/5</span>
                  </div>
                </div>
              </div>

              {/* SECTION: ACADEMIC ADMISSION REQUIREMENTS */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-green" />
                  1. Admission Requirements
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed">
                  <div className="p-4 bg-cream-bg/25 border border-light-gold/10 rounded-2xl">
                    <strong className="text-xs uppercase font-mono text-light-text block mb-1">Academic Requirement</strong>
                    <p className="text-dark-text">{currentCountry.admissionRequirements.academic}</p>
                  </div>
                  <div className="p-4 bg-cream-bg/25 border border-light-gold/10 rounded-2xl">
                    <strong className="text-xs uppercase font-mono text-light-text block mb-1">English Proficiency Rules</strong>
                    <p className="text-dark-text">{currentCountry.admissionRequirements.english}</p>
                  </div>
                </div>
              </div>

              {/* SECTION: SCHOLARSHIP PATHS */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 flex items-center gap-2">
                  <Stars className="w-5 h-5 text-nigerian-gold" />
                  2. Scholarship Opportunities
                </h5>
                {currentCountry.scholarshipPath.length === 0 ? (
                  <p className="text-sm text-light-text">No government automatic waivers or scholarships matched this profile classification.</p>
                ) : (
                  <div className="space-y-4" id="scholarships-container-unlocked">
                    {currentCountry.scholarshipPath.map((sch, i) => (
                      <div key={i} className="p-5 border border-light-gold/15 bg-cream-bg/10 rounded-2xl space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-[#10b068] uppercase font-mono tracking-wider block">SCHOLARSHIP NAME</span>
                            <h6 className="font-serif font-bold text-dark-text text-base leading-snug">{sch.name}</h6>
                          </div>
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full text-right" style={{ whiteSpace: "nowrap" }}>
                            {sch.deadline}
                          </span>
                        </div>
                        <p className="text-xs text-body-text leading-snug"><strong className="text-dark-text">What it Covers:</strong> {sch.covers}</p>
                        <p className="text-xs text-body-text"><strong className="text-dark-text">Value per Year:</strong> <span className="text-primary-green font-bold text-sm">{sch.amountNaira}</span></p>
                        <p className="text-xs text-body-text leading-relaxed"><strong className="text-dark-text">Eligibility Rules:</strong> {sch.eligibility}</p>
                        
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-light-gold/10 text-xs">
                          <p className="text-light-text italic font-medium">💡 Quick Tips: {sch.tips}</p>
                          <a 
                            href={sch.applyLink} 
                            target="_blank" 
                            rel="noreferrer noopener" 
                            className="text-[#10b068] font-bold inline-flex items-center gap-1 hover:underline cursor-pointer py-1 self-start sm:self-auto"
                            id={`apply-sch-${i}`}
                          >
                            Read Official Portal <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CORE LOCKED GROUPS */}
              {/* SECTION: SELF-FUNDED PATHWAYS & COST BREAKDOWN */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-green animate-pulse" />
                  3. Self-Funded Cost Breakdown (Naira)
                </h5>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-cream-bg/30 text-xs space-y-2">
                      <strong className="block text-dark-text uppercase tracking-wider font-mono">ANNUAL TUITION</strong>
                      <p className="text-base font-serif font-bold text-emerald-700 leading-snug">{currentCountry.selfFundedPath.tuitionFeeNaira}</p>
                      <p className="text-light-text">In local currency: {currentCountry.selfFundedPath.tuitionFeeLocal}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-cream-bg/30 text-xs space-y-2">
                      <strong className="block text-dark-text uppercase tracking-wider font-mono font-bold text-amber-700">LIVING COST PER MONTH</strong>
                      <p className="text-base font-serif font-bold text-amber-800 leading-snug">{currentCountry.selfFundedPath.livingCostNaira} / mo</p>
                      <p className="text-light-text">In local currency: {currentCountry.selfFundedPath.livingCostLocal} / mo</p>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] font-semibold text-rose-800 leading-relaxed font-mono">
                    ⚠️ VOLATILITY NOTICE: Custom student budgets should factor an extra 10-15% reserve buffer because exchange rates can fluctuate on a weekly grid.
                  </div>

                  <div className="space-y-2.5 text-xs text-body-text">
                    <p><strong>Prominent Acceptable Universities:</strong> {currentCountry.selfFundedPath.universities.join(", ")}</p>
                    <p><strong>Accommodation Matrix:</strong> {currentCountry.selfFundedPath.accommodationCost}</p>
                    <p><strong>Health Insurance:</strong> {currentCountry.selfFundedPath.healthInsurance}</p>
                    <p><strong>Part-Time Work Limits:</strong> {currentCountry.selfFundedPath.partTimeWorkRules}</p>
                    <p><strong>Est. Earnings After Part-Time:</strong> {currentCountry.selfFundedPath.estimatedPartTimeEarningsNaira}</p>
                    <div className="bg-primary-green/5 text-primary-green p-4 rounded-2xl font-bold uppercase tracking-wider flex items-center justify-between border border-light-gold/15 mt-4">
                      <span>ESTIMATED ANNUAL EXPENSE matrix:</span>
                      <span className="text-base tracking-normal normal-case font-serif">{currentCountry.selfFundedPath.estimatedAnnualTotalNaira}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NIGERIAN PHYSICAL REQUISITION SIDE PROCESSES */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#10b068]" />
                  4. Certified Nigerian Side Processes Needed
                </h5>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div className="p-4 border border-light-gold/10 bg-cream-bg/10 rounded-2xl space-y-1.5">
                      <strong className="text-dark-text font-bold block">1. WAEC/NECO Online Verification</strong>
                      <p className="text-light-text">Required before authenticating with the Ministry of Education.</p>
                      <ul className="list-disc pl-4 space-y-1 text-body-text font-mono text-[10.5px]">
                        <li>Verify on: www.waecdirect.org</li>
                        <li>Yaba head office branch</li>
                        <li>Takes 2-5 working days</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-light-gold/10 bg-cream-bg/10 rounded-2xl space-y-1.5">
                      <strong className="text-dark-text font-bold block">2. University Academic Transcripts</strong>
                      <p className="text-light-text">Request SEALED sealed copies from your registry exams office.</p>
                      <ul className="list-disc pl-4 space-y-1 text-body-text font-mono text-[10.5px]">
                        <li>Takes 2-6 weeks depending on school</li>
                        <li>Ask for sealed registrar stamp</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-cream-bg/40 border border-light-gold/25 rounded-2xl text-xs space-y-3">
                    <span className="font-mono text-[10px] font-bold text-primary-green uppercase tracking-wider block">Federal Embassy Verification Checks</span>
                    {currentCountry.nigerianSideProcesses.moe.needed && (
                      <div className="space-y-1">
                        <strong className="text-dark-text block">Federal Ministry of Education (MOE) Authentication</strong>
                        <ul className="list-disc pl-5 space-y-0.5 text-light-text">
                          {currentCountry.nigerianSideProcesses.moe.steps.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {currentCountry.nigerianSideProcesses.mfa.needed && (
                      <div className="space-y-1 pt-1.5 border-t border-light-gold/10">
                        <strong className="text-dark-text block">Ministry of Foreign Affairs (MFA Apostille)</strong>
                        <ul className="list-disc pl-5 space-y-0.5 text-light-text">
                          {currentCountry.nigerianSideProcesses.mfa.steps.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* EMBASSY DOCUMENTATIONS & VISA SUBMISSIONS PROCESS */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#10b068]" />
                  5. Embassy & Visa Requirements
                </h5>
                <div className="space-y-4">
                  <div className="p-5 border border-light-gold/15 bg-cream-bg/10 rounded-2xl space-y-2 text-xs">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-light-text block">Embassy Contacts physical address</span>
                    <strong className="text-dark-text text-base font-serif block">{currentCountry.embassyVisaProcess.embassyName}</strong>
                    <p className="text-body-text"><strong>Addresses: </strong>{currentCountry.embassyVisaProcess.addressLagosAbuja}</p>
                    <p className="text-body-text"><strong>Contact: </strong>{currentCountry.embassyVisaProcess.phone} | {currentCountry.embassyVisaProcess.email}</p>
                    <a href={currentCountry.embassyVisaProcess.websiteUrl} target="_blank" rel="noreferrer" className="text-primary-green hover:underline font-bold inline-flex items-center gap-1 mt-1">
                      Official Embassy Portal <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-body-text">
                    <div className="p-4 bg-cream-bg/25 border border-light-gold/10 rounded-2xl">
                      <strong className="text-dark-text block mb-1">Visa Submission Details</strong>
                      <p><strong>Visa Class:</strong> {currentCountry.embassyVisaProcess.visaType}</p>
                      <p><strong>Fees:</strong> {currentCountry.embassyVisaProcess.visaFeeLocal} (~{currentCountry.embassyVisaProcess.visaFeeNaira})</p>
                      <p><strong>Timescale:</strong> {currentCountry.embassyVisaProcess.processingTimeWeeks}</p>
                      <p><strong>Interview Required?</strong> {currentCountry.embassyVisaProcess.interviewRequired ? "Yes" : "No"}</p>
                    </div>

                    <div className="p-4 bg-cream-bg/25 border border-light-gold/10 rounded-2xl space-y-1">
                      <strong className="text-dark-text block">Visa Checklist</strong>
                      <ul className="list-disc pl-4 space-y-0.5 text-light-text">
                        {currentCountry.embassyVisaProcess.requiredVisaDocumentsChecklist.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-cream-bg/40 border border-light-gold/25 rounded-2xl text-xs space-y-2">
                    <strong className="text-dark-text uppercase font-mono tracking-wider block">EMBASSY SCHEDULING WARNING</strong>
                    <p className="text-body-text">{currentCountry.embassyVisaProcess.appointmentDetails}</p>
                    <p className="text-emerald-700 font-bold leading-snug pt-1">💡 Pro Tips: Check early at 7:00 AM daily for newly listed appointment opening cycles.</p>
                  </div>
                </div>
              </div>

              {/* POST STUDY Relocation PR Pathway checklist */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary-green" />
                  6. Post-Study & Permanent Residency (PR) Pathway
                </h5>
                <div className="space-y-4 text-xs leading-relaxed text-body-text">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-cream-bg/30 rounded-2xl">
                      <strong className="text-dark-text block hover:text-primary-green transition-colors">Post-Study Work Permit</strong>
                      <p className="font-serif font-bold text-emerald-700 text-sm mt-1">{currentCountry.postStudyPathway.postStudyWorkVisaName}</p>
                      <p className="mt-1"><strong>Duration:</strong> {currentCountry.postStudyPathway.duration}</p>
                      <p><strong>Switch Allowed? </strong> {currentCountry.postStudyPathway.canSwitchToWorkVisa ? "Yes" : "No"}</p>
                      <p><strong>Job Constraints: </strong> {currentCountry.postStudyPathway.canWorkAnyJob ? "Open Visa" : "Employer Sponsored Only"}</p>
                    </div>

                    <div className="p-4 bg-cream-bg/30 rounded-2xl">
                      <strong className="text-dark-text block hover:text-primary-green transition-colors">Permanent Residency (PR)</strong>
                      <p className="mt-1"><strong>Eligibility:</strong> {currentCountry.postStudyPathway.prEligibilityYears}</p>
                      <p><strong>Application Fees:</strong> {currentCountry.postStudyPathway.prCost}</p>
                      <p><strong>Key PR Benefits:</strong> {currentCountry.postStudyPathway.prBenefits}</p>
                    </div>

                    <div className="p-4 bg-cream-bg/30 rounded-2xl border border-light-gold/15">
                      <strong className="text-dark-text block flex items-center gap-1 text-amber-700 font-bold uppercase tracking-wider font-mono text-[10px]">
                        👨‍👩‍👧 Dependents Status
                      </strong>
                      <p className="mt-1 text-dark-text/90 font-medium text-xs leading-relaxed">
                        {currentCountry.postStudyPathway.familyReunificationDetails}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-cream-bg/40 border border-light-gold/25 rounded-2xl">
                    <strong className="text-dark-text block uppercase font-mono mb-2">Relocation Path Milestone Timeline</strong>
                    <ul className="space-y-2 pl-4 border-l border-light-gold">
                      {currentCountry.postStudyPathway.timelineSummary.map((t, idx) => (
                        <li key={idx} className="relative pl-1">
                          <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#10b068] border border-white" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* PRE-DEPARTURE CHECKLIST ACTION STEPS */}
              <div className="bg-white rounded-3xl border border-light-gold/30 p-6 shadow-sm space-y-4">
                <h5 className="font-serif font-bold text-dark-text text-lg border-b border-light-gold/10 pb-3 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-500 animate-bounce" />
                  7. Pre-Departure Action Steps
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-body-text leading-relaxed">
                  <div className="space-y-1.5">
                    <strong className="text-dark-text uppercase font-mono tracking-wider block">Before Leaving Nigeria</strong>
                    <ul className="space-y-1 bg-cream-bg/15 border border-light-gold/10 p-3 rounded-2xl">
                      {currentCountry.preDepartureChecklist.map((c, i) => (
                        <li key={i} className="flex gap-2 items-start text-dark-text/95">
                          <span className="font-bold text-[#10b068]">✓</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <strong className="text-dark-text uppercase font-mono tracking-wider block">First Week on Arrival Checklist</strong>
                    <ul className="space-y-1 bg-cream-bg/15 border border-light-gold/10 p-3 rounded-2xl">
                      {currentCountry.firstWeekGuide.map((g, i) => (
                        <li key={i} className="flex gap-2 items-start text-dark-text/95">
                          <span className="font-bold text-nigerian-gold">➔</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PAYSTACK POPUP COMPONENT (Controlled by State overlay) */}
      {showPaystack && (
        <PaystackSim
          amount={5000}
          email={email}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaystack(false)}
        />
      )}

    </div>
  );
}
