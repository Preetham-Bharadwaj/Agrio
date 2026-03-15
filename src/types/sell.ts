export interface CropDetails {
  cropType: string;
  variety: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  location: string;
  expectedQuality: string;
}

export interface HealthAnalysis {
  healthScore: number;
  diseases: string[];
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

export interface MarketPrice {
  basePrice: number;
  finalPrice: number;
  marketRate: number;
  qualityAdjustment: number;
  marketTrend: 'up' | 'down' | 'stable';
  reasoning: string;
  marketData?: {
    source: string;
    state: string;
    arrivalDate: string;
  };
}

export interface SaleData {
  cropDetails: CropDetails;
  healthAnalysis: HealthAnalysis;
  marketPrice: MarketPrice;
  photo?: string;
  submittedAt: string;
}
