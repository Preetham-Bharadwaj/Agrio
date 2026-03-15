"use client";

import { motion } from "framer-motion";
import { 
  Store, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShoppingBag,
  Zap,
  Hammer,
  Truck,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function RetailerLanding({ locale }: { locale: string }) {
  return (
    <div className="bg-primary pt-32 selection:bg-secondary selection:text-primary">
      {/* Hero */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-6 py-2 rounded-full">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em]">Buy directly from 86,000 FPOs across India</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif text-background leading-[0.95]">
            Fresh stock. <br />
            <span className="text-secondary italic">No middlemen.</span> <br />
            30-40% cheaper.
          </h1>

          <div className="flex justify-center">
            <Link href={`/${locale}/onboard/auth`}>
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-12 py-8 text-2xl rounded-[2.5rem] shadow-2xl shadow-secondary/20">
                Start Buying
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features List */}
      <div className="space-y-40 pb-40">
        {/* Feature 1: Live Auction Bidding */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1">TRANSPARENT PRICING</Badge>
              <h2 className="text-4xl md:text-6xl font-serif text-background">Live Auction Bidding</h2>
              <p className="text-xl text-background/60 leading-relaxed font-sans">
                Bid on pooled produce from farmer collectives. <span className="text-secondary font-bold">Real-time. Transparent.</span> Get the best market rate without negotiating with brokers.
              </p>
            </div>
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                        <Hammer className="w-5 h-5 text-primary" />
                     </div>
                     <span className="font-serif font-bold text-primary">LIVE BID CONSOLE</span>
                  </div>
                  <Badge variant="outline" className="text-red-500 border-red-200 animate-pulse">2m 45s left</Badge>
               </div>
               
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">CURRENT HIGHEST</p>
                        <p className="text-4xl font-mono font-bold text-primary">₹32.50<span className="text-base font-sans font-medium text-foreground/40 ml-1">/kg</span></p>
                     </div>
                     <Button className="bg-primary text-background rounded-full px-8">+₹0.50 BID</Button>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                     <motion.div initial={{ width: "100%" }} animate={{ width: "40%" }} className="h-full bg-primary" />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Bulk Procurement */}
        <section className="px-6 bg-white py-40">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
                {[
                  { crop: "Tomato", qty: "2,400 kg", grade: "A", dist: "Bidar" },
                  { crop: "Wheat", qty: "45,000 kg", grade: "B", dist: "Nashik" },
                  { crop: "Potato", qty: "8,500 kg", grade: "A", dist: "Agra" },
                  { crop: "Onion", qty: "12,000 kg", grade: "A", dist: "Lasalgaon" },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-muted/30 border border-muted rounded-2xl">
                     <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">{item.crop}</p>
                     <p className="text-lg font-serif font-bold text-primary/80">{item.qty}</p>
                     <div className="flex items-center justify-between mt-3 text-[10px] font-bold uppercase text-foreground/40">
                        <span>{item.dist}</span>
                        <Badge className="bg-primary/5 text-primary text-[8px] h-4">GRADE {item.grade}</Badge>
                     </div>
                  </div>
                ))}
             </div>
             <div className="order-1 lg:order-2 space-y-8">
               <Badge className="bg-primary/5 text-primary border-none px-4 py-1">CENTRALIZED VIEW</Badge>
               <h2 className="text-4xl md:text-6xl font-serif text-primary">Bulk Procurement</h2>
               <p className="text-xl text-foreground/60 leading-relaxed">
                 Browse available stock by <span className="text-primary italic">crop, grade, district, and quantity.</span> Manage all your farm-direct orders from a single dashboard.
               </p>
             </div>
           </div>
        </section>

        {/* Feature 3: Quality Guaranteed */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1">AI QUALITY ASSURANCE</Badge>
               <h2 className="text-4xl md:text-6xl font-serif text-background">Quality Guaranteed</h2>
               <p className="text-xl text-background/60 leading-relaxed font-sans">
                 Every listing comes with an AI health grade — <span className="text-secondary font-bold italic">A, B, or C.</span> Know the exact moisture and quality parameters before you place a single rupee.
               </p>
            </div>
            <div className="bg-primary/50 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-10 shadow-2xl relative">
                <div className="flex items-center gap-6 mb-10">
                   <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center text-primary shadow-xl shadow-secondary/20">
                      <Zap className="w-10 h-10" />
                   </div>
                   <div>
                      <h4 className="text-2xl font-serif text-background">AI Grade: A+</h4>
                      <p className="text-secondary font-bold text-xs uppercase tracking-widest">Lab-Certified Accuracy</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-background/40 text-[10px] uppercase font-bold tracking-widest">
                      <span>Purity</span>
                      <span>99.2%</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full">
                      <div className="w-[99%] h-full bg-secondary" />
                   </div>
                   <div className="flex justify-between text-background/40 text-[10px] uppercase font-bold tracking-widest">
                      <span>Shelf Life</span>
                      <span>High (14 Days)</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full">
                      <div className="w-[85%] h-full bg-secondary" />
                   </div>
                </div>
            </div>
          </div>
        </section>

        {/* Feature 4: Price Analytics */}
        <section className="px-6 bg-secondary py-40">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <div className="bg-primary rounded-[3rem] p-10 text-background shadow-2xl">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] mb-4">SEASONAL FORECAST</p>
                <div className="flex items-baseline gap-2 mb-10">
                   <h4 className="text-4xl font-serif">Onion Trends</h4>
                   <span className="text-green-400 font-bold text-sm">↓ 12% Cost Expectation</span>
                </div>
                <div className="h-40 flex items-end gap-3 pb-4">
                   {[40, 60, 45, 90, 65, 30, 80].map((h, i) => (
                     <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        className={`flex-1 rounded-t-lg ${i === 3 ? 'bg-secondary' : 'bg-white/10'}`} 
                     />
                   ))}
                </div>
                <p className="text-sm text-background/40">Our AI predicts seasonal bottoming next week. Suggestion: Start procurement from Sept 12.</p>
             </div>
             <div className="space-y-8">
               <h2 className="text-4xl md:text-6xl font-serif text-primary">Price Analytics</h2>
               <p className="text-xl text-primary/70 leading-relaxed font-medium">
                 See APMC trends, <span className="text-primary italic">forecasts, and seasonal patterns</span>. Plan your procurement cycles smartly to maximize your margins.
               </p>
             </div>
           </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6">
           <div className="max-w-4xl mx-auto bg-primary rounded-[4rem] p-12 md:p-20 text-center space-y-10 shadow-2xl relative overflow-hidden border border-white/5">
              <h2 className="text-5xl md:text-7xl font-serif text-background leading-tight">
                 Fresh stock. <br />
                 <span className="text-secondary italic">Direct from farms.</span>
              </h2>
              
              <div className="flex justify-center pt-10">
                <Link href={`/${locale}/onboard/auth`}>
                  <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-12 py-8 text-2xl rounded-full w-full sm:w-auto">
                    Register as Retailer
                  </Button>
                </Link>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
