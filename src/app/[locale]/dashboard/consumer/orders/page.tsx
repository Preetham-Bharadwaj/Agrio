"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Star, 
  MessageSquare,
  Phone,
  Mail,
  ChevronRight,
  RefreshCw,
  Calendar,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock orders data
const activeOrders = [
  {
    id: "ORD-2024-001",
    items: [
      { name: "Organic Tomatoes", quantity: 2, unit: "kg", price: 40 },
      { name: "Farm Fresh Eggs", quantity: 1, unit: "dozen", price: 120 }
    ],
    total: 200,
    status: "in-transit",
    orderDate: "2024-03-15",
    estimatedDelivery: "2024-03-15",
    trackingNumber: "TRK123456789",
    farmer: "Green Valley Farms",
    deliveryAddress: "123 Main Street, Mumbai",
    progress: 75
  },
  {
    id: "ORD-2024-002",
    items: [
      { name: "Pure Milk", quantity: 3, unit: "liters", price: 60 }
    ],
    total: 180,
    status: "processing",
    orderDate: "2024-03-15",
    estimatedDelivery: "2024-03-16",
    trackingNumber: "TRK123456790",
    farmer: "Dairy Fresh",
    deliveryAddress: "123 Main Street, Mumbai",
    progress: 25
  }
];

const pastOrders = [
  {
    id: "ORD-2024-003",
    items: [
      { name: "Fresh Fish", quantity: 1, unit: "kg", price: 180 },
      { name: "Organic Apples", quantity: 2, unit: "kg", price: 150 }
    ],
    total: 480,
    status: "delivered",
    orderDate: "2024-03-10",
    deliveredDate: "2024-03-11",
    farmer: "Coastal Catch & Mountain Orchards",
    rating: 5,
    review: "Excellent quality and fast delivery!"
  },
  {
    id: "ORD-2024-004",
    items: [
      { name: "Fresh Carrots", quantity: 3, unit: "kg", price: 35 }
    ],
    total: 105,
    status: "delivered",
    orderDate: "2024-03-08",
    deliveredDate: "2024-03-09",
    farmer: "Root Vegetables Co",
    rating: 4,
    review: "Good quality carrots, very fresh."
  }
];

export default function OrdersPage() {
  const { locale } = useParams();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700">Delivered</Badge>;
      case "in-transit":
        return <Badge className="bg-blue-100 text-blue-700">In Transit</Badge>;
      case "processing":
        return <Badge className="bg-orange-100 text-orange-700">Processing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in-transit":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "processing":
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">
            📦 Orders
          </h1>
          <p className="text-foreground/60">
            Active orders + live tracking • Past orders + reorder • Rate and review
          </p>
        </div>
        <Link href={`/${locale}/dashboard/consumer/shop`}>
          <Button className="bg-primary hover:bg-primary/90 text-background rounded-full">
            Shop More
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-muted">
        <Button
          variant={activeTab === "active" ? "default" : "ghost"}
          onClick={() => setActiveTab("active")}
          className="rounded-full rounded-b-none"
        >
          Active Orders ({activeOrders.length})
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "ghost"}
          onClick={() => setActiveTab("past")}
          className="rounded-full rounded-b-none"
        >
          Past Orders ({pastOrders.length})
        </Button>
      </div>

      {/* Active Orders */}
      {activeTab === "active" && (
        <div className="space-y-6">
          {activeOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-muted">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-primary">{order.id}</h3>
                        <p className="text-sm text-foreground/60">
                          Ordered on {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-2xl font-bold text-primary mt-2">₹{order.total}</p>
                    </div>
                  </div>

                  {/* Live Tracking Progress */}
                  {order.status === "in-transit" && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Live Tracking</span>
                        </div>
                        <span className="text-sm text-blue-700">ETA: Today, 6:00 PM</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">Order Processed</span>
                          <span className="text-blue-700">Out for Delivery</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-blue-600">
                          Tracking: {order.trackingNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-medium text-primary mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-sm">
                          <span className="text-foreground/60">
                            {item.quantity} {item.unit} × {item.name}
                          </span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="mb-6">
                    <h4 className="font-medium text-primary mb-3">Delivery Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-foreground/60">
                        <MapPin className="w-4 h-4" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60">
                        <Calendar className="w-4 h-4" />
                        <span>Estimated: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/60">
                        <Package className="w-4 h-4" />
                        <span>Seller: {order.farmer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Support
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {activeOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <p className="text-foreground/60">No active orders</p>
              <Link href={`/${locale}/dashboard/consumer/shop`}>
                <Button className="mt-4 rounded-full">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Past Orders */}
      {activeTab === "past" && (
        <div className="space-y-6">
          {pastOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-muted">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-primary">{order.id}</h3>
                        <p className="text-sm text-foreground/60">
                          Delivered on {new Date(order.deliveredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-2xl font-bold text-primary mt-2">₹{order.total}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-medium text-primary mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-sm">
                          <span className="text-foreground/60">
                            {item.quantity} {item.unit} × {item.name}
                          </span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating and Review */}
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-amber-900">Your Rating</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < order.rating
                                ? "text-amber-500 fill-current"
                                : "text-amber-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-amber-700">{order.review}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button className="rounded-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reorder
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      <Star className="w-4 h-4 mr-2" />
                      Update Review
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Get Invoice
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {pastOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <p className="text-foreground/60">No past orders</p>
              <Link href={`/${locale}/dashboard/consumer/shop`}>
                <Button className="mt-4 rounded-full">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
