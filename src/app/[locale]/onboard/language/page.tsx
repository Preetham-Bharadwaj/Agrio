"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const languages = [
  { id: "hi", name: "Hindi", native: "हिन्दी" },
  { id: "en", name: "English", native: "English" },
  { id: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { id: "te", name: "Telugu", native: "తెలుగు" },
  { id: "mr", name: "Marathi", native: "मराठी" },
  { id: "ta", name: "Tamil", native: "தமிழ்" },
];

export default function LanguagePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = useParams();

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-center items-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-12"
      >
        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center text-background font-serif font-bold text-3xl">
          k
        </div>
        <h1 className="text-3xl font-serif text-primary mb-2">Welcome</h1>
        <p className="text-foreground/60">Choose your preferred language</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full mb-12">
        {languages.map((lang) => (
          <motion.div
            key={lang.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(lang.id)}
            className={`cursor-pointer relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${
              selected === lang.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted bg-white hover:border-primary/30"
            }`}
          >
            {selected === lang.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-background" />
              </div>
            )}
            <span className="text-2xl mb-1">{lang.native}</span>
            <span className="text-xs text-foreground/40 font-medium uppercase tracking-widest">{lang.name}</span>
          </motion.div>
        ))}
      </div>

      <Button
        disabled={!selected}
        onClick={() => router.push(`/${locale}/onboard/register`)}
        className="w-full py-8 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
      >
        Continue
      </Button>
    </div>
  );
}
