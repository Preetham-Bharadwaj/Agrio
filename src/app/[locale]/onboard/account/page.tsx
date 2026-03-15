"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ProfileCollectionForm } from "@/components/onboard/ProfileCollectionForm";
import { DocumentUpload } from "@/components/onboard/DocumentUpload";
import { useUserStore } from "@/store/useUserStore";
import { isPrototypeMode } from "@/lib/prototype";

export default function AccountPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { role, userId } = useUserStore();
  const [step, setStep] = useState<'profile' | 'documents'>('profile');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      if (userId) {
        setCurrentUserId(userId);
        return;
      }
      if (isPrototypeMode) return;
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setCurrentUserId(session.user.id);
    };
    getUserId();
  }, [userId]);

  const handleProfileComplete = () => {
    // If consumer, skip document upload
    if (role === 'consumer') {
      router.push(`/${locale}/onboard/complete`);
    } else {
      setStep('documents');
    }
  };

  const handleDocumentUploadComplete = () => {
    router.push(`/${locale}/onboard/complete`);
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-[#faf6ee] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ee] p-6 flex flex-col justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-4">
          {step === 'profile' ? 'Step 3: Profile' : 'Step 4: Verification'}
        </p>
        <h1 className="text-4xl font-serif text-primary mb-2">
          {step === 'profile' ? 'Your Details' : 'Verify Identity'}
        </h1>
        <p className="text-foreground/60 text-lg">
          {step === 'profile' 
            ? 'Tell us a bit about yourself'
            : 'Upload verification documents'}
        </p>
      </motion.div>

      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        {step === 'profile' ? (
          <ProfileCollectionForm
            userId={currentUserId}
            onProfileComplete={handleProfileComplete}
          />
        ) : (
          <DocumentUpload
            userId={currentUserId}
            role={role as 'farmer' | 'retailer'}
            onUploadComplete={handleDocumentUploadComplete}
          />
        )}
      </div>
      
      <p className="text-center text-[10px] text-foreground/30 font-bold uppercase tracking-widest mt-12">
        Secure • Encrypted • Agrio Platform
      </p>
    </div>
  );
}
