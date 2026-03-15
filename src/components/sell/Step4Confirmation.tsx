"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, IndianRupee, Calendar, MapPin, Package, Star } from 'lucide-react';
import { SaleData, CropDetails, HealthAnalysis, MarketPrice } from '@/types/sell';

interface Step4ConfirmationProps {
  cropDetails: CropDetails;
  healthAnalysis: HealthAnalysis;
  marketPrice: MarketPrice;
  photo: string;
  onSubmit: (saleData: SaleData) => void;
  onBack: () => void;
}

export function Step4Confirmation({
  cropDetails,
  healthAnalysis,
  marketPrice,
  photo,
  onSubmit,
  onBack
}: Step4ConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const saleData: SaleData = {
      cropDetails,
      healthAnalysis,
      marketPrice,
      photo,
      submittedAt: new Date().toISOString()
    };
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    onSubmit(saleData);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-muted">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-serif text-primary mb-2">Listing Submitted Successfully!</h2>
          <p className="text-foreground/60 mb-6">Your crop has been listed and buyers will be notified</p>
          
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
            <p className="text-green-800 font-medium mb-2">What happens next?</p>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• Interested buyers will contact you within 24-48 hours</li>
              <li>• You'll receive notifications for purchase inquiries</li>
              <li>• You can manage your listings from your dashboard</li>
            </ul>
          </div>

          <Button
            onClick={() => window.location.href = '/dashboard/farmer'}
            className="bg-primary hover:bg-primary/90 text-background rounded-full"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-muted">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-primary mb-2">Step 4: Confirm & Submit</h2>
        <p className="text-foreground/60 text-sm">Review all details and submit your crop listing</p>
      </div>

      <div className="space-y-6">
        {/* Crop Photo */}
        <div className="border border-muted rounded-2xl p-4">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Crop Photo
          </h3>
          <img 
            src={photo} 
            alt="Crop" 
            className="w-full h-48 object-cover rounded-2xl border border-muted"
          />
        </div>

        {/* Crop Details */}
        <div className="border border-muted rounded-2xl p-4">
          <h3 className="font-medium text-foreground mb-3">Crop Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-foreground/40" />
              <span className="text-sm text-foreground/60">Crop:</span>
              <span className="font-medium">{cropDetails.cropType}</span>
              {cropDetails.variety && <span className="text-foreground/40">({cropDetails.variety})</span>}
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-foreground/40" />
              <span className="text-sm text-foreground/60">Quantity:</span>
              <span className="font-medium">{cropDetails.quantity} {cropDetails.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-foreground/40" />
              <span className="text-sm text-foreground/60">Harvested:</span>
              <span className="font-medium">{new Date(cropDetails.harvestDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-foreground/40" />
              <span className="text-sm text-foreground/60">Location:</span>
              <span className="font-medium">{cropDetails.location}</span>
            </div>
          </div>
        </div>

        {/* Health Analysis */}
        <div className="border border-muted rounded-2xl p-4">
          <h3 className="font-medium text-foreground mb-3">Health Analysis</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${getHealthScoreColor(healthAnalysis.healthScore)}`}>
                {healthAnalysis.healthScore}%
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(healthAnalysis.quality)}`}>
                {healthAnalysis.quality.charAt(0).toUpperCase() + healthAnalysis.quality.slice(1)} Quality
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(healthAnalysis.healthScore / 20) ? 'text-yellow-400 fill-current' : 'text-foreground/20'}`} 
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-foreground/60">
            <p className="mb-1"><strong>Status:</strong> {healthAnalysis.diseases.join(', ')}</p>
            <p><strong>Recommendations:</strong> {healthAnalysis.recommendations.join(', ')}</p>
          </div>
        </div>

        {/* Pricing Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-4"
        >
          <h3 className="font-medium text-foreground mb-3">Pricing Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-foreground/60">Base Market Rate:</span>
              <span className="font-medium">₹{marketPrice.basePrice}/{cropDetails.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-foreground/60">Quality Adjustment:</span>
              <span className={`font-medium ${marketPrice.qualityAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {marketPrice.qualityAdjustment >= 0 ? '+' : ''}₹{marketPrice.qualityAdjustment}/{cropDetails.unit}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-muted">
              <span>Final Price:</span>
              <span className="text-primary">₹{marketPrice.finalPrice}/{cropDetails.unit}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Value:</span>
              <span className="text-secondary">₹{Math.round(marketPrice.finalPrice * cropDetails.quantity)}</span>
            </div>
          </div>
        </motion.div>

        {/* Important Notice */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-secondary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Important Notice</p>
              <p className="text-sm text-foreground/60">
                By submitting this listing, you confirm that all information provided is accurate. 
                Buyers will contact you directly for purchase negotiations.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-full"
          >
            ← Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-background rounded-full px-8"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                Submitting...
              </>
            ) : (
              'Confirm & Submit Listing'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
