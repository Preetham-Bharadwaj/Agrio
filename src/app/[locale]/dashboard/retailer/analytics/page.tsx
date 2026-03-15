"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertCircle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for price trends
const priceTrends = [
  {
    crop: "Wheat",
    currentPrice: 2450,
    lastWeek: 2380,
    lastMonth: 2250,
    trend: "up",
    change: 8.8,
    forecast: 2600,
    forecastConfidence: 85,
    seasonality: "High demand season",
    recommendation: "Buy now - prices expected to rise"
  },
  {
    crop: "Tomato",
    currentPrice: 2200,
    lastWeek: 2350,
    lastMonth: 2400,
    trend: "down",
    change: -8.3,
    forecast: 2000,
    forecastConfidence: 78,
    seasonality: "Peak harvest season",
    recommendation: "Wait for better prices"
  },
  {
    crop: "Onion",
    currentPrice: 2800,
    lastWeek: 2750,
    lastMonth: 2600,
    trend: "up",
    change: 7.7,
    forecast: 3000,
    forecastConfidence: 72,
    seasonality: "Supply constraints",
    recommendation: "Consider bulk purchase"
  },
  {
    crop: "Rice",
    currentPrice: 4500,
    lastWeek: 4450,
    lastMonth: 4300,
    trend: "up",
    change: 4.7,
    forecast: 4700,
    forecastConfidence: 88,
    seasonality: "Stable demand",
    recommendation: "Good time to buy"
  }
];

// Mock data for spend breakdown
const spendBreakdown = [
  { category: "Grains", amount: 480000, percentage: 38.7, color: "bg-blue-500" },
  { category: "Vegetables", amount: 320000, percentage: 25.8, color: "bg-green-500" },
  { category: "Fruits", amount: 180000, percentage: 14.5, color: "bg-orange-500" },
  { category: "Spices", amount: 150000, percentage: 12.1, color: "bg-purple-500" },
  { category: "Others", amount: 110000, percentage: 8.9, color: "bg-gray-500" }
];

// Mock data for seasonal planning
const seasonalPlan = [
  {
    month: "March",
    recommendations: [
      { crop: "Wheat", action: "Buy", reason: "End of season prices" },
      { crop: "Tomato", action: "Wait", reason: "Prices falling" },
      { crop: "Onion", action: "Buy", reason: "Limited supply" }
    ]
  },
  {
    month: "April",
    recommendations: [
      { crop: "Rice", action: "Buy", reason: "New harvest" },
      { crop: "Corn", action: "Wait", reason: "Abundant supply" },
      { crop: "Potato", action: "Buy", reason: "Good quality" }
    ]
  },
  {
    month: "May",
    recommendations: [
      { crop: "Mango", action: "Buy", reason: "Peak season" },
      { crop: "Ginger", action: "Wait", reason: "Prices high" },
      { crop: "Turmeric", action: "Buy", reason: "Favorable rates" }
    ]
  }
];

// Mock data for savings analysis
const savingsAnalysis = {
  totalSpent: 1240000,
  marketValue: 1450000,
  savings: 210000,
  savingsPercentage: 14.5,
  comparedTo: {
    traditionalMiddlemen: 320000,
    wholesaleMarket: 180000,
    onlinePlatforms: 150000
  },
  monthlySavings: [
    { month: "Jan", savings: 45000 },
    { month: "Feb", savings: 52000 },
    { month: "Mar", savings: 48000 },
    { month: "Apr", savings: 61000 },
    { month: "May", savings: 58000 },
    { month: "Jun", savings: 55000 }
  ]
};

export default function RetailerAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const { locale } = useParams();

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-primary mb-2">Analytics</h1>
          <p className="text-foreground/60">Price trends, forecasts, and procurement insights</p>
        </div>
        <div className="flex gap-3">
          <select
            className="px-4 py-2 rounded-xl border border-muted bg-white"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button variant="outline" className="rounded-full">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-100 text-green-700">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              14.5%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">{formatCurrency(savingsAnalysis.savings)}</h3>
          <p className="text-sm text-foreground/60">Total Savings</p>
        </Card>

        <Card className="p-6 bg-white border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              8.2%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">{formatCurrency(savingsAnalysis.totalSpent)}</h3>
          <p className="text-sm text-foreground/60">Total Spend</p>
        </Card>

        <Card className="p-6 bg-white border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <Badge className="bg-purple-100 text-purple-700">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              12.3%
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">284.5 Tons</h3>
          <p className="text-sm text-foreground/60">Volume Purchased</p>
        </Card>

        <Card className="p-6 bg-white border-muted">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <Badge className="bg-amber-100 text-amber-700">On Track</Badge>
          </div>
          <h3 className="text-2xl font-bold text-primary mb-1">87%</h3>
          <p className="text-sm text-foreground/60">Procurement Target</p>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="spending">Spend Analysis</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Planning</TabsTrigger>
          <TabsTrigger value="savings">Savings Report</TabsTrigger>
        </TabsList>

        {/* Price Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {priceTrends.map((trend, index) => (
              <motion.div
                key={trend.crop}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-serif font-bold text-primary">{trend.crop}</h3>
                    <div className="flex items-center gap-2">
                      {trend.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`font-bold ${
                        trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(trend.change)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground/60">Current Price</span>
                        <span className="font-bold">{formatCurrency(trend.currentPrice)}/qtl</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Last Week</span>
                        <span>{formatCurrency(trend.lastWeek)}/qtl</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Last Month</span>
                        <span>{formatCurrency(trend.lastMonth)}/qtl</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-foreground/60">Forecast (30 days)</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(trend.forecast)}/qtl
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground/60">Confidence</span>
                        <span>{trend.forecastConfidence}%</span>
                      </div>
                      <Progress value={trend.forecastConfidence} className="h-2" />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            {trend.seasonality}
                          </p>
                          <p className="text-sm text-blue-700">
                            {trend.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Spend Analysis */}
        <TabsContent value="spending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white border-muted">
                <h3 className="text-lg font-serif font-bold text-primary mb-4">Spend Breakdown</h3>
                <div className="space-y-4">
                  {spendBreakdown.map((category, index) => (
                    <div key={category.category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{category.category}</span>
                        <span className="font-bold">{formatCurrency(category.amount)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={category.percentage} className="flex-1 h-3" />
                        <span className="text-sm text-foreground/60 w-12 text-right">
                          {category.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6 bg-white border-muted">
                <h3 className="text-lg font-serif font-bold text-primary mb-4">Top Categories</h3>
                <div className="space-y-3">
                  {spendBreakdown.slice(0, 4).map((category, index) => (
                    <div key={category.category} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${category.color}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{category.category}</p>
                        <p className="text-xs text-foreground/60">{category.percentage}% of total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Seasonal Planning */}
        <TabsContent value="seasonal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {seasonalPlan.map((plan, index) => (
              <motion.div
                key={plan.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white border-muted">
                  <h3 className="text-lg font-serif font-bold text-primary mb-4">{plan.month}</h3>
                  <div className="space-y-3">
                    {plan.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Badge 
                          className={
                            rec.action === 'Buy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }
                        >
                          {rec.action}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{rec.crop}</p>
                          <p className="text-xs text-foreground/60">{rec.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Savings Report */}
        <TabsContent value="savings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-muted">
              <h3 className="text-lg font-serif font-bold text-primary mb-4">Savings Comparison</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">vs Traditional Middlemen</span>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(savingsAnalysis.comparedTo.traditionalMiddlemen)}</p>
                    <p className="text-xs text-foreground/60">25.8% savings</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">vs Wholesale Market</span>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(savingsAnalysis.comparedTo.wholesaleMarket)}</p>
                    <p className="text-xs text-foreground/60">14.5% savings</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/60">vs Online Platforms</span>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(savingsAnalysis.comparedTo.onlinePlatforms)}</p>
                    <p className="text-xs text-foreground/60">12.1% savings</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-muted">
              <h3 className="text-lg font-serif font-bold text-primary mb-4">Monthly Savings Trend</h3>
              <div className="space-y-3">
                {savingsAnalysis.monthlySavings.map((month, index) => (
                  <div key={month.month} className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">{month.month}</span>
                    <span className="font-medium text-green-600">{formatCurrency(month.savings)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-green-50 border border-green-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Total Savings Achievement</h4>
                <p className="text-green-700 mb-3">
                  You've saved {formatCurrency(savingsAnalysis.savings)} compared to traditional procurement channels,
                  representing a {savingsAnalysis.savingsPercentage}% cost reduction.
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-green-600">Total Spent</p>
                    <p className="font-bold text-green-800">{formatCurrency(savingsAnalysis.totalSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Market Value</p>
                    <p className="font-bold text-green-800">{formatCurrency(savingsAnalysis.marketValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Your Savings</p>
                    <p className="font-bold text-green-800">{formatCurrency(savingsAnalysis.savings)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
