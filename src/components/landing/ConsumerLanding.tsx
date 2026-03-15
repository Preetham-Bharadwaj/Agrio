"use client";

import { motion } from "framer-motion";
import { 
  ShoppingBasket, 
  MapPin, 
  Truck, 
  Leaf, 
  CheckCircle2, 
  ShoppingBag,
  Zap,
  Star,
  User,
  Search,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function ConsumerLanding({ locale }: { locale: string }) {
  return (
    <div className="bg-primary pt-32 selection:bg-secondary selection:text-primary">
      {/* Hero */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-full">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-500 text-xs font-bold uppercase tracking-[0.2em]">Fresh produce. Direct from the farm.</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif text-background leading-[0.95]">
            India&apos;s freshest. <br />
            <span className="text-secondary italic">Know your farmer.</span> <br />
            No cold storage.
          </h1>

          <div className="flex justify-center">
            <Link href={`/${locale}/onboard/auth`}>
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-12 py-8 text-2xl rounded-[2.5rem] shadow-2xl shadow-secondary/20">
                Shop Fresh
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features List */}
      <div className="space-y-40 pb-40">
        {/* Feature 1: Marketplace */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-amber-500/20 text-amber-500 border-none px-4 py-1 uppercase tracking-widest font-bold">THE REAL MARKETPLACE</Badge>
              <h2 className="text-4xl md:text-6xl font-serif text-background">Farm Fresh Marketplace</h2>
              <p className="text-xl text-background/60 leading-relaxed">
                Browse seasonal produce listed directly by farmers. <span className="text-secondary italic">No cold storage delay.</span> Harvested this morning, arriving at your kitchen tomorrow.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { name: "Organic Tomatoes", price: "₹42/kg", farm: "Reddy Farm", image: "/products/tomatoes.png" },
                 { name: "Alphonso Mango", price: "₹650/box", farm: "Patil Baag", image: "/products/mangoes.png" },
                 { name: "Fresh Palak", price: "₹18/bunch", farm: "Green Fields", image: "/products/spinach.png" },
                 { name: "Baby Corn", price: "₹30/pkt", farm: "Sun Harvest", image: "/products/babycorn.png" },
               ].map((item, i) => (
                 <Card key={i} className="p-4 bg-white/5 border-white/10 rounded-3xl group hover:bg-white/10 transition-colors overflow-hidden">
                    <div className="aspect-square bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
                       <img 
                         src={item.image} 
                         alt={item.name} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                       />
                    </div>
                    <p className="font-serif font-bold text-background mb-1">{item.name}</p>
                    <div className="flex items-center justify-between">
                       <p className="text-secondary font-mono font-bold">{item.price}</p>
                       <p className="text-[8px] text-background/40 font-bold uppercase tracking-widest">{item.farm}</p>
                    </div>
                 </Card>
               ))}
            </div>
          </div>
        </section>

        {/* Feature 2: Traceability */}
        <section className="px-6 bg-white py-40">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1">
                <div className="bg-primary rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                   <div className="mb-10 flex items-center gap-4">
                      <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-secondary/20">
                         <User className="w-8 h-8" />
                      </div>
                      <div>
                         <p className="text-secondary font-bold text-xs uppercase tracking-widest leading-none mb-1">PRODUCED BY</p>
                         <h4 className="text-2xl font-serif text-background">Ramrao Patil</h4>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <MapPin className="w-5 h-5 text-secondary" />
                         <span className="text-background/60 text-lg">Indapur, Pune District</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Clock className="w-5 h-5 text-secondary" />
                         <span className="text-background/60 text-lg">Harvested: 4:00 AM Today</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Star className="w-5 h-5 text-secondary fill-secondary" />
                         <span className="text-background/60 text-lg">Verified Farmer Since 2024</span>
                      </div>
                   </div>
                   <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
                </div>
             </div>
             <div className="order-1 lg:order-2 space-y-8">
               <Badge className="bg-primary/5 text-primary border-none px-4 py-1 uppercase tracking-widest font-bold">100% TRANSPARENT</Badge>
               <h2 className="text-4xl md:text-6xl font-serif text-primary">Farm Traceability</h2>
               <p className="text-xl text-foreground/60 leading-relaxed">
                 Know exactly <span className="text-primary italic">which farm</span> your food came from. Every product shows the farm name, district, harvest date, and farmer profile.
               </p>
             </div>
           </div>
        </section>

        {/* Feature 3: Fair Pricing */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1 uppercase tracking-widest font-bold">ETHICAL EATING</Badge>
               <h2 className="text-4xl md:text-6xl font-serif text-background">Fair Pricing</h2>
               <p className="text-xl text-background/60 leading-relaxed font-sans">
                 You pay fair. Farmer earns fair. No 3-layer middleman markup. <span className="text-secondary font-bold">Agrio returns 92% of your spend</span> directly to the rural communities.
               </p>
            </div>
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 text-center shadow-2xl">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <p className="text-[10px] text-background/40 font-bold uppercase tracking-widest">OTHERS</p>
                     <p className="text-4xl font-serif text-background/20 line-through">₹120</p>
                     <p className="text-xs text-background/20 italic">Middlemen cut: ₹45</p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">AGRIO</p>
                     <p className="text-6xl font-serif text-secondary tracking-tighter">₹85</p>
                     <p className="text-xs text-secondary italic font-bold">Direct to Farmer: ₹78</p>
                  </div>
               </div>
               <div className="mt-12 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: "20%" }} whileInView={{ width: "92%" }} transition={{ duration: 1 }} className="h-full bg-secondary" />
               </div>
            </div>
          </div>
        </section>

        {/* Feature 4: Easy Delivery */}
        <section className="px-6 bg-amber-500 py-40">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
             <div className="bg-primary rounded-[3rem] p-10 text-background shadow-2xl relative">
                <MapPin className="text-secondary w-12 h-12 mb-8" />
                <h4 className="text-4xl font-serif mb-6">Farm to Doorstep</h4>
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-primary">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <p className="font-bold">Order Confirmed</p>
                </div>
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary animate-bounce">
                      <Truck className="w-6 h-6" />
                   </div>
                   <p className="font-bold">In Transit from Indapur</p>
                </div>
                <div className="flex items-center gap-4 opacity-30">
                   <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-background">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <p className="font-bold">Delivered to Mumbai</p>
                </div>
             </div>
             <div className="space-y-8">
               <h2 className="text-4xl md:text-6xl font-serif text-primary">Easy Delivery</h2>
               <p className="text-xl text-primary/70 leading-relaxed font-medium">
                 Order online. Delivered to your door. 
                 <span className="text-primary font-bold"> Track your food</span> in real-time as it moves from the farm directly to your doorstep.
               </p>
             </div>
           </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6">
           <div className="max-w-4xl mx-auto bg-white rounded-[4rem] p-12 md:p-20 text-center space-y-10 shadow-2xl relative overflow-hidden">
              <h2 className="text-5xl md:text-7xl font-serif text-primary leading-tight">
                 Fresh food. <br />
                 <span className="text-secondary italic">Empowered farms.</span>
              </h2>
              
              <div className="flex justify-center pt-10">
                <Link href={`/${locale}/onboard/auth`}>
                  <Button size="lg" className="bg-primary text-background hover:bg-primary/90 font-bold px-12 py-8 text-2xl rounded-full w-full sm:w-auto">
                    Start Shopping
                  </Button>
                </Link>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
