"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  MapPin,
  Badge as BadgeIcon,
  SlidersHorizontal,
  X,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock products data
const products = [
  {
    id: 1,
    name: "Organic Tomatoes",
    farmer: "Green Valley Farms",
    retailer: "FreshMart",
    price: 40,
    unit: "kg",
    rating: 4.8,
    image: "🍅",
    badge: "FRESH",
    sellerType: "farmer",
    category: "vegetables",
    grade: "A+",
    inStock: true
  },
  {
    id: 2,
    name: "Farm Fresh Eggs",
    farmer: "Happy Hens Coop",
    retailer: null,
    price: 120,
    unit: "dozen",
    rating: 4.9,
    image: "🥚",
    badge: "ORGANIC",
    sellerType: "farmer",
    category: "poultry",
    grade: "A",
    inStock: true
  },
  {
    id: 3,
    name: "Pure Milk",
    farmer: "Dairy Fresh",
    retailer: null,
    price: 60,
    unit: "liter",
    rating: 4.7,
    image: "🥛",
    badge: "PASTEURIZED",
    sellerType: "farmer",
    category: "dairy",
    grade: "A+",
    inStock: true
  },
  {
    id: 4,
    name: "Fresh Fish",
    farmer: "Coastal Catch",
    retailer: "Seafood Plus",
    price: 180,
    unit: "kg",
    rating: 4.6,
    image: "🐟",
    badge: "WILD CAUGHT",
    sellerType: "retailer",
    category: "seafood",
    grade: "A",
    inStock: true
  },
  {
    id: 5,
    name: "Organic Apples",
    farmer: "Mountain Orchards",
    retailer: null,
    price: 150,
    unit: "kg",
    rating: 4.9,
    image: "🍎",
    badge: "ORGANIC",
    sellerType: "farmer",
    category: "fruits",
    grade: "A+",
    inStock: true
  },
  {
    id: 6,
    name: "Fresh Carrots",
    farmer: "Root Vegetables Co",
    retailer: "VeggieMart",
    price: 35,
    unit: "kg",
    rating: 4.5,
    image: "🥕",
    badge: "FRESH",
    sellerType: "retailer",
    category: "vegetables",
    grade: "A",
    inStock: false
  }
];

const categories = ["All", "Vegetables", "Fruits", "Dairy", "Seafood", "Poultry", "Grains"];
const sellerTypes = ["All", "Farmer", "Retailer"];

export default function ShopPage() {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
  const [selectedSeller, setSelectedSeller] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<{[key: number]: number}>({});

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || 
                           product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSeller = selectedSeller === "All" || 
                         product.sellerType.toLowerCase() === selectedSeller.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesSeller;
  });

  const handleAddToCart = (productId: number) => {
    setCartQuantities(prev => ({
      ...prev,
      [productId]: 1
    }));
  };

  const handleIncreaseQuantity = (productId: number) => {
    setCartQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleDecreaseQuantity = (productId: number) => {
    setCartQuantities(prev => {
      const currentQuantity = prev[productId] || 0;
      if (currentQuantity <= 1) {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      }
      return {
        ...prev,
        [productId]: currentQuantity - 1
      };
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">
            🛒 Shop
          </h1>
          <p className="text-foreground/60">
            Search + filters • Products from farmers AND retailers • Clearly labeled seller type
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-full"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for products, farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Seller Type Filters */}
          <div className="flex flex-wrap gap-2">
            {sellerTypes.map((seller) => (
              <Button
                key={seller}
                variant={selectedSeller === seller ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeller(seller)}
                className="rounded-full"
              >
                {seller}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-white border-muted hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{product.image}</div>
                <div className="flex flex-col gap-2">
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {product.badge}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    Grade {product.grade}
                  </Badge>
                  {!product.inStock && (
                    <Badge className="bg-red-100 text-red-700 text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-primary mb-1">{product.name}</h3>
              <p className="text-sm text-foreground/60 mb-2">
                {product.sellerType === "farmer" ? product.farmer : product.retailer}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-sm ml-1">{product.rating}</span>
                </div>
                <Badge className={
                  product.sellerType === "farmer" 
                    ? "bg-green-100 text-green-700 text-xs" 
                    : "bg-orange-100 text-orange-700 text-xs"
                }>
                  {product.sellerType === "farmer" ? "🌾 Farmer" : "🏪 Retailer"}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                  <span className="text-sm text-foreground/60">/{product.unit}</span>
                </div>
                <div className="flex items-center text-xs text-foreground/40">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>Nearby</span>
                </div>
              </div>

              <div className="flex gap-2">
                {cartQuantities[product.id] ? (
                  // Show quantity selector
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecreaseQuantity(product.id)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-primary">
                      {cartQuantities[product.id]}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleIncreaseQuantity(product.id)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  // Show Add to Cart button
                  <Button 
                    size="sm" 
                    className="flex-1 rounded-full"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                )}
                <Link href={`/${locale}/dashboard/consumer/product/${product.id}`}>
                  <Button size="sm" variant="outline" className="rounded-full">
                    View
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-foreground/60">No products found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4 rounded-full"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedSeller("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
