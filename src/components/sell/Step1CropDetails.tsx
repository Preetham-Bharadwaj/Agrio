"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CropDetails } from '@/types/sell';

interface Step1CropDetailsProps {
  onNext: (details: CropDetails) => void;
}

export function Step1CropDetails({ onNext }: Step1CropDetailsProps) {
  const [formData, setFormData] = useState<CropDetails>({
    cropType: '',
    variety: '',
    quantity: 0,
    unit: 'kg',
    harvestDate: '',
    location: '',
    expectedQuality: 'good'
  });

  const cropTypes = [
    // Grains & Cereals
    'Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Sugarcane', 'Bajra', 'Jowar', 'Ragi', 'Barley',
    
    // Vegetables
    'Tomato', 'Potato', 'Onion', 'Garlic', 'Ginger', 'Turmeric', 'Chilli', 'Brinjal', 'Cauliflower', 
    'Cabbage', 'Spinach', 'Coriander', 'Mint', 'Bitter Gourd', 'Bottle Gourd', 'Ridge Gourd', 
    'Lady Finger', 'Capsicum', 'Carrot', 'Radish', 'Beetroot', 'Peas', 'Beans', 'Cucumber', 'Pumpkin',
    'Lettuce', 'Broccoli', 'Celery', 'Spring Onion', 'Mushroom', 'Sweet Potato', 'Yam', 'Taro',
    
    // Fruits
    'Mango', 'Apple', 'Banana', 'Orange', 'Grapes', 'Pomegranate', 'Papaya', 'Guava', 'Sapota', 
    'Jackfruit', 'Pineapple', 'Watermelon', 'Muskmelon', 'Lemon', 'Lime', 'Coconut', 'Cashew',
    'Strawberry', 'Peach', 'Plum', 'Cherry', 'Pear', 'Fig', 'Jamun', 'Amla', 'Ber', 'Phalsa',
    
    // General Categories
    'Vegetables', 'Fruits', 'Leafy Vegetables', 'Root Vegetables', 'Gourds', 'Legumes', 'Pulses'
  ];
  const units = ['kg', 'tons', 'quintals', 'bags'];
  const qualities = ['excellent', 'good', 'fair', 'poor'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cropType && formData.quantity > 0 && formData.harvestDate && formData.location) {
      onNext(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-muted">
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-primary mb-2">Step 1: Enter Crop Details</h2>
        <p className="text-foreground/60 text-sm">Tell us about the crop you want to sell</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cropType" className="text-sm font-medium text-foreground/80 mb-1">
              Crop Type *
            </Label>
            <select
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              required
            >
              <option value="">Select crop type</option>
              {cropTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="variety" className="text-sm font-medium text-foreground/80 mb-1">
              Variety
            </Label>
            <Input
              id="variety"
              name="variety"
              value={formData.variety}
              onChange={handleChange}
              placeholder="e.g., Basmati, Golden"
              className="rounded-xl border-muted"
            />
          </div>

          <div>
            <Label htmlFor="quantity" className="text-sm font-medium text-foreground/80 mb-1">
              Quantity *
            </Label>
            <div className="flex gap-2">
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="0"
                className="flex-1 rounded-xl border-muted"
                required
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="px-3 py-2 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="harvestDate" className="text-sm font-medium text-foreground/80 mb-1">
              Harvest Date *
            </Label>
            <Input
              id="harvestDate"
              name="harvestDate"
              type="date"
              value={formData.harvestDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="rounded-xl border-muted"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="location" className="text-sm font-medium text-foreground/80 mb-1">
              Location *
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Village, District, State"
              className="rounded-xl border-muted"
              required
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="expectedQuality" className="text-sm font-medium text-foreground/80 mb-1">
              Expected Quality
            </Label>
            <select
              id="expectedQuality"
              name="expectedQuality"
              value={formData.expectedQuality}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
            >
              {qualities.map(quality => (
                <option key={quality} value={quality}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-background font-bold rounded-full px-8"
          >
            Next Step →
          </Button>
        </div>
      </form>
    </div>
  );
}
