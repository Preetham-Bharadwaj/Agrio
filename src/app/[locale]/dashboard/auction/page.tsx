"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hammer, 
  Users, 
  Timer, 
  TrendingUp, 
  ChevronRight,
  ArrowUp,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/useUserStore";
import { Input } from "@/components/ui/input";

export default function AuctionPage() {
  const role = useUserStore((state) => state.role);
  const [currentBid, setCurrentBid] = useState(32.50);
  const [bidInput, setBidInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [bids, setBids] = useState([
    { id: 1, bidder: "Madan_Retail", amount: 32.50, time: "Just now" },
    { id: 2, bidder: "Praveen_Bulk", amount: 31.00, time: "1m ago" },
    { id: 3, bidder: "Vashi_Trader", amount: 29.50, time: "3m ago" },
  ]);

  // Simulate real-time bid updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const increment = (Math.random() * 2).toFixed(2);
        const newBid = parseFloat((currentBid + parseFloat(increment)).toFixed(2));
        setCurrentBid(newBid);
        setBids(prev => [
          { id: Date.now(), bidder: "Fresh_Buyer_" + Math.floor(Math.random() * 100), amount: newBid, time: "Just now" },
          ...prev.slice(0, 4)
        ]);
      }
      if (timeLeft > 0) setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentBid, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-0 flex flex-col min-h-screen">
      {/* Top Banner */}
      <div className="bg-primary p-6 pt-10 rounded-b-[40px] shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <Hammer className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-background">WHEAT POOL #842</h1>
              <div className="flex items-center gap-2 opacity-60">
                <Users className="w-3 h-3 text-secondary" />
                <span className="text-[10px] text-background font-mono font-bold uppercase tracking-widest">42 Farmers • 45,000 KG</span>
              </div>
            </div>
          </div>
          <Badge className="bg-red-500 hover:bg-red-500 text-white animate-pulse border-none px-3 font-mono">LIVE</Badge>
        </div>

        <div className="text-center mb-10 relative z-10">
          <p className="text-[10px] text-background/40 font-bold uppercase tracking-widest mb-2">Highest Bid / KG</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl text-secondary font-mono font-bold">₹</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentBid}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-7xl text-secondary font-mono font-bold"
              >
                {currentBid.toFixed(2)}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-center mb-4 relative z-10">
          <div className="bg-background/10 backdrop-blur-md px-6 py-2 rounded-full border border-background/20 flex items-center gap-3">
            <Timer className="w-4 h-4 text-secondary" />
            <span className="text-background font-mono font-bold tracking-widest">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/5">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: `${(timeLeft / 120) * 100}%` }}
            className="h-full bg-secondary"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1">
        <div className="bg-muted/30 rounded-3xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mb-1">Your Share (500 KG)</p>
            <p className="text-2xl font-mono font-bold text-primary">₹{(currentBid * 500).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Net Gain</p>
            <p className="text-xl font-mono font-bold text-green-600">+₹4,500</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary mb-4">Live Bids</h3>
          {bids.map((bid, i) => (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-4 rounded-2xl ${i === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-white'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 0 ? 'bg-primary text-background' : 'bg-muted text-foreground/40'}`}>
                  {i === 0 ? <ArrowUp className="w-4 h-4" /> : <div className="w-1 h-1 bg-current" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${i === 0 ? 'text-primary' : 'text-foreground/60'}`}>{bid.bidder}</h4>
                  <p className="text-[10px] text-foreground/40">{bid.time}</p>
                </div>
              </div>
              <p className={`font-mono font-bold ${i === 0 ? 'text-primary' : 'text-foreground/60'}`}>₹{bid.amount.toFixed(2)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-20 left-0 right-0 px-6 max-w-md mx-auto z-[70]">
        {role === 'retailer' ? (
          <div className="bg-background border border-muted p-4 rounded-3xl shadow-2xl flex flex-col gap-4">
            <div className="flex gap-2">
              <Button onClick={() => setBidInput((currentBid + 0.5).toFixed(2))} variant="outline" className="flex-1 rounded-xl h-12 border-muted font-bold">+₹0.50</Button>
              <Button onClick={() => setBidInput((currentBid + 1.0).toFixed(2))} variant="outline" className="flex-1 rounded-xl h-12 border-muted font-bold">+₹1.00</Button>
              <Button onClick={() => setBidInput((currentBid + 2.0).toFixed(2))} variant="outline" className="flex-1 rounded-xl h-12 border-muted font-bold">+₹2.00</Button>
            </div>
            <div className="flex gap-3">
              <Input 
                value={bidInput}
                onChange={(e) => setBidInput(e.target.value)}
                placeholder="Enter custom bid..."
                className="flex-1 h-14 rounded-2xl border-muted bg-muted/20 font-mono font-bold"
              />
              <Button className="bg-primary text-background h-14 px-8 rounded-2xl font-bold shadow-xl shadow-primary/20">
                PLACE BID
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-background border border-muted p-4 rounded-3xl shadow-2xl flex gap-3">
            <Button className="flex-1 bg-primary text-background hover:bg-primary/90 py-7 rounded-2xl font-bold flex flex-col items-center">
              <span>Accept Current Bid</span>
              <span className="text-[10px] opacity-60 font-mono tracking-widest uppercase">CLOSE POOL</span>
            </Button>
            <Button variant="outline" className="flex-1 py-7 rounded-2xl font-bold flex flex-col items-center border-muted border-2">
              <span>Hold Harvest</span>
              <span className="text-[10px] opacity-40 font-mono tracking-widest uppercase">WAIT FOR HIGHER</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
