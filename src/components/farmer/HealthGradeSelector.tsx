'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HealthGradeSelectorProps {
  selectedGrade: 'A' | 'B' | 'C';
  onGradeChange: (grade: 'A' | 'B' | 'C') => void;
  apmcRate?: number | null;
}

export function HealthGradeSelector({ 
  selectedGrade, 
  onGradeChange,
  apmcRate 
}: HealthGradeSelectorProps) {
  const t = useTranslations('farmer');

  const grades = [
    {
      value: 'A' as const,
      label: t('gradeA'),
      description: t('gradeADesc'),
      color: 'bg-green-100 border-green-500 text-green-900',
      selectedColor: 'bg-green-500 text-white',
      priceAdjustment: 1.10, // +10%
      emoji: '🌟',
    },
    {
      value: 'B' as const,
      label: t('gradeB'),
      description: t('gradeBDesc'),
      color: 'bg-blue-100 border-blue-500 text-blue-900',
      selectedColor: 'bg-blue-500 text-white',
      priceAdjustment: 1.00, // No change
      emoji: '✓',
    },
    {
      value: 'C' as const,
      label: t('gradeC'),
      description: t('gradeCDesc'),
      color: 'bg-orange-100 border-orange-500 text-orange-900',
      selectedColor: 'bg-orange-500 text-white',
      priceAdjustment: 0.90, // -10%
      emoji: '⚠️',
    },
  ];

  const calculateSuggestedPrice = (adjustment: number) => {
    if (!apmcRate) return null;
    return (apmcRate * adjustment).toFixed(2);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('selectHealthGrade')}</h3>
        <p className="text-sm text-muted-foreground">{t('gradeDescription')}</p>
      </div>

      <div className="grid gap-3">
        {grades.map((grade) => {
          const isSelected = selectedGrade === grade.value;
          const suggestedPrice = calculateSuggestedPrice(grade.priceAdjustment);

          return (
            <Card
              key={grade.value}
              className={`p-4 cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-primary shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              onClick={() => onGradeChange(grade.value)}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl ${isSelected ? 'scale-110' : ''} transition-transform`}>
                  {grade.emoji}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">{grade.label}</h4>
                    <Badge 
                      variant="outline"
                      className={isSelected ? grade.selectedColor : grade.color}
                    >
                      {grade.value}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {grade.description}
                  </p>

                  {apmcRate && suggestedPrice && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-600">{t('suggestedPrice')}:</p>
                      <p className="text-lg font-bold text-primary">
                        ₹{suggestedPrice}/kg
                      </p>
                      {grade.priceAdjustment !== 1.00 && (
                        <p className="text-xs text-gray-500">
                          ({grade.priceAdjustment > 1 ? '+' : ''}
                          {((grade.priceAdjustment - 1) * 100).toFixed(0)}% {t('fromAPMC')})
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="text-primary">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {!apmcRate && (
        <p className="text-xs text-center text-muted-foreground">
          {t('selectCropForPriceSuggestion')}
        </p>
      )}
    </div>
  );
}
