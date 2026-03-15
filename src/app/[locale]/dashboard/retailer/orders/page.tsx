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
  FileText, 
  Download,
  Filter,
  Search,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  AlertCircle,
  RefreshCw,
  Eye,
  MessageCircle,
  ArrowUpRight,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for active deliveries
const activeDeliveries = [
  {
    id: "ORD-2024-001",
    farmer: {
      name: "Green Valley FPO",
      contact: "+91 98765 43210",
      email: "contact@greenvalley.com",
      rating: 4.8
    },
    crop: "Wheat",
    variety: "Sharbati",
    quantity: 5000,
    unit: "kg",
    price: 2450,
    totalAmount: 122500,
    orderDate: "2024-03-10",
    deliveryDate: "2024-03-15",
    status: "in-transit",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "Tomorrow, 2:00 PM",
    deliveryAddress: "123 Retail Street, Mumbai, Maharashtra 400001",
    paymentStatus: "paid",
    quality: "A+",
    transport: "Refrigerated Truck"
  },
  {
    id: "ORD-2024-002",
    farmer: {
      name: "Sahyadri Farms",
      contact: "+91 87654 32109",
      email: "info@sahyadri.com",
      rating: 4.9
    },
    crop: "Tomato",
    variety: "Local Hybrid",
    quantity: 3000,
    unit: "kg",
    price: 2200,
    totalAmount: 66000,
    orderDate: "2024-03-12",
    deliveryDate: "2024-03-16",
    status: "processing",
    trackingNumber: "TRK987654321",
    estimatedDelivery: "In 2 days",
    deliveryAddress: "456 Market Road, Pune, Maharashtra 411001",
    paymentStatus: "paid",
    quality: "A",
    transport: "Cold Chain"
  },
  {
    id: "ORD-2024-003",
    farmer: {
      name: "Golden Harvest",
      contact: "+91 76543 21098",
      email: "orders@goldenharvest.com",
      rating: 4.7
    },
    crop: "Onion",
    variety: "Red Bellary",
    quantity: 8000,
    unit: "kg",
    price: 2800,
    totalAmount: 224000,
    orderDate: "2024-03-08",
    deliveryDate: "2024-03-14",
    status: "out-for-delivery",
    trackingNumber: "TRK456789123",
    estimatedDelivery: "Today, 5:00 PM",
    deliveryAddress: "789 Commercial Ave, Delhi, Delhi 110001",
    paymentStatus: "paid",
    quality: "A+",
    transport: "Standard Truck"
  }
];

// Mock data for past purchases
const pastPurchases = [
  {
    id: "ORD-2024-004",
    farmer: {
      name: "Premium Grains Co",
      rating: 4.9
    },
    crop: "Rice",
    variety: "Basmati 1121",
    quantity: 2000,
    unit: "kg",
    price: 4500,
    totalAmount: 90000,
    orderDate: "2024-03-05",
    deliveryDate: "2024-03-10",
    status: "delivered",
    quality: "A+",
    rating: 5,
    review: "Excellent quality rice, very well packaged and delivered on time."
  },
  {
    id: "ORD-2024-005",
    farmer: {
      name: "North India FPO",
      rating: 4.6
    },
    crop: "Potato",
    variety: "Kufri Jyoti",
    quantity: 10000,
    unit: "kg",
    price: 1800,
    totalAmount: 180000,
    orderDate: "2024-03-01",
    deliveryDate: "2024-03-06",
    status: "delivered",
    quality: "A",
    rating: 4,
    review: "Good quality potatoes, fresh and properly sorted."
  },
  {
    id: "ORD-2024-006",
    farmer: {
      name: "Madhya Bharat Farms",
      rating: 4.8
    },
    crop: "Soybeans",
    variety: "Local",
    quantity: 3000,
    unit: "kg",
    price: 4200,
    totalAmount: 126000,
    orderDate: "2024-02-28",
    deliveryDate: "2024-03-03",
    status: "delivered",
    quality: "A+",
    rating: 5,
    review: "Premium quality soybeans, excellent for processing."
  }
];

// Mock data for invoices
const invoices = [
  {
    id: "INV-2024-001",
    orderId: "ORD-2024-001",
    farmer: "Green Valley FPO",
    crop: "Wheat",
    amount: 122500,
    issueDate: "2024-03-10",
    dueDate: "2024-03-20",
    status: "paid",
    paymentDate: "2024-03-11",
    paymentMethod: "Bank Transfer",
    gst: 11025,
    totalWithGst: 133525
  },
  {
    id: "INV-2024-002",
    orderId: "ORD-2024-002",
    farmer: "Sahyadri Farms",
    crop: "Tomato",
    amount: 66000,
    issueDate: "2024-03-12",
    dueDate: "2024-03-22",
    status: "paid",
    paymentDate: "2024-03-13",
    paymentMethod: "UPI",
    gst: 5940,
    totalWithGst: 71940
  },
  {
    id: "INV-2024-003",
    orderId: "ORD-2024-003",
    farmer: "Golden Harvest",
    crop: "Onion",
    amount: 224000,
    issueDate: "2024-03-08",
    dueDate: "2024-03-18",
    status: "pending",
    paymentMethod: "Pending",
    gst: 20160,
    totalWithGst: 244160
  }
];

export default function RetailerOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in-transit': return 'bg-blue-100 text-blue-700';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-700';
      case 'processing': return 'bg-orange-100 text-orange-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'paid': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'in-transit': return <Truck className="w-4 h-4" />;
      case 'out-for-delivery': return <Package className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredActiveDeliveries = activeDeliveries.filter(delivery => 
    delivery.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPastPurchases = pastPurchases.filter(purchase => 
    purchase.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvoices = invoices.filter(invoice => 
    invoice.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.farmer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Orders</h1>
          <p className="text-foreground/60">Track deliveries, view purchases, and manage invoices</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-background rounded-full">
            <Package className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-muted rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input
              placeholder="Search orders..."
              className="pl-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 rounded-xl border border-muted bg-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>

          <select
            className="px-4 py-2 rounded-xl border border-muted bg-white"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <Button variant="outline" className="rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active Deliveries
            <Badge className="ml-2 bg-blue-100 text-blue-700">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Purchases
            <Badge className="ml-2 bg-green-100 text-green-700">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="invoices">
            Invoices
            <Badge className="ml-2 bg-purple-100 text-purple-700">3</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Active Deliveries */}
        <TabsContent value="active" className="space-y-6">
          <div className="space-y-4">
            {filteredActiveDeliveries.map((delivery, index) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-primary">{delivery.crop}</h3>
                        <p className="text-sm text-foreground/60">
                          {delivery.variety} • {delivery.quantity.toLocaleString()} {delivery.unit}
                        </p>
                        <p className="text-xs text-foreground/40">
                          Order ID: {delivery.id} • Placed on {delivery.orderDate}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusIcon(delivery.status)}
                      <span className="ml-1">
                        {delivery.status === 'in-transit' ? 'In Transit' :
                         delivery.status === 'out-for-delivery' ? 'Out for Delivery' :
                         delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Farmer</p>
                      <p className="font-medium">{delivery.farmer.name}</p>
                      <div className="flex items-center gap-1 text-xs text-foreground/40 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{delivery.farmer.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Delivery</p>
                      <p className="font-medium">{delivery.estimatedDelivery}</p>
                      <p className="text-xs text-foreground/40">
                        Tracking: {delivery.trackingNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Total Amount</p>
                      <p className="font-bold text-primary">{formatCurrency(delivery.totalAmount)}</p>
                      <p className="text-xs text-foreground/40">
                        {formatCurrency(delivery.price)}/qtl
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-foreground/40 mb-4">
                    <MapPin className="w-3 h-3" />
                    <span>{delivery.deliveryAddress}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Farmer
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Driver
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Past Purchases */}
        <TabsContent value="past" className="space-y-6">
          <div className="space-y-4">
            {filteredPastPurchases.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted hover:border-green-500/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-primary">{purchase.crop}</h3>
                        <p className="text-sm text-foreground/60">
                          {purchase.variety} • {purchase.quantity.toLocaleString()} {purchase.unit}
                        </p>
                        <p className="text-xs text-foreground/40">
                          Order ID: {purchase.id} • Delivered on {purchase.deliveryDate}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Delivered
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Farmer</p>
                      <p className="font-medium">{purchase.farmer.name}</p>
                      <div className="flex items-center gap-1 text-xs text-foreground/40 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{purchase.farmer.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Quality Rating</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < purchase.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Total Amount</p>
                      <p className="font-bold text-primary">{formatCurrency(purchase.totalAmount)}</p>
                      <p className="text-xs text-foreground/40">
                        {formatCurrency(purchase.price)}/qtl
                      </p>
                    </div>
                  </div>

                  {purchase.review && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <p className="text-sm text-foreground/60 italic">"{purchase.review}"</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Package className="w-4 h-4 mr-2" />
                      Reorder
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Star className="w-4 h-4 mr-2" />
                      Leave Review
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Invoice
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Invoices */}
        <TabsContent value="invoices" className="space-y-6">
          <div className="space-y-4">
            {filteredInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted hover:border-purple-500/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-primary">{invoice.id}</h3>
                        <p className="text-sm text-foreground/60">
                          {invoice.crop} • {invoice.farmer}
                        </p>
                        <p className="text-xs text-foreground/40">
                          Order ID: {invoice.orderId} • Issued on {invoice.issueDate}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Subtotal</p>
                      <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">GST (9%)</p>
                      <p className="font-medium">{formatCurrency(invoice.gst)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Total Amount</p>
                      <p className="font-bold text-primary">{formatCurrency(invoice.totalWithGst)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Due Date</p>
                      <p className="font-medium">{invoice.dueDate}</p>
                    </div>
                  </div>

                  {invoice.status === 'paid' && (
                    <div className="bg-green-50 rounded-xl p-3 mb-4">
                      <p className="text-sm text-green-700">
                        Paid on {invoice.paymentDate} via {invoice.paymentMethod}
                      </p>
                    </div>
                  )}

                  {invoice.status === 'pending' && (
                    <div className="bg-amber-50 rounded-xl p-3 mb-4">
                      <p className="text-sm text-amber-700">
                        Payment due by {invoice.dueDate}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {invoice.status === 'pending' && (
                      <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-700">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </Button>
                    )}
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
