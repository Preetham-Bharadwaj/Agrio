"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { CheckCircle2, FileText, Image as ImageIcon, Upload, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function VerificationPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [step, setStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [docs, setDocs] = useState<Record<number, { name: string, verified: boolean }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { role } = useUserStore();

  const farmerDocs = [
    { title: "Aadhaar / ID Card", desc: "Government issued identity proof" },
    { title: "Land Proof / 7/12", desc: "Proof of cultivation or ownership" },
    { title: "Bank Passbook", desc: "For direct payment settlements" }
  ];

  const retailerDocs = [
    { title: "Aadhaar / Business ID", desc: "Identity proof of the owner" },
    { title: "Trade License / GST", desc: "Registration certificate (Optional)" },
    { title: "Business Bank Acc", desc: "For bulk transaction settlements" }
  ];

  const currentDocs = role === 'farmer' ? farmerDocs : retailerDocs;

  const handleContinue = () => {
    router.push(`/${locale}/onboard/complete`);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file.name);
    }
  };

  const handleUpload = (name: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setDocs({ ...docs, [step]: { name, verified: true } });
        if (step < 2) {
          setStep(step + 1);
        }
      }, 2000);
    }, 1000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-4">Step 4: Verification</p>
        <h1 className="text-4xl font-serif text-primary mb-2">Final Step</h1>
        <p className="text-foreground/60 text-lg leading-relaxed">We need to verify your {role === 'farmer' ? 'Farmer' : 'Retailer'} credentials for security.</p>
      </motion.div>

      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              docs[i]?.verified ? 'bg-green-500' : 
              step === i ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]' : 'bg-primary/10'
            }`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-8"
        >
          <div className={`bg-white border-2 rounded-[2.5rem] p-10 text-center transition-all ${docs[step]?.verified ? 'border-green-500 bg-green-50/30' : 'border-dashed border-primary/20'}`}>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onFileChange}
            />
            
            {isUploading ? (
              <div className="py-8">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6 mx-auto" />
                <p className="text-primary font-bold animate-pulse text-xl">Uploading...</p>
              </div>
            ) : isScanning ? (
              <div className="py-8 relative">
                <Sparkles className="w-12 h-12 text-secondary mb-6 animate-pulse mx-auto" />
                <p className="text-secondary font-bold text-xl uppercase tracking-tighter">KisanCartel-AI Verifying</p>
                <div className="mt-4 h-1 w-32 bg-secondary/10 mx-auto rounded-full overflow-hidden">
                   <motion.div initial={{ x: -100 }} animate={{ x: 100 }} transition={{ repeat: Infinity, duration: 1 }} className="w-20 h-full bg-secondary" />
                </div>
              </div>
            ) : docs[step]?.verified ? (
              <div className="py-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-background shadow-xl shadow-green-500/20 mb-6 mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-serif text-green-600 mb-2">Verified</h4>
                <p className="text-xs text-green-600/60 font-mono font-bold truncate max-w-[200px] mx-auto">{docs[step].name}</p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary/40 mb-6 mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-primary mb-2 line-clamp-1">{currentDocs[step].title}</h4>
                <p className="text-foreground/60 mb-8 text-sm leading-relaxed px-4">
                  {currentDocs[step].desc}
                </p>
                <Button 
                  onClick={triggerFileInput}
                  className="bg-primary text-background hover:bg-primary/90 rounded-full px-12 py-8 text-lg font-bold shadow-2xl shadow-primary/20"
                >
                  Scan Document
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="space-y-4">
        {Object.values(docs).length === 3 ? (
          <Button
            onClick={handleContinue}
            className="w-full py-10 text-xl font-bold rounded-[2.5rem] bg-primary text-background hover:bg-primary/90 shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]"
          >
            Enter {role === 'farmer' ? 'Cartel' : 'Procurements'}
          </Button>
        ) : (
          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
             <div className="flex items-center gap-3 text-primary/40">
                <div className="w-6 h-6 border-2 border-primary/20 rounded-full flex items-center justify-center text-[10px] font-bold">
                   {Object.values(docs).length}/3
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">Documents Uploaded</p>
             </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(120px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
