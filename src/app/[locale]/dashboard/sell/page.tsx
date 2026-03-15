"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SellTabs } from "@/components/sell/SellTabs";
import { SellProgressBar } from "@/components/sell/SellProgressBar";
import { Step1CropDetails } from "@/components/sell/Step1CropDetails";
import { Step2PhotoCapture } from "@/components/sell/Step2PhotoCapture";
import { Step3Pricing } from "@/components/sell/Step3Pricing";
import { Step4Confirmation } from "@/components/sell/Step4Confirmation";
import { MyListings } from "@/components/sell/MyListings";
import { CropDetails, HealthAnalysis, MarketPrice, SaleData } from "@/types/sell";

export default function SellPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'listings'>('new');
  const [currentStep, setCurrentStep] = useState(1);
  const [cropDetails, setCropDetails] = useState<CropDetails | null>(null);
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis | null>(null);
  const [marketPrice, setMarketPrice] = useState<MarketPrice | null>(null);
  const [photo, setPhoto] = useState<string>('');

  const handleStep1Next = (details: CropDetails) => {
    setCropDetails(details);
    setCurrentStep(2);
  };

  const handleStep2Next = (analysis: HealthAnalysis, cropPhoto: string) => {
    setHealthAnalysis(analysis);
    setPhoto(cropPhoto);
    setCurrentStep(3);
  };

  const handleStep3Next = (price: MarketPrice) => {
    setMarketPrice(price);
    setCurrentStep(4);
  };

  const handleStep4Submit = (saleData: SaleData) => {
    console.log('Sale submitted:', saleData);
    // Here you would normally send to API
    // Reset to step 1 and switch to listings tab
    setCurrentStep(1);
    setActiveTab('listings');
    setCropDetails(null);
    setHealthAnalysis(null);
    setMarketPrice(null);
    setPhoto('');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNewListing = () => {
    setActiveTab('new');
    setCurrentStep(1);
    setCropDetails(null);
    setHealthAnalysis(null);
    setMarketPrice(null);
    setPhoto('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1CropDetails onNext={handleStep1Next} />;
      case 2:
        return (
          <Step2PhotoCapture
            onNext={handleStep2Next}
            onBack={handleBack}
            cropType={cropDetails?.cropType || ''}
          />
        );
      case 3:
        return (
          <Step3Pricing
            onNext={handleStep3Next}
            onBack={handleBack}
            cropDetails={cropDetails!}
            healthAnalysis={healthAnalysis!}
          />
        );
      case 4:
        return (
          <Step4Confirmation
            cropDetails={cropDetails!}
            healthAnalysis={healthAnalysis!}
            marketPrice={marketPrice!}
            photo={photo}
            onSubmit={handleStep4Submit}
            onBack={handleBack}
          />
        );
      default:
        return <Step1CropDetails onNext={handleStep1Next} />;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Sell Harvest</h1>
        <p className="text-foreground/40 text-sm">
          {activeTab === 'new' 
            ? '4-step AI-powered process to get the best price for your crops'
            : 'Manage your listings and track your earnings'
          }
        </p>
      </header>

      <SellTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'new' ? (
          <div>
            <SellProgressBar currentStep={currentStep} />
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </div>
        ) : (
          <MyListings onNewListing={handleNewListing} />
        )}
      </motion.div>
    </div>
  );
}
