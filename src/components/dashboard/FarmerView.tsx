"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Hammer, 
  TrendingUp, 
  Landmark, 
  MessageSquare,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Cloud,
  AlertTriangle,
  DollarSign,
  Package,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function FarmerView() {
  const { locale } = useParams();
  const { name, district } = useUserStore();
  const [dismissedAlert, setDismissedAlert] = useState(false);

  return (
    <div className="space-y-8 md:space-y-10">
      {/* AI Alert Banner */}
      {!dismissedAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">🌧 Monsoon in 6 days</p>
              <p className="text-sm text-blue-700">Wheat prices may rise 12% • Recommendation: HOLD your stock</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="rounded-full text-xs">
              Hold
            </Button>
            <Button size="sm" className="rounded-full text-xs bg-green-600 hover:bg-green-700">
              Sell Now
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setDismissedAlert(true)}
              className="rounded-full text-xs"
            >
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary leading-tight">
            {name ? `Welcome, ${name}` : "Farmer Hub"}
          </h1>
          <p className="text-secondary font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1">
            {district ? `${district} District` : "Location"} • Status: Verified Farmer ✅
          </p>
        </div>
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-muted">
          <Zap className="w-5 h-5 md:w-6 md:h-6 fill-primary" />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-muted">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="text-xs text-foreground/60 font-medium">Earned</p>
          </div>
          <p className="text-xl font-bold text-primary">₹1.24L</p>
          <p className="text-xs text-foreground/40">this mo</p>
        </Card>
        
        <Card className="p-4 bg-white border-muted">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-foreground/60 font-medium">Active</p>
          </div>
          <p className="text-xl font-bold text-primary">2</p>
          <p className="text-xs text-foreground/40">Listings</p>
        </Card>
        
        <Card className="p-4 bg-white border-muted">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-foreground/60 font-medium">Schemes</p>
          </div>
          <p className="text-xl font-bold text-primary">₹23,000</p>
          <p className="text-xs text-foreground/40">Savings</p>
        </Card>
      </div>

      {/* Main Feature: Sell Produce */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-primary text-background rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-primary/10 group active:scale-95 transition-all"
      >
        <div className="relative z-10 space-y-4 max-w-xl">
          <Badge className="bg-secondary text-primary font-bold px-3 py-1 mb-2">MOST USED</Badge>
          <h2 className="text-3xl md:text-4xl font-serif">🌾 List & Sell</h2>
          <p className="text-background/60 text-sm md:text-base leading-relaxed">
            Take photo → Auto Grade → Pool with 120+ neighbors.
          </p>
          <Link href={`/${locale}/dashboard/sell`} className="inline-block pt-4">
            <Button className="bg-secondary text-primary hover:bg-secondary/90 rounded-full font-bold px-6 md:px-8 h-11 md:h-12 shadow-xl shadow-secondary/20 text-sm md:text-base">
              Start Listing →
            </Button>
          </Link>
        </div>
        <PlusCircle className="absolute -bottom-8 -right-8 w-40 h-40 md:w-48 md:h-48 text-background/10 group-hover:rotate-12 transition-transform duration-700" />
      </motion.div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Auctions */}
        <Link href={`/${locale}/dashboard/auction`} className="block">
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] hover:border-amber-500/30 transition-all flex flex-col justify-between min-h-[180px] md:h-48 group shadow-lg shadow-amber-500/5">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                  <Hammer className="w-6 h-6" />
               </div>
               <Badge className="bg-red-500 animate-pulse text-background border-none text-[8px] uppercase font-bold">Live</Badge>
            </div>
            <div>
               <h3 className="font-serif font-bold text-xl text-primary">🔨 Live Auction</h3>
               <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">3 buyers bidding on your wheat now</p>
            </div>
          </Card>
        </Link>

        {/* Market Rates */}
        <Link href={`/${locale}/dashboard/prices`} className="block">
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] hover:border-blue-500/30 transition-all flex flex-col justify-between min-h-[180px] md:h-48 group shadow-lg shadow-blue-500/5">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-serif font-bold text-xl text-primary">📈 Market Rates</h3>
                <div className="flex gap-2 mt-1">
                   <Badge className="bg-green-100 text-green-700 border-none text-[8px] font-black tracking-tighter">SELL NOW</Badge>
                   <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black tracking-tighter">HOLD</Badge>
                </div>
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">Wheat ₹29.50 ▲8.2% · HOLD</p>
            </div>
          </Card>
        </Link>

        {/* Govt Schemes */}
        <Link href={`/${locale}/dashboard/schemes`} className="block">
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] hover:border-purple-500/30 transition-all flex flex-col justify-between min-h-[180px] md:h-48 group shadow-lg shadow-purple-500/5">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600">
               <Landmark className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-serif font-bold text-xl text-primary">🏛 Govt Schemes</h3>
               <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mt-1">₹23,000 yearly unclaimed • 4 schemes eligible</p>
            </div>
          </Card>
        </Link>

        {/* Chatbot */}
        <Link href={`/${locale}/dashboard/chat`} className="block">
          <Card className="p-5 md:p-6 bg-secondary text-primary border-none rounded-xl md:rounded-[2rem] flex flex-col justify-between min-h-[180px] md:h-48 shadow-lg shadow-secondary/10 group active:scale-95 transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
               <MessageSquare className="w-6 h-6 fill-primary" />
            </div>
            <div>
               <h3 className="font-serif font-bold text-xl">💬 Sarkari Saathi</h3>
               <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest mt-1">Ask anything in Hindi</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Earnings */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl md:rounded-[2rem] p-5 md:p-6 flex flex-col gap-4">
         <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-primary">Recent Earnings</h4>
            <Link href={`/${locale}/dashboard/history`} className="text-[10px] font-bold text-primary/40 hover:text-primary uppercase tracking-widest underline underline-offset-4">View All</Link>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { item: "Tomato", qty: "200kg", auction: "Auction #14", price: "₹17/kg", amount: "₹3,400", status: "Paid" },
              { item: "Wheat", qty: "500kg", auction: "Auction #17", price: "₹29.50/kg", amount: "₹14,750", status: "Pending" },
            ].map((e, i) => (
              <div key={i} className="bg-white p-4 rounded-xl md:rounded-2xl flex items-center justify-between border border-muted shadow-sm group hover:shadow-md transition-all">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-[10px] font-black">{e.item[0]}</div>
                    <div className="overflow-hidden">
                       <p className="font-bold text-xs truncate max-w-[100px]">{e.item} · {e.qty}</p>
                       <p className="text-[10px] text-foreground/40 font-bold">{e.auction} · {e.price}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-mono font-bold text-primary">{e.amount}</p>
                    <p className={`text-[8px] font-black uppercase tracking-tighter ${e.status === 'Paid' ? 'text-green-500' : 'text-amber-500'}`}>
                      {e.status === 'Paid' ? '✅ PAID' : '⏳ PENDING'}
                    </p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
