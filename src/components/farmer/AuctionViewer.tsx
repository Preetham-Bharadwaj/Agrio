'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Gavel, TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';

interface AuctionViewerProps {
  farmerId: string;
  onAcceptBid: (auctionId: string, bidAmount: number) => void;
}

interface Auction {
  id: string;
  crop: string;
  total_quantity_kg: number;
  current_bid: number;
  highest_bidder_id: string | null;
  status: 'scheduled' | 'live' | 'closed';
  starts_at: string;
  ends_at: string;
  fpo_id: string;
  created_at: string;
}

export function AuctionViewer({ farmerId, onAcceptBid }: AuctionViewerProps) {
  const t = useTranslations('farmer');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctions();

    // Set up real-time subscription for auction updates
    const channel = supabase
      .channel('auction-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions',
          filter: `status=eq.live`,
        },
        (payload) => {
          console.log('Auction update:', payload);
          fetchAuctions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('auctions')
        .select('*')
        .eq('status', 'live')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAuctions(data || []);
    } catch (err: any) {
      console.error('Error fetching auctions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (auctionId: string, bidAmount: number) => {
    try {
      // Update auction status to closed
      const { error: updateError } = await supabase
        .from('auctions')
        .update({ status: 'closed' })
        .eq('id', auctionId);

      if (updateError) throw updateError;

      onAcceptBid(auctionId, bidAmount);
      fetchAuctions();
    } catch (err: any) {
      console.error('Error accepting bid:', err);
      setError(err.message);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeRemaining = (endsAt: string) => {
    const now = new Date();
    const end = new Date(endsAt);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">{t('noLiveAuctions')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('noLiveAuctionsDesc')}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Gavel className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">{t('liveAuctions')}</h3>
        <Badge variant="destructive" className="animate-pulse">
          {auctions.length} {t('live')}
        </Badge>
      </div>

      {auctions.map((auction) => (
        <Card key={auction.id} className="p-6 border-2 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold mb-1">{auction.crop}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {auction.total_quantity_kg.toLocaleString()} kg
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getTimeRemaining(auction.ends_at)}
                </span>
              </div>
            </div>
            <Badge 
              variant="default" 
              className="bg-green-500 animate-pulse"
            >
              {t('live')}
            </Badge>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('currentBid')}
                </p>
                <p className="text-3xl font-bold text-primary">
                  ₹{auction.current_bid.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  ₹{(auction.current_bid / auction.total_quantity_kg).toFixed(2)}/kg
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>

          {auction.highest_bidder_id && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Users className="w-4 h-4" />
              <span>
                {t('highestBidder')}: {auction.highest_bidder_id.slice(0, 8)}...
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => fetchAuctions()}
            >
              {t('refresh')}
            </Button>
            {auction.status === 'closed' && (
              <Button
                className="flex-1"
                onClick={() => handleAcceptBid(auction.id, auction.current_bid)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('acceptBid')}
              </Button>
            )}
          </div>

          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>{t('starts')}: {formatTime(auction.starts_at)}</span>
              <span>{t('ends')}: {formatTime(auction.ends_at)}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
