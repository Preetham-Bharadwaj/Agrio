"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Hammer, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Star,
  Eye,
  Bell,
  Filter,
  Search,
  ArrowUpRight,
  Trophy,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for live auctions
const liveAuctions = [
  {
    id: 1,
    crop: "Wheat",
    variety: "Sharbati",
    quantity: 12500,
    unit: "kg",
    currentBid: 2450,
    minBid: 2400,
    bids: 12,
    timeLeft: "2h 15m",
    location: "Nashik, Maharashtra",
    quality: "A+",
    trend: "up",
    farmer: "Green Valley FPO",
    harvestDate: "2024-03-10",
    participants: 8
  },
  {
    id: 2,
    crop: "Tomato",
    variety: "Local",
    quantity: 8500,
    unit: "kg",
    currentBid: 2200,
    minBid: 2100,
    bids: 8,
    timeLeft: "45m",
    location: "Bangalore, Karnataka",
    quality: "A",
    trend: "down",
    farmer: "Sahyadri Farms",
    harvestDate: "2024-03-12",
    participants: 5
  },
  {
    id: 3,
    crop: "Onion",
    variety: "Red",
    quantity: 15000,
    unit: "kg",
    currentBid: 2800,
    minBid: 2700,
    bids: 15,
    timeLeft: "3h 30m",
    location: "Pune, Maharashtra",
    quality: "A+",
    trend: "stable",
    farmer: "Golden Harvest",
    harvestDate: "2024-03-08",
    participants: 12
  },
  {
    id: 4,
    crop: "Rice",
    variety: "Basmati",
    quantity: 6000,
    unit: "kg",
    currentBid: 4500,
    minBid: 4400,
    bids: 6,
    timeLeft: "1h 20m",
    location: "Delhi, NCR",
    quality: "A+",
    trend: "up",
    farmer: "Premium Grains Co",
    harvestDate: "2024-03-05",
    participants: 4
  }
];

// Mock data for upcoming auctions
const upcomingAuctions = [
  {
    id: 5,
    crop: "Corn",
    variety: "Sweet",
    quantity: 10000,
    unit: "kg",
    estimatedPrice: 2100,
    location: "Hyderabad, Telangana",
    quality: "A",
    startTime: "2024-03-15 10:00 AM",
    farmer: "AgriGold Farms",
    harvestDate: "2024-03-14",
    reminder: false
  },
  {
    id: 6,
    crop: "Potato",
    variety: "Kufri",
    quantity: 20000,
    unit: "kg",
    estimatedPrice: 1800,
    location: "Lucknow, Uttar Pradesh",
    quality: "A+",
    startTime: "2024-03-15 2:00 PM",
    farmer: "North India FPO",
    harvestDate: "2024-03-13",
    reminder: true
  },
  {
    id: 7,
    crop: "Soybeans",
    variety: "Local",
    quantity: 7500,
    unit: "kg",
    estimatedPrice: 4200,
    location: "Indore, Madhya Pradesh",
    quality: "A+",
    startTime: "2024-03-16 9:00 AM",
    farmer: "Madhya Bharat Farms",
    harvestDate: "2024-03-15",
    reminder: false
  }
];

// Mock data for won auctions
const wonAuctions = [
  {
    id: 8,
    crop: "Garlic",
    variety: "Local",
    quantity: 3000,
    unit: "kg",
    winningBid: 8500,
    marketPrice: 9200,
    savings: 2100,
    location: "Jaipur, Rajasthan",
    quality: "A+",
    wonDate: "2024-03-10",
    farmer: "Rajasthan Herbs",
    status: "processing",
    delivery: "2024-03-15"
  },
  {
    id: 9,
    crop: "Ginger",
    variety: "Organic",
    quantity: 2000,
    unit: "kg",
    winningBid: 12000,
    marketPrice: 13500,
    savings: 3000,
    location: "Kochi, Kerala",
    quality: "A+",
    wonDate: "2024-03-08",
    farmer: "Spice Gardens",
    status: "delivered",
    delivery: "2024-03-12"
  },
  {
    id: 10,
    crop: "Turmeric",
    variety: "Local",
    quantity: 5000,
    unit: "kg",
    winningBid: 9500,
    marketPrice: 10200,
    savings: 3500,
    location: "Hyderabad, Telangana",
    quality: "A",
    wonDate: "2024-03-05",
    farmer: "Golden Spices",
    status: "in-transit",
    delivery: "2024-03-14"
  }
];

export default function RetailerAuctions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const { locale } = useParams();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatWeight = (weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} Tons`;
    }
    return `${weight} kg`;
  };

  const filteredLiveAuctions = liveAuctions.filter(auction => 
    auction.crop.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCrop === "all" || auction.crop === selectedCrop)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Auctions</h1>
          <p className="text-foreground/60">Live bidding, upcoming auctions, and your winning bids</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-background rounded-full">
            <Bell className="w-4 h-4 mr-2" />
            Set Alerts
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search auctions by crop..."
            className="pl-10 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-xl border border-muted bg-white"
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          <option value="all">All Crops</option>
          <option value="Wheat">Wheat</option>
          <option value="Rice">Rice</option>
          <option value="Tomato">Tomato</option>
          <option value="Onion">Onion</option>
          <option value="Corn">Corn</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="live" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="relative">
            Live Auctions
            <Badge className="ml-2 bg-red-100 text-red-700">4</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming
            <Badge className="ml-2 bg-blue-100 text-blue-700">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="won">
            Won Auctions
            <Badge className="ml-2 bg-green-100 text-green-700">3</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Live Auctions */}
        <TabsContent value="live" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLiveAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <div>
                        <h3 className="text-xl font-serif font-bold text-primary">{auction.crop}</h3>
                        <p className="text-sm text-foreground/60">{auction.variety} • {auction.quality} Grade</p>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-700 animate-pulse">LIVE</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Current Bid</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{formatCurrency(auction.currentBid)}</span>
                        <span className="text-xs text-foreground/60">/qtl</span>
                        {auction.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {auction.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Time Left</p>
                      <div className="flex items-center gap-1 text-amber-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-bold">{auction.timeLeft}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Available</span>
                      <span className="font-medium">{formatWeight(auction.quantity)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Bids</span>
                      <span className="font-medium">{auction.bids} participants</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Min Bid</span>
                      <span className="font-medium">{formatCurrency(auction.minBid)}/qtl</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-foreground/40">
                      <Eye className="w-3 h-3" />
                      <span>📍 {auction.location} • {auction.farmer}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/${locale}/dashboard/retailer/auctions/${auction.id}`} className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-background rounded-full">
                        <Hammer className="w-4 h-4 mr-2" />
                        Join Auction
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Upcoming Auctions */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted hover:border-blue-500/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-primary">{auction.crop}</h3>
                      <p className="text-sm text-foreground/60">{auction.variety} • {auction.quality} Grade</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      <Calendar className="w-3 h-3 mr-1" />
                      Upcoming
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Start Time</p>
                      <p className="font-medium">{auction.startTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">Est. Price</p>
                      <p className="font-medium">{formatCurrency(auction.estimatedPrice)}/qtl</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Available</span>
                      <span className="font-medium">{formatWeight(auction.quantity)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-foreground/40">
                      <Eye className="w-3 h-3" />
                      <span>📍 {auction.location} • {auction.farmer}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant={auction.reminder ? "default" : "outline"} 
                      className="flex-1 rounded-full"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {auction.reminder ? "Reminder Set" : "Set Reminder"}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Won Auctions */}
        <TabsContent value="won" className="space-y-6">
          <div className="space-y-4">
            {wonAuctions.map((auction, index) => (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted hover:border-green-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-primary">{auction.crop}</h3>
                        <p className="text-sm text-foreground/60">
                          {auction.quantity.toLocaleString()} {auction.unit} • {auction.variety}
                        </p>
                        <p className="text-xs text-foreground/40">
                          From {auction.farmer} • Won on {auction.wonDate}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="mb-2">
                        <p className="text-xs text-foreground/60 uppercase tracking-wider">Winning Bid</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(auction.winningBid)}/qtl</p>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-xs text-foreground/60">You Saved</p>
                        <p className="text-sm font-bold text-green-600">
                          {formatCurrency(auction.savings)} ({Math.round((auction.savings / (auction.marketPrice * auction.quantity / 100)) * 100)}%)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            auction.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            auction.status === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }
                        >
                          {auction.status === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {auction.status === 'in-transit' && <Clock className="w-3 h-3 mr-1" />}
                          {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-foreground/60">
                          Delivery: {auction.delivery}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
