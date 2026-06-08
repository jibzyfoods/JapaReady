import React, { useState } from "react";
import { CreditCard, Landmark, PhoneCall, ShieldCheck, X, Loader } from "lucide-react";

interface PaystackSimProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

type PayMethod = "card" | "transfer" | "ussd";

export default function PaystackSim({ amount, email, onSuccess, onClose }: PaystackSimProps) {
  const [method, setMethod] = useState<PayMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"fill" | "submitting" | "success">("fill");

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);

  const handleCardPay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStep("submitting");

    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess(`pay_ps_ref_${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      }, 1500);
    }, 2000);
  };

  const handleSimulateAutoPay = () => {
    setCardNumber("4084 0840 8408 4081");
    setExpiry("12/28");
    setCvv("111");
  };

  React.useEffect(() => {
    // Soft scroll to ensure the modal matches viewport visual height, bypassing tall iframe document sizes
    const el = document.getElementById("paystack-modal");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 pt-10 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in" id="paystack-overlay">
      <div className="relative w-full max-w-md my-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-left" id="paystack-modal">
        
        {/* Paystack Styled Header */}
        <div className="bg-[#4a5568] px-4 py-3 sm:px-6 sm:py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#10b068] flex items-center justify-center font-bold text-xs sm:text-sm text-white">
              P
            </div>
            <div>
              <h3 className="font-semibold text-xs sm:text-sm leading-tight">Paystack SDK Checkout</h3>
              <p className="text-[10px] sm:text-xs text-gray-300">Secured with Paystack</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            id="close-paystack"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Transaction Summary Container */}
        <div className="bg-[#edf2f7] px-4 py-2.5 sm:px-6 sm:py-3.5 flex justify-between items-center border-b border-gray-200">
          <div>
            <span className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider font-mono font-medium">PAYING TO</span>
            <p className="font-bold text-dark-text text-xs sm:text-sm leading-tight">JapaReady International Ltd</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wider font-mono font-medium">AMOUNT</span>
            <p className="font-serif font-bold text-base sm:text-lg text-primary-green leading-none">{formattedAmount}</p>
          </div>
        </div>

        {step === "fill" && (
          <div className="flex flex-col">
            {/* Top Horizontal Payment Options */}
            <div className="flex border-b border-gray-200 bg-[#f7fafc] text-[11px] sm:text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 focus:outline-none transition-colors border-b-2 cursor-pointer ${
                  method === "card" 
                    ? "bg-white text-[#10b068] border-[#10b068]" 
                    : "text-gray-600 border-transparent hover:bg-gray-100"
                }`}
                id="pay-by-card-tab"
              >
                <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("transfer")}
                className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 focus:outline-none transition-colors border-b-2 text-xs font-semibold cursor-pointer ${
                  method === "transfer" 
                    ? "bg-white text-[#10b068] border-[#10b068]" 
                    : "text-gray-600 border-transparent hover:bg-gray-100"
                }`}
                id="pay-by-transfer-tab"
              >
                <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="truncate">Bank Transfer</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("ussd")}
                className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 focus:outline-none transition-colors border-b-2 text-xs font-semibold cursor-pointer ${
                  method === "ussd" 
                    ? "bg-white text-[#10b068] border-[#10b068]" 
                    : "text-gray-600 border-transparent hover:bg-gray-100"
                }`}
                id="pay-by-ussd-tab"
              >
                <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span>USSD</span>
              </button>
            </div>

            {/* Content for payment method */}
            <div className="p-4 sm:p-5 flex flex-col justify-between min-h-[220px]">
              {method === "card" && (
                <form onSubmit={handleCardPay} className="w-full flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gray-400 tracking-wider">ENTER CARD DETAILS</span>
                      <button
                        type="button"
                        onClick={handleSimulateAutoPay}
                        className="text-[9px] text-primary-green hover:underline cursor-pointer font-semibold"
                        id="use-test-card"
                      >
                        Use Test Card
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Card Number</label>
                      <input
                        type="text"
                        placeholder="4084 0840 8408 4081"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068] focus:border-[#10b068]"
                        maxLength={19}
                        required
                        id="paystack-card-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068] focus:border-[#10b068]"
                          maxLength={5}
                          required
                          id="paystack-expiry-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068] focus:border-[#10b068]"
                          maxLength={3}
                          required
                          id="paystack-cvv-input"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 sm:mt-5 py-2 sm:py-2.5 bg-[#10b068] hover:bg-[#0e9b5c] text-white font-medium text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    id="submit-paystack-card"
                  >
                    Pay {formattedAmount}
                  </button>
                </form>
              )}

              {method === "transfer" && (
                <div className="w-full flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-gray-400 tracking-wider block">BANK TRANSFER INSTRUCTIONS</span>
                    
                    <div className="bg-[#edf2f7] p-2.5 sm:p-3.5 rounded-xl border border-gray-200">
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Bank Name</span>
                      <p className="font-bold text-dark-text text-xs sm:text-sm leading-tight mb-2">Paystack WEMA / Titan Trust Bank</p>
                      
                      <span className="text-[9px] text-gray-500 font-bold uppercase block">Account Number</span>
                      <p className="font-mono font-bold text-base sm:text-lg text-primary-green leading-none mb-0.5">9920384729</p>
                      <p className="text-[9px] text-light-text">Expires in 20 minutes</p>
                    </div>
                    
                    <p className="text-[10px] sm:text-xs text-light-text leading-snug">
                      Transfer exactly <strong className="text-dark-text">{formattedAmount}</strong> to the WEMA bank details above, then click the confirmation button below.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitting(true);
                      setStep("submitting");
                      setTimeout(() => {
                        setStep("success");
                        setTimeout(() => onSuccess(`pay_ps_ref_trf_${Math.random().toString(36).substring(3, 9).toUpperCase()}`), 1500);
                      }, 1800);
                    }}
                    className="w-full mt-3.5 py-2 sm:py-2.5 bg-[#10b068] hover:bg-[#0e9b5c] text-white font-medium text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    id="submit-paystack-transfer"
                  >
                    I've sent the money
                  </button>
                </div>
              )}

              {method === "ussd" && (
                <div className="w-full flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-gray-400 tracking-wider block">DIAL USSD CODE</span>
                    
                    <div className="p-2 sm:p-3 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                      <p className="text-[10px] text-yellow-800 font-semibold mb-1">Simulated Bank Dial Code</p>
                      <p className="font-mono font-bold text-sm sm:text-base text-yellow-950">*737*2*₦5,000*992038#</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wide block">Select Your Bank</label>
                      <select className="w-full px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068] bg-white">
                        <option>GTBank (*737#)</option>
                        <option>Zenith Bank (*966#)</option>
                        <option>Access Bank (*901#)</option>
                        <option>UBA (*919#)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitting(true);
                      setStep("submitting");
                      setTimeout(() => {
                        setStep("success");
                        setTimeout(() => onSuccess(`pay_ps_ref_ussd_${Math.random().toString(36).substring(3, 9).toUpperCase()}`), 1500);
                      }, 1800);
                    }}
                    className="w-full mt-3.5 py-2 sm:py-2.5 bg-[#10b068] hover:bg-[#0e9b5c] text-white font-medium text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    id="submit-paystack-ussd"
                  >
                    Authorize Simulated USSD
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "submitting" && (
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
            <Loader className="w-10 h-10 text-[#10b068] animate-spin mb-3" />
            <h4 className="font-semibold text-dark-text text-sm sm:text-base">Authorizing payment...</h4>
            <p className="text-[10px] sm:text-xs text-light-text max-w-xs mt-2 leading-relaxed">
              Waiting for provider settlement clearance. Do not close this window or reload page.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#10b068]/20 flex items-center justify-center text-[#10b068] mb-3">
              <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <h4 className="font-sans font-bold text-dark-text text-base sm:text-lg">Settlement Successful</h4>
            <p className="text-[11px] sm:text-xs text-primary-green font-medium mt-0.5">Payment Verified Securely</p>
            <p className="text-[10px] sm:text-xs text-light-text max-w-xs mt-2.5 leading-relaxed">
              Updating Google Sheets records and rendering full roadmap content...
            </p>
          </div>
        )}

        {/* Footer info badge */}
        <div className="bg-[#edf2f7] py-2.5 sm:py-3 text-center text-[9px] text-gray-500 font-mono flex items-center justify-center gap-1 border-t border-gray-200">
          <ShieldCheck className="w-3 h-3 text-[#10b068]" />
          <span>PAYSTACK SECURE PCI-DSS LEVEL 1 COMPLIANT</span>
        </div>

      </div>
    </div>
  );
}
