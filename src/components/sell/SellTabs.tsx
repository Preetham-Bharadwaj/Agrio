"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface SellTabsProps {
  activeTab: 'new' | 'listings';
  onTabChange: (tab: 'new' | 'listings') => void;
}

export function SellTabs({ activeTab, onTabChange }: SellTabsProps) {
  return (
    <div className="flex gap-2 mb-8 bg-muted/30 p-1 rounded-xl">
      <Button
        variant={activeTab === 'new' ? 'default' : 'ghost'}
        onClick={() => onTabChange('new')}
        className={`flex-1 rounded-lg font-medium transition-all ${
          activeTab === 'new' 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-foreground/60 hover:text-foreground hover:bg-background/50'
        }`}
      >
        + New Listing
      </Button>
      <Button
        variant={activeTab === 'listings' ? 'default' : 'ghost'}
        onClick={() => onTabChange('listings')}
        className={`flex-1 rounded-lg font-medium transition-all ${
          activeTab === 'listings' 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-foreground/60 hover:text-foreground hover:bg-background/50'
        }`}
      >
        My Listings
      </Button>
    </div>
  );
}
