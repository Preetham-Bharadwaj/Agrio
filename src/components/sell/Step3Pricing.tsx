"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, IndianRupee, Info, AlertCircle } from 'lucide-react';
import { MarketPrice, HealthAnalysis, CropDetails } from '@/types/sell';
import { marketPriceService, convertToPerKg } from '@/lib/marketPrices';

interface Step3PricingProps {
  onNext: (price: MarketPrice) => void;
  onBack: () => void;
  cropDetails: CropDetails;
  healthAnalysis: HealthAnalysis;
}

export function Step3Pricing({ 
  onNext, 
  onBack, 
  cropDetails, 
  healthAnalysis 
}: Step3PricingProps) {
  const [marketPrice, setMarketPrice] = useState<MarketPrice | null>(null);
  const [isCalculating, setIsCalculating] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'fallback'>('fallback');
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const calculateMarketPrice = async () => {
      setIsCalculating(true);
      setApiError(null);
      
      try {
        // Fetch real market price from Agmarknet/data.gov.in
        const marketData = await marketPriceService.getMarketPriceForCommodity(
          cropDetails.cropType,
          cropDetails.location.split(',').pop()?.trim()
        );

        let baseRate = 25; // Default fallback
        
        if (marketData) {
          // Convert from per quintal to per kg
          baseRate = convertToPerKg(marketData.modalPrice);
          setDataSource('api');
        } else {
          // Use fallback rates with comprehensive crop coverage
          const fallbackRates: Record<string, number> = {
            // Grains & Cereals
            'Wheat': 25, 'Rice': 35, 'Corn': 20, 'Soybeans': 45, 'Cotton': 60, 'Sugarcane': 3,
            'Bajra': 18, 'Jowar': 20, 'Ragi': 25, 'Barley': 22,
            
            // Vegetables
            'Tomato': 22, 'Potato': 18, 'Onion': 28, 'Garlic': 85, 'Ginger': 120, 'Turmeric': 95,
            'Chilli': 75, 'Brinjal': 35, 'Cauliflower': 25, 'Cabbage': 18, 'Spinach': 20,
            'Coriander': 45, 'Mint': 30, 'Bitter Gourd': 40, 'Bottle Gourd': 25, 'Ridge Gourd': 30,
            'Lady Finger': 45, 'Capsicum': 55, 'Carrot': 32, 'Radish': 22, 'Beetroot': 28,
            'Peas': 50, 'Beans': 48, 'Cucumber': 30, 'Pumpkin': 15, 'Lettuce': 35,
            'Broccoli': 60, 'Celery': 40, 'Spring Onion': 45, 'Mushroom': 80, 'Sweet Potato': 20,
            'Yam': 25, 'Taro': 30,
            
            // Fruits
            'Mango': 85, 'Apple': 120, 'Banana': 35, 'Orange': 65, 'Grapes': 75, 'Pomegranate': 95,
            'Papaya': 25, 'Guava': 40, 'Sapota': 45, 'Jackfruit': 30, 'Pineapple': 55,
            'Watermelon': 20, 'Muskmelon': 28, 'Lemon': 80, 'Lime': 75, 'Coconut': 35, 'Cashew': 150,
            'Strawberry': 200, 'Peach': 90, 'Plum': 85, 'Cherry': 180, 'Pear': 100, 'Fig': 110,
            'Jamun': 60, 'Amla': 70, 'Ber': 40, 'Phalsa': 55,
            
            // General Categories (average prices)
            'Vegetables': 30, 'Fruits': 60, 'Leafy Vegetables': 25, 'Root Vegetables': 25,
            'Gourds': 30, 'Legumes': 45, 'Pulses': 40
          };
          baseRate = fallbackRates[cropDetails.cropType] || 30;
          setDataSource('fallback');
        }
        
        // Quality adjustment based on health analysis
        let qualityMultiplier = 1;
        switch (healthAnalysis.quality) {
          case 'excellent': qualityMultiplier = 1.2; break;
          case 'good': qualityMultiplier = 1.0; break;
          case 'fair': qualityMultiplier = 0.8; break;
          case 'poor': qualityMultiplier = 0.6; break;
        }

        // Market trend simulation (could be enhanced with real trend data)
        const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
        const marketTrend = marketData?.trend || trends[Math.floor(Math.random() * trends.length)];
        
        let trendAdjustment = 1;
        switch (marketTrend) {
          case 'up': trendAdjustment = 1.05; break;
          case 'down': trendAdjustment = 0.95; break;
          case 'stable': trendAdjustment = 1.0; break;
        }

        // Calculate final price
        const marketRate = baseRate * trendAdjustment;
        const qualityAdjustment = marketRate * (qualityMultiplier - 1);
        const finalPrice = marketRate * qualityMultiplier;

        const reasoning = marketData 
          ? `Live market data from ${marketData.market}, ${marketData.state}: ₹${baseRate}/${cropDetails.unit}. ` +
            `${healthAnalysis.quality === 'excellent' ? 'Premium quality (+20%)' : 
              healthAnalysis.quality === 'good' ? 'Standard quality (0%)' :
              healthAnalysis.quality === 'fair' ? 'Below average (-20%)' : 'Poor quality (-40%)'}. ` +
            `Market is ${marketTrend === 'up' ? 'rising (+5%)' : 
              marketTrend === 'down' ? 'falling (-5%)' : 'stable (0%)'}.`
          : `Base market rate for ${cropDetails.cropType} is ₹${baseRate}/${cropDetails.unit}. ` +
            `${healthAnalysis.quality === 'excellent' ? 'Premium quality (+20%)' : 
              healthAnalysis.quality === 'good' ? 'Standard quality (0%)' :
              healthAnalysis.quality === 'fair' ? 'Below average (-20%)' : 'Poor quality (-40%)'}. ` +
            `Market is ${marketTrend === 'up' ? 'rising (+5%)' : 
              marketTrend === 'down' ? 'falling (-5%)' : 'stable (0%)'}.`;

        const priceData: MarketPrice = {
          basePrice: baseRate,
          finalPrice: Math.round(finalPrice * 100) / 100,
          marketRate: Math.round(marketRate * 100) / 100,
          qualityAdjustment: Math.round(qualityAdjustment * 100) / 100,
          marketTrend,
          reasoning,
          marketData: marketData ? {
            source: marketData.market,
            state: marketData.state,
            arrivalDate: marketData.arrivalDate
          } : undefined
        };

        setMarketPrice(priceData);
        
      } catch (error) {
        console.error('Market price calculation failed:', error);
        setApiError('Unable to fetch live market data. Using estimated prices.');
        
        // Fallback calculation
        const fallbackRates: Record<string, number> = {
          // Grains & Cereals
          'Wheat': 25, 'Rice': 35, 'Corn': 20, 'Soybeans': 45, 'Cotton': 60, 'Sugarcane': 3,
          'Bajra': 18, 'Jowar': 20, 'Ragi': 25, 'Barley': 22,
          
          // Vegetables
          'Tomato': 22, 'Potato': 18, 'Onion': 28, 'Garlic': 85, 'Ginger': 120, 'Turmeric': 95,
          'Chilli': 75, 'Brinjal': 35, 'Cauliflower': 25, 'Cabbage': 18, 'Spinach': 20,
          'Coriander': 45, 'Mint': 30, 'Bitter Gourd': 40, 'Bottle Gourd': 25, 'Ridge Gourd': 30,
          'Lady Finger': 45, 'Capsicum': 55, 'Carrot': 32, 'Radish': 22, 'Beetroot': 28,
          'Peas': 50, 'Beans': 48, 'Cucumber': 30, 'Pumpkin': 15, 'Lettuce': 35,
          'Broccoli': 60, 'Celery': 40, 'Spring Onion': 45, 'Mushroom': 80, 'Sweet Potato': 20,
          'Yam': 25, 'Taro': 30,
          
          // Fruits
          'Mango': 85, 'Apple': 120, 'Banana': 35, 'Orange': 65, 'Grapes': 75, 'Pomegranate': 95,
          'Papaya': 25, 'Guava': 40, 'Sapota': 45, 'Jackfruit': 30, 'Pineapple': 55,
          'Watermelon': 20, 'Muskmelon': 28, 'Lemon': 80, 'Lime': 75, 'Coconut': 35, 'Cashew': 150,
          'Strawberry': 200, 'Peach': 90, 'Plum': 85, 'Cherry': 180, 'Pear': 100, 'Fig': 110,
          'Jamun': 60, 'Amla': 70, 'Ber': 40, 'Phalsa': 55,
          
          // General Categories (average prices)
          'Vegetables': 30, 'Fruits': 60, 'Leafy Vegetables': 25, 'Root Vegetables': 25,
          'Gourds': 30, 'Legumes': 45, 'Pulses': 40
        };
        
        const baseRate = fallbackRates[cropDetails.cropType] || 25;
        const qualityMultiplier = healthAnalysis.quality === 'excellent' ? 1.2 : 
                                 healthAnalysis.quality === 'good' ? 1.0 : 
                                 healthAnalysis.quality === 'fair' ? 0.8 : 0.6;
        
        const finalPrice = baseRate * qualityMultiplier;
        
        setMarketPrice({
          basePrice: baseRate,
          finalPrice: Math.round(finalPrice * 100) / 100,
          marketRate: baseRate,
          qualityAdjustment: baseRate * (qualityMultiplier - 1),
          marketTrend: 'stable',
          reasoning: `Estimated price for ${cropDetails.cropType} based on market averages.`
        });
        setDataSource('fallback');
      }
      
      setIsCalculating(false);
    };

    if (cropDetails && healthAnalysis) {
      calculateMarketPrice();
    }
  }, [cropDetails, healthAnalysis]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isCalculating) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-muted">
        <div className="mb-6">
          <h2 className="text-2xl font-serif text-primary mb-2">Step 3: AI Price Calculation</h2>
          <p className="text-foreground/60 text-sm">Fetching live market rates and setting optimal price</p>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-medium mb-2">
            {dataSource === 'api' ? 'Fetching live market data...' : 'AI is calculating the best price...'}
          </p>
          <p className="text-primary/60 text-sm">
            {dataSource === 'api' 
              ? 'Connecting to Agmarknet and analyzing market trends' 
              : 'Analyzing market trends, quality factors, and demand'
            }
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-full"
          >
            ← Back
          </Button>
        </div>
      </div>
    );
  }

  if (!marketPrice) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-muted">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-primary mb-2">Step 3: AI-Optimized Pricing</h2>
        <p className="text-foreground/60 text-sm">
          {dataSource === 'api' ? 'Live market prices' : 'Estimated prices'} based on market rates and crop quality
        </p>
      </div>

      {/* Data Source Indicator */}
      {apiError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Using Estimated Prices</p>
              <p className="text-sm text-amber-700">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {dataSource === 'api' && marketPrice.marketData && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              Live data from {marketPrice.marketData.source}, {marketPrice.marketData.state}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Price Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-6"
        >
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-foreground/60 mb-2">Recommended Selling Price</p>
            <div className="flex items-center justify-center gap-2">
              <IndianRupee className="w-8 h-8 text-primary" />
              <span className="text-4xl font-serif font-bold text-primary">{marketPrice.finalPrice}</span>
              <span className="text-xl text-foreground/60">per {cropDetails.unit}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-foreground/40 mb-1">Market Rate</p>
              <p className="text-lg font-semibold text-foreground">₹{marketPrice.basePrice}</p>
              <p className="text-xs text-green-600">{dataSource === 'api' ? 'Live' : 'Estimated'}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-foreground/40 mb-1">Market Trend</p>
              <div className="flex items-center justify-center gap-1">
                {getTrendIcon(marketPrice.marketTrend)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(marketPrice.marketTrend)}`}>
                  {marketPrice.marketTrend.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-foreground/40 mb-1">Quality Bonus</p>
              <p className={`text-lg font-semibold ${marketPrice.qualityAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketPrice.qualityAdjustment >= 0 ? '+' : ''}₹{marketPrice.qualityAdjustment}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <div className="bg-muted/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-foreground/60" />
            <h3 className="font-medium text-foreground">Price Calculation Details</h3>
          </div>
          <p className="text-sm text-foreground/60 leading-relaxed">{marketPrice.reasoning}</p>
        </div>

        {/* Total Value */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-foreground/60">Total Value for {cropDetails.quantity} {cropDetails.unit}</p>
              <p className="text-xs text-foreground/40 mt-1">At recommended price per {cropDetails.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-serif font-bold text-secondary">
                ₹{Math.round(marketPrice.finalPrice * cropDetails.quantity)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-full"
          >
            ← Back
          </Button>
          <Button
            onClick={() => onNext(marketPrice)}
            className="bg-primary hover:bg-primary/90 text-background rounded-full"
          >
            Next Step →
          </Button>
        </div>
      </div>
    </div>
  );
}
