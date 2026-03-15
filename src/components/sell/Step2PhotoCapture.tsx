"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { HealthAnalysis } from '@/types/sell';

interface Step2PhotoCaptureProps {
  onNext: (analysis: HealthAnalysis, photo: string) => void;
  onBack: () => void;
  cropType: string;
}

export function Step2PhotoCapture({ onNext, onBack, cropType }: Step2PhotoCaptureProps) {
  const [photo, setPhoto] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateAIAnalysis = (): HealthAnalysis => {
    const healthScores = [85, 90, 78, 92, 88, 95, 82, 87];
    const diseaseOptions = [
      ['No diseases detected', 'Healthy leaf structure'],
      ['Minor pest damage', 'Slight yellowing'],
      ['Early signs of fungus', 'Leaf spots detected'],
      ['Healthy crop', 'Optimal growth']
    ];
    const recommendationOptions = [
      ['Continue current irrigation schedule', 'Monitor for pests weekly'],
      ['Apply organic pesticide', 'Increase nitrogen fertilizer'],
      ['Treat with fungicide', 'Improve drainage'],
      ['Maintain current practices', 'Ready for harvest']
    ];

    const randomIndex = Math.floor(Math.random() * healthScores.length);
    const score = healthScores[randomIndex];
    
    let quality: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) quality = 'excellent';
    else if (score >= 80) quality = 'good';
    else if (score >= 70) quality = 'fair';
    else quality = 'poor';

    return {
      healthScore: score,
      diseases: diseaseOptions[randomIndex] || ['No diseases detected'],
      quality,
      recommendations: recommendationOptions[randomIndex] || ['Continue current practices']
    };
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhoto(result);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!photo) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = simulateAIAnalysis();
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleNext = () => {
    if (analysis && photo) {
      onNext(analysis, photo);
    }
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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-muted">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-primary mb-2">Step 2: Take Photo & AI Health Detection</h2>
        <p className="text-foreground/60 text-sm">Capture a clear photo of your {cropType} for AI analysis</p>
      </div>

      <div className="space-y-6">
        {/* Photo Capture Section */}
        <div className="border-2 border-dashed border-muted rounded-2xl p-6 text-center">
          {photo ? (
            <div className="space-y-4">
              <img 
                src={photo} 
                alt="Crop" 
                className="max-h-64 mx-auto rounded-2xl object-cover border border-muted"
              />
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPhoto('');
                    setAnalysis(null);
                  }}
                  className="rounded-full"
                >
                  Retake Photo
                </Button>
                {!analysis && !isAnalyzing && (
                  <Button
                    onClick={handleAnalyze}
                    className="bg-primary hover:bg-primary/90 text-background rounded-full"
                  >
                    Analyze with AI
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-foreground/40" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Capture Crop Photo</h3>
                <p className="text-sm text-foreground/60 mb-4">
                  Take a clear photo in good lighting for best AI analysis
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary hover:bg-primary/90 text-background rounded-full mr-2"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <div>
                <p className="text-primary font-medium">AI is analyzing your crop...</p>
                <p className="text-primary/60 text-sm">Checking health, diseases, and quality</p>
              </div>
            </div>
          </motion.div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-medium text-green-800">AI Analysis Complete</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Health Score</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-600">{analysis.healthScore}%</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(analysis.quality)}`}>
                    {analysis.quality.charAt(0).toUpperCase() + analysis.quality.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Health Status</p>
                <div className="space-y-1">
                  {analysis.diseases.map((disease, index) => (
                    <p key={index} className="text-sm text-gray-600">• {disease}</p>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Recommendations</p>
                <div className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <p key={index} className="text-sm text-gray-600">• {rec}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-full"
          >
            ← Back
          </Button>
          {analysis && (
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-background rounded-full"
            >
              Next Step →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
