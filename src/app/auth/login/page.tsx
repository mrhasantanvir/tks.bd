"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStep(2);
        alert(`Demo OTP: ${data.demo_otp}`);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ mobile, otp }),
      });
      
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="max-w-md w-full bg-white border border-stone-100 p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-display font-bold text-primary tracking-tighter">TKS.bd</h1>
          </Link>
          <h2 className="text-2xl font-display font-bold text-on-background mb-2">
            {step === 1 ? "Welcome Back" : "Verify OTP"}
          </h2>
          <p className="text-sm text-stone-400">
            {step === 1 ? "Enter your mobile number to sign in." : `Enter the code sent to ${mobile}`}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">+88</span>
                <input 
                  type="tel" 
                  placeholder="017XX XXXXXX"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-stone-50 border border-stone-100 focus:border-primary focus:ring-0 rounded-none transition-all outline-none"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary-light transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "Requesting..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-3">6-Digit Code</label>
              <input 
                type="text" 
                maxLength={6}
                placeholder="XXXXXX"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-4 bg-stone-50 border border-stone-100 focus:border-primary focus:ring-0 rounded-none transition-all outline-none text-center text-2xl font-display font-bold tracking-[0.5em]"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-primary py-5 font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-lg"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-[10px] text-stone-400 font-bold uppercase tracking-widest hover:text-primary transition-colors"
            >
              Edit Mobile Number
            </button>
          </form>
        )}

        <div className="mt-10 text-center">
          <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
            Premium Agro Excellence <br />
            Cultivating Transparency Since 2024
          </p>
        </div>
      </div>
      
      <div className="fixed top-0 left-0 w-full h-1 bg-agro-gradient"></div>
    </div>
  );
}
