import { useState, useRef } from "react";
import Header from "./components/Header";
import ProfileForm from "./components/ProfileForm";
import ResultsDashboard from "./components/ResultsDashboard";
import FAQ from "./components/FAQ";
import { ProfileForm as ProfileFormType, JapaReport } from "./types";
import { 
  Sparkles, CheckCircle, ShieldAlert, BadgeInfo, Scale, Mail, Globe, Cpu, Plane,
  Users, Award, Receipt, Milestone, GraduationCap, ArrowUpRight, Lock, Check, FileCheck
} from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<JapaReport | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState<"home" | "calculator">("home");

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const handleNavigation = (targetPage: "home" | "calculator", sectionId?: string) => {
    setCurrentPage(targetPage);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const countriesList = [
    { name: "Germany", flag: "🇩🇪", region: "Europe" },
    { name: "United Kingdom", flag: "🇬🇧", region: "Europe" },
    { name: "Canada", flag: "🇨🇦", region: "North America" },
    { name: "United States", flag: "🇺🇸", region: "North America" },
    { name: "Ireland", flag: "🇮🇪", region: "Europe" },
    { name: "Netherlands", flag: "🇳🇱", region: "Europe" },
    { name: "France", flag: "🇫🇷", region: "Europe" },
    { name: "Italy", flag: "🇮🇹", region: "Europe" },
    { name: "Australia", flag: "🇦🇺", region: "Oceania" },
    { name: "New Zealand", flag: "🇳🇿", region: "Oceania" },
    { name: "Finland", flag: "🇫🇮", region: "Europe" },
    { name: "Sweden", flag: "🇸🇪", region: "Europe" },
    { name: "Spain", flag: "🇪🇸", region: "Europe" },
    { name: "Portugal", flag: "🇵🇹", region: "Europe" },
    { name: "UAE", flag: "🇦🇪", region: "Middle East" },
    { name: "Malaysia", flag: "🇲🇾", region: "Asia" },
    { name: "South Korea", flag: "🇰🇷", region: "Asia" },
    { name: "China", flag: "🇨🇳", region: "Asia" },
    { name: "Poland", flag: "🇵🇱", region: "Europe" },
    { name: "Hungary", flag: "🇭🇺", region: "Europe" },
    { name: "Russia", flag: "🇷🇺", region: "Europe/Asia" },
    { name: "Japan", flag: "🇯🇵", region: "Asia" },
    { name: "Singapore", flag: "🇸🇬", region: "Asia" },
    { name: "Norway", flag: "🇳🇴", region: "Europe" },
    { name: "Denmark", flag: "🇩🇰", region: "Europe" },
    { name: "Switzerland", flag: "🇨🇭", region: "Europe" },
    { name: "Belgium", flag: "🇧🇪", region: "Europe" },
    { name: "Austria", flag: "🇦🇹", region: "Europe" },
    { name: "Turkey", flag: "🇹🇷", region: "Europe" },
    { name: "South Africa", flag: "🇿🇦", region: "Africa" },
    { name: "Brazil", flag: "🇧🇷", region: "South America" },
    { name: "India", flag: "🇮🇳", region: "Asia" },
    { name: "Cyprus", flag: "🇨🇾", region: "Europe" },
    { name: "Greece", flag: "🇬🇷", region: "Europe" },
    { name: "Czech Republic", flag: "🇨🇿", region: "Europe" },
    { name: "Luxembourg", flag: "🇱🇺", region: "Europe" },
    { name: "Egypt", flag: "🇪🇬", region: "Africa" },
    { name: "Estonia", flag: "🇪🇪", region: "Europe" },
    { name: "Qatar", flag: "🇶🇦", region: "Middle East" },
    { name: "Saudi Arabia", flag: "🇸🇦", region: "Middle East" }
  ];

  const handleFormSubmit = async (formData: ProfileFormType) => {
    setIsLoading(true);
    setErrorMessage("");
    setReport(null);
    setUserEmail(formData.email);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        const text = await res.text();
        console.error("Received HTML response instead of JSON:", text);
        throw new Error(
          "The JapaReady AI engine is currently finalizing its network pipeline or experiencing peak load. Please wait a few seconds and try submitting again."
        );
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to analyze profile.");
      }

      setReport(data.report);

      // Scroll smoothly to results
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred. Please ensure your Gemini API key is configured.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-cream-bg flex flex-col antialiased">
      <Header currentPage={currentPage} onNavigate={handleNavigation} />

      {currentPage === "home" && (
        <>
          {/* Hero Section */}
          <section id="hero" className="relative pt-16 pb-20 md:py-28 overflow-hidden">
            {/* Soft background glow accents */}
            <div className="absolute top-1/4 -left-36 w-96 h-96 rounded-full bg-primary-green/5 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -right-36 w-96 h-96 rounded-full bg-nigerian-gold/5 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Hero text information */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-green/10 text-primary-green text-xs font-semibold rounded-full border border-primary-green/20">
                  <Sparkles className="w-3.5 h-3.5 text-nigerian-gold animate-spin-slow" />
                  <span>DYNAMIC AI JAPA CALCULATOR</span>
                </div>
                
                <h1 className="font-serif text-5xl md:text-6xl font-black text-dark-text tracking-tight leading-[1.1]">
                  Stop guessing. <br />
                  Get your personalized <span className="text-primary-green">Japa Roadmap</span>.
                </h1>
                
                <p className="text-light-text text-base md:text-lg max-w-xl leading-relaxed">
                  We analyze your degree, grades, budget, English proficiency, and experience against <strong>40+ countries in real-time</strong>. Get tuition and living costs in Naira, visa checklists, and step-by-step pathways to relocation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => handleNavigation("calculator")}
                    className="px-8 py-4 bg-primary-green hover:bg-light-green text-white font-serif font-black text-base rounded-full shadow-[0_5px_20px_rgba(13,107,63,0.3)] hover:shadow-[0_15px_40px_rgba(13,107,63,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer text-center"
                    id="hero-get-report-btn"
                  >
                    Get My Free Report
                  </button>
              <button
                onClick={() => {
                  const el = document.getElementById("faq");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 bg-white hover:bg-cream-bg/35 text-dark-text font-serif font-bold text-base rounded-full border border-light-gold/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-center"
                id="hero-faq-btn"
              >
                How It Works
              </button>
            </div>

            {/* Float badges statistics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-light-gold/20 max-w-lg">
              <div>
                <span className="font-serif text-2xl md:text-3xl font-bold text-primary-green block">40+</span>
                <span className="text-[10px] font-mono font-bold text-light-text uppercase tracking-wider">Destination Countries</span>
              </div>
              <div>
                <span className="font-serif text-2xl md:text-3xl font-bold text-nigerian-gold block">100%</span>
                <span className="text-[10px] font-mono font-bold text-light-text uppercase tracking-wider">Nigerian Context</span>
              </div>
              <div>
                <span className="font-serif text-2xl md:text-3xl font-bold text-dark-text block">5 Mins</span>
                <span className="text-[10px] font-mono font-bold text-light-text uppercase tracking-wider">Analysis Speed</span>
              </div>
            </div>
          </div>

          {/* Hero floating app illustration / card visuals */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md animate-bob bg-white rounded-3xl border border-light-gold/30 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-dark-text text-base leading-none">AI Profile Evaluation Analyzer</h4>
                  <p className="text-[10px] font-mono text-light-text mt-1">REAL-TIME WEB SEARCH ENABLED</p>
                </div>
              </div>

              {/* Sample Profile Metrics list */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs p-3.5 bg-cream-bg/30 rounded-2xl border border-light-gold/10">
                  <span className="text-light-text font-mono">HIGHEST DEGREE</span>
                  <strong className="text-dark-text">BSc / HND Holder</strong>
                </div>
                <div className="flex justify-between items-center text-xs p-3.5 bg-cream-bg/30 rounded-2xl border border-light-gold/10">
                  <span className="text-light-text font-mono">ANNUAL BUDGET</span>
                  <strong className="text-dark-text">$5,000 - $15,000</strong>
                </div>
                <div className="flex justify-between items-center text-xs p-3.5 bg-cream-bg/30 rounded-2xl border border-light-gold/10">
                  <span className="text-light-text font-mono">TARGET PATHWAY</span>
                  <strong className="text-dark-text">Masters / Work Visa</strong>
                </div>
              </div>

              <div className="p-4 bg-primary-green/5 text-primary-green text-xs font-semibold rounded-2xl flex items-center gap-2 border border-light-gold/15">
                <CheckCircle className="w-5 h-5 text-[#10b068]" />
                <span>DAAD, Chevening, and Commonwealth Deadlines Loaded</span>
              </div>

              {/* Green pulse locator badge */}
              <div className="absolute -top-3 -right-3 bg-white px-3.5 py-1.5 rounded-full border border-light-gold/30 shadow-md text-[10px] font-mono flex items-center gap-1.5 font-bold text-[#10b068]">
                <span className="w-2 h-2 rounded-full bg-[#10b068] animate-ping-custom" />
                <span>AVAILABLE NOW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Problem */}
      <section id="the-problem" className="py-20 bg-white border-t border-b border-light-gold/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-full mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>THE EXPATRIATION DILEMMA</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-dark-text font-bold mb-4">
              Why Current Japa Research is Broken
            </h2>
            <p className="text-light-text text-sm md:text-base leading-relaxed">
              Relocating and studying abroad shouldn't be a game of random internet searches. Here is are the hurdles current applicants face:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">1</div>
              <h4 className="font-serif font-bold text-dark-text text-lg">200+ Websites to Screen Alone</h4>
              <p className="text-body-text text-sm leading-relaxed">
                Manually scanning and bookmarking university requirements, visa guidelines, and scholarships across dozens of countries is dizzying and takes months.
              </p>
            </div>

            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-15 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">2</div>
              <h4 className="font-serif font-bold text-dark-text text-lg">Naira Volatilities & Currency Shocks</h4>
              <p className="text-body-text text-sm leading-relaxed">
                Tuition fees change dynamically. When parallel exchange markets spike overnight, your self-funded relocation estimates break apart.
              </p>
            </div>

            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">3</div>
              <h4 className="font-serif font-bold text-dark-text text-lg">HND or ND Holders Ignored</h4>
              <p className="text-body-text text-sm leading-relaxed">
                Standard study platforms only accommodate traditional BSc structures. HND graduates are left puzzled regarding top-ups, conversion programs, or MSc acceptances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section id="how-it-works" className="py-20 bg-cream-bg/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-widest block mb-1">THE SYSTEM ARCHITECTURE</span>
            <h2 className="font-serif text-3xl md:text-4xl text-dark-text font-bold mb-4">
              Generate Your Roadmap in 3 Steps
            </h2>
            <p className="text-light-text text-sm md:text-base">
              Get an instant fully detailed relocation dossier tailored strictly to your grades and budget range.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-green text-white font-serif text-lg font-bold flex items-center justify-center mx-auto shadow-md">1</div>
              <h4 className="font-serif font-bold text-dark-text text-lg">Fill Your Profile Questionnaire</h4>
              <p className="text-body-text text-sm max-w-xs mx-auto">
                Define your qualification, GPA, target region preference, travel timeline, and financial budget in our wizard form.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-green text-white font-serif text-lg font-bold flex items-center justify-center mx-auto shadow-md">2</div>
              <h4 className="font-serif font-bold text-dark-text text-lg">AI Real-Time Web Analysis</h4>
              <p className="text-body-text text-sm max-w-xs mx-auto">
                Gemini processes your profile parameters, checks actual live 2026 guidelines, and converts all fees using dynamic NGN rates.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-green text-white font-serif text-lg font-bold flex items-center justify-center mx-auto shadow-md">3</div>
              <h4 className="font-serif font-bold text-dark-text text-lg">Review Relocation Blueprints</h4>
              <p className="text-body-text text-sm max-w-xs mx-auto">
                Explore calculated success scores, scholarship deadlines, physical embassies, and permanent residency post-study steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: What You Get */}
      <section id="what-you-get" className="py-20 bg-white border-t border-b border-light-gold/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-green/10 text-primary-green text-xs font-mono rounded-full mb-3">
              <Award className="w-4 h-4 text-nigerian-gold animate-bounce" />
              <span>THE DOSSIER HIGHLIGHTS</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-dark-text font-bold mb-4">
              What Appears Inside Your Study Registry Report
            </h2>
            <p className="text-light-text text-sm">
              We detail every stage in clear human terms—allowing you to formulate a foolproof strategic plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-mono">1</div>
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-dark-text text-lg leading-tight">Japa Probability Score</h5>
                <p className="text-body-text text-xs leading-relaxed">
                  An overall profile evaluation rating (0-100) highlighting strengths, vulnerabilities, and steps to boost admission.
                </p>
              </div>
            </div>

            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-mono">2</div>
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-dark-text text-lg leading-tight">Integrative Cost of Living</h5>
                <p className="text-body-text text-xs leading-relaxed">
                  Tuition, medical, accommodation and feeding fees converted dynamically to Naira for exact budgeting.
                </p>
              </div>
            </div>

            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-mono">3</div>
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-dark-text text-lg leading-tight">Active Scholarships Finder</h5>
                <p className="text-body-text text-xs leading-relaxed">
                  Listings of government and institutional bursary grants featuring eligibility rules, due dates, and links.
                </p>
              </div>
            </div>

            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-mono">4</div>
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-dark-text text-lg leading-tight">Embassy Visa Procedures</h5>
                <p className="text-body-text text-xs leading-relaxed">
                  Physical street locations of embassies in Lagos or Abuja, booking timelines, visa fees, and rejection mitigations.
                </p>
              </div>
            </div>

            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-mono">5</div>
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-dark-text text-lg leading-tight">Nigerian Side Documents</h5>
                <p className="text-body-text text-xs leading-relaxed">
                  Steps for verifying secondary WAEC credentials, official transcripts, and Ministry of Education authentication.
                </p>
              </div>
            </div>

            <div className="p-6 bg-cream-bg/15 border border-light-gold/15 rounded-3xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-mono">6</div>
              <div className="space-y-2">
                <h5 className="font-serif font-bold text-dark-text text-lg leading-tight">Post-Study Work Permits</h5>
                <p className="text-body-text text-xs leading-relaxed">
                  Durations, extension rules, and Permanent Residency (PR) timelines allowing strategic long-term citizenship planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Countries We Cover */}
      <section id="countries" className="py-20 bg-cream-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-widest block mb-1">GLOBAL REACH</span>
            <h2 className="font-serif text-3xl md:text-4xl text-dark-text font-bold mb-4">
              Countries Checked by our AI Core Classifier
            </h2>
            <p className="text-light-text text-sm">
              We check your profile compatibility factors against over 40+ top-tier study and work locations:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {countriesList.map((c) => (
              <div 
                key={c.name}
                className="bg-white p-4 rounded-2xl border border-light-gold/20 shadow-xs text-center flex flex-col items-center justify-center space-y-2 hover:translate-y-[-3px] transition-transform duration-300"
                id={`country-card-${c.name.toLowerCase()}`}
              >
                <span className="text-4xl filter drop-shadow-xs flex items-center justify-center">
                  {getCountryFlagImg(c.name, c.flag)}
                </span>
                <span className="font-serif text-sm font-semibold text-dark-text">{c.name}</span>
                <span className="text-[9px] font-mono text-light-text uppercase tracking-wider">{c.region}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Sample Report Preview */}
      <section id="sample-preview" className="py-20 bg-white border-t border-b border-light-gold/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark-text mb-4">
              A Quick Peek At Our Roadmap Dashboard
            </h2>
            <p className="text-light-text text-sm leading-relaxed">
              Fully interactive dashboard components tailored to guide you from Abuja authentication desks to international university lecture halls.
            </p>
          </div>

          {/* High contrast blurred peek elements simulating the full baby guide */}
          <div className="relative max-w-4xl mx-auto overflow-hidden rounded-3xl border border-light-gold/30 p-4 md:p-8 bg-cream-bg/10 shadow-[0_15px_60px_rgba(0,0,0,0.03)] filter">
            <div className="flex justify-between items-center pb-4 border-b border-light-gold/10 mb-6 text-left">
              <div>
                <span className="text-[10px] font-mono text-primary-green font-bold">SAMPLE RELOCATION PATHWAY</span>
                <h4 className="font-serif text-xl font-bold text-dark-text">Canada Study Relocation Dossier</h4>
              </div>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                ★ 94% Match Fit
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left filter blur-[3px] select-none pointer-events-none">
              <div className="p-4 bg-white rounded-2xl border border-light-gold/10 space-y-2">
                <span className="text-[9px] text-light-text font-mono font-bold block">STUDY PATH TUITION</span>
                <strong className="text-dark-text font-serif text-lg">₦15,400,000 / year</strong>
                <p className="text-[10px] text-light-text">In CAD: $18,500/yr CAD</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-light-gold/10 space-y-2">
                <span className="text-[9px] text-light-text font-mono font-bold block">EMBASSY LOCATION</span>
                <strong className="text-dark-text text-xs block">Canadian High Commission</strong>
                <p className="text-[10px] text-light-text">Abuja: 4, Anifowoshe Street, Victoria Island</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-light-gold/10 space-y-2">
                <span className="text-[9px] text-light-text font-mono font-bold block">POST WORK PERMIT</span>
                <strong className="text-dark-text text-xs block">PGWP (Post-Graduate Work Permit)</strong>
                <p className="text-[10px] text-light-text">Up to 3 yr work eligibility</p>
              </div>
            </div>

            {/* Locked floating badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 space-y-4">
              <div className="bg-white/95 border border-light-gold p-6 rounded-2xl shadow-xl max-w-xs text-center space-y-3">
                <Lock className="w-8 h-8 text-nigerian-gold mx-auto" strokeWidth={1.5} />
                <h5 className="font-serif font-black text-dark-text text-base leading-snug">Visual Blueprint Locked</h5>
                <p className="text-[11px] leading-relaxed text-light-text">
                  Complete your short eligibility registry below to discover your personalized country suitability options.
                </p>
                <button 
                  onClick={() => handleNavigation("calculator")}
                  className="w-full py-2 bg-primary-green text-white font-semibold text-xs rounded-full hover:bg-light-green transition-colors cursor-pointer"
                  id="go-to-form-from-preview"
                >
                  Generate My Report Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Pricing Comparison */}
      <section id="pricing" className="py-20 bg-cream-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-widest block mb-1">MEMBERSHIP PLANS</span>
            <h2 className="font-serif text-3xl md:text-4xl text-dark-text font-bold mb-4">
              Fair & Transparent Pricing Structuring
            </h2>
            <p className="text-light-text text-sm">
              Begin with our free profile matches. Upgrade to our complete baby guide anytime to unlock deep structural reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white rounded-3xl border border-light-gold/20 p-8 shadow-sm space-y-6 flex flex-col justify-between" id="pricing-card-free">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-cream-bg text-primary-green text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">TIER 1 — DISCOVERY</span>
                <h4 className="font-serif font-bold text-dark-text text-3xl">Free</h4>
                <p className="text-xs text-light-text leading-relaxed">Perfect to check which countries align generally best with your qualification grading and score.</p>
                
                <ul className="space-y-3 pt-4 text-sm text-body-text">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-1" />
                    <span>Japa Probability Match Score (0-100)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-1" />
                    <span>Discovery of Top 2 best fit country options</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-1" />
                    <span>Raw Reality Dashboard star ratings</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-light-text/60 line-through">
                    <span className="w-4 h-4 flex-shrink-0" />
                    <span>Detailed Naira breakdowns and authentication step checklists</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleNavigation("calculator")}
                className="w-full mt-8 py-3.5 bg-cream-bg hover:bg-light-gold/10 text-dark-text font-serif font-bold text-sm rounded-full transition-colors cursor-pointer text-center"
                id="pricing-free-cta"
              >
                Register Profile Free
              </button>
            </div>

            {/* Paid Tier */}
            <div className="bg-white rounded-3xl border-2 border-primary-green p-8 shadow-md space-y-6 flex flex-col justify-between relative" id="pricing-card-paid">
              <div className="absolute top-4 right-4 bg-primary-green text-white text-[10px] font-bold font-mono px-3 py-1 rounded-full">
                RECOMMENDED BEST VALUE
              </div>
              
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-primary-green/10 text-primary-green text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">TIER 2 — THE BABY GUIDE</span>
                <h4 className="font-serif font-black text-dark-text text-3xl">₦5,000 <span className="text-xs text-light-text font-serif font-normal">/ one-time</span></h4>
                <p className="text-xs text-light-text leading-relaxed">Unlock complete, highly targeted relocations action steps—replaces days of consultancy fees for a fraction of the cost.</p>
                
                <ul className="space-y-3 pt-4 text-sm text-body-text">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary-green flex-shrink-0 mt-0.5 font-bold" />
                    <span><strong>Everything in Tier 1 Access Plus:</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-0.5" />
                    <span>3 matched countries with complete analysis details</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-0.5" />
                    <span>Live Exchange Rate converted cost matrices (Naira)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-0.5" />
                    <span>Embassy addresses and appointment booking links</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#10b068] flex-shrink-0 mt-0.5" />
                    <span>WAEC, MOE, and MFA Apostille flow breakdowns</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleNavigation("calculator")}
                className="w-full mt-8 py-3.5 bg-primary-green hover:bg-light-green text-white font-serif font-black text-sm rounded-full shadow-lg transition-colors cursor-pointer text-center"
                id="pricing-paid-cta"
              >
                Access Full Baby Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )}

      {/* Dedicated Calculator / Report Page */}
      {currentPage === "calculator" && (
        <div className="flex-1 bg-white">
          {/* Action breadcrumb controls */}
          <div className="max-w-7xl mx-auto px-6 pt-10 pb-2">
            <button
              onClick={() => handleNavigation("home")}
              className="inline-flex items-center gap-2 text-primary-green hover:text-light-green text-sm font-semibold transition-colors cursor-pointer"
              id="back-to-home-link"
            >
              ← Back to Home Page
            </button>
          </div>

          {!report ? (
            <section id="form-section" ref={formRef} className="py-12 bg-white">
              <div className="max-w-4xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-[#a58137] text-xs font-mono rounded-full mb-3">
                    <FileCheck className="w-4 h-4" />
                    <span>REGISTRY REGISTRATION</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-dark-text font-bold mb-4">
                    Tell JapaReady AI About Your Goals
                  </h2>
                  <p className="text-light-text text-sm">
                    We never collect sensitive files like Passenger passports, Bank passwords, or NIN numbers. Your registry is processed strictly with secure privacy protections.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <div className="space-y-1">
                      <strong className="block text-rose-950 font-sans text-sm">Registry Pipeline Halts</strong>
                      <p className="leading-snug">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <ProfileForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>
            </section>
          ) : (
            <section id="results-section" ref={resultsRef} className="py-12 bg-cream-bg/40 scroll-mt-18 min-h-screen">
              <div className="max-w-7xl mx-auto px-6" id="full-unlocked-report">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left border-b border-light-gold/25 pb-8">
                  <div className="max-w-2xl">
                    <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider block mb-1">DOSSIER DELIVERED SUITABLE PATHWAY</span>
                    <h2 className="font-serif text-3xl md:text-4xl font-black text-dark-text leading-tight">
                      Your AI-Powered Relocation Blueprint
                    </h2>
                    <p className="text-light-text text-sm mt-2">
                      We have prepared and filtered matches for <strong>{report.countries[0].country}</strong> and <strong>{report.countries[1].country}</strong>. Undergo simulated checkouts to uncover all detailed checklists.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setReport(null);
                      setErrorMessage("");
                    }}
                    className="px-6 py-2.5 bg-white border border-light-gold/30 hover:bg-cream-bg text-dark-text text-xs font-bold rounded-full transition-all duration-300 font-serif cursor-pointer shadow-sm text-center"
                    id="reset-form-btn"
                  >
                    Reset Form & Re-Analyze
                  </button>
                </div>

                <ResultsDashboard report={report} email={userEmail} />
              </div>
            </section>
          )}
        </div>
      )}

      {/* Section 11: FAQs (Only shown on home page) */}
      {currentPage === "home" && <FAQ />}

      {/* Section 12 & Website Footer: Legal disclosures */}
      <footer className="bg-dark-text text-white py-16 border-t border-light-gold/25 text-left text-xs md:text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-green flex items-center justify-center text-white">
                <Plane className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                Japa<span className="text-nigerian-gold">Ready</span>
              </span>
            </div>
            
            <p className="text-white/70 text-xs leading-relaxed max-w-sm">
              The AI-Powered Japa Calculator For Nigerians. Empowering aspirants with cost breakdowns, authenticating desks guidelines, and active bursary timelines.
            </p>

            <span className="text-[10px] text-white/40 block pt-4 font-mono uppercase tracking-widest">
              © {new Date().getFullYear()} JapaReady. All Rights Reserved. Built securely for Nigerians.
            </span>
          </div>

          <div className="space-y-3">
            <strong className="text-nigerian-gold uppercase tracking-wider block text-xs font-mono">Privacy Policy</strong>
            <ul className="space-y-2 text-xs text-white/75 font-sans leading-relaxed">
              <li>• We do not sell your personal data to any third party.</li>
              <li>• Information is used ONLY to calculate match probability roadmaps.</li>
              <li>• We do not share registry coordinates with any embassies.</li>
              <li>• Records are saved securely using encrypted in-memory caches.</li>
              <li>• Request profile deletion anytime by contacting admin email.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <strong className="text-nigerian-gold uppercase tracking-wider block text-xs font-mono font-bold">Terms & Disclaimers</strong>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              JapaReady provides AI-generated orientation derived from public matrices. We are NOT licensed immigration consultants or legal travel agencies. We NEVER guarantee visa approvals or scholarships. Please cross-reference guidelines on official government portals before final settlements.
            </p>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              <strong>Contact:</strong> support@japaready.com
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
