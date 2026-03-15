"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Hammer, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  BarChart3,
  FileText,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for live auctions
const liveAuctions = [
  {
    id: 1,
    crop: "Wheat",
    variety: "Sharbati",
    quantity: 12500,
    unit: "kg",
    currentBid: 2450,
    bids: 12,
    timeLeft: "2h 15m",
    location: "Nashik, Maharashtra",
    quality: "A+",
    trend: "up"
  },
  {
    id: 2,
    crop: "Tomato",
    variety: "Local",
    quantity: 8500,
    unit: "kg",
    currentBid: 2200,
    bids: 8,
    timeLeft: "45m",
    location: "Bangalore, Karnataka",
    quality: "A",
    trend: "down"
  },
  {
    id: 3,
    crop: "Onion",
    variety: "Red",
    quantity: 15000,
    unit: "kg",
    currentBid: 2800,
    bids: 15,
    timeLeft: "3h 30m",
    location: "Pune, Maharashtra",
    quality: "A+",
    trend: "stable"
  }
];

// Mock data for recent purchases
const recentPurchases = [
  {
    id: 1,
    crop: "Rice",
    quantity: 5000,
    unit: "kg",
    price: 3200,
    farmer: "Green Valley FPO",
    date: "2 hours ago",
    status: "in-transit",
    delivery: "Tomorrow"
  },
  {
    id: 2,
    crop: "Potato",
    quantity: 8000,
    unit: "kg",
    price: 1800,
    farmer: "Sahyadri Farms",
    date: "5 hours ago",
    status: "delivered",
    delivery: "Today"
  },
  {
    id: 3,
    crop: "Corn",
    quantity: 3000,
    unit: "kg",
    price: 2100,
    farmer: "Golden Harvest",
    date: "1 day ago",
    status: "processing",
    delivery: "In 2 days"
  }
];

// Mock stats data
const stats = {
  totalSpent: 1240000,
  volume: 284500,
  totalSavings: 210000,
  activeOrders: 5,
  avgSavings: 15.2,
  activeFarmers: 47
};

export default function RetailerHome() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { locale } = useParams();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatWeight = (weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} Tons`;
    }
    return `${weight} kg`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">🏠 Home</h1>
          <p className="text-foreground/60">
            Quick stats • Live auctions happening now • Recent purchase feed
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${locale}/dashboard/retailer/auctions`}>
            <Button className="bg-primary hover:bg-primary/90 text-background rounded-full">
              <Hammer className="w-4 h-4 mr-2" />
              View All Auctions
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif text-primary">📊 Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-white border-muted">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">+12.5%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-1">{formatCurrency(stats.totalSpent)}</h3>
            <p className="text-sm text-foreground/60">Total Spent This Month</p>
          </Card>

          <Card className="p-6 bg-white border-muted">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700">+8.2%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-1">{formatWeight(stats.volume)}</h3>
            <p className="text-sm text-foreground/60">Volume Purchased</p>
          </Card>

          <Card className="p-6 bg-white border-muted">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-amber-600" />
              </div>
              <Badge className="bg-green-100 text-green-700">{stats.avgSavings}%</Badge>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-1">{formatCurrency(stats.totalSavings)}</h3>
            <p className="text-sm text-foreground/60">Saved vs Middleman</p>
          </Card>

          <Card className="p-6 bg-white border-muted">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700">{stats.activeFarmers}</Badge>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-1">{stats.activeFarmers}</h3>
            <p className="text-sm text-foreground/60">Active Farmers</p>
          </Card>
        </div>
      </div>

      {/* Live Auctions Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h2 className="text-2xl font-serif text-primary">Live Auctions Happening Now</h2>
            <Badge className="bg-red-100 text-red-700">3 Active</Badge>
          </div>
          <Link href={`/${locale}/dashboard/retailer/auctions`}>
            <Button variant="outline" className="rounded-full">
              View All
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {liveAuctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white border-muted hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary">{auction.crop}</h3>
                    <p className="text-sm text-foreground/60">{auction.variety} • {auction.quality} Grade</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 animate-pulse">LIVE</Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Current Bid</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">₹{auction.currentBid}</span>
                      <span className="text-sm text-foreground/60">/qtl</span>
                      {auction.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {auction.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Available</span>
                    <span className="font-medium">{auction.quantity.toLocaleString()} {auction.unit}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Bids</span>
                    <span className="font-medium">{auction.bids} participants</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Time Left</span>
                    <div className="flex items-center gap-1 text-amber-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{auction.timeLeft}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-foreground/40">
                    <Eye className="w-3 h-3" />
                    <span>📍 {auction.location}</span>
                  </div>
                </div>

                <Link href={`/${locale}/dashboard/retailer/auctions/${auction.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-background rounded-full">
                    Join Auction
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Purchase Feed */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-primary">Recent Purchase Feed</h2>
          <Link href={`/${locale}/dashboard/retailer/orders`}>
            <Button variant="outline" className="rounded-full">
              View All Orders
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Card className="bg-white border-muted">
          <div className="divide-y divide-muted">
            {recentPurchases.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{purchase.crop}</h4>
                      <p className="text-sm text-foreground/60">
                        {purchase.quantity.toLocaleString()} {purchase.unit} • {formatCurrency(purchase.price * purchase.quantity)}
                      </p>
                      <p className="text-xs text-foreground/40">
                        From {purchase.farmer} • {purchase.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge 
                      className={
                        purchase.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        purchase.status === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }
                    >
                      {purchase.status === 'delivered' ? 'Delivered' :
                       purchase.status === 'in-transit' ? 'In Transit' : 'Processing'}
                    </Badge>
                    <p className="text-sm text-foreground/60 mt-2">
                      Delivery: {purchase.delivery}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={`/${locale}/dashboard/retailer/listings`}>
          <Card className="p-6 bg-white border-muted hover:border-green-500/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Browse Listings</h3>
                <p className="text-sm text-foreground/60">Buy directly from farmers</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href={`/${locale}/dashboard/retailer/analytics`}>
          <Card className="p-6 bg-white border-muted hover:border-blue-500/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">View Analytics</h3>
                <p className="text-sm text-foreground/60">Price trends & forecasts</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href={`/${locale}/dashboard/retailer/orders`}>
          <Card className="p-6 bg-white border-muted hover:border-purple-500/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Manage Orders</h3>
                <p className="text-sm text-foreground/60">Track deliveries & invoices</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
