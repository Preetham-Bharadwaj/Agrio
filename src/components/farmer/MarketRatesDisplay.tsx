'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

interface MarketRatesDisplayProps {
  district: string;
  state: string;
}

interface MarketRate {
  id: string;
  crop: string;
  price_per_kg: number;
  mandi: string;
  district: string;
  state: string;
  trend_pct: number;
  forecast_signal: 'hold' | 'sell' | 'urgent_sell';
  updated_at: string;
}

export function MarketRatesDisplay({ district, state }: MarketRatesDisplayProps) {
  const t = useTranslations('farmer');
  const [rates, setRates] = useState<MarketRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchMarketRates();
  }, [district, state]);

  const fetchMarketRates = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('prices')
        .select('*')
        .eq('district', district)
        .eq('state', state)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setRates(data || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching market rates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trendPct: number) => {
    if (trendPct > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (trendPct < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trendPct: number) => {
    if (trendPct > 0) return 'text-green-600';
    if (trendPct < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'hold':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {t('hold')}
          </Badge>
        );
      case 'sell':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {t('sellNow')}
          </Badge>
        );
      case 'urgent_sell':
        return (
          <Badge variant="destructive" className="animate-pulse">
            {t('urgentSell')}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSignalDescription = (signal: string) => {
    switch (signal) {
      case 'hold':
        return t('holdDesc');
      case 'sell':
        return t('sellNowDesc');
      case 'urgent_sell':
        return t('urgentSellDesc');
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{t('marketRates')}</h3>
          <p className="text-sm text-muted-foreground">
            {district}, {state}
          </p>
        </div>
        <button
          onClick={fetchMarketRates}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title={t('refresh')}
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {lastUpdated && (
        <p className="text-xs text-muted-foreground">
          {t('lastUpdated')}: {lastUpdated.toLocaleTimeString('en-IN')}
        </p>
      )}

      {rates.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">{t('noRatesAvailable')}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rates.map((rate) => (
            <Card key={rate.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">{rate.crop}</h4>
                  <p className="text-xs text-muted-foreground">
                    {rate.mandi || t('localMandi')}
                  </p>
                </div>
                {getSignalBadge(rate.forecast_signal)}
              </div>

              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    ₹{rate.price_per_kg.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('perKg')}</p>
                </div>

                <div className="flex items-center gap-2">
                  {getTrendIcon(rate.trend_pct)}
                  <span className={`text-sm font-semibold ${getTrendColor(rate.trend_pct)}`}>
                    {rate.trend_pct > 0 && '+'}
                    {rate.trend_pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  {t('7dayTrend')}: {getSignalDescription(rate.forecast_signal)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
