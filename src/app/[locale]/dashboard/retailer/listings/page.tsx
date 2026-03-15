"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar,
  Truck,
  Scale,
  DollarSign,
  CheckCircle,
  MessageCircle,
  Heart,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for farmer listings
const farmerListings = [
  {
    id: 1,
    farmer: {
      name: "Green Valley FPO",
      rating: 4.8,
      reviews: 124,
      location: "Nashik, Maharashtra",
      verified: true,
      responseTime: "2 hours"
    },
    crop: "Wheat",
    variety: "Sharbati",
    quantity: 5000,
    unit: "kg",
    price: 2450,
    priceUnit: "quintal",
    quality: "A+",
    harvestDate: "2024-03-10",
    availableFrom: "2024-03-12",
    description: "Premium quality Sharbati wheat, organically grown with proper irrigation and harvesting techniques.",
    images: ["/api/placeholder/300/200"],
    certifications: ["Organic", "ISO Certified"],
    deliveryOptions: ["Farm pickup", "Home delivery"],
    minOrder: 1000,
    negotiable: true,
    listed: "2 hours ago"
  },
  {
    id: 2,
    farmer: {
      name: "Sahyadri Farms",
      rating: 4.9,
      reviews: 89,
      location: "Bangalore, Karnataka",
      verified: true,
      responseTime: "1 hour"
    },
    crop: "Tomato",
    variety: "Local Hybrid",
    quantity: 3000,
    unit: "kg",
    price: 2200,
    priceUnit: "quintal",
    quality: "A",
    harvestDate: "2024-03-12",
    availableFrom: "2024-03-13",
    description: "Fresh, locally grown tomatoes with excellent taste and long shelf life. Perfect for retail.",
    images: ["/api/placeholder/300/200"],
    certifications: ["Good Agricultural Practices"],
    deliveryOptions: ["Farm pickup", "Home delivery", "Cold chain"],
    minOrder: 500,
    negotiable: false,
    listed: "5 hours ago"
  },
  {
    id: 3,
    farmer: {
      name: "Golden Harvest",
      rating: 4.7,
      reviews: 156,
      location: "Pune, Maharashtra",
      verified: true,
      responseTime: "3 hours"
    },
    crop: "Onion",
    variety: "Red Bellary",
    quantity: 8000,
    unit: "kg",
    price: 2800,
    priceUnit: "quintal",
    quality: "A+",
    harvestDate: "2024-03-08",
    availableFrom: "2024-03-11",
    description: "High-quality red onions with good storage life. Well-cured and ready for market.",
    images: ["/api/placeholder/300/200"],
    certifications: ["Traditional Farming"],
    deliveryOptions: ["Farm pickup", "Home delivery"],
    minOrder: 2000,
    negotiable: true,
    listed: "1 day ago"
  },
  {
    id: 4,
    farmer: {
      name: "Premium Grains Co",
      rating: 4.9,
      reviews: 203,
      location: "Delhi NCR",
      verified: true,
      responseTime: "1 hour"
    },
    crop: "Rice",
    variety: "Basmati 1121",
    quantity: 2000,
    unit: "kg",
    price: 4500,
    priceUnit: "quintal",
    quality: "A+",
    harvestDate: "2024-03-05",
    availableFrom: "2024-03-10",
    description: "Premium Basmati 1121 rice with excellent aroma and long grain. Aged for 12 months.",
    images: ["/api/placeholder/300/200"],
    certifications: ["Organic", "FSSAI", "ISO Certified"],
    deliveryOptions: ["Farm pickup", "Home delivery", "Packaging available"],
    minOrder: 500,
    negotiable: false,
    listed: "2 days ago"
  },
  {
    id: 5,
    farmer: {
      name: "North India FPO",
      rating: 4.6,
      reviews: 78,
      location: "Lucknow, Uttar Pradesh",
      verified: true,
      responseTime: "4 hours"
    },
    crop: "Potato",
    variety: "Kufri Jyoti",
    quantity: 10000,
    unit: "kg",
    price: 1800,
    priceUnit: "quintal",
    quality: "A",
    harvestDate: "2024-03-13",
    availableFrom: "2024-03-14",
    description: "Good quality potatoes suitable for table consumption and processing. Disease-free.",
    images: ["/api/placeholder/300/200"],
    certifications: ["Traditional Farming"],
    deliveryOptions: ["Farm pickup", "Home delivery"],
    minOrder: 2500,
    negotiable: true,
    listed: "3 days ago"
  }
];

export default function RetailerListings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedQuality, setSelectedQuality] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("recent");
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

  const filteredListings = farmerListings
    .filter(listing => 
      listing.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(listing => selectedCrop === "all" || listing.crop === selectedCrop)
    .filter(listing => selectedQuality === "all" || listing.quality === selectedQuality)
    .filter(listing => listing.price >= priceRange[0] && listing.price <= priceRange[1])
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.farmer.rating - a.farmer.rating;
        default:
          return 0; // recent
      }
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Browse Listings</h1>
          <p className="text-foreground/60">Buy directly from verified farmers and FPOs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-background rounded-full">
            Post Requirement
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-muted rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input
              placeholder="Search crops or farmers..."
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
            <option value="Potato">Potato</option>
          </select>

          <select
            className="px-4 py-2 rounded-xl border border-muted bg-white"
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
          >
            <option value="all">All Quality</option>
            <option value="A+">A+ Grade</option>
            <option value="A">A Grade</option>
            <option value="B">B Grade</option>
          </select>

          <select
            className="px-4 py-2 rounded-xl border border-muted bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <Button variant="outline" className="rounded-xl">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-foreground/60">
          Showing <span className="font-semibold text-primary">{filteredListings.length}</span> listings
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Save Search</Button>
          <Button variant="ghost" size="sm">Export Results</Button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredListings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white border-muted hover:border-primary/30 transition-all group">
              {/* Farmer Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {listing.farmer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-primary">{listing.farmer.name}</h3>
                      {listing.farmer.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/60">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{listing.farmer.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{listing.farmer.reviews} reviews</span>
                      <span>•</span>
                      <span>Responds in {listing.farmer.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-foreground/40 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{listing.farmer.location}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              {/* Product Image */}
              <div className="w-full h-48 bg-muted rounded-xl mb-4 flex items-center justify-center">
                <div className="text-foreground/40">
                  <Scale className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{listing.crop}</p>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="font-serif font-bold text-lg text-primary">{listing.crop}</h4>
                  <p className="text-sm text-foreground/60">{listing.variety} • {listing.quality} Grade</p>
                </div>

                <p className="text-sm text-foreground/60 line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {listing.certifications.map((cert, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-foreground/60">Available</p>
                    <p className="font-medium">{formatWeight(listing.quantity)}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Min Order</p>
                    <p className="font-medium">{formatWeight(listing.minOrder)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(listing.price)}</p>
                    <p className="text-xs text-foreground/60">per {listing.priceUnit}</p>
                  </div>
                  {listing.negotiable && (
                    <Badge className="bg-green-100 text-green-700">Negotiable</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <Calendar className="w-3 h-3" />
                  <span>Harvested: {listing.harvestDate} • Available: {listing.availableFrom}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/${locale}/dashboard/retailer/listings/${listing.id}`} className="flex-1">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-background rounded-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="rounded-full">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Truck className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-3 text-xs text-foreground/40 text-center">
                Listed {listing.listed}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredListings.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-foreground/40" />
          </div>
          <h3 className="text-lg font-serif text-primary mb-2">No listings found</h3>
          <p className="text-foreground/60 mb-4">Try adjusting your filters or search terms</p>
          <Button variant="outline" className="rounded-full">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
