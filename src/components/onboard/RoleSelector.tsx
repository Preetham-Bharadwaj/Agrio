'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isPrototypeMode } from '@/lib/prototype';

interface RoleSelectorProps {
  onRoleSelected: (role: 'farmer' | 'retailer' | 'consumer') => void;
}

type UserRole = 'farmer' | 'retailer' | 'consumer';

export function RoleSelector({ onRoleSelected }: RoleSelectorProps) {
  const t = useTranslations('onboard');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles: { value: UserRole; icon: string; titleKey: string; descKey: string }[] = [
    {
      value: 'farmer',
      icon: '🌾',
      titleKey: 'farmerTitle',
      descKey: 'farmerDesc',
    },
    {
      value: 'retailer',
      icon: '🏪',
      titleKey: 'retailerTitle',
      descKey: 'retailerDesc',
    },
    {
      value: 'consumer',
      icon: '🛒',
      titleKey: 'consumerTitle',
      descKey: 'consumerDesc',
    },
  ];

  const handleConfirmRole = async () => {
    if (!selectedRole) return;

    setLoading(true);
    setError('');

    try {
      if (isPrototypeMode) {
        onRoleSelected(selectedRole);
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          mobile: user.phone || '',
          account_type: selectedRole,
          created_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (updateError) throw updateError;
      onRoleSelected(selectedRole);
    } catch (err: any) {
      console.error('Role selection error:', err);
      setError(err.message || t('roleSelectionFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('whoAreYou')}</h2>
        <p className="text-muted-foreground">{t('selectYourRole')}</p>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card
            key={role.value}
            className={`p-6 cursor-pointer transition-all ${
              selectedRole === role.value
                ? 'border-primary border-2 bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedRole(role.value)}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{role.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {t(role.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(role.descKey)}
                </p>
              </div>
              {selectedRole === role.value && (
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
        ))}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <Button
        onClick={handleConfirmRole}
        disabled={!selectedRole || loading}
        className="w-full"
        size="lg"
      >
        {loading ? t('saving') : t('continue')}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        {t('roleCannotBeChanged')}
      </p>
    </div>
  );
}
