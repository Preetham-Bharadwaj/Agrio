"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShoppingCart, 
  Package, 
  Star, 
  Truck, 
  Bell, 
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Apple,
  Carrot,
  Wheat,
  Milk,
  Fish,
  Egg
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/useUserStore";

// Mock data
const featuredProduce = [
  {
    id: 1,
    name: "Organic Tomatoes",
    farmer: "Green Valley Farms",
    price: 40,
    unit: "kg",
    rating: 4.8,
    image: "🍅",
    badge: "FRESH",
    sellerType: "farmer"
  },
  {
    id: 2,
    name: "Farm Fresh Eggs",
    farmer: "Happy Hens Coop",
    price: 120,
    unit: "dozen",
    rating: 4.9,
    image: "🥚",
    badge: "ORGANIC",
    sellerType: "farmer"
  },
  {
    id: 3,
    name: "Pure Milk",
    farmer: "Dairy Fresh",
    price: 60,
    unit: "liter",
    rating: 4.7,
    image: "🥛",
    badge: "PASTEURIZED",
    sellerType: "farmer"
  },
  {
    id: 4,
    name: "Fresh Fish",
    farmer: "Coastal Catch",
    price: 180,
    unit: "kg",
    rating: 4.6,
    image: "🐟",
    badge: "WILD CAUGHT",
    sellerType: "farmer"
  }
];

const categories = [
  { name: "Vegetables", icon: Carrot, color: "bg-green-100 text-green-600", count: 245 },
  { name: "Fruits", icon: Apple, color: "bg-red-100 text-red-600", count: 189 },
  { name: "Grains", icon: Wheat, color: "bg-amber-100 text-amber-600", count: 156 },
  { name: "Dairy", icon: Milk, color: "bg-blue-100 text-blue-600", count: 98 },
  { name: "Seafood", icon: Fish, color: "bg-cyan-100 text-cyan-600", count: 67 },
  { name: "Poultry", icon: Egg, color: "bg-orange-100 text-orange-600", count: 134 }
];

const recentOrders = [
  {
    id: 1,
    items: "Organic Tomatoes, Farm Fresh Eggs",
    total: 280,
    status: "delivered",
    date: "2 days ago",
    tracking: "Delivered to your doorstep"
  },
  {
    id: 2,
    items: "Pure Milk, Fresh Fish",
    total: 420,
    status: "in-transit",
    date: "1 day ago",
    tracking: "Out for delivery - ETA 2 hours"
  },
  {
    id: 3,
    items: "Mixed Vegetables",
    total: 195,
    status: "processing",
    date: "3 hours ago",
    tracking: "Being prepared for shipment"
  }
];

export default function ConsumerHome() {
  const { locale } = useParams();
  const { name } = useUserStore();
  const [dismissedAlert, setDismissedAlert] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">
            🏠 Home
          </h1>
          <p className="text-foreground/60">
            {name ? `Welcome back, ${name}!` : "Welcome to your fresh marketplace"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${locale}/dashboard/consumer/cart`}>
            <Button className="bg-primary hover:bg-primary/90 text-background rounded-full">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart (3)
            </Button>
          </Link>
        </div>
      </div>

      {/* Fresh Produce Alert Banner */}
      {!dismissedAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">🌟 Fresh Produce Alert!</p>
              <p className="text-sm text-green-700">New seasonal mangoes just arrived • 20% off today only</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="rounded-full text-xs bg-green-600 hover:bg-green-700">
              Shop Now
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setDismissedAlert(true)}
              className="rounded-full text-xs"
            >
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700">12</Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">12</h3>
          <p className="text-sm text-foreground/60">Total Orders</p>
        </Card>

        <Card className="p-6 bg-white border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700">₹2,450</Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">₹8,950</h3>
          <p className="text-sm text-foreground/60">Total Spent</p>
        </Card>

        <Card className="p-6 bg-white border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <Badge className="bg-amber-100 text-amber-700">4.8</Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">4.8</h3>
          <p className="text-sm text-foreground/60">Avg Rating</p>
        </Card>
      </div>

      {/* Featured Produce - Horizontal Scroll */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-primary">Featured Produce</h2>
          <Link href={`/${locale}/dashboard/consumer/shop`}>
            <Button variant="outline" className="rounded-full">
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {featuredProduce.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-64"
            >
              <Card className="p-6 bg-white border-muted hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{product.image}</div>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {product.badge}
                  </Badge>
                </div>

                <h3 className="font-semibold text-primary mb-1">{product.name}</h3>
                <p className="text-sm text-foreground/60 mb-2">{product.farmer}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    {product.sellerType}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                    <span className="text-sm text-foreground/60">/{product.unit}</span>
                  </div>
                  <Button size="sm" className="rounded-full">
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-serif text-primary mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/${locale}/dashboard/consumer/shop?category=${category.name.toLowerCase()}`}>
                <Card className="p-6 bg-white border-muted hover:border-primary/30 transition-all cursor-pointer text-center group">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <category.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-primary mb-1">{category.name}</h3>
                  <p className="text-sm text-foreground/60">{category.count} items</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif text-primary">Recent Orders</h2>
          <Link href={`/${locale}/dashboard/consumer/orders`}>
            <Button variant="outline" className="rounded-full">
              View All Orders
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Card className="bg-white border-muted">
          <div className="divide-y divide-muted">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
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
                      <h4 className="font-semibold text-primary">{order.items}</h4>
                      <p className="text-sm text-foreground/60">
                        Total: ₹{order.total} • {order.date}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {order.tracking}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge 
                      className={
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }
                    >
                      {order.status === 'delivered' ? 'Delivered' :
                       order.status === 'in-transit' ? 'In Transit' : 'Processing'}
                    </Badge>
                    {order.status === 'delivered' && (
                      <Button size="sm" variant="outline" className="mt-2 rounded-full">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
