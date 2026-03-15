"use client";

import { motion } from "framer-motion";
import { 
  Hammer, 
  Search, 
  BarChart3, 
  Handshake, 
  Truck,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RetailerView() {
  const { locale } = useParams();

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary leading-tight">Procurement</h1>
          <p className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1">Direct FPO Network #108</p>
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-muted">
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </header>

      {/* Feature 1: Live Auctions */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-primary text-background rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-primary/10 group active:scale-95 transition-all"
      >
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <Badge className="bg-secondary text-primary font-bold px-3 py-1 mb-2">LIVE AUCTION</Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif">Wheat #BS21</h2>
          <p className="text-background/60 text-sm md:text-base leading-relaxed">
            63,500kg available from <span className="text-secondary font-bold">Bidar FPO</span>.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4">
            <div>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Top Bid</p>
              <p className="text-2xl md:text-3xl font-mono font-bold">₹2,840<span className="text-xs opacity-60">/qtl</span></p>
            </div>
            <Link href={`/${locale}/dashboard/auction`}>
              <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-full font-bold px-6 md:px-8 h-11 md:h-12 text-sm md:text-base w-full sm:w-auto">
                Join & Bid
              </Button>
            </Link>
          </div>
        </div>
        <Hammer className="absolute -bottom-8 -right-8 w-40 h-40 md:w-48 md:h-48 text-background/10 group-hover:rotate-12 transition-transform duration-700" />
      </motion.div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Marketplace */}
        <Link href={`/${locale}/dashboard/marketplace`} className="block">
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] hover:border-green-500/30 transition-all flex flex-col justify-between min-h-[180px] md:h-48 group shadow-lg shadow-green-500/5">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
               <Search className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-serif font-bold text-xl text-primary">📦 Bulk Listings</h3>
               <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">Pooled produce by district</p>
            </div>
          </Card>
        </Link>

        {/* Analytics */}
        <Link href={`/${locale}/dashboard/analytics`} className="block">
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] hover:border-blue-500/30 transition-all flex flex-col justify-between min-h-[180px] md:h-48 group shadow-lg shadow-blue-500/5">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-serif font-bold text-xl text-primary">📊 Price Analytics</h3>
               <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">APMC Rates & AI Forecasts</p>
            </div>
          </Card>
        </Link>

        {/* Contract Farming */}
        <Link href={`/${locale}/dashboard/contracts`} className="block">
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] hover:border-purple-500/30 transition-all flex flex-col justify-between min-h-[180px] md:h-48 group shadow-lg shadow-purple-500/5">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600">
               <Handshake className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-serif font-bold text-xl text-primary">🤝 Contract Farming</h3>
               <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">Lock future harvest prices</p>
            </div>
          </Card>
        </Link>

        {/* Track Orders */}
        <Link href={`/${locale}/dashboard/logistics`} className="block">
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] hover:border-amber-500/30 transition-all flex flex-col justify-between min-h-[180px] md:h-48 group shadow-lg shadow-amber-500/5">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
               <Truck className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-serif font-bold text-xl text-primary">🚚 Track Logistics</h3>
               <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">Purchase history & Cold chain</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Invoice Banner */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl md:rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <div className="space-y-1">
            <h4 className="font-serif font-bold text-primary text-xl">Recent Procurements</h4>
            <p className="text-xs text-primary/40 font-bold">Total this month: <span className="text-primary">128.5 Tons</span></p>
         </div>
         <Button variant="outline" className="rounded-full border-primary/20 text-primary font-bold text-xs uppercase tracking-widest px-6 active:scale-95 transition-all">
            Invoices
         </Button>
      </div>
    </div>
  );
}
