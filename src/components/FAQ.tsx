import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is JapaReady a registered immigration agency?",
    answer: "No, JapaReady is not a licensed immigration consultancy or travel agency. We are an AI-powered guidance platform that retrieves and reviews publicly available rules, fees, and requirements directly from official embassy and university databases to generate tailored blueprints. Always verify final steps on official government websites."
  },
  {
    question: "Do you offer refunds after generating my paid roadmap?",
    answer: "Because AI web searching and specialized computation costs are incurred immediately upon generating a personalized detailed roadmap, we do not offer refunds once the report is finalized. However, the premium guide is so comprehensive that it replicates weeks of personalized research."
  },
  {
    question: "Can I use an HND or ND qualification for Masters admission?",
    answer: "Yes! Some countries allow direct or indirect admission. For example, the United Kingdom features specific universities accepting HND directly for some MSc programmes if you have years of relevant experience. Others, like Germany, require a top-up or foundation conversion. Your profile report will explicitly flag HND-accepting schools."
  },
  {
    question: "What is 'Form A' and how does it affect my budget?",
    answer: "Form A is a Nigerian federal document that allows students to purchase foreign currency (for tuition and upkeep fees) at official Central Bank exchange rates rather than expensive black market parallel rates. While it can save you massive sums of Naira, standard processing takes weeks or months, which we detail in our checklists."
  },
  {
    question: "How reliable are the Live Exchange Rates listed in the cost breakdowns?",
    answer: "We query live currency rates dynamically ($1 USD to NGN conversion). However, due to Nigerian Forex market volatility, rates fluctuate daily. We recommend budgeting an extra 10-15% conversion buffer as suggested in our volatility alerts."
  },
  {
    question: "Can I bypass the IELTS English proficiency test requirement?",
    answer: "Yes, certain universities allow English proficiency waivers for students from Nigeria since the official language is English, provided you submit an official Letter of English Instruction from your prior institution. Your report will specifically state the IELTS/TOEFL requirements per option."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-cream-bg border-t border-light-gold/20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-green/10 text-primary-green text-xs font-mono rounded-full mb-3">
            <HelpCircle className="w-3 px-0.5 h-3" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-dark-text font-bold mb-4">
            Clear Answers for Your Japa Strategy
          </h2>
          <p className="text-light-text max-w-2xl mx-auto text-sm md:text-base">
            Everything you need to know about immigration pathways, accuracy, fees, and expectations.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-light-gold/20 shadow-sm transition-all duration-300"
                id={`faq-item-${idx}`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif font-semibold text-dark-text text-base md:text-lg">
                    {faq.question}
                  </span>
                  <span className={`p-1.5 rounded-full bg-cream-bg text-primary-green transition-transform duration-350 ${isOpen ? "rotate-180 bg-primary-green/10" : ""}`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-350 ${isOpen ? "max-h-96 border-t border-light-gold/10" : "max-h-0"}`}
                >
                  <div className="px-6 py-5 text-body-text text-sm leading-relaxed bg-white/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
