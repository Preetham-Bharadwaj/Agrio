"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { RoleSelector } from "@/components/onboard/RoleSelector";
import { useUserStore } from "@/store/useUserStore";

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useParams();
  const setRole = useUserStore((state) => state.setRole);

  const handleRoleSelected = (role: 'farmer' | 'retailer' | 'consumer') => {
    setRole(role);
    router.push(`/${locale}/onboard/account`);
  };

  return (
    <div className="min-h-screen bg-[#faf6ee] p-6 flex flex-col justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-4">Step 2: Role</p>
        <h1 className="text-4xl font-serif text-primary mb-2">Choose Your Role</h1>
        <p className="text-foreground/60 text-lg">Select how you'll use Agrio</p>
      </motion.div>

      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <RoleSelector onRoleSelected={handleRoleSelected} />
      </div>
      
      <p className="text-center text-[10px] text-foreground/30 font-bold uppercase tracking-widest mt-12">
        Secure • Role-Based Access • Agrio Platform
      </p>
    </div>
  );
}
