'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isPrototypeMode, PROTOTYPE_OTP } from '@/lib/prototype';

interface OTPAuthFormProps {
  onOTPSent: (phoneNumber: string) => void;
  locale: string;
}

export function OTPAuthForm({ onOTPSent, locale }: OTPAuthFormProps) {
  const t = useTranslations('auth');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(cleaned);
  };

  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    if (!cleaned.startsWith('+91')) {
      if (cleaned.startsWith('91')) cleaned = '+' + cleaned;
      else cleaned = '+91' + cleaned;
    }
    return cleaned;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError(t('invalidPhoneNumber'));
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      if (isPrototypeMode) {
        // Prototype: no Supabase, simulate OTP sent. Use OTP 123456.
        await new Promise((r) => setTimeout(r, 600));
        onOTPSent(formattedPhone);
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: { channel: 'sms' },
      });
      if (otpError) throw otpError;
      onOTPSent(formattedPhone);
    } catch (err: any) {
      console.error('OTP send error:', err);
      setError(err.message || t('otpSendFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">{t('phoneNumber')}</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91 9876543210"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={loading}
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground">
          {t('phoneNumberHint')}
        </p>
        {isPrototypeMode && (
          <p className="text-sm font-medium text-blue-700 bg-blue-50 rounded-md p-2 mt-2">
            Demo: Use OTP <strong>{PROTOTYPE_OTP}</strong> for quick access
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !phoneNumber}
      >
        {loading ? t('sending') : t('sendOTP')}
      </Button>
    </form>
  );
}
