"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function CompletePage() {
  const router = useRouter();
  const { locale } = useParams();
  const { role } = useUserStore();

  const handleEnterDashboard = () => {
    if (role === "retailer") {
      router.push(`/${locale}/dashboard/retailer`);
    } else if (role === "consumer") {
      router.push(`/${locale}/dashboard/consumer`);
    } else {
      // Default to farmer dashboard
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center">
      {/* Mobile-first container with responsive max-width */}
      <div className="w-full max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-secondary rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Check className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary stroke-[3px] sm:stroke-[4px]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Main heading - responsive text sizes */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif text-background mb-4 text-balance leading-tight">
            Welcome to <span className="text-secondary italic font-bold">Agrio</span>
          </h1>
          
          {/* Subheading - responsive text */}
          <p className="text-base sm:text-lg lg:text-xl text-background/80 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed">
            Your account is ready! You can now access your personalized dashboard and start your agricultural journey.
          </p>

          {/* Success message - responsive */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 mb-8 sm:mb-12">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            <span className="text-sm sm:text-base text-background font-medium">
              Successfully Registered
            </span>
          </div>

          {/* CTA Button - responsive sizing */}
          <Button
            onClick={handleEnterDashboard}
            className="w-full sm:w-auto px-8 py-4 sm:py-6 text-base sm:text-lg lg:text-xl font-bold rounded-full bg-secondary text-primary hover:bg-secondary/90 shadow-xl transition-all duration-200 hover:scale-105 group"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Additional info for desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 hidden lg:block"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-secondary mb-2">🌾</div>
              <div className="text-background/80 text-sm">Farm Direct</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-secondary mb-2">🚚</div>
              <div className="text-background/80 text-sm">Fast Delivery</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-secondary mb-2">💚</div>
              <div className="text-background/80 text-sm">100% Fresh</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confetti simulation - responsive and optimized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 1, 
              x: 0, 
              y: 0, 
              rotate: 0,
              scale: 1
            }}
            animate={{ 
              opacity: 0, 
              x: (Math.random() - 0.5) * (window.innerWidth > 768 ? 600 : 400), 
              y: (Math.random() - 0.5) * (window.innerHeight > 768 ? 600 : 400),
              rotate: Math.random() * 360,
              scale: 0
            }}
            transition={{ duration: 2, delay: 0.4 + (i * 0.1) }}
            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-secondary rounded-sm"
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
}
