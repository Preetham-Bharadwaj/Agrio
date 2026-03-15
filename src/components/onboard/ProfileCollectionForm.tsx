'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isPrototypeMode } from '@/lib/prototype';
import { useLocation } from '@/hooks/useLocation';
import { MapPin, Search, Edit3, Check, Loader2 } from 'lucide-react';

interface ProfileCollectionFormProps {
  userId: string;
  onProfileComplete: () => void;
}

interface LocationData {
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface ProfileData {
  name: string;
  location: LocationData | null;
}

export function ProfileCollectionForm({ userId, onProfileComplete }: ProfileCollectionFormProps) {
  const t = useTranslations('onboard');
  const [step, setStep] = useState<'location' | 'details'>('location');
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    location: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { location, loading: locationLoading, error: locationError, detectLocation, searchAddress, updateLocation } = useLocation();

  // Handle GPS detection
  const handleDetectLocation = async () => {
    await detectLocation();
  };

  // Handle edit mode
  const handleEditAddress = () => {
    setEditMode(true);
  };

  // Save edited address
  const handleSaveAddress = () => {
    if (profile.location) {
      updateLocation(profile.location);
      setEditMode(false);
    }
  };

  // Update location field in edit mode
  const updateLocationField = (field: keyof LocationData, value: string) => {
    if (profile.location) {
      const updatedLocation = { ...profile.location, [field]: value };
      setProfile({ ...profile, location: updatedLocation });
    }
  };

  // Continue to details step
  const handleContinueToDetails = () => {
    if (location) {
      setStep('details');
    }
  };

  // Validate and submit profile
  const validateProfile = (): boolean => {
    if (profile.name.length < 2) {
      setError('Please enter your full name');
      return false;
    }
    if (!profile.location) {
      setError('Please provide your location');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateProfile()) {
      return;
    }

    setLoading(true);

    try {
      if (isPrototypeMode) {
        onProfileComplete();
        return;
      }

      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: profile.name,
          state: profile.location!.state,
          district: profile.location!.district,
        })
        .eq('id', userId);

      if (updateError) throw updateError;
      onProfileComplete();
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile location when useLocation hook detects location
  useEffect(() => {
    if (location && !profile.location) {
      setProfile({ ...profile, location });
    }
  }, [location]);

  if (step === 'location') {
    return (
      <div className="space-y-6">
        {/* Location Permission Screen */}
        {!location && !locationLoading && !locationError && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary">Detect your location</h3>
              <p className="text-sm text-foreground/60">
                We'll auto-fill your address instantly
              </p>
            </div>

            <Button
              onClick={handleDetectLocation}
              className="w-full bg-primary hover:bg-primary/90 text-background rounded-full py-6"
              size="lg"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Use My Location
            </Button>
          </div>
        )}

        {/* Loading State */}
        {locationLoading && (
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-foreground/60">Detecting your location...</p>
          </div>
        )}

        {/* Error State */}
        {locationError && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center">
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-red-600">{locationError}</p>
            <Button
              onClick={handleDetectLocation}
              variant="outline"
              className="rounded-full"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Location Found */}
        {location && !editMode && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Location Found ✓</span>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-green-800">🟢 Auto-detected</span>
                <Button
                  onClick={handleEditAddress}
                  variant="ghost"
                  size="sm"
                  className="text-green-700 hover:text-green-800"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit Address
                </Button>
              </div>
              
              <div className="space-y-1 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-600">Street:</span>
                  <span className="font-medium">{location.street || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-600">City:</span>
                  <span className="font-medium">{location.city || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-600">District:</span>
                  <span className="font-medium">{location.district || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-600">State:</span>
                  <span className="font-medium">{location.state || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-600">Pincode:</span>
                  <span className="font-medium">{location.pincode || 'N/A'}</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-green-800">Is this address correct?</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleContinueToDetails}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full"
                    size="sm"
                  >
                    ✓ Yes, Correct
                  </Button>
                  <Button
                    onClick={handleDetectLocation}
                    variant="outline"
                    className="rounded-full border-green-600 text-green-600 hover:bg-green-50"
                    size="sm"
                  >
                    🔄 Redetect
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {location && editMode && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Edit3 className="w-5 h-5" />
              <span className="font-medium">Edit Your Address</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Street / Area</Label>
                <Input
                  value={location.street}
                  onChange={(e) => updateLocationField('street', e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={location.city}
                  onChange={(e) => updateLocationField('city', e.target.value)}
                  placeholder="City"
                />
              </div>

              <div className="space-y-2">
                <Label>District</Label>
                <Input
                  value={location.district}
                  onChange={(e) => updateLocationField('district', e.target.value)}
                  placeholder="District"
                />
              </div>

              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={location.state}
                  onChange={(e) => updateLocationField('state', e.target.value)}
                  placeholder="State"
                />
              </div>

              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  value={location.pincode}
                  onChange={(e) => updateLocationField('pincode', e.target.value)}
                  placeholder="Pincode"
                />
              </div>
            </div>

            <Button
              onClick={handleSaveAddress}
              className="w-full bg-primary hover:bg-primary/90 text-background rounded-full"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Address ✓
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Details Step
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your full name"
            disabled={loading}
            required
          />
        </div>

        {/* Show selected location */}
        {profile.location && (
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Your Location</span>
            </div>
            <p className="text-sm text-foreground/60">
              {profile.location.street && `${profile.location.street}, `}
              {profile.location.city && `${profile.location.city}, `}
              {profile.location.district && `${profile.location.district}, `}
              {profile.location.state && `${profile.location.state}`}
              {profile.location.pincode && ` - ${profile.location.pincode}`}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-background rounded-full py-6"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Continue →'
        )}
      </Button>
    </form>
  );
}
