'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isPrototypeMode, PROTOTYPE_USER_ID, PROTOTYPE_OTP } from '@/lib/prototype';

interface OTPVerificationFormProps {
  phoneNumber: string;
  onVerified: (userId: string) => void;
  onResend: () => void;
}

export function OTPVerificationForm({
  phoneNumber,
  onVerified,
  onResend,
}: OTPVerificationFormProps) {
  const t = useTranslations('auth');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(lockoutTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockoutTime === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [lockoutTime, isLocked]);

  // Handle resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError(t('accountLocked', { minutes: Math.ceil(lockoutTime / 60) }));
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError(t('invalidOTPLength'));
      return;
    }

    setLoading(true);

    try {
      if (isPrototypeMode) {
        // Prototype: accept any 6-digit OTP (e.g. 123456)
        await new Promise((r) => setTimeout(r, 400));
        onVerified(PROTOTYPE_USER_ID);
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpString,
        type: 'sms',
      });
      if (verifyError) throw verifyError;
      if (data.user) onVerified(data.user.id);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutTime(15 * 60); // 15 minutes
        setError(t('tooManyAttempts'));
      } else {
        setError(t('invalidOTP', { remaining: 3 - newAttempts }));
      }
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) {
      return;
    }

    setResendCooldown(30); // 30 seconds cooldown
    setOtp(['', '', '', '', '', '']);
    setError('');
    setAttempts(0);
    onResend();
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div className="space-y-2">
        <Label>{t('enterOTP')}</Label>
        <p className="text-sm text-muted-foreground">
          {t('otpSentTo', { phone: phoneNumber })}
        </p>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading || isLocked}
              className="w-12 h-12 text-center text-lg font-semibold"
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {isLocked && (
        <div className="p-3 text-sm text-orange-600 bg-orange-50 rounded-md">
          {t('lockedMessage', { 
            minutes: Math.floor(lockoutTime / 60),
            seconds: lockoutTime % 60 
          })}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || isLocked || otp.join('').length !== 6}
      >
        {loading ? t('verifying') : t('verifyOTP')}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={handleResend}
        disabled={resendCooldown > 0 || loading}
      >
        {resendCooldown > 0
          ? t('resendIn', { seconds: resendCooldown })
          : t('resendOTP')}
      </Button>
    </form>
  );
}
