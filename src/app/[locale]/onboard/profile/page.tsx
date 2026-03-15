"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MapPin, User, Loader2, Navigation, CheckCircle2, Map as MapIcon } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/onboard/LocationMap"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-[2rem] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary/20" /></div>
});

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useParams();
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState<{ lat: number, lng: number, address?: string } | null>(null);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const { 
    setName: setStoreName, 
    setState: setStoreState,
    setDistrict: setStoreDistrict,
    setLocation: setStoreLocation, 
    role 
  } = useUserStore();

  const detectLocation = () => {
    setIsDetecting(true);
    setIsAddressConfirmed(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Trigger Nominatim Reverse Geocode
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            setLocation({ 
              lat: latitude, 
              lng: longitude, 
              address: data.display_name || "Detected Location"
            });
            // Auto-fill state/district if available from Nominatim
            if (data.address) {
              if (data.address.state) setState(data.address.state);
              if (data.address.district || data.address.city || data.address.county) {
                setDistrict(data.address.district || data.address.city || data.address.county);
              }
            }
          } catch (e) {
            setLocation({ lat: latitude, lng: longitude, address: "Nashik, Maharashtra" });
          }
          setIsDetecting(false);
        },
        (error) => {
          console.error(error);
          setIsDetecting(false);
          setLocation({ lat: 19.9975, lng: 73.7898, address: "Default: Nashik, Maharashtra" });
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  const handleMapSelect = (lat: number, lng: number, address: string) => {
    setLocation({ lat, lng, address });
    setIsAddressConfirmed(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && location && isAddressConfirmed && state && district) {
      setStoreName(name);
      setStoreState(state);
      setStoreDistrict(district);
      setStoreLocation({ 
        lat: location.lat, 
        lng: location.lng, 
        address: location.address || "" 
      });
      
      if (role === 'consumer') {
        router.push(`/${locale}/onboard/complete`);
      } else {
        router.push(`/${locale}/onboard/verification`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ee] p-6 py-12 flex flex-col justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-secondary font-bold text-xs uppercase tracking-[0.3em] mb-4">Step 3: Identity</p>
        <h1 className="text-4xl font-serif text-primary mb-3">Your Details</h1>
        <p className="text-foreground/50">Tell us who you are and where you are located.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-primary/40 ml-1">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
              <Input
                id="name"
                placeholder="e.g. Ramesh Patel"
                required
                className="pl-14 rounded-3xl border-muted py-8 focus-visible:ring-primary shadow-inner bg-white/50 backdrop-blur-sm transition-all text-lg font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="state" className="text-xs font-bold uppercase tracking-widest text-primary/40 ml-1">
                State
              </Label>
              <Input
                id="state"
                placeholder="Maharashtra"
                required
                className="rounded-3xl border-muted py-8 focus-visible:ring-primary shadow-inner bg-white/50 backdrop-blur-sm transition-all text-lg font-bold"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="district" className="text-xs font-bold uppercase tracking-widest text-primary/40 ml-1">
                District
              </Label>
              <Input
                id="district"
                placeholder="Nashik"
                required
                className="rounded-3xl border-muted py-8 focus-visible:ring-primary shadow-inner bg-white/50 backdrop-blur-sm transition-all text-lg font-bold"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-widest text-primary/40 ml-1">
            Exact Location
          </Label>
          
          <div className="space-y-4">
            <LocationMap onLocationSelect={handleMapSelect} />
            
            <AnimatePresence>
              {location && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className={`p-6 bg-white border border-muted rounded-[2.5rem] shadow-xl transition-all ${isAddressConfirmed ? 'border-green-500/30' : ''}`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-background ${isAddressConfirmed ? 'bg-green-500' : 'bg-primary'}`}>
                      {isAddressConfirmed ? <CheckCircle2 className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest mb-1">Detected Address</p>
                      <p className="text-sm font-serif font-bold text-primary leading-tight">{location.address}</p>
                    </div>
                  </div>

                  {!isAddressConfirmed ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-primary mb-4">Confirm this address?</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          type="button" 
                          onClick={() => setIsAddressConfirmed(true)}
                          className="bg-primary text-background rounded-full font-bold"
                        >
                          Confirm
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => { setLocation(null); detectLocation(); }}
                          className="border-primary text-primary rounded-full font-bold"
                        >
                          Redetect
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                       <span className="text-green-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4" /> Address Verified
                       </span>
                       <button onClick={() => setIsAddressConfirmed(false)} className="text-[10px] text-primary/40 hover:text-primary underline">Change</button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!location && (
              <Button 
                type="button" 
                variant="outline"
                onClick={detectLocation}
                disabled={isDetecting}
                className="w-full rounded-[2rem] py-10 border-muted text-primary/40 font-bold hover:bg-primary/5 hover:text-primary transition-all border-dashed"
              >
                {isDetecting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-primary">Detecting...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Navigation className="w-8 h-8 opacity-20" />
                    <span className="text-xs uppercase tracking-[0.2em]">Detect via GPS / Map</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={!name || !location || !isAddressConfirmed || !state || !district}
            className="w-full py-10 text-xl font-bold rounded-[2.5rem] bg-primary text-background hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {role === 'consumer' ? 'Complete Profile' : 'Continue to Verification'}
          </Button>
        </div>
      </form>
    </div>
  );
}
