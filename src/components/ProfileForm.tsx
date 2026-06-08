import React, { useState } from "react";
import { ProfileForm as ProfileFormType } from "../types";
import { Sparkles, User, GraduationCap, Globe, DollarSign, Send, ArrowRight } from "lucide-react";

interface ProfileFormProps {
  onSubmit: (form: ProfileFormType) => void;
  isLoading: boolean;
}

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormType>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    highestQualification: "BSc / BA / BEng (Bachelor's Degree)",
    fieldOfStudy: "",
    gradeClass: "Second Class Upper / Upper Credit",
    cgpa: "",
    englishProficiency: "IELTS 6.0-6.5",
    workExperience: "1-2 years",
    budgetRange: "$5,000 - $15,000 (₦7.5M - ₦22.5M)",
    preference: "Master's Degree",
    preferredRegions: ["Europe"],
    travelTimeline: "Within 1 year",
    avoidCountry: ""
  });

  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "proficiency">("personal");

  const regionsList = [
    "Europe",
    "North America (USA, Canada)",
    "Asia",
    "Middle East",
    "Australia / New Zealand",
    "Anywhere — show me the best options"
  ];

  const handleRegionChange = (region: string) => {
    const current = formData.preferredRegions || [];
    if (current.includes(region)) {
      setFormData({
        ...formData,
        preferredRegions: current.filter((r) => r !== region)
      });
    } else {
      setFormData({
        ...formData,
        preferredRegions: [...current, region]
      });
    }
  };

  const currentTabIsValid = () => {
    if (activeTab === "personal") {
      return formData.fullName.trim() !== "" && formData.email.trim() !== "";
    }
    if (activeTab === "academic") {
      return formData.highestQualification !== "" && formData.fieldOfStudy.trim() !== "";
    }
    return true;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab === "personal") setActiveTab("academic");
    else if (activeTab === "academic") setActiveTab("proficiency");
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeTab === "proficiency") setActiveTab("academic");
    else if (activeTab === "academic") setActiveTab("personal");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-3xl border border-light-gold/30 shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden" id="profile-form-container">
      {/* Form Steps Header */}
      <div className="bg-primary-green px-6 py-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-light-gold/20">
        <div>
          <h3 className="font-serif text-xl font-bold tracking-tight">Step-By-Step Profile Registry</h3>
          <p className="text-xs text-white/80 mt-1">Complete your registry to generate an instant profile roadmap</p>
        </div>
        
        {/* Step Wizard indicators */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "personal" ? "bg-white text-primary-green shadow-sm" : "text-white/75 hover:bg-white/10"
            }`}
            id="wizard-step-personal"
          >
            1. Personal
          </button>
          <button
            type="button"
            onClick={() => {
              if (formData.fullName && formData.email) setActiveTab("academic");
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "academic" ? "bg-white text-primary-green shadow-sm" : "text-white/75 hover:bg-white/10"
            } ${!(formData.fullName && formData.email) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            id="wizard-step-academic"
          >
            2. Academic
          </button>
          <button
            type="button"
            onClick={() => {
              if (formData.fullName && formData.email && formData.fieldOfStudy) setActiveTab("proficiency");
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "proficiency" ? "bg-white text-primary-green shadow-sm" : "text-white/75 hover:bg-white/10"
            } ${!(formData.fullName && formData.email && formData.fieldOfStudy) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            id="wizard-step-proficiency"
          >
            3. Preferences
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Step 1: Personal Info */}
        {activeTab === "personal" && (
          <div className="space-y-5 animate-fade-in" id="personal-fields-tab">
            <div className="flex items-center gap-2 border-b border-light-gold/10 pb-2 mb-4">
              <User className="w-5 h-5 text-primary-green" />
              <h4 className="font-serif font-bold text-dark-text text-lg">Personal Registry</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Babatunde Alabi"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green text-dark-text"
                  required
                  id="form-full-name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  placeholder="e.g. babatunde@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green text-dark-text"
                  required
                  id="form-email-address"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Phone Number (WhatsApp - Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. +234 812 345 6789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  id="form-phone-number"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Gender (Optional)</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green text-dark-text"
                  id="form-gender-select"
                >
                  <option value="">Choose Options...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentTabIsValid()}
                className="px-6 py-3 bg-primary-green text-white font-semibold text-sm rounded-full flex items-center gap-1.5 shadow-md hover:bg-light-green disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                id="next-to-academic"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Academic Info */}
        {activeTab === "academic" && (
          <div className="space-y-5 animate-fade-in" id="academic-fields-tab">
            <div className="flex items-center gap-2 border-b border-light-gold/10 pb-2 mb-4">
              <GraduationCap className="w-5 h-5 text-primary-green" />
              <h4 className="font-serif font-bold text-dark-text text-lg">Academic Qualifications</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Highest Qualification <span className="text-red-500">*</span></label>
                <select
                  value={formData.highestQualification}
                  onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  required
                  id="form-highest-qualification"
                >
                  <option value="SSCE / O-Level">SSCE / O-Level</option>
                  <option value="OND (Ordinary National Diploma)">OND (Ordinary National Diploma)</option>
                  <option value="ND (National Diploma)">ND (National Diploma)</option>
                  <option value="HND (Higher National Diploma)">HND (Higher National Diploma)</option>
                  <option value="BSc / BA / BEng (Bachelor's Degree)">BSc / BA / BEng (Bachelor's Degree)</option>
                  <option value="PGD (Post Graduate Diploma)">PGD (Post Graduate Diploma)</option>
                  <option value="MSc / MA / MEng (Master's Degree)">MSc / MA / MEng (Master's Degree)</option>
                  <option value="PhD / Doctorate">PhD / Doctorate</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Course / Field of Study <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Accounting, Chemistry"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green text-dark-text"
                  required
                  id="form-course-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Grade / Class Classification <span className="text-red-500">*</span></label>
                <select
                  value={formData.gradeClass}
                  onChange={(e) => setFormData({ ...formData, gradeClass: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  required
                  id="form-grade-class"
                >
                  <option value="First Class / Distinction">First Class / Distinction</option>
                  <option value="Second Class Upper / Upper Credit">Second Class Upper / Upper Credit</option>
                  <option value="Second Class Lower / Lower Credit">Second Class Lower / Lower Credit</option>
                  <option value="Third Class / Pass">Third Class / Pass</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">CGPA (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 4.68 or 3.5"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  id="form-cgpa"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">English Proficiency <span className="text-red-500">*</span></label>
                <select
                  value={formData.englishProficiency}
                  onChange={(e) => setFormData({ ...formData, englishProficiency: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  required
                  id="form-english-proficiency"
                >
                  <option value="Not taken yet">Not taken yet</option>
                  <option value="IELTS 4.0-4.5">IELTS 4.0-4.5</option>
                  <option value="IELTS 5.0-5.5">IELTS 5.0-5.5</option>
                  <option value="IELTS 6.0-6.5">IELTS 6.0-6.5</option>
                  <option value="IELTS 7.0-7.5">IELTS 7.0-7.5</option>
                  <option value="IELTS 8.0+">IELTS 8.0+</option>
                  <option value="TOEFL 60-79">TOEFL 60-79</option>
                  <option value="TOEFL 80-99">TOEFL 80-99</option>
                  <option value="TOEFL 100+">TOEFL 100+</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Years of Work Experience <span className="text-red-500">*</span></label>
                <select
                  value={formData.workExperience}
                  onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  required
                  id="form-work-experience"
                >
                  <option value="No experience">No experience</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-cream-bg text-dark-text border border-light-gold/20 font-semibold text-sm rounded-full transition-all hover:bg-light-gold/10 cursor-pointer"
                id="back-to-personal"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentTabIsValid()}
                className="px-6 py-3 bg-primary-green text-white font-semibold text-sm rounded-full flex items-center gap-1.5 shadow-md hover:bg-light-green disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                id="next-to-preferences"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: English, Budget, Preferences */}
        {activeTab === "proficiency" && (
          <div className="space-y-6 animate-fade-in" id="preference-fields-tab">
            <div className="flex items-center gap-2 border-b border-light-gold/10 pb-2 mb-4">
              <Globe className="w-5 h-5 text-primary-green" />
              <h4 className="font-serif font-bold text-dark-text text-lg">Budgets & Preferences</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Budget Range (Annual) <span className="text-red-500">*</span></label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  required
                  id="form-budget-range"
                >
                  <option value="Need full scholarship (₦0 budget)">Need full scholarship (₦0 budget)</option>
                  <option value="Under $5,000 (Under ₦7.5M)">Under $5,000 (Under ₦7.5M)</option>
                  <option value="$5,000 - $15,000 (₦7.5M - ₦22.5M)">$5,000 - $15,000 (₦7.5M - ₦22.5M)</option>
                  <option value="$15,000 - $30,000 (₦22.5M - ₦45M)">$15,000 - $30,000 (₦22.5M - ₦45M)</option>
                  <option value="$30,000+ (₦45M+)">$30,000+ (₦45M+)</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">What Do You Want Abroad? <span className="text-red-500">*</span></label>
                <select
                  value={formData.preference}
                  onChange={(e) => setFormData({ ...formData, preference: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  required
                  id="form-ultimate-preference"
                >
                  <option value="Bachelor's Degree Abroad">Bachelor's Degree Abroad</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD / Doctorate">PhD / Doctorate</option>
                  <option value="Professional Certificate / Diploma">Professional Certificate / Diploma</option>
                  <option value="Work Visa (no study)">Work Visa (no study)</option>
                  <option value="Permanent Residency / Citizenship">Permanent Residency / Citizenship</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">When Do You Want to Travel? <span className="text-red-500">*</span></label>
                <select
                  value={formData.travelTimeline}
                  onChange={(e) => setFormData({ ...formData, travelTimeline: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green text-dark-text"
                  required
                  id="form-travel-timeline"
                >
                  <option value="As soon as possible">As soon as possible</option>
                  <option value="Within 6 months">Within 6 months</option>
                  <option value="Within 1 year">Within 1 year</option>
                  <option value="1-2 years from now">1-2 years from now</option>
                  <option value="2+ years from now">2+ years from now</option>
                  <option value="Just exploring options">Just exploring options</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Any Country You Do NOT Want? (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. USA, Northern Europe, none"
                  value={formData.avoidCountry}
                  onChange={(e) => setFormData({ ...formData, avoidCountry: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-cream-bg/40 border border-light-gold/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green text-dark-text"
                  id="form-avoid-country"
                />
              </div>
            </div>

            {/* Checklist Preferred Regions */}
            <div className="space-y-2 mt-2">
              <label className="text-xs font-semibold text-light-text uppercase tracking-wider block">Preferred Regions (Optional — Select Multiple)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {regionsList.map((reg) => {
                  const isChecked = (formData.preferredRegions || []).includes(reg);
                  return (
                    <label 
                      key={reg}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        isChecked 
                          ? "bg-primary-green/5 border-primary-green text-primary-green shadow-xs" 
                          : "bg-cream-bg/20 border-light-gold/20 text-body-text hover:bg-cream-bg/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleRegionChange(reg)}
                        className="mt-0.5 accent-primary-green cursor-pointer"
                        id={`check-region-${reg.toLowerCase().replace(/[^a-z]/g, "")}`}
                      />
                      <span>{reg}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit Action Block */}
            <div className="pt-6 border-t border-light-gold/15 flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-cream-bg text-dark-text border border-light-gold/20 font-semibold text-sm rounded-full transition-all hover:bg-light-gold/10 cursor-pointer"
                id="back-to-academic-2"
              >
                Back
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4.5 bg-nigerian-gold text-white font-bold text-base rounded-full shadow-[0_4px_15px_rgba(212,165,55,0.25)] hover:shadow-[0_15px_40px_rgba(212,165,55,0.4)] hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 flex items-center gap-2"
                id="submit-profile-form"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Analyzing Profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-yellow-100" />
                    Generate My Report →
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
