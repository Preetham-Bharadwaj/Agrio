"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface SellProgressBarProps {
  currentStep: number;
}

export function SellProgressBar({ currentStep }: SellProgressBarProps) {
  const steps = [
    { number: 1, name: 'Crop Details', description: 'Enter crop information' },
    { number: 2, name: 'Photo & AI Analysis', description: 'Capture photo for health check' },
    { number: 3, name: 'AI Pricing', description: 'Get optimal market price' },
    { number: 4, name: 'Confirmation', description: 'Review and submit' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep > step.number 
                    ? 'bg-primary text-background' 
                    : currentStep === step.number 
                    ? 'bg-primary text-background' 
                    : 'bg-muted text-foreground/40'
                  }
                `}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${
                  currentStep >= step.number ? 'text-primary' : 'text-foreground/40'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-foreground/40 mt-1 max-w-20">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`
                  w-full h-1 mx-4
                  ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
