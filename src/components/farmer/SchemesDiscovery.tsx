'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { FileText, CheckCircle, ExternalLink, IndianRupee } from 'lucide-react';

interface SchemesDiscoveryProps {
  userId: string;
  state: string;
  district: string;
}

interface Scheme {
  id: string;
  name: string;
  benefit_amount: number | null;
  eligibility_rules: any;
  state: string;
  description: string;
}

interface Application {
  id: string;
  scheme_id: string;
  status: string;
}

export function SchemesDiscovery({ userId, state, district }: SchemesDiscoveryProps) {
  const t = useTranslations('farmer');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingSchemeId, setApplyingSchemeId] = useState<string | null>(null);

  useEffect(() => {
    fetchSchemes();
    fetchApplications();
  }, [state]);

  const fetchSchemes = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('schemes')
        .select('*')
        .eq('state', state)
        .order('name');

      if (fetchError) throw fetchError;

      setSchemes(data || []);
    } catch (err: any) {
      console.error('Error fetching schemes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      setApplications(data || []);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleApply = async (schemeId: string) => {
    setApplyingSchemeId(schemeId);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          scheme_id: schemeId,
          status: 'submitted',
        });

      if (insertError) throw insertError;

      await fetchApplications();
    } catch (err: any) {
      console.error('Error applying to scheme:', err);
      setError(err.message);
    } finally {
      setApplyingSchemeId(null);
    }
  };

  const getApplicationStatus = (schemeId: string) => {
    return applications.find((app) => app.scheme_id === schemeId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {t('submitted')}
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {t('underReview')}
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {t('approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {t('rejected')}
          </Badge>
        );
      default:
        return null;
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">{t('governmentSchemes')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('schemesAvailableIn')} {state}
        </p>
      </div>

      {schemes.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('noSchemesAvailable')}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {schemes.map((scheme) => {
            const application = getApplicationStatus(scheme.id);
            const isApplied = !!application;
            const isApplying = applyingSchemeId === scheme.id;

            return (
              <Card key={scheme.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">{scheme.name}</h4>
                    {scheme.benefit_amount && (
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        <span>₹{scheme.benefit_amount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  {isApplied && getStatusBadge(application.status)}
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {scheme.description}
                </p>

                {scheme.eligibility_rules && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      {t('eligibility')}:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {Object.entries(scheme.eligibility_rules).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{String(value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  {isApplied ? (
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('applied')}
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => handleApply(scheme.id)}
                      disabled={isApplying}
                    >
                      {isApplying ? t('applying') : t('applyNow')}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    title={t('learnMore')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {applications.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            {t('yourApplications')}
          </p>
          <p className="text-xs text-blue-700">
            {t('applicationCount', { count: applications.length })}
          </p>
        </div>
      )}
    </div>
  );
}
