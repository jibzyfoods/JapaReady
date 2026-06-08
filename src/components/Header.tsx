import { Plane } from "lucide-react";

interface HeaderProps {
  currentPage: "home" | "calculator";
  onNavigate: (page: "home" | "calculator", sectionId?: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-light-gold/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate("home", "hero")} 
          className="flex items-center gap-2 cursor-pointer group"
          id="logo"
        >
          <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center text-white shadow-md group-hover:bg-light-green transition-all duration-300">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold text-dark-text tracking-tight flex items-center">
              Japa<span className="text-nigerian-gold">Ready</span>
            </span>
            <p className="text-[10px] font-mono leading-none text-light-text tracking-wider">AI ROADMAP GENERATOR</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate("home")} 
            className={`text-sm font-medium transition-colors ${currentPage === "home" ? "text-primary-green" : "text-body-text hover:text-primary-green"}`}
            id="nav-home"
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate("home", "how-it-works")} 
            className="text-body-text hover:text-primary-green text-sm font-medium transition-colors"
            id="nav-how-it-works"
          >
            How It Works
          </button>
          <button 
            onClick={() => onNavigate("home", "what-you-get")} 
            className="text-body-text hover:text-primary-green text-sm font-medium transition-colors"
            id="nav-what-you-get"
          >
            What You Get
          </button>
          <button 
            onClick={() => onNavigate("home", "pricing")} 
            className="text-body-text hover:text-primary-green text-sm font-medium transition-colors"
            id="nav-pricing"
          >
            Pricing
          </button>
          <button 
            onClick={() => onNavigate("home", "countries")} 
            className="text-body-text hover:text-primary-green text-sm font-medium transition-colors"
            id="nav-countries"
          >
            Countries Covered
          </button>
        </nav>

        {/* CTA Button */}
        <div>
          <button
            onClick={() => onNavigate("calculator")}
            className={`px-6 py-2.5 font-medium text-sm rounded-full transition-all duration-300 cursor-pointer ${
              currentPage === "calculator"
                ? "bg-cream-bg text-dark-text border border-light-gold/40 hover:bg-cream-bg/65"
                : "bg-primary-green text-white shadow-[0_4px_15px_rgba(13,107,63,0.2)] hover:bg-light-green hover:shadow-[0_15px_40px_rgba(13,107,63,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            }`}
            id="nav-cta"
          >
            {currentPage === "calculator" ? "View Japa Form" : "Get My Report"}
          </button>
        </div>
      </div>
    </header>
  );
}
