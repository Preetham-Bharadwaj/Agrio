"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Smartphone, 
  MessageSquare, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Hammer,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function FarmerLanding({ locale }: { locale: string }) {
  return (
    <div className="bg-primary pt-32 selection:bg-secondary selection:text-primary">
      {/* Hero */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-6 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500 text-xs font-bold uppercase tracking-[0.2em]">Built for India&apos;s 100M smallholder farmers</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif text-background leading-[0.95]">
            Earn 2x more. <br />
            <span className="text-secondary italic">Zero middlemen.</span> <br />
            Zero extra work.
          </h1>

          <div className="flex justify-center">
            <Link href={`/${locale}/onboard/auth`}>
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-12 py-8 text-2xl rounded-[2.5rem] shadow-2xl shadow-secondary/20">
                Get Started Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features List */}
      <div className="space-y-40 pb-40">
        {/* Feature 1: Collective Auction */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1">COLLECTIVE BARGAINING</Badge>
              <h2 className="text-4xl md:text-6xl font-serif text-background">Collective Auction</h2>
              <p className="text-xl text-background/60 leading-relaxed">
                127 farmers pool together → <span className="text-secondary italic">buyers compete</span> → 
                you always get best price. We handle the paperwork; you handle the harvest.
              </p>
            </div>
            {/* Visual: Live Bidding Animation */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Hammer className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-background/40 font-bold uppercase tracking-widest">Active Pool #842</p>
                    <p className="text-background font-serif font-bold">Nashik Organic Sona Masuri</p>
                  </div>
                </div>
                <Badge className="bg-red-500 animate-pulse text-background border-none">LIVE</Badge>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "BigBasket_Buyer", bid: "₹3,450", time: "just now", active: true },
                  { name: "Reliance_Procure", bid: "₹3,200", time: "2m ago", active: false },
                  { name: "Madan_Traders", bid: "₹3,150", time: "5m ago", active: false },
                ].map((bid, i) => (
                  <motion.div 
                    key={bid.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-2xl ${bid.active ? 'bg-secondary/10 border border-secondary/20' : 'bg-white/5 opacity-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-background/10 rounded-full" />
                      <div>
                        <p className="text-sm font-bold text-background">{bid.name}</p>
                        <p className="text-[10px] text-background/40">{bid.time}</p>
                      </div>
                    </div>
                    <p className={`font-mono font-bold ${bid.active ? 'text-secondary text-lg' : 'text-background/40'}`}>{bid.bid}</p>
                  </motion.div>
                ))}
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all" />
            </div>
          </div>
        </section>

        {/* Feature 2: Market Rates + AI */}
        <section className="px-6 bg-white py-40">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
               <div className="bg-primary rounded-[3rem] p-10 text-background relative overflow-hidden shadow-2xl">
                 <div className="relative z-10 flex justify-between items-start mb-12">
                   <div>
                     <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-1">AI MARKET SIGNAL</p>
                     <p className="text-3xl font-serif">WHEAT (Lasalgaon)</p>
                   </div>
                   <Badge className="bg-green-500 text-background text-lg font-serif italic px-6 py-2 rounded-2xl">HOLD</Badge>
                 </div>
                 
                 <div className="relative z-10 flex items-end gap-4 mb-8">
                   <p className="text-6xl font-mono font-bold text-secondary">₹2,950</p>
                   <p className="text-secondary/60 text-lg mb-2">/ Quintal</p>
                 </div>

                 <p className="relative z-10 text-background/60 text-sm leading-relaxed max-w-md">
                   Vashi Mandi supply is down 30%. Prices expected to jump another <span className="text-green-400 font-bold">+₹150</span> by Friday.
                 </p>
                 
                 <TrendingUp className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 -rotate-12" />
               </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <Badge className="bg-primary/5 text-primary border-none px-4 py-1">SMART FARMING</Badge>
              <h2 className="text-4xl md:text-6xl font-serif text-primary">Rates + AI Forecast</h2>
              <p className="text-xl text-foreground/60 leading-relaxed">
                Know today&apos;s rate. Know tomorrow&apos;s trend.
                <span className="text-primary font-bold"> Never sell blind again.</span> Our AI tracks supply maps to tell you exactly when to list.
              </p>
            </div>
          </div>
        </section>

        {/* Feature 3: Govt Schemes */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1">AUTOMATIC FILING</Badge>
              <h2 className="text-4xl md:text-6xl font-serif text-background">Govt Schemes</h2>
              <p className="text-xl text-background/60 leading-relaxed">
                We check 47 schemes for you automatically. 
                Average <span className="text-secondary italic font-bold">₹23,000/year</span> unclaimed. We file for you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "PM-Kisan Instalment", status: "READY TO FILE", amount: "₹2,000", bg: "bg-white/5" },
                { name: "Fasal Bima Yojana", status: "ELIGIBLE", amount: "₹8,400", bg: "bg-secondary/10 border-secondary/20" },
                { name: "KCC Interest Sub", status: "VERIFIED", amount: "₹1,200", bg: "bg-white/5" },
                { name: "Solar Pump Subsidy", status: "APPLY NOW", amount: "₹45,000", bg: "bg-white/5" },
              ].map((scheme, i) => (
                <div key={i} className={`p-6 rounded-3xl border border-white/10 ${scheme.bg} flex flex-col justify-between h-40`}>
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-background/60 leading-tight uppercase tracking-widest">{scheme.name}</p>
                    <CheckCircle2 className={`w-5 h-5 ${scheme.bg.includes('secondary') ? 'text-secondary' : 'text-white/20'}`} />
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-mono font-bold text-background">{scheme.amount}</p>
                    <Badge variant="outline" className="text-[10px] border-white/20 text-background/40 uppercase">{scheme.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature 4: Crop Health */}
        <section className="px-6 bg-secondary py-40">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <div className="bg-primary rounded-[3rem] p-8 shadow-2xl relative">
                <div className="aspect-[4/3] bg-background/5 rounded-2xl mb-6 overflow-hidden relative">
                   {/* Simulated Photo */}
                   <div className="absolute inset-0 bg-green-950 flex items-center justify-center opacity-40">
                      <p className="text-background/40 font-mono text-[10px]">CROP_SCAN_V12.9</p>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-dashed border-secondary/40 rounded-full animate-ping" />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                     <p className="font-serif font-bold text-primary">CROP ANALYSIS</p>
                     <Badge className="bg-green-500">GRADE A+</Badge>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary/40">
                        <span>Moisture</span><span>12.4%</span>
                     </div>
                     <div className="w-full h-1 bg-muted rounded-full">
                        <div className="w-3/4 h-full bg-green-500 rounded-full" />
                     </div>
                     <p className="text-[10px] text-green-600 font-bold italic mt-2">Recommended Price: ₹2,800 - ₹3,100</p>
                  </div>
                </motion.div>
             </div>
             <div className="space-y-8">
               <h2 className="text-4xl md:text-6xl font-serif text-primary">Crop Health Detection</h2>
               <p className="text-xl text-primary/70 leading-relaxed font-medium">
                 Take a photo. Know your crop grade in 3 seconds.
                 <span className="text-primary font-bold"> Get max recommended selling price</span> backed by lab-trained AI.
               </p>
             </div>
           </div>
        </section>

        {/* Feature 5: Sarkari Saathi */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8">
               <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1">AI AGRI-EXPERT</Badge>
               <h2 className="text-4xl md:text-6xl font-serif text-background">Sarkari Saathi Chatbot</h2>
               <p className="text-xl text-background/60 leading-relaxed">
                 Ask anything in <span className="text-secondary italic">Hindi, Kannada, Telugu.</span>
                 Schemes, prices, auctions — all answered instantly on your phone.
               </p>
             </div>
             <div className="bg-white rounded-[3rem] p-6 shadow-2xl space-y-4">
                <div className="flex justify-start">
                   <div className="bg-muted p-4 rounded-2xl rounded-tl-none font-bold text-sm text-primary max-w-[80%]">
                      नमस्ते! मुझे अपनी फसल के बारे में पूछें।
                   </div>
                </div>
                <div className="flex justify-end">
                   <div className="bg-primary p-4 rounded-2xl rounded-tr-none font-bold text-sm text-background max-w-[80%]">
                      मेरा गेहूं कब बेचना चाहिए?
                   </div>
                </div>
                <div className="flex justify-start">
                   <div className="bg-muted p-4 rounded-2xl rounded-tl-none font-bold text-sm text-primary max-w-[80%]">
                      AI संकेत के अनुसार, शुक्रवार तक रुकें। कीमत ₹200 बढ़ सकती है।
                   </div>
                </div>
                <div className="flex items-center gap-3 mt-8 pt-4 border-t border-muted">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary/40">
                       <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-10 px-4" />
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background">
                       <ArrowRight className="w-5 h-5" />
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6">
           <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-12 md:p-20 text-center space-y-10 shadow-2xl relative overflow-hidden">
              <h2 className="text-5xl md:text-7xl font-serif text-primary leading-tight">
                 Free for farmers. <br />
                 <span className="text-secondary italic">Forever.</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10">
                <Link href={`/${locale}/onboard/auth`}>
                  <Button size="lg" className="bg-primary text-background hover:bg-primary/90 font-bold px-12 py-8 text-xl rounded-full w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href={`/${locale}/onboard/auth`}>
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 font-bold px-12 py-8 text-xl rounded-full w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
              
              <p className="text-primary/40 font-bold uppercase tracking-widest text-[10px]">NO HIDDEN CHARGES • NO SUBSCRIPTIONS</p>
           </div>
        </section>
      </div>
    </div>
  );
}
