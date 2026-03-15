"use client";

import { motion } from "framer-motion";
import { Landmark, CheckCircle2, AlertCircle, Info, ChevronRight, Calculator, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const schemes = [
  {
    id: 1,
    name: "PM-KISAN",
    benefit: "₹6,000 / Year",
    status: "Eligible",
    desc: "Income support to all landholding farmers' families in the country.",
    color: "bg-green-50 text-green-600",
    border: "border-green-100"
  },
  {
    id: 2,
    name: "PM Fasal Bima Yojana",
    benefit: "Crop Insurance",
    status: "Applied",
    desc: "Financial support to farmers suffering crop loss/damage arising out of natural calamities.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100"
  },
  {
    id: 3,
    name: "KCC (Kisan Credit Card)",
    benefit: "7% Interest Loan",
    status: "Checking",
    desc: "Timely credit support to farmers for their cultivation and other needs.",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100"
  },
  {
    id: 4,
    name: "PM Krishi Sinchai Yojana",
    benefit: "₹40,000 Subsidy",
    status: "Eligible",
    desc: "Focus on creating sources of assured irrigation and modern irrigation methods.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100"
  }
];

export default function SchemesPage() {
  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Government Schemes</h1>
        <p className="text-foreground/40 text-sm">We&apos;ve found 2 eligible schemes based on your profile</p>
      </header>

      {/* Calculator Banner */}
      <div className="bg-primary rounded-3xl p-6 mb-10 relative overflow-hidden shadow-lg shadow-primary/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-secondary" />
            <span className="text-[10px] font-bold text-background/60 uppercase tracking-widestLow">Potential Benefits</span>
          </div>
          <p className="text-3xl font-mono font-bold text-background mb-1">₹46,000</p>
          <p className="text-xs text-background/40 mb-6 font-medium">Claimable subsidies for this season</p>
          <Button size="sm" className="bg-secondary text-primary font-bold rounded-xl px-6">
            Apply to All
          </Button>
        </div>
        <Landmark className="absolute -bottom-6 -right-6 w-32 h-32 text-background/10" />
      </div>

      <div className="space-y-6">
        <h3 className="font-serif font-bold text-lg text-primary">Your Status</h3>
        {schemes.map((scheme, i) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`border rounded-3xl p-6 relative bg-white ${scheme.border} hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <Badge className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-widest ${
                scheme.status === "Eligible" ? "bg-green-100 text-green-600 hover:bg-green-100" :
                scheme.status === "Checking" ? "bg-amber-100 text-amber-600 hover:bg-amber-100" :
                "bg-blue-100 text-blue-600 hover:bg-blue-100"
              }`}>
                {scheme.status}
              </Badge>
              <div className="flex items-center gap-1 text-primary">
                <IndianRupee className="w-4 h-4" />
                <span className="text-sm font-mono font-bold">{scheme.benefit}</span>
              </div>
            </div>

            <h4 className="font-serif font-bold text-xl text-primary mb-2">{scheme.name}</h4>
            <p className="text-xs text-foreground/60 leading-relaxed mb-6">
              {scheme.desc}
            </p>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl text-xs py-5 border-muted text-foreground/60 hover:text-primary">
                View Details
              </Button>
              {scheme.status === "Eligible" && (
                <Button className="flex-1 rounded-xl bg-primary text-background text-xs py-5">
                  Apply Now
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
