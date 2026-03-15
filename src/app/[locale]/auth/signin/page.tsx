'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Smartphone, CheckCircle, User } from 'lucide-react';
import { OTPAuthForm } from '@/components/auth/OTPAuthForm';
import { OTPVerificationForm } from '@/components/auth/OTPVerificationForm';
import { useUserStore } from '@/store/useUserStore';
import { createMockUser, supabase } from '@/lib/supabase';

export default function SignInPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create some mock users for testing
  useEffect(() => {
    // Test existing users - using the same ID format as handleOTPSent generates
    createMockUser({
      id: 'user_919876543210',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+919876543210',
      state: 'Karnataka',
      district: 'Bangalore Urban',
      role: 'farmer',
      verified: true,
      created_at: new Date().toISOString()
    });

    createMockUser({
      id: 'user_919876543211',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+919876543211',
      state: 'Maharashtra',
      district: 'Mumbai',
      role: 'retailer',
      verified: true,
      created_at: new Date().toISOString()
    });

    createMockUser({
      id: 'user_919876543212',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '+919876543212',
      state: 'Gujarat',
      district: 'Ahmedabad',
      role: 'consumer',
      verified: true,
      created_at: new Date().toISOString()
    });

    console.log('Mock users created');
    console.log('Available user IDs: user_919876543210, user_919876543211, user_919876543212');
  }, []);

  const handleOTPSent = (phone: string) => {
  setPhoneNumber(phone);
  setStep('otp');
  // Generate a simple user ID for demo purposes
  const demoUserId = `user_${phone.replace(/\D/g, '')}`;
  setUserId(demoUserId);
  console.log('Phone entered:', phone);
  console.log('Generated user ID:', demoUserId);
};

// Custom OTP verification component that uses the correct user ID
const CustomOTPVerificationForm = ({ phoneNumber, onVerified, onResend, userId }: {
  phoneNumber: string;
  onVerified: (userId: string) => void;
  onResend: () => void;
  userId: string;
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // For demo, accept any 6-digit OTP
      await new Promise((r) => setTimeout(r, 400));
      if (otpString === '123456') {
        onVerified(userId);
      } else {
        setError('Invalid OTP. Use 123456 for demo.');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-medium text-background">Enter 6-digit OTP</Label>
        <div className="flex gap-4 justify-center py-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(input) => {
                if (input) {
                  inputRefs.current[index] = input;
                }
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-16 h-16 text-3xl font-bold text-center bg-white border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 shadow-md transition-all duration-200 hover:bg-gray-50"
              disabled={loading}
              placeholder="0"
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                backgroundColor: 'white',
                color: '#1f2937',
                border: '2px solid #d1d5db',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
            />
          ))}
        </div>
        <p className="text-center text-sm text-background/60">
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full py-4 text-lg font-semibold bg-secondary text-primary hover:bg-secondary/90 rounded-xl shadow-lg transition-all duration-200 hover:scale-105" 
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            Verifying...
          </div>
        ) : (
          'Verify OTP'
        )}
      </Button>

      <Button 
        type="button" 
        variant="outline" 
        onClick={onResend} 
        className="w-full py-4 text-lg font-semibold border-2 border-white/30 text-background hover:bg-white/10 rounded-xl transition-all duration-200"
      >
        Resend OTP
      </Button>
    </form>
  );
};

const handleOTPVerified = async (verifiedUserId: string) => {
    setLoading(true);
    setError('');

    try {
      console.log('Checking user ID:', verifiedUserId);
      
      // Check if user exists in database
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', verifiedUserId)
        .single();

      console.log('User data:', user);
      console.log('Fetch error:', fetchError);

      if (fetchError) {
        console.log('Fetch error details:', fetchError);
        if (fetchError.code === 'PGRST116' || fetchError.message?.includes('No rows found')) {
          // User doesn't exist - new user
          console.log('User does not exist, redirecting to registration');
          setIsNewUser(true);
          // Store the verified phone number and user ID for the create account flow
          localStorage.setItem('verifiedPhone', phoneNumber);
          localStorage.setItem('verifiedUserId', verifiedUserId);
          localStorage.setItem('verifiedOTP', 'true');
          
          // Redirect to create account page
          router.push(`/${locale}/onboard/register`);
          return;
        } else {
          throw fetchError;
        }
      }

      if (user) {
        console.log('User found:', user);
        // Existing user - check if profile is complete
        if (user.name && user.state && user.district) {
          // Profile complete - redirect to appropriate dashboard
          const { role } = user;
          console.log('User role:', role);
          if (role === 'retailer') {
            router.push(`/${locale}/dashboard/retailer`);
          } else if (role === 'consumer') {
            router.push(`/${locale}/dashboard/consumer`);
          } else {
            router.push(`/${locale}/dashboard`);
          }
        } else {
          // Profile incomplete - redirect to account setup
          console.log('Profile incomplete, redirecting to account setup');
          router.push(`/${locale}/onboard/account`);
        }
      } else {
        console.log('No user data, treating as new user');
        // User doesn't exist - new user
        setIsNewUser(true);
        localStorage.setItem('verifiedPhone', phoneNumber);
        localStorage.setItem('verifiedUserId', verifiedUserId);
        localStorage.setItem('verifiedOTP', 'true');
        router.push(`/${locale}/onboard/register`);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
        {/* Back Button */}
        <Link href={`/${locale}`}>
          <Button
            variant="ghost"
            className="mb-6 text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="bg-white/95 backdrop-blur-xl border border-white/30 p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
              <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg">
              Sign in to access your Agrio account
            </p>
          </div>

          {/* Forms */}
          <div className="space-y-6">
            {step === 'phone' && (
              <OTPAuthForm
                onOTPSent={handleOTPSent}
                locale={locale as string}
              />
            )}

            {step === 'otp' && userId && (
              <CustomOTPVerificationForm
                phoneNumber={phoneNumber}
                onVerified={handleOTPVerified}
                onResend={() => setStep('phone')}
                userId={userId}
              />
            )}

            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-gray-700">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                  <span className="text-sm sm:text-base">Signing you in...</span>
                </div>
              </div>
            )}
          </div>

          {/* Test Users */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Test Users (Demo)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">+91 9876543210</span>
                <span className="text-secondary font-medium">Rajesh (Farmer)</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">+91 9876543211</span>
                <span className="text-secondary font-medium">Priya (Retailer)</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">+91 9876543212</span>
                <span className="text-secondary font-medium">Amit (Consumer)</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Any other number</span>
                <span className="text-amber-600 font-medium">New User</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Use any number above to test sign-in. OTP: 123456
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              Don't have an account?{' '}
              <Link href={`/${locale}/onboard/auth`} className="text-secondary hover:underline font-medium">
                Get Started
              </Link>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: CheckCircle, label: 'Secure Login' },
            { icon: CheckCircle, label: 'Quick Access' },
            { icon: CheckCircle, label: 'No Password' }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mx-auto mb-2" />
              <p className="text-gray-300 text-xs sm:text-sm">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
