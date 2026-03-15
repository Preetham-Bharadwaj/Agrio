'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Search, Filter, MapPin } from 'lucide-react';

interface ProduceBrowserProps {
  onAddToCart: (listingId: string, quantity: number) => void;
}

interface ProduceListing {
  id: string;
  crop: string;
  quantity_kg: number;
  min_price: number;
  health_grade: string;
  photo_url: string | null;
  status: string;
  farmer_id: string;
  created_at: string;
  farmer?: {
    name: string;
    district: string;
    state: string;
    account_type: string;
  };
}

export function ProduceBrowser({ onAddToCart }: ProduceBrowserProps) {
  const t = useTranslations('consumer');
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchQuery, selectedGrade, selectedType, listings]);

  const fetchListings = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('listings')
        .select(`
          *,
          farmer:users!farmer_id (
            name,
            district,
            state,
            account_type
          )
        `)
        .in('status', ['pending', 'pooled'])
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setListings(data || []);
      setFilteredListings(data || []);
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((listing) =>
        listing.crop.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Grade filter
    if (selectedGrade !== 'all') {
      filtered = filtered.filter((listing) => listing.health_grade === selectedGrade);
    }

    // Type filter (farmer/retailer)
    if (selectedType !== 'all') {
      filtered = filtered.filter(
        (listing) => listing.farmer?.account_type === selectedType
      );
    }

    setFilteredListings(filtered);
  };

  const handleAddToCart = (listingId: string) => {
    const quantity = quantities[listingId] || 1;
    onAddToCart(listingId, quantity);
    setQuantities({ ...quantities, [listingId]: 1 });
  };

  const getGradeBadge = (grade: string) => {
    const colors = {
      A: 'bg-green-100 text-green-700 border-green-200',
      B: 'bg-blue-100 text-blue-700 border-blue-200',
      C: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[grade as keyof typeof colors] || 'bg-gray-100 text-gray-700';
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
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder={t('searchProduce')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            {t('all')}
          </Button>
          <Button
            variant={selectedType === 'farmer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('farmer')}
          >
            🌾 {t('farmers')}
          </Button>
          <Button
            variant={selectedType === 'retailer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('retailer')}
          >
            🏪 {t('retailers')}
          </Button>
        </div>

        <div className="flex gap-2">
          {['all', 'A', 'B', 'C'].map((grade) => (
            <Button
              key={grade}
              variant={selectedGrade === grade ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedGrade(grade)}
            >
              {grade === 'all' ? t('allGrades') : `Grade ${grade}`}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredListings.length} {t('productsFound')}
      </p>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">{t('noProductsFound')}</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="p-4">
              <div className="flex gap-4">
                {listing.photo_url ? (
                  <img
                    src={listing.photo_url}
                    alt={listing.crop}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                    🌾
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{listing.crop}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {listing.farmer?.district}, {listing.farmer?.state}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getGradeBadge(listing.health_grade)}
                    >
                      {listing.health_grade}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">
                      {listing.farmer?.account_type === 'farmer' ? '🌾 Farmer' : '🏪 Retailer'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {listing.quantity_kg} kg {t('available')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ₹{listing.min_price}
                      </p>
                      <p className="text-xs text-muted-foreground">{t('perKg')}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={listing.quantity_kg}
                        value={quantities[listing.id] || 1}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [listing.id]: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-20"
                      />
                      <Button
                        onClick={() => handleAddToCart(listing.id)}
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {t('add')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
