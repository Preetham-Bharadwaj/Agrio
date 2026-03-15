"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newOtp.every((digit) => digit !== "")) {
      // In real app, trigger verify API here
      setTimeout(() => router.push(`/${locale}/onboard/profile`), 500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-serif text-primary mb-2">Verify Mobile</h1>
        <p className="text-foreground/60">We sent a 6-digit code to your number</p>
      </motion.div>

      <div className="flex justify-between gap-2 mb-10">
        {otp.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-xl font-mono font-bold rounded-xl border-muted focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
        ))}
      </div>

      <div className="text-center space-y-6">
        <p className="text-foreground/40 text-sm">
          {timer > 0 ? (
            `Resend code in ${timer}s`
          ) : (
            <button className="text-primary font-bold hover:underline">Resend Code</button>
          )}
        </p>
        
        <Button 
          disabled={otp.some(d => !d)}
          onClick={() => router.push(`/${locale}/onboard/profile`)}
          className="w-full py-8 text-lg font-bold rounded-full bg-primary hover:bg-primary/90"
        >
          Verify & Continue
        </Button>
      </div>
    </div>
  );
}
