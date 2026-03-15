"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  IndianRupee, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface MyListingsProps {
  onNewListing: () => void;
}

export function MyListings({ onNewListing }: MyListingsProps) {
  // Mock data for demonstration
  const earnings = {
    total: 284650,
    pending: 42500,
    thisMonth: 125000
  };

  const activeListings = [
    {
      id: 1,
      crop: 'Tomato',
      variety: 'Hybrid',
      quantity: 500,
      unit: 'kg',
      price: 22,
      currentBid: 24.5,
      bids: 8,
      views: 145,
      timeLeft: '2h 15m',
      status: 'active'
    },
    {
      id: 2,
      crop: 'Wheat',
      variety: 'Premium',
      quantity: 1200,
      unit: 'kg',
      price: 28,
      currentBid: 27.8,
      bids: 5,
      views: 89,
      timeLeft: '5h 30m',
      status: 'active'
    }
  ];

  const pastListings = [
    {
      id: 3,
      crop: 'Potato',
      variety: 'Local',
      quantity: 800,
      unit: 'kg',
      finalPrice: 18.5,
      soldPrice: 19.2,
      buyer: 'GreenMart Organics',
      soldDate: '2024-03-10',
      paymentStatus: 'paid',
      views: 203,
      totalBids: 12
    },
    {
      id: 4,
      crop: 'Corn',
      variety: 'Sweet',
      quantity: 600,
      unit: 'kg',
      finalPrice: 25,
      soldPrice: 24.8,
      buyer: 'FreshVeg Co.',
      soldDate: '2024-03-08',
      paymentStatus: 'pending',
      views: 167,
      totalBids: 9
    }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Earnings Summary */}
      <div>
        <h2 className="text-xl font-serif text-primary mb-4">Earnings Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-primary">
                ₹{earnings.total.toLocaleString()}
              </p>
              <p className="text-xs text-foreground/60">Total Earnings</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <Badge className="bg-yellow-100 text-yellow-700 border-none text-xs">Pending</Badge>
              </div>
              <p className="text-2xl font-serif font-bold text-yellow-700">
                ₹{earnings.pending.toLocaleString()}
              </p>
              <p className="text-xs text-foreground/60">Pending Payments</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-green-700">
                ₹{earnings.thisMonth.toLocaleString()}
              </p>
              <p className="text-xs text-foreground/60">This Month</p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Active Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif text-primary">Active Listings</h2>
          <Badge className="bg-green-100 text-green-700 border-none animate-pulse">
            {activeListings.length} Live
          </Badge>
        </div>
        
        <div className="space-y-4">
          {activeListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="p-4 border-l-4 border-l-green-500 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-primary">
                          {listing.crop} ({listing.variety})
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {listing.quantity} {listing.unit} • Listed at ₹{listing.price}/{listing.unit}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Current Bid</p>
                        <p className="font-bold text-green-600">₹{listing.currentBid}</p>
                        <div className="flex items-center justify-center text-xs">
                          {listing.currentBid > listing.price ? (
                            <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-600 mr-1" />
                          )}
                          <span className={listing.currentBid > listing.price ? 'text-green-600' : 'text-red-600'}>
                            {listing.currentBid > listing.price ? '+' : ''}{((listing.currentBid - listing.price) / listing.price * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Buyer Interest</p>
                        <p className="font-bold">{listing.bids} bids</p>
                        <div className="flex items-center justify-center text-xs text-foreground/60">
                          <Users className="w-3 h-3 mr-1" />
                          {listing.views} views
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Time Left</p>
                        <p className="font-bold text-amber-600">{listing.timeLeft}</p>
                        <div className="w-full bg-muted rounded-full h-1 mt-1">
                          <div className="bg-amber-500 h-1 rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Est. Value</p>
                        <p className="font-bold text-primary">
                          ₹{(listing.currentBid * listing.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">+₹{((listing.currentBid - listing.price) * listing.quantity).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Past Listings */}
      <div>
        <h2 className="text-xl font-serif text-primary mb-4">Past Listings</h2>
        
        <div className="space-y-4">
          {pastListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-4 border-l-4 border-l-gray-300 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-foreground/60" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-foreground">
                          {listing.crop} ({listing.variety})
                        </h3>
                        <p className="text-sm text-foreground/60">
                          {listing.quantity} {listing.unit} • Sold to {listing.buyer}
                        </p>
                      </div>
                      <Badge className={getPaymentStatusColor(listing.paymentStatus)}>
                        <div className="flex items-center gap-1">
                          {getPaymentStatusIcon(listing.paymentStatus)}
                          {listing.paymentStatus.charAt(0).toUpperCase() + listing.paymentStatus.slice(1)}
                        </div>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Final Price</p>
                        <p className="font-bold">₹{listing.soldPrice}</p>
                        <p className="text-xs text-foreground/60">
                          {listing.soldPrice > listing.finalPrice ? (
                            <span className="text-green-600">+₹{(listing.soldPrice - listing.finalPrice).toFixed(1)}</span>
                          ) : (
                            <span className="text-red-600">-₹{(listing.finalPrice - listing.soldPrice).toFixed(1)}</span>
                          )}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Total Value</p>
                        <p className="font-bold text-primary">
                          ₹{(listing.soldPrice * listing.quantity).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Buyer Interest</p>
                        <p className="font-bold">{listing.totalBids} bids</p>
                        <div className="flex items-center justify-center text-xs text-foreground/60">
                          <Eye className="w-3 h-3 mr-1" />
                          {listing.views} views
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-foreground/40">Sold Date</p>
                        <p className="font-bold">{new Date(listing.soldDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Empty State for No Listings */}
      {activeListings.length === 0 && pastListings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-foreground/40" />
          </div>
          <h3 className="text-xl font-serif text-primary mb-2">No listings yet</h3>
          <p className="text-foreground/60 mb-6">Start selling your crops by creating your first listing</p>
          <Button onClick={onNewListing} className="bg-primary hover:bg-primary/90 text-background rounded-full">
            Create Your First Listing
          </Button>
        </motion.div>
      )}
    </div>
  );
}
