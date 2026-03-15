"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  MapPin, 
  TrendingDown, 
  Filter,
  Search,
  ShoppingCart,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface Listing {
  id: string;
  crop_name: string;
  quantity: number;
  available_quantity: number;
  price_per_kg: number;
  grade: string;
  district: string;
  farmer_name: string;
  farmer_id: string;
  bulk_discount: number | null;
  photo_url: string | null;
  created_at: string;
}

export default function BulkProcurementBrowser() {
  const t = useTranslations('retailer');
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(l => 
        l.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.farmer_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Crop filter
    if (selectedCrop !== "all") {
      filtered = filtered.filter(l => l.crop_name === selectedCrop);
    }

    // Grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter(l => l.grade === selectedGrade);
    }

    // District filter
    if (selectedDistrict !== "all") {
      filtered = filtered.filter(l => l.district === selectedDistrict);
    }

    // Only show bulk quantities (> 50kg)
    filtered = filtered.filter(l => l.available_quantity > 50);

    setFilteredListings(filtered);
  }, [searchQuery, selectedCrop, selectedGrade, selectedDistrict, listings]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('listings')
      //   .select('*, users(name)')
      //   .gte('available_quantity', 50)
      //   .eq('status', 'active')
      //   .order('created_at', { ascending: false });

      // Mock data
      const mockListings: Listing[] = [
        {
          id: '1',
          crop_name: 'Wheat',
          quantity: 5000,
          available_quantity: 5000,
          price_per_kg: 28,
          grade: 'A',
          district: 'Bidar',
          farmer_name: 'Ramesh Kumar',
          farmer_id: 'farmer1',
          bulk_discount: 5,
          photo_url: null,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          crop_name: 'Tomato',
          quantity: 2400,
          available_quantity: 2400,
          price_per_kg: 42,
          grade: 'A',
          district: 'Nashik',
          farmer_name: 'Suresh Patil',
          farmer_id: 'farmer2',
          bulk_discount: 10,
          photo_url: '/products/tomatoes.png',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          crop_name: 'Onion',
          quantity: 8500,
          available_quantity: 8500,
          price_per_kg: 35,
          grade: 'B',
          district: 'Lasalgaon',
          farmer_name: 'Vijay Deshmukh',
          farmer_id: 'farmer3',
          bulk_discount: null,
          photo_url: null,
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          crop_name: 'Potato',
          quantity: 12000,
          available_quantity: 12000,
          price_per_kg: 18,
          grade: 'A',
          district: 'Agra',
          farmer_name: 'Rajesh Singh',
          farmer_id: 'farmer4',
          bulk_discount: 8,
          photo_url: null,
          created_at: new Date().toISOString()
        }
      ];

      setListings(mockListings);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedListing || !purchaseQuantity) return;

    const qty = parseFloat(purchaseQuantity);
    if (qty > selectedListing.available_quantity) {
      alert(`Maximum available: ${selectedListing.available_quantity} kg`);
      return;
    }

    try {
      setLoading(true);

      // TODO: Replace with actual Supabase mutation
      // Create order record
      // const { data, error } = await supabase
      //   .from('orders')
      //   .insert({
      //     buyer_id: currentUserId,
      //     seller_id: selectedListing.farmer_id,
      //     listing_id: selectedListing.id,
      //     quantity: qty,
      //     price_per_kg: selectedListing.price_per_kg,
      //     total_amount: calculateTotal(),
      //     status: 'pending',
      //     created_at: new Date().toISOString()
      //   });

      // Update listing available_quantity
      // await supabase
      //   .from('listings')
      //   .update({
      //     available_quantity: selectedListing.available_quantity - qty
      //   })
      //   .eq('id', selectedListing.id);

      alert('Order placed successfully!');
      setSelectedListing(null);
      setPurchaseQuantity("");
      fetchListings();

    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedListing || !purchaseQuantity) return 0;
    
    const qty = parseFloat(purchaseQuantity);
    let total = qty * selectedListing.price_per_kg;

    // Apply bulk discount if available
    if (selectedListing.bulk_discount) {
      total = total * (1 - selectedListing.bulk_discount / 100);
    }

    return total;
  };

  const getUniqueCrops = () => {
    return Array.from(new Set(listings.map(l => l.crop_name)));
  };

  const getUniqueDistricts = () => {
    return Array.from(new Set(listings.map(l => l.district)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-serif text-primary">{t('bulkProcurement')}</h2>
        <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest mt-1">
          {t('browseStock')}
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 rounded-[2rem] bg-white border-muted">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search by crop or farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 rounded-2xl border-muted"
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">
                {t('filterByCrop')}
              </label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t('allCrops')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allCrops')}</SelectItem>
                  {getUniqueCrops().map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">
                {t('filterByGrade')}
              </label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t('allGrades')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allGrades')}</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground/60 uppercase tracking-widest mb-2 block">
                {t('filterByDistrict')}
              </label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder={t('allDistricts')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allDistricts')}</SelectItem>
                  {getUniqueDistricts().map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Count */}
          {(searchQuery || selectedCrop !== "all" || selectedGrade !== "all" || selectedDistrict !== "all") && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-bold">
                {filteredListings.length} results found
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCrop("all");
                  setSelectedGrade("all");
                  setSelectedDistrict("all");
                }}
                className="ml-auto text-xs"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Listings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <Card
            key={listing.id}
            className="p-6 rounded-[2rem] bg-white border-muted hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setSelectedListing(listing)}
          >
            <div className="space-y-4">
              {/* Image */}
              {listing.photo_url && (
                <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
                  <img 
                    src={listing.photo_url} 
                    alt={listing.crop_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-serif text-primary font-bold">
                    {listing.crop_name}
                  </h3>
                  <Badge variant="outline" className="border-primary/20 text-primary text-xs">
                    Grade {listing.grade}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
                  {listing.farmer_name}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <Package className="w-4 h-4" />
                  <span>{listing.available_quantity.toLocaleString()} kg {t('available')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.district}</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-muted">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-mono font-bold text-primary">
                      ₹{listing.price_per_kg}
                      <span className="text-sm font-sans text-foreground/40 ml-1">{t('perKg')}</span>
                    </p>
                    {listing.bulk_discount && (
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600 font-bold">
                          {listing.bulk_discount}% bulk discount
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary text-background rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedListing(listing);
                    }}
                  >
                    {t('buyNow')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 && !loading && (
        <Card className="p-12 rounded-[3rem] text-center bg-white border-muted">
          <Package className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-primary mb-2">{t('noStockAvailable')}</h3>
          <p className="text-foreground/40 text-sm">{t('tryAdjustingFilters')}</p>
        </Card>
      )}

      {/* Purchase Modal */}
      {selectedListing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedListing(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[3rem] p-8 max-w-md w-full shadow-2xl"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-primary font-bold">
                    {selectedListing.crop_name}
                  </h3>
                  <p className="text-sm text-foreground/60 mt-1">
                    {selectedListing.farmer_name} • {selectedListing.district}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedListing(null)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Details */}
              <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">{t('available')}</span>
                  <span className="font-bold text-primary">
                    {selectedListing.available_quantity.toLocaleString()} kg
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Price per kg</span>
                  <span className="font-bold text-primary">₹{selectedListing.price_per_kg}</span>
                </div>
                {selectedListing.bulk_discount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Bulk Discount</span>
                    <span className="font-bold text-green-600">{selectedListing.bulk_discount}%</span>
                  </div>
                )}
              </div>

              {/* Quantity Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground/80 uppercase tracking-widest">
                  {t('partialQuantity')}
                </label>
                <Input
                  type="number"
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(e.target.value)}
                  placeholder={t('enterQuantity')}
                  className="py-6 rounded-2xl"
                  max={selectedListing.available_quantity}
                  min={1}
                />
                <p className="text-xs text-foreground/40 italic">
                  Maximum: {selectedListing.available_quantity.toLocaleString()} kg
                </p>
              </div>

              {/* Total */}
              {purchaseQuantity && (
                <div className="bg-primary/5 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground/60 uppercase tracking-widest">
                      {t('totalCost')}
                    </span>
                    <span className="text-3xl font-mono font-bold text-primary">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedListing(null)}
                  className="flex-1 rounded-2xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchase}
                  disabled={loading || !purchaseQuantity}
                  className="flex-1 bg-primary text-background rounded-2xl"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('confirmPurchase')}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
