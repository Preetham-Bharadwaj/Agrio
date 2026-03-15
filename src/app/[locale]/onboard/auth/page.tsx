"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { OTPAuthForm } from "@/components/auth/OTPAuthForm";
import { OTPVerificationForm } from "@/components/auth/OTPVerificationForm";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const setStoreMobile = useUserStore((state) => state.setMobile);
  const setUserId = useUserStore((state) => state.setUserId);

  // Check if user is coming from sign-in with pre-verified OTP
  React.useEffect(() => {
    const verifiedPhone = localStorage.getItem('verifiedPhone');
    const verifiedUserId = localStorage.getItem('verifiedUserId');
    const verifiedOTP = localStorage.getItem('verifiedOTP');
    
    if (verifiedPhone && verifiedUserId && verifiedOTP === 'true') {
      // User is coming from sign-in flow with verified OTP
      setPhoneNumber(verifiedPhone);
      setStoreMobile(verifiedPhone);
      setOtpSent(true);
      setOtpVerified(true);
      setUserId(verifiedUserId);
      
      // Clear the stored values
      localStorage.removeItem('verifiedPhone');
      localStorage.removeItem('verifiedUserId');
      localStorage.removeItem('verifiedOTP');
      
      // Redirect to register since this is a new user
      router.push(`/${locale}/onboard/register`);
    }
  }, [locale, router, setStoreMobile, setUserId]);

  const handleOTPSent = (phone: string) => {
    setPhoneNumber(phone);
    setStoreMobile(phone);
    setOtpSent(true);
  };

  const handleVerified = async (userId: string) => {
    setUserId(userId);
    setOtpVerified(true);

    const { isPrototypeMode, PROTOTYPE_USER_ID } = await import('@/lib/prototype');
    if (isPrototypeMode && userId === PROTOTYPE_USER_ID) {
      router.push(`/${locale}/onboard/register`);
      return;
    }

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('account_type, name, district, state, verified')
      .eq('id', userId)
      .single();

    if (error || !user || !user.account_type) {
      router.push(`/${locale}/onboard/register`);
    } else {
      router.push(`/${locale}/dashboard/${user.account_type}`);
    }
  };

  const handleResend = () => {
    setOtpSent(false);
    setOtpVerified(false);
  };

  return (
    <div className="min-h-screen bg-[#faf6ee] p-6 flex flex-col justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12 text-center"
      >
        <div className="w-20 h-20 bg-primary rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-secondary shadow-2xl shadow-primary/20 rotate-3">
          <span className="font-serif font-bold text-4xl">A</span>
        </div>
        <h1 className="text-4xl font-serif text-primary mb-3">Welcome to Agrio</h1>
        <p className="text-foreground/50 text-lg">
          Sign in or create your account
        </p>
      </motion.div>

      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl space-y-6">
        {/* Phone Number Input */}
        <div className={otpSent ? "opacity-60" : ""}>
          <h3 className="text-lg font-semibold text-primary mb-4">Phone Number</h3>
          <OTPAuthForm 
            onOTPSent={handleOTPSent}
            locale={locale as string}
          />
        </div>

        {/* OTP Verification - Appears below phone input */}
        {otpSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-6 border-t border-muted/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Verify OTP</h3>
              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
              >
                Change number
              </button>
            </div>
            <OTPVerificationForm
              phoneNumber={phoneNumber}
              onVerified={handleVerified}
              onResend={handleResend}
            />
          </motion.div>
        )}
      </div>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}`)}
          className="w-full bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/80 text-foreground/70 hover:text-foreground rounded-full"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </motion.div>

      <p className="mt-12 text-center text-sm text-foreground/40 leading-relaxed px-6">
        By continuing, you agree to our <span className="text-primary font-bold underline">Terms</span> and <span className="text-primary font-bold underline">Data Usage Policy</span>.
      </p>
    </div>
  );
}
