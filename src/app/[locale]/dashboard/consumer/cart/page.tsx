"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  CreditCard,
  Smartphone,
  DollarSign,
  Truck,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock cart data
const cartItems = [
  {
    id: 1,
    name: "Organic Tomatoes",
    farmer: "Green Valley Farms",
    price: 40,
    unit: "kg",
    quantity: 2,
    image: "🍅",
    badge: "FRESH",
    sellerType: "farmer",
    grade: "A+"
  },
  {
    id: 2,
    name: "Farm Fresh Eggs",
    farmer: "Happy Hens Coop",
    price: 120,
    unit: "dozen",
    quantity: 1,
    image: "🥚",
    badge: "ORGANIC",
    sellerType: "farmer",
    grade: "A"
  },
  {
    id: 3,
    name: "Pure Milk",
    farmer: "Dairy Fresh",
    price: 60,
    unit: "liter",
    quantity: 3,
    image: "🥛",
    badge: "PASTEURIZED",
    sellerType: "farmer",
    grade: "A+"
  }
];

export default function CartPage() {
  const { locale } = useParams();
  const [items, setItems] = useState(cartItems);
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const updateQuantity = (id: number, change: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">
              🎉 Order Placed!
            </h1>
            <p className="text-foreground/60">
              Your order has been successfully placed
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-muted p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-serif text-primary mb-4">
              Order Confirmed!
            </h2>
            
            <p className="text-foreground/60 mb-6">
              Your order has been placed successfully and will be delivered in estimated time.
            </p>
            
            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-foreground/60">Order ID</span>
                <span className="font-semibold text-primary">ORD-2024-{Math.floor(Math.random() * 100000)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-foreground/60">Total Amount</span>
                <span className="font-semibold text-primary">₹{total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/60">Estimated Delivery</span>
                <span className="font-semibold text-primary">Today, 6:00 PM</span>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link href={`/${locale}/dashboard/consumer/orders`}>
                <Button className="rounded-full">
                  Track Order
                </Button>
              </Link>
              <Link href={`/${locale}/dashboard/consumer/shop`}>
                <Button variant="outline" className="rounded-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">
            🛒 Cart
          </h1>
          <p className="text-foreground/60">
            Items list • Delivery address • Price summary • Payment (UPI/Card/COD) • Place order
          </p>
        </div>
        <Link href={`/${locale}/dashboard/consumer/shop`}>
          <Button variant="outline" className="rounded-full">
            Continue Shopping
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white border-muted">
            <div className="p-6 border-b border-muted">
              <h2 className="text-xl font-serif text-primary">Items ({items.length})</h2>
            </div>
            <div className="divide-y divide-muted">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">{item.name}</h3>
                      <p className="text-sm text-foreground/60">{item.farmer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {item.badge}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          Grade {item.grade}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          {item.sellerType === "farmer" ? "🌾 Farmer" : "🏪 Retailer"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{item.price}</p>
                      <p className="text-sm text-foreground/60">/{item.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="rounded-full w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="rounded-full w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          ₹{item.price * item.quantity}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="bg-white border-muted p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-serif text-primary">Delivery Address</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-muted rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary">Home</p>
                    <p className="text-sm text-foreground/60">
                      123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001
                    </p>
                    <p className="text-sm text-foreground/60">+91 98765 43210</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Default</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full">
                Add New Address
              </Button>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card className="bg-white border-muted p-6">
            <h2 className="text-xl font-serif text-primary mb-4">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Delivery Fee</span>
                <span className="font-medium">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Tax (5%)</span>
                <span className="font-medium">₹{tax}</span>
              </div>
              <div className="border-t border-muted pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-primary">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{total}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="bg-white border-muted p-6">
            <h2 className="text-xl font-serif text-primary mb-4">Payment Method</h2>
            <div className="space-y-3">
              <Button
                variant={selectedPayment === "upi" ? "default" : "outline"}
                className="w-full justify-start rounded-full"
                onClick={() => setSelectedPayment("upi")}
              >
                <Smartphone className="w-4 h-4 mr-3" />
                UPI Payment
              </Button>
              <Button
                variant={selectedPayment === "card" ? "default" : "outline"}
                className="w-full justify-start rounded-full"
                onClick={() => setSelectedPayment("card")}
              >
                <CreditCard className="w-4 h-4 mr-3" />
                Credit/Debit Card
              </Button>
              <Button
                variant={selectedPayment === "cod" ? "default" : "outline"}
                className="w-full justify-start rounded-full"
                onClick={() => setSelectedPayment("cod")}
              >
                <DollarSign className="w-4 h-4 mr-3" />
                Cash on Delivery
              </Button>
            </div>
          </Card>

          {/* Place Order Button */}
          <Button 
            onClick={handlePlaceOrder}
            className="w-full bg-primary hover:bg-primary/90 text-background rounded-full py-6 text-lg font-semibold"
          >
            <Truck className="w-5 h-5 mr-2" />
            Place Order • ₹{total}
          </Button>

          <p className="text-xs text-foreground/40 text-center">
            By placing this order, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}
