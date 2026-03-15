"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Hammer, 
  TrendingUp, 
  Clock, 
  Users, 
  MapPin, 
  AlertCircle,
  CheckCircle2,
  Zap,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface Auction {
  id: string;
  crop_name: string;
  quantity: number;
  grade: string;
  district: string;
  current_bid: number;
  min_bid_increment: number;
  highest_bidder_id: string | null;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'live' | 'closed';
  farmer_count: number;
}

interface Bid {
  id: string;
  auction_id: string;
  bidder_name: string;
  amount: number;
  timestamp: string;
  is_current_user: boolean;
}

export default function AuctionBiddingInterface() {
  const t = useTranslations('retailer');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [recentBids, setRecentBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch auctions on mount
  useEffect(() => {
    fetchAuctions();
    // Set up real-time subscription (Supabase Realtime)
    // TODO: Implement WebSocket connection in Task 10
  }, []);

  // Auto-refresh auctions every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedAuction) {
        fetchAuctionDetails(selectedAuction.id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedAuction]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('auctions')
      //   .select('*')
      //   .in('status', ['scheduled', 'live'])
      //   .order('start_time', { ascending: true });

      // Mock data for now
      const mockAuctions: Auction[] = [
        {
          id: '1',
          crop_name: 'Wheat',
          quantity: 63500,
          grade: 'A',
          district: 'Bidar',
          current_bid: 2950,
          min_bid_increment: 50,
          highest_bidder_id: null,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          status: 'live',
          farmer_count: 127
        },
        {
          id: '2',
          crop_name: 'Tomato',
          quantity: 28000,
          grade: 'A',
          district: 'Nashik',
          current_bid: 42,
          min_bid_increment: 2,
          highest_bidder_id: 'user123',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 1800000).toISOString(),
          status: 'live',
          farmer_count: 84
        },
        {
          id: '3',
          crop_name: 'Onion',
          quantity: 45000,
          grade: 'B',
          district: 'Lasalgaon',
          current_bid: 0,
          min_bid_increment: 5,
          highest_bidder_id: null,
          start_time: new Date(Date.now() + 7200000).toISOString(),
          end_time: new Date(Date.now() + 10800000).toISOString(),
          status: 'scheduled',
          farmer_count: 156
        }
      ];

      setAuctions(mockAuctions);
    } catch (err) {
      setError('Failed to fetch auctions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionDetails = async (auctionId: string) => {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('auctions')
      //   .select('*')
      //   .eq('id', auctionId)
      //   .single();

      // Update selected auction with latest data
      const updatedAuction = auctions.find(a => a.id === auctionId);
      if (updatedAuction) {
        setSelectedAuction(updatedAuction);
      }
    } catch (err) {
      console.error('Failed to fetch auction details:', err);
    }
  };

  const handlePlaceBid = async () => {
    if (!selectedAuction || !bidAmount) return;

    const bid = parseFloat(bidAmount);
    const minRequired = selectedAuction.current_bid + selectedAuction.min_bid_increment;

    // Validation: Bid must be at least 1% above current bid
    if (bid < minRequired) {
      setError(`Bid must be at least ₹${minRequired.toFixed(2)}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual Supabase mutation
      // const { data, error } = await supabase
      //   .from('bids')
      //   .insert({
      //     auction_id: selectedAuction.id,
      //     bidder_id: currentUserId,
      //     amount: bid,
      //     timestamp: new Date().toISOString()
      //   });

      // Update auction's current_bid and highest_bidder_id
      // await supabase
      //   .from('auctions')
      //   .update({
      //     current_bid: bid,
      //     highest_bidder_id: currentUserId
      //   })
      //   .eq('id', selectedAuction.id);

      // Mock success
      setSuccess('Bid placed successfully!');
      setBidAmount("");
      
      // Update local state
      setSelectedAuction({
        ...selectedAuction,
        current_bid: bid,
        highest_bidder_id: 'current_user'
      });

      // Refresh auctions
      setTimeout(() => {
        fetchAuctions();
        setSuccess(null);
      }, 2000);

    } catch (err) {
      setError('Failed to place bid. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'scheduled': return 'bg-amber-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-primary">{t('liveAuctions')}</h2>
          <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest mt-1">
            {t('bidDirectly')}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAuctions}
          disabled={loading}
          className="rounded-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh')}
        </Button>
      </div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-green-500 text-sm font-medium">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auction List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <Card
            key={auction.id}
            className={`p-6 rounded-[2rem] cursor-pointer transition-all hover:shadow-xl ${
              selectedAuction?.id === auction.id 
                ? 'border-primary bg-primary/5' 
                : 'border-muted bg-white'
            }`}
            onClick={() => setSelectedAuction(auction)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-serif text-primary font-bold">
                    {auction.crop_name}
                  </h3>
                  <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                    {auction.quantity.toLocaleString()} kg
                  </p>
                </div>
                <Badge className={`${getStatusColor(auction.status)} text-background border-none text-[10px]`}>
                  {auction.status.toUpperCase()}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <MapPin className="w-4 h-4" />
                  <span>{auction.district}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Users className="w-4 h-4" />
                  <span>{auction.farmer_count} farmers pooled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeRemaining(auction.end_time)}</span>
                </div>
              </div>

              {/* Current Bid */}
              <div className="pt-4 border-t border-muted">
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest mb-1">
                  {auction.current_bid > 0 ? t('currentBid') : t('startingBid')}
                </p>
                <p className="text-2xl font-mono font-bold text-primary">
                  ₹{auction.current_bid > 0 ? auction.current_bid.toFixed(2) : '---'}
                  <span className="text-sm font-sans text-foreground/40 ml-1">/kg</span>
                </p>
              </div>

              {/* Grade Badge */}
              <Badge variant="outline" className="border-primary/20 text-primary text-xs">
                Grade {auction.grade}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {auctions.length === 0 && !loading && (
        <Card className="p-12 rounded-[3rem] text-center bg-white border-muted">
          <Hammer className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-primary mb-2">{t('noLiveAuctions')}</h3>
          <p className="text-foreground/40 text-sm">{t('checkBackLater')}</p>
        </Card>
      )}

      {/* Bidding Panel */}
      {selectedAuction && selectedAuction.status === 'live' && (
        <Card className="p-8 rounded-[3rem] bg-primary text-background border-none shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-serif mb-1">{t('placeBid')}</h3>
                <p className="text-background/60 text-sm">
                  {selectedAuction.crop_name} • {selectedAuction.quantity.toLocaleString()} kg
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                <Hammer className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Current Bid Info */}
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-background/60 text-sm">{t('currentHighest')}</span>
                <span className="text-2xl font-mono font-bold">
                  ₹{selectedAuction.current_bid.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-background/60 text-sm">{t('minimumBid')}</span>
                <span className="text-lg font-mono font-bold text-secondary">
                  ₹{(selectedAuction.current_bid + selectedAuction.min_bid_increment).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bid Input */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-background/80 uppercase tracking-widest">
                {t('yourBid')}
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-background/60 font-mono">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={(selectedAuction.current_bid + selectedAuction.min_bid_increment).toFixed(2)}
                    className="pl-8 py-6 rounded-2xl bg-white/10 border-white/20 text-background placeholder:text-background/40 font-mono text-lg"
                    step={selectedAuction.min_bid_increment}
                    min={selectedAuction.current_bid + selectedAuction.min_bid_increment}
                  />
                </div>
                <Button
                  onClick={handlePlaceBid}
                  disabled={loading || !bidAmount}
                  className="bg-secondary text-primary hover:bg-secondary/90 font-bold px-8 rounded-2xl"
                >
                  {loading ? t('placing') : t('placeBid')}
                </Button>
              </div>
              <p className="text-background/40 text-xs italic">
                {t('bidIncrement')}: ₹{selectedAuction.min_bid_increment}
              </p>
            </div>

            {/* Quick Bid Buttons */}
            <div className="flex gap-2">
              {[50, 100, 200].map((increment) => (
                <Button
                  key={increment}
                  variant="outline"
                  size="sm"
                  onClick={() => setBidAmount((selectedAuction.current_bid + increment).toFixed(2))}
                  className="flex-1 border-white/20 text-background hover:bg-white/10 rounded-full"
                >
                  +₹{increment}
                </Button>
              ))}
            </div>

            {/* Time Remaining */}
            <div className="flex items-center justify-center gap-2 text-secondary">
              <Clock className="w-4 h-4" />
              <span className="font-bold text-sm">
                {t('timeRemaining')}: {getTimeRemaining(selectedAuction.end_time)}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
