export interface ProfileForm {
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  highestQualification: string;
  fieldOfStudy: string;
  gradeClass: string;
  cgpa?: string;
  englishProficiency: string;
  workExperience: string;
  budgetRange: string;
  preference: string; // What do you want
  preferredRegions?: string[];
  travelTimeline: string;
  avoidCountry?: string;
}

export interface Ratings {
  scholarship: number; // 1-5
  visa: number; // 1-5
  tuition: number; // 1-5
  living: number; // 1-5
  pr: number; // 1-5
}

export interface WhyCountryForYou {
  matchReason: string;
  pros: string[];
  cons: string[];
}

export interface ScholarshipItem {
  name: string;
  covers: string;
  amountNaira: string;
  eligibility: string;
  deadline: string;
  applyLink: string;
  tips: string;
}

export interface SelfFundedPath {
  universities: string[];
  tuitionFeeLocal: string;
  tuitionFeeUSD: string;
  tuitionFeeNaira: string;
  livingCostLocal: string;
  livingCostNaira: string;
  accommodationCost: string;
  healthInsurance: string;
  estimatedAnnualTotalNaira: string;
  tuitionPaymentMethod: string;
  partTimeWorkRules: string;
  estimatedPartTimeEarningsNaira: string;
  netMonthlyCostNaira: string;
}

export interface AdmissionRequirements {
  academic: string;
  english: string;
  documentChecklist: string[];
  applicationFeeNaira: string;
  portalUrl: string;
  deadline: string;
}

export interface ProcessDetails {
  needed: boolean;
  steps: string[];
}

export interface NigerianSideProcesses {
  moe: ProcessDetails;
  mfa: ProcessDetails;
  apostille: ProcessDetails;
  notaryOnly: ProcessDetails;
}

export interface EmbassyVisaProcess {
  embassyName: string;
  addressLagosAbuja: string;
  phone: string;
  email: string;
  websiteUrl: string;
  workingHours: string;
  visaType: string;
  visaPortalUrl: string;
  requiresAppointment: boolean;
  appointmentDetails: string;
  requiredVisaDocumentsChecklist: string[];
  visaFeeLocal: string;
  visaFeeNaira: string;
  processingTimeWeeks: string;
  interviewRequired: boolean;
  interviewTips: string;
  biometricsDetails: string;
  visaDecisionDetails: string;
  successRateAnalysis: string;
  rejectionReasons: string[];
  reapplyBuffer: string;
}

export interface PostStudyPathway {
  postStudyWorkVisaName: string;
  duration: string;
  howToApply: string;
  canSwitchToWorkVisa: boolean;
  canWorkAnyJob: boolean;
  estimatedEarningsFieldNaira: string;
  prEligibilityYears: string;
  prRequirements: string;
  prCost: string;
  prProcessingTime: string;
  prBenefits: string;
  citizenshipEligibilityYears: string;
  citizenshipRequirements: string;
  allowsDualCitizenship: boolean;
  dualCitizenshipExplanation: string;
  passportStrengthRank: string;
  familyReunificationDetails: string;
  timelineSummary: string[];
}

export interface CountryResult {
  country: string;
  flag: string;
  matchPercentage: number;
  ratings: Ratings;
  realityCheck: string;
  whyForYou: WhyCountryForYou;
  scholarshipPath: ScholarshipItem[];
  selfFundedPath: SelfFundedPath;
  admissionRequirements: AdmissionRequirements;
  nigerianSideProcesses: NigerianSideProcesses;
  embassyVisaProcess: EmbassyVisaProcess;
  preDepartureChecklist: string[];
  firstWeekGuide: string[];
  postStudyPathway: PostStudyPathway;
}

export interface JapaReport {
  score: number; // Japa Probability Score (0-100)
  scoreText: string; // Explanatory rating paragraph
  countries: CountryResult[];
  profileSummaryText: string;
}
