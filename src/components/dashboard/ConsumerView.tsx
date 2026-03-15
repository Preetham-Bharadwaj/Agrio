"use client";

import { motion } from "framer-motion";
import { 
  ShoppingBasket, 
  Search, 
  MapPin, 
  CreditCard, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ConsumerView() {
  const { locale } = useParams();

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Search Header */}
      <div className="space-y-4 md:space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-serif text-primary leading-tight">Agrio Marketplace</h1>
            <div className="flex items-center gap-2 text-primary/40 text-xs font-bold uppercase tracking-widest mt-1">
              <MapPin className="w-3 h-3 text-secondary flex-shrink-0" />
              <span className="truncate">Delivering to Mumbai</span>
            </div>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary text-background rounded-2xl flex items-center justify-center shadow-xl shadow-primary/10 flex-shrink-0 ml-4">
            <ShoppingBasket className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </header>

        <div className="relative group max-w-2xl">
          <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary/30 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search Tomatoes, Mangoes..."
            className="pl-12 md:pl-14 py-6 md:py-8 rounded-xl md:rounded-[2rem] bg-white border-muted shadow-inner focus-visible:ring-primary text-base md:text-lg"
          />
        </div>
      </div>

      {/* Main Feature: Browse & Buy */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-serif text-primary">Farm Fresh Listings</h3>
          <Link href={`/${locale}/dashboard/consumer/browse`}>
            <Button variant="ghost" size="sm" className="text-xs font-bold">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Organic Tomatoes", price: "₹42/kg", farm: "Reddy Farm", district: "Nashik", grade: "A", type: "Farmer", img: "/products/tomatoes.png" },
            { name: "Alphonso Mango", price: "₹650/box", farm: "Patil Baag", district: "Ratnagiri", grade: "A+", type: "Farmer", img: "/products/mangoes.png" },
            { name: "Bulk Potato", price: "₹18/kg", farm: "Madan Bulk Store", district: "Indore", grade: "A", type: "Retailer", img: "/products/babycorn.png" },
          ].map((item, i) => (
            <Link key={i} href={`/${locale}/dashboard/consumer/browse`}>
              <Card className="p-4 bg-white border-muted rounded-xl md:rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/10 transition-all flex gap-4 items-center group h-full">
                 <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-1 right-1">
                       <Badge className="bg-white/80 backdrop-blur-md text-[8px] text-primary border-none px-1.5 py-0.5">{item.grade}</Badge>
                    </div>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${item.type === 'Farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.type}
                       </span>
                    </div>
                    <h4 className="font-serif font-bold text-primary truncate">{item.name}</h4>
                    <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-tighter">
                       {item.farm} • <span className="text-primary/60">{item.district}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2">
                       <p className="text-lg font-mono font-bold text-primary">{item.price}</p>
                       <Button size="sm" className="bg-primary text-background rounded-full hover:bg-secondary hover:text-primary transition-colors h-7 px-4 text-xs font-bold">
                          Add
                       </Button>
                    </div>
                 </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Order Tracking */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif text-primary">Track Orders</h3>
          <Link href={`/${locale}/dashboard/consumer/orders`}>
            <Button variant="ghost" size="sm" className="text-xs font-bold">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        <Link href={`/${locale}/dashboard/consumer/orders`}>
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-serif font-bold text-primary">Order #9842</h4>
                      <p className="text-[10px] text-foreground/40 font-bold uppercase">Arrival: Tomm, 8:00 AM</p>
                   </div>
                </div>
                <Badge className="bg-green-500 text-background border-none text-[8px] animate-pulse">DISPATCHED</Badge>
             </div>
             
             <div className="flex items-center gap-2 mb-2">
                {[1, 1, 1, 0].map((s, i) => (
                   <div key={i} className={`flex-1 h-1 rounded-full ${s ? 'bg-green-500' : 'bg-muted'}`} />
                ))}
             </div>
             <p className="text-[10px] font-bold text-primary/40 italic">Coming directly from <span className="text-primary">Reddy Farm, Nashik</span></p>
             
             <ArrowRight className="absolute -bottom-6 -right-6 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors" />
          </Card>
        </Link>
      </section>

      {/* Payment & Help */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cart */}
        <Link href={`/${locale}/dashboard/consumer/cart`}>
          <Card className="p-5 md:p-6 bg-white border-muted rounded-xl md:rounded-[2rem] flex flex-col justify-between min-h-[140px] md:h-40 group cursor-pointer active:scale-95 transition-all hover:shadow-xl hover:border-primary/10">
             <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
                <ShoppingBasket className="w-5 h-5" />
             </div>
             <div>
                <p className="font-serif font-bold text-primary">My Cart</p>
                <p className="text-[8px] text-foreground/40 font-bold uppercase tracking-widest">View & Checkout</p>
             </div>
          </Card>
        </Link>

        {/* Support */}
        <Link href={`/${locale}/dashboard/consumer/support`}>
          <Card className="p-5 md:p-6 bg-secondary text-primary border-none rounded-xl md:rounded-[2rem] flex flex-col justify-between min-h-[140px] md:h-40 group active:scale-95 transition-all hover:shadow-xl">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                 <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                 <p className="font-serif font-bold">Help & Support</p>
                 <p className="text-[8px] text-primary/40 font-bold uppercase tracking-widest">Chat with AI</p>
              </div>
           </Card>
        </Link>
      </div>

      <p className="text-center text-[10px] text-primary/20 font-black uppercase tracking-[0.4em] py-10">Agrio Direct Network</p>
    </div>
  );
}
