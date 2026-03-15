'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Upload, X, TrendingUp } from 'lucide-react';

interface ProduceListingFormProps {
  farmerId: string;
  onListingCreated: (listingId: string) => void;
}

interface ListingFormData {
  crop: string;
  quantity_kg: number;
  price_per_kg: number;
  health_grade: 'A' | 'B' | 'C';
  photo?: File;
}

const COMMON_CROPS = [
  'Wheat', 'Rice', 'Corn', 'Tomato', 'Potato', 'Onion', 
  'Cotton', 'Sugarcane', 'Soybean', 'Chickpea', 'Mango', 'Banana'
];

export function ProduceListingForm({ farmerId, onListingCreated }: ProduceListingFormProps) {
  const t = useTranslations('farmer');
  const [formData, setFormData] = useState<ListingFormData>({
    crop: '',
    quantity_kg: 0,
    price_per_kg: 0,
    health_grade: 'B',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apmcRate, setApmcRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch APMC rate when crop is selected
  useEffect(() => {
    const fetchAPMCRate = async () => {
      if (!formData.crop) {
        setApmcRate(null);
        return;
      }

      setLoadingRate(true);
      try {
        const { data, error } = await supabase
          .from('prices')
          .select('price_per_kg')
          .eq('crop', formData.crop)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data) {
          setApmcRate(data.price_per_kg);
        }
      } catch (err) {
        console.error('Error fetching APMC rate:', err);
        setApmcRate(null);
      } finally {
        setLoadingRate(false);
      }
    };

    fetchAPMCRate();
  }, [formData.crop]);

  const handlePhotoChange = (file: File) => {
    if (file.size > 3 * 1024 * 1024) {
      setError(t('photoTooLarge'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError(t('invalidPhotoType'));
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.quantity_kg <= 0) {
      setError(t('quantityMustBePositive'));
      return;
    }

    if (formData.price_per_kg <= 0) {
      setError(t('priceMustBePositive'));
      return;
    }

    setLoading(true);

    try {
      let photoUrl = null;

      // Upload photo if provided
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${farmerId}-${Date.now()}.${fileExt}`;
        const filePath = `produce-photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, photo, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // Create listing
      const { data, error: insertError } = await supabase
        .from('listings')
        .insert({
          farmer_id: farmerId,
          crop: formData.crop,
          quantity_kg: formData.quantity_kg,
          min_price: formData.price_per_kg,
          health_grade: formData.health_grade,
          photo_url: photoUrl,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onListingCreated(data.id);
      
      // Reset form
      setFormData({
        crop: '',
        quantity_kg: 0,
        price_per_kg: 0,
        health_grade: 'B',
      });
      setPhoto(null);
      setPhotoPreview(null);
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setError(err.message || t('listingCreationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('createListing')}</h3>

        {/* Crop Selection */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="crop">{t('cropName')}</Label>
          <select
            id="crop"
            value={formData.crop}
            onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t('selectCrop')}</option>
            {COMMON_CROPS.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* APMC Rate Display */}
        {formData.crop && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                {t('currentAPMCRate')}
              </p>
              {loadingRate ? (
                <p className="text-xs text-blue-600">{t('loading')}</p>
              ) : apmcRate ? (
                <p className="text-lg font-bold text-blue-600">
                  ₹{apmcRate.toFixed(2)}/kg
                </p>
              ) : (
                <p className="text-xs text-blue-600">{t('rateNotAvailable')}</p>
              )}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="quantity">{t('quantity')} (kg)</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            step="0.01"
            value={formData.quantity_kg || ''}
            onChange={(e) => setFormData({ ...formData, quantity_kg: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>

        {/* Price */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="price">{t('pricePerKg')} (₹)</Label>
          <Input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.price_per_kg || ''}
            onChange={(e) => setFormData({ ...formData, price_per_kg: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>

        {/* Health Grade */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="grade">{t('healthGrade')}</Label>
          <select
            id="grade"
            value={formData.health_grade}
            onChange={(e) => setFormData({ ...formData, health_grade: e.target.value as 'A' | 'B' | 'C' })}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="A">{t('gradeA')} - {t('gradeADesc')}</option>
            <option value="B">{t('gradeB')} - {t('gradeBDesc')}</option>
            <option value="C">{t('gradeC')} - {t('gradeCDesc')}</option>
          </select>
        </div>

        {/* Photo Upload */}
        <div className="space-y-2 mb-4">
          <Label>{t('producePhoto')} ({t('optional')})</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handlePhotoChange(e.target.files[0])}
            className="hidden"
          />
          
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">{t('uploadPhoto')}</span>
              <span className="text-xs text-gray-400">{t('maxSize3MB')}</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-4">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? t('creating') : t('createListing')}
        </Button>
      </Card>
    </form>
  );
}
