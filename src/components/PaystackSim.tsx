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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="paystack-overlay">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden text-left" id="paystack-modal">
        
        {/* Paystack Styled Header */}
        <div className="bg-[#4a5568] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#10b068] flex items-center justify-center font-bold text-sm text-white">
              P
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">Paystack SDK Checkout</h3>
              <p className="text-xs text-gray-300">Secured with Paystack</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-300 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            id="close-paystack"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Summary Container */}
        <div className="bg-[#edf2f7] px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">PAYING TO</span>
            <p className="font-bold text-dark-text text-sm">JapaReady International Ltd</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">AMOUNT</span>
            <p className="font-serif font-bold text-lg text-primary-green leading-none">{formattedAmount}</p>
          </div>
        </div>

        {step === "fill" && (
          <div className="flex" style={{ minHeight: "320px" }}>
            {/* Sidebar Payment Options */}
            <div className="w-1/3 bg-[#f7fafc] border-r border-gray-200 py-4 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`w-full py-3.5 px-4 flex flex-col items-center gap-1.5 focus:outline-none transition-colors border-l-4 text-xs font-semibold cursor-pointer ${
                  method === "card" 
                    ? "bg-white text-[#10b068] border-[#10b068]" 
                    : "text-gray-600 border-transparent hover:bg-gray-100"
                }`}
                id="pay-by-card-tab"
              >
                <CreditCard className="w-5 h-5" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("transfer")}
                className={`w-full py-3.5 px-4 flex flex-col items-center gap-1.5 focus:outline-none transition-colors border-l-4 text-xs font-semibold cursor-pointer ${
                  method === "transfer" 
                    ? "bg-white text-[#10b068] border-[#10b068]" 
                    : "text-gray-600 border-transparent hover:bg-gray-100"
                }`}
                id="pay-by-transfer-tab"
              >
                <Landmark className="w-5 h-5" />
                <span>Bank</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod("ussd")}
                className={`w-full py-3.5 px-4 flex flex-col items-center gap-1.5 focus:outline-none transition-colors border-l-4 text-xs font-semibold cursor-pointer ${
                  method === "ussd" 
                    ? "bg-white text-[#10b068] border-[#10b068]" 
                    : "text-gray-600 border-transparent hover:bg-gray-100"
                }`}
                id="pay-by-ussd-tab"
              >
                <PhoneCall className="w-5 h-5" />
                <span>USSD</span>
              </button>
            </div>

            {/* Content for payment method */}
            <div className="w-2/3 p-6 flex flex-col justify-between">
              {method === "card" && (
                <form onSubmit={handleCardPay} className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider">ENTER CARD DETAILS</span>
                      <button
                        type="button"
                        onClick={handleSimulateAutoPay}
                        className="text-[10px] text-primary-green hover:underline cursor-pointer"
                        id="use-test-card"
                      >
                        Use Test Card
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Card Number</label>
                      <input
                        type="text"
                        placeholder="4084 0840 8408 4081"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068] focus:border-[#10b068]"
                        maxLength={19}
                        required
                        id="paystack-card-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068] focus:border-[#10b068]"
                          maxLength={5}
                          required
                          id="paystack-expiry-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068] focus:border-[#10b068]"
                          maxLength={3}
                          required
                          id="paystack-cvv-input"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3 bg-[#10b068] hover:bg-[#0e9b5c] text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    id="submit-paystack-card"
                  >
                    Pay {formattedAmount}
                  </button>
                </form>
              )}

              {method === "transfer" && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider">BANK TRANSFER INSTRUCTIONS</span>
                    
                    <div className="bg-[#edf2f7] p-4 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Bank Name</span>
                      <p className="font-bold text-dark-text text-base leading-tight mb-2">Paystack WEMA / Titan Trust Bank</p>
                      
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Account Number</span>
                      <p className="font-mono font-bold text-lg text-primary-green leading-none mb-1">9920384729</p>
                      <p className="text-[10px] text-light-text">Expires in 20 minutes</p>
                    </div>
                    
                    <p className="text-xs text-light-text leading-snug">
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
                    className="w-full mt-4 py-3 bg-[#10b068] hover:bg-[#0e9b5c] text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                    id="submit-paystack-transfer"
                  >
                    I've sent the money
                  </button>
                </div>
              )}

              {method === "ussd" && (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider">DIAL USSD CODE</span>
                    
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                      <p className="text-xs text-yellow-800 font-semibold mb-2">Simulated Bank Dial Code</p>
                      <p className="font-mono font-bold text-lg text-yellow-950">*737*2*₦5,000*992038#</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block">Select Your Bank</label>
                      <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b068]">
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
                    className="w-full mt-4 py-3 bg-[#10b068] hover:bg-[#0e9b5c] text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
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
          <div className="p-10 flex flex-col items-center justify-center text-center" style={{ minHeight: "380px" }}>
            <Loader className="w-12 h-12 text-[#10b068] animate-spin mb-4" />
            <h4 className="font-semibold text-dark-text text-base">Authorizing payment...</h4>
            <p className="text-xs text-light-text max-w-xs mt-2">
              Waiting for provider settlement clearance. Do not close this window or reload page.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-10 flex flex-col items-center justify-center text-center" style={{ minHeight: "380px" }}>
            <div className="w-16 h-16 rounded-full bg-[#10b068]/20 flex items-center justify-center text-[#10b068] mb-4 scale-up-pulse">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h4 className="font-serif font-bold text-dark-text text-xl">Settlement Successful</h4>
            <p className="text-sm text-primary-green font-medium mt-1">Payment Verified Securely</p>
            <p className="text-xs text-light-text max-w-xs mt-3 leading-relaxed">
              Updating Google Sheets records and rendering full roadmap content...
            </p>
          </div>
        )}

        {/* Footer info badge */}
        <div className="bg-[#edf2f7] py-3.5 text-center text-[10px] text-gray-500 font-mono flex items-center justify-center gap-1 border-t border-gray-200">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10b068]" />
          <span>PAYSTACK SECURE PCI-DSS LEVEL 1 COMPLIANT</span>
        </div>

      </div>
    </div>
  );
}
