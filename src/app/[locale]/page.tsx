"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Users, 
  Store, 
  ShoppingBasket, 
  Zap, 
  Clock, 
  ShieldCheck,
  MessageSquare,
  Globe,
  Plus,
  Hammer,
  IndianRupee,
  Smartphone,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import FarmerLanding from "@/components/landing/FarmerLanding";
import RetailerLanding from "@/components/landing/RetailerLanding";
import ConsumerLanding from "@/components/landing/ConsumerLanding";

// --- Components ---

const Navbar = ({ onLogoClick }: { onLogoClick: () => void }) => {
  const { locale } = useParams();
  return (
    <nav className="fixed top-0 z-[100] w-full bg-primary/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2 group cursor-pointer bg-transparent border-none">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-lg shadow-secondary/20">
            <span className="text-primary font-bold text-2xl">A</span>
          </div>
          <span className="text-background font-serif font-bold text-2xl tracking-tight">Agrio</span>
        </button>
        
        <div className="hidden lg:flex items-center gap-8 text-background/60 font-sans text-sm font-bold uppercase tracking-widest">
          <a href="#how-it-works" className="hover:text-secondary transition-colors">How it Works</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href={`/${locale}/auth/signin`}>
            <Button variant="outline" className="hidden sm:flex border-white/20 text-background bg-transparent hover:bg-white/10 rounded-full font-bold">
              Sign In
            </Button>
          </Link>
          <Link href={`/${locale}/onboard/auth`}>
            <Button className="bg-secondary text-primary hover:bg-secondary/90 font-bold rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const StoryCard = () => {
  const [index, setIndex] = useState(0);
  const stories = [
    {
      role: "FARMER",
      title: "LIVE Auction — Wheat 63,500kg",
      detail: "127 farmers earning together",
      bid: ["₹24.00", "₹27.50", "₹29.50"],
      icon: Users,
      color: "bg-green-500"
    },
    {
      role: "RETAILER",
      title: "Fresh Stock: Tomato 28,000kg",
      detail: "Direct from Bidar FPO — ₹18/kg",
      tags: ["Grade A", "Ready to Ship"],
      icon: Store,
      color: "bg-amber-500"
    },
    {
      role: "CONSUMER",
      title: "Farm to Door: Ordered 5kg",
      detail: "Nashik Farm → Bandra, Mumbai",
      status: "Delivery in 2 days",
      icon: ShoppingBasket,
      color: "bg-blue-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % stories.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const story = stories[index];

  return (
    <div className="relative h-[400px] w-full max-w-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -20 }}
          className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/20 p-8 shadow-2xl flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-widest text-background ${story.color}`}>
                {story.role}
              </span>
              <story.icon className="w-6 h-6 text-background/40" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-background leading-snug">{story.title}</h3>
              <p className="text-background/40 text-sm font-medium italic">{story.detail}</p>
            </div>

            {index === 0 && (
              <div className="bg-background/5 rounded-2xl p-4 border border-white/5">
                <p className="text-[10px] text-background/40 font-bold uppercase mb-3">Live Bidding</p>
                <div className="flex items-center gap-4">
                  {story.bid?.map((b, i) => (
                    <motion.span 
                      key={b}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className={`text-xl font-mono font-bold ${i === 2 ? 'text-secondary text-2xl' : 'text-background/20 line-through'}`}
                    >
                      {b}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {index === 1 && (
              <div className="flex gap-2">
                {story.tags?.map(t => (
                  <Badge className="bg-secondary/10 text-secondary border-none px-3" key={t}>{t}</Badge>
                ))}
              </div>
            )}

            {index === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-secondary font-bold text-sm">{story.status}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    className="h-full bg-secondary"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between opacity-40">
            <span className="text-[10px] font-mono tracking-widest">Agrio Network</span>
            <Globe className="w-4 h-4" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ComparisonTable = () => {
  const rows = [
    { name: "Farmer Pooling", cartel: true, comp1: false, comp2: "partial", comp3: false },
    { name: "Live Auction", cartel: true, comp1: false, comp2: false, comp3: false },
    { name: "Direct to Consumer", cartel: true, comp1: false, comp2: false, comp3: true },
    { name: "AI Price Forecast", cartel: true, comp1: "partial", comp2: false, comp3: false },
    { name: "Govt Schemes", cartel: true, comp1: false, comp2: false, comp3: false },
    { name: "No Middleman", cartel: true, comp1: false, comp2: false, comp3: false },
  ];

  const StatusIcon = ({ status }: { status: boolean | string }) => {
    if (status === true) return <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />;
    if (status === "partial") return <Zap className="w-5 h-5 text-amber-500/50 mx-auto" />;
    return <XCircle className="w-5 h-5 text-red-700 mx-auto" />;
  };

  return (
    <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="py-8 px-8 text-xs font-bold uppercase tracking-[0.3em] text-white/70">Platform Feature</th>
              <th className="py-8 px-6 text-center">
                <div className="inline-flex flex-col items-center">
                  <span className="text-xl font-serif text-secondary mb-1">Agrio</span>
                  <div className="h-1 w-full bg-secondary rounded-full" />
                </div>
              </th>
              <th className="py-8 px-6 text-center text-xs font-black text-white/60 uppercase tracking-widest">Farminfinity</th>
              <th className="py-8 px-6 text-center text-xs font-black text-white/60 uppercase tracking-widest">eNAM</th>
              <th className="py-8 px-6 text-center text-xs font-black text-white/60 uppercase tracking-widest">BigBasket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.name} className="group hover:bg-white/[0.01] transition-colors">
                <td className="py-6 px-8 text-white font-medium text-lg">{row.name}</td>
                <td className="py-6 px-6 bg-secondary/5 border-x border-white/5">
                  <StatusIcon status={row.cartel} />
                </td>
                <td className="py-6 px-6"><StatusIcon status={row.comp1} /></td>
                <td className="py-6 px-6"><StatusIcon status={row.comp2} /></td>
                <td className="py-6 px-6"><StatusIcon status={row.comp3} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Counter = ({ value, suffix = "", label }: { value: string, suffix?: string, label: string }) => (
  <div className="text-center group">
    <motion.h4 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-5xl md:text-7xl font-serif text-secondary mb-2"
    >
      {value}<span className="text-3xl opacity-50 ml-1">{suffix}</span>
    </motion.h4>
    <p className="text-background/40 text-xs font-bold uppercase tracking-[0.3em] group-hover:text-background/60 transition-colors">{label}</p>
  </div>
);

// --- Main Page ---

export default function LandingPage() {
  const { locale } = useParams();
  const [view, setView] = useState<'main' | 'farmer' | 'retailer' | 'consumer'>('main');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (view === 'farmer') return (
    <>
      <Navbar onLogoClick={() => setView('main')} />
      <FarmerLanding locale={locale as string} />
    </>
  );

  if (view === 'retailer') return (
    <>
      <Navbar onLogoClick={() => setView('main')} />
      <RetailerLanding locale={locale as string} />
    </>
  );

  if (view === 'consumer') return (
    <>
      <Navbar onLogoClick={() => setView('main')} />
      <ConsumerLanding locale={locale as string} />
    </>
  );

  return (
    <div className="bg-primary selection:bg-secondary selection:text-primary scroll-smooth">
      <Navbar onLogoClick={() => setView('main')} />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-6 flex items-center overflow-hidden">
        {/* Wheat SVG Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
          <div className="grid grid-cols-6 gap-20 p-20">
            {[...Array(24)].map((_, i) => (
              <Zap key={i} className="w-20 h-20 text-background" />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em]">Farm to Table. No Middlemen.</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif text-background mb-8 leading-[0.95] tracking-tight">
              India&apos;s First Farmer <br />
              <span className="text-secondary italic">Collective</span> <br /> 
              Auction Network.
            </h1>
            
            <p className="text-xl text-background/60 mb-12 max-w-xl leading-relaxed">
              Farmers earn more. Retailers buy fresher. Consumers get farm-direct produce. <br />
              <span className="text-background font-bold text-lg">Everyone wins — except the middleman.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Button onClick={() => setView('farmer')} size="lg" className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-10 py-8 text-xl rounded-[2rem] w-full sm:w-auto shadow-2xl shadow-secondary/20 hover:scale-105 transition-all">
                I&apos;m a Farmer
              </Button>
              <Button onClick={() => setView('retailer')} variant="outline" size="lg" className="border-white/20 text-background bg-transparent hover:bg-white/10 font-bold px-10 py-8 text-xl rounded-[2rem] w-full sm:w-auto backdrop-blur-sm">
                I&apos;m a Retailer
              </Button>
              <Button onClick={() => setView('consumer')} variant="outline" size="lg" className="border-secondary/30 text-secondary bg-transparent hover:bg-secondary/5 font-bold px-10 py-8 text-xl rounded-[2rem] w-full sm:w-auto backdrop-blur-sm">
                I&apos;m a Consumer
              </Button>
            </div>
          </motion.div>

          <div className="flex justify-center items-center">
            <StoryCard />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-6 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-5xl md:text-7xl font-serif text-primary mb-6 leading-tight">
              The food chain is broken. <br />
              <span className="text-secondary italic">For everyone.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                user: "For Farmers", 
                icon: Users, 
                problem: "₹14/kg stolen per kg of wheat by middlemen every single harvest.",
                color: "bg-green-500/10 text-green-600"
              },
              { 
                user: "For Retailers", 
                icon: Store, 
                problem: "3–4 middleman layers inflate cost by 40% before produce reaches you.",
                color: "bg-amber-500/10 text-amber-600"
              },
              { 
                user: "For Consumers", 
                icon: ShoppingBasket, 
                problem: "You pay ₹80/kg for tomatoes. The farmer got ₹18. Where did ₹62 go?",
                color: "bg-blue-500/10 text-blue-600"
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-[#faf6ee] border border-muted group hover:border-primary/20 transition-all shadow-sm"
              >
                <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 uppercase tracking-widest">{card.user}</h3>
                <p className="text-2xl font-serif text-primary/60 leading-relaxed italic">&quot;{card.problem}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-40 px-6 bg-[#0c2d19] relative overflow-hidden">
        {/* Subtle glow objects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-serif text-background mb-6">Designed for speed. <br /> Built for <span className="text-secondary italic">Trust.</span></h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Farmer Lists", 
                desc: "Voice message on WhatsApp: Gehu 500kg Bidar. Listed in 4 seconds. Pooled with 126 other farmers.",
                icon: Smartphone,
                accent: "from-green-500/20"
              },
              { 
                step: "02", 
                title: "Retailers Bid / Consumers Browse", 
                desc: "Retailers compete in live auction. Consumers browse farm-fresh listings. AI price alerts for everyone.",
                icon: Hammer,
                accent: "from-amber-500/20"
              },
              { 
                step: "03", 
                title: "Everyone Gets Paid", 
                desc: "Farmer gets best price. Retailer gets fresh bulk stock. Consumer gets farm-direct produce. No middleman cut.",
                icon: IndianRupee,
                accent: "from-blue-500/20"
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 overflow-hidden hover:bg-white/[0.05] transition-all`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.accent} to-transparent opacity-50`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-16 h-16 bg-background/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-secondary shadow-inner group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <span className="text-6xl font-serif italic text-background/10 group-hover:text-secondary/20 transition-colors select-none tracking-tighter">
                      {step.step}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-serif text-background mb-6 leading-tight group-hover:text-secondary transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-white/70 text-lg leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection (Who is it for) */}
      <section className="py-32 px-6 bg-[#faf6ee]">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-serif text-primary mb-6">Designed for three. <br /> Built <span className="text-secondary italic">for one India.</span></h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Farmer Card */}
            <Card className="rounded-[3rem] border-muted p-10 bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center text-background shadow-xl shadow-green-500/20 rotate-12">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-primary">FARMERS</h3>
                    <p className="text-green-600 font-bold text-xs uppercase tracking-widest">Earn 2.1x More</p>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  {[
                    "Collective auction with 100+ farmers",
                    "Live market rates + AI Hold/Sell signal",
                    "47 govt schemes auto-checked + filed",
                    "Crop health detection (photo → grade)",
                    "Sarkari Saathi chatbot in your language"
                  ].map(t => (
                    <li key={t} className="flex items-start gap-3 text-sm text-foreground/60 font-medium">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>

                <Button onClick={() => setView('farmer')} className="w-full bg-primary text-background hover:bg-primary/90 font-bold py-8 rounded-2xl text-lg">
                  Join as Farmer
                </Button>
              </div>
              <Users className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] text-primary" />
            </Card>

            {/* Retailer Card */}
            <Card className="rounded-[3rem] border-muted p-10 bg-primary hover:shadow-2xl hover:shadow-primary/20 transition-all group overflow-hidden relative">
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4 text-background">
                  <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center text-primary shadow-xl shadow-secondary/20 rotate-12">
                    <Store className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif">RETAILERS</h3>
                    <p className="text-secondary font-bold text-xs uppercase tracking-widest">Lower Cost. Direct.</p>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  {[
                    "Bid directly on farmer collectives",
                    "Grade A/B/C quality guaranteed",
                    "Cut 3 middleman layers — save 40%",
                    "Bulk procurement dashboard",
                    "Price trend analytics"
                  ].map(t => (
                    <li key={t} className="flex items-start gap-3 text-sm text-background/60 font-medium">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>

                <Button onClick={() => setView('retailer')} className="w-full bg-secondary text-primary hover:bg-secondary/90 font-bold py-8 rounded-2xl text-lg">
                  Start Buying
                </Button>
              </div>
              <Store className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] text-background" />
            </Card>

            {/* Consumer Card */}
            <Card className="rounded-[3rem] border-muted p-10 bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-background shadow-xl shadow-amber-500/20 rotate-12">
                    <ShoppingBasket className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-primary">CONSUMERS</h3>
                    <p className="text-amber-600 font-bold text-xs uppercase tracking-widest">Fair For Everyone</p>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  {[
                    "Farm-fresh produce delivered home",
                    "Know which farm your food came from",
                    "Grade A produce at fair prices",
                    "Seasonal crop availability",
                    "Direct farmer support"
                  ].map(t => (
                    <li key={t} className="flex items-start gap-3 text-sm text-foreground/60 font-medium">
                      <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>

                <Button onClick={() => setView('consumer')} className="w-full bg-[#c8933a] text-white hover:bg-amber-600 font-bold py-8 rounded-2xl text-lg border-none">
                  Shop Fresh
                </Button>
              </div>
              <ShoppingBasket className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] text-primary" />
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-40 px-6 bg-primary border-y border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <Counter value="₹1.4" suffix="L Cr" label="Money Returned to Soil" />
          <Counter value="2.1" suffix="x" label="Average Income Increase" />
          <Counter value="40" suffix="%" label="Retailer Cost Savings" />
          <Counter value="100" suffix="M" label="Farmers Impacted" />
        </div>
      </section>

      <section className="py-40 px-6 bg-primary">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-serif text-background mb-20 text-center">Built for <span className="text-secondary italic">Excellence.</span></h2>
          <ComparisonTable />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-20">
          <div className="col-span-2 space-y-8">
            <button onClick={() => setView('main')} className="flex items-center gap-2 bg-transparent border-none cursor-pointer">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center rotate-12">
                <span className="text-primary font-bold text-2xl">A</span>
              </div>
              <span className="text-background font-serif font-bold text-2xl tracking-tight">Agrio</span>
            </button>
            <p className="text-background/40 max-w-sm text-lg italic leading-relaxed">
              &quot;Farm to Table. No Middlemen. Returning profit to the roots of the country.&quot;
            </p>
          </div>
          
          <div>
            <h5 className="text-secondary font-bold uppercase tracking-widest text-sm mb-8">Platform</h5>
            <ul className="space-y-4 text-background/60 font-medium">
              <li><button onClick={() => setView('farmer')} className="bg-transparent border-none text-background/60 hover:text-background transition-colors cursor-pointer">Farmers</button></li>
              <li><button onClick={() => setView('retailer')} className="bg-transparent border-none text-background/60 hover:text-background transition-colors cursor-pointer">Retailers</button></li>
              <li><button onClick={() => setView('consumer')} className="bg-transparent border-none text-background/60 hover:text-background transition-colors cursor-pointer">Consumers</button></li>
              <li><Link href="#" className="hover:text-background transition-colors">Price API</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-secondary font-bold uppercase tracking-widest text-sm mb-8">Network</h5>
            <ul className="space-y-4 text-background/60 font-medium">
              <li><Link href="#" className="hover:text-background transition-colors">Support (WhatsApp)</Link></li>
              <li><Link href="#" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-background transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-background transition-colors">Media Kit</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-background/20 text-xs font-mono">© 2025 KISANCARTEL INDIA. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-background/20 font-bold tracking-widest text-[10px] uppercase">
            <Link href="#">Instagram</Link>
            <Link href="#">X / Twitter</Link>
            <Link href="#">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
