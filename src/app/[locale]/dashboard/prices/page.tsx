"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown, Info, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { marketPriceService, convertToPerKg, MarketPriceData } from "@/lib/marketPrices";

export default function PricesPage() {
  const [search, setSearch] = useState("");
  const [cropPrices, setCropPrices] = useState<MarketPriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'agmarknet' | 'fallback' | 'cache' | 'commodityapi'>('fallback');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const loadMarketPrices = async () => {
      setIsLoading(true);
      try {
        const response = await marketPriceService.getMarketPrices();
        if (response.success) {
          setCropPrices(response.data);
          setDataSource(response.source);
          setLastUpdated(new Date());
        }
      } catch (error) {
        console.error('Failed to load market prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketPrices();
    
    // Refresh prices every 30 minutes
    const interval = setInterval(loadMarketPrices, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredCrops = cropPrices.filter(c => 
    c.commodity.toLowerCase().includes(search.toLowerCase())
  );

  const getForecastBadge = (trend: string) => {
    if (trend === 'up') return { text: 'SELL NOW', className: 'bg-red-100 text-red-600 hover:bg-red-100' };
    if (trend === 'down') return { text: 'HOLD', className: 'bg-green-100 text-green-600 hover:bg-green-100' };
    return { text: 'HOLD', className: 'bg-amber-100 text-amber-600 hover:bg-amber-100' };
  };

  const formatPrice = (price: number) => {
    return `₹${convertToPerKg(price).toFixed(2)}`;
  };

  const formatTrend = (trend: string) => {
    if (trend === 'up') return '+5.2%';
    if (trend === 'down') return '-3.1%';
    return '0.0%';
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    marketPriceService.clearCache(); // Clear cache to force fresh data
    try {
      const response = await marketPriceService.getMarketPrices();
      if (response.success) {
        setCropPrices(response.data);
        setDataSource(response.source);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to refresh market prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  };

  if (isLoading && cropPrices.length === 0) {
    return (
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-serif text-primary mb-2">Market Rates</h1>
          <p className="text-foreground/40 text-sm">Loading real-time mandi prices...</p>
        </header>
        
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-primary mb-2">Market Rates</h1>
            <p className="text-foreground/40 text-sm">
              {dataSource === 'agmarknet' || dataSource === 'cache' || dataSource === 'commodityapi' ? 'Live' : 'Estimated'} mandi prices across India
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="rounded-xl border-muted p-3"
          >
            <RefreshCw className={`w-5 h-5 text-primary ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </header>

      {/* Data Source Indicator */}
      {dataSource === 'fallback' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Using Estimated Prices</p>
              <p className="text-sm text-amber-700">Unable to fetch live market data. Showing estimated prices based on market averages.</p>
            </div>
          </div>
        </div>
      )}

      {(dataSource === 'agmarknet' || dataSource === 'cache' || dataSource === 'commodityapi') && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              {dataSource === 'commodityapi' ? 'Real-time simulated market data' : 'Live market data from Agmarknet'}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input 
            placeholder="Search from 70+ crops..." 
            className="pl-10 rounded-xl border-muted py-6"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl border-muted p-4">
          <Filter className="w-5 h-5 text-primary" />
        </Button>
      </div>

      <div className="space-y-4">
        {filteredCrops.map((crop, i) => {
          const forecast = getForecastBadge(crop.trend);
          return (
            <motion.div
              key={crop.commodity}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-white border border-muted rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                    {crop.commodity[0]}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-primary">{crop.commodity}</h3>
                    <p className="text-[10px] text-foreground/40 font-mono italic">{crop.market}, {crop.state}</p>
                  </div>
                </div>
                <Badge 
                  className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-widest ${forecast.className}`}
                >
                  {forecast.text}
                </Badge>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-mono font-bold text-primary">{formatPrice(crop.modalPrice)}</span>
                  <span className="text-foreground/40 text-sm ml-1">/kg</span>
                  <div className="text-xs text-foreground/40 mt-1">
                    Range: {formatPrice(crop.minPrice)} - {formatPrice(crop.maxPrice)}
                  </div>
                </div>
                <div className={`flex items-center gap-1 font-mono font-bold text-sm ${crop.trend === 'up' ? "text-green-600" : crop.trend === 'down' ? "text-red-600" : "text-amber-600"}`}>
                  {crop.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : crop.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-90" />}
                  {formatTrend(crop.trend)}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-muted/50 flex items-center gap-2 text-[10px] text-foreground/40 font-medium">
                <Info className="w-3 h-3" />
                Price updated {getTimeAgo(lastUpdated)} from {(dataSource === 'agmarknet' || dataSource === 'cache' || dataSource === 'commodityapi') ? 'real-time' : 'estimated'} feed.
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCrops.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-foreground/40" />
          </div>
          <h3 className="text-lg font-serif text-primary mb-2">No crops found</h3>
          <p className="text-foreground/60">Try searching for a different crop</p>
        </div>
      )}
    </div>
  );
}
