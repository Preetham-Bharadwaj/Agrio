import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'farmer' | 'retailer' | 'consumer';

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  state: string;
  district: string;
  language: string;
  account_type: UserRole;
  document_url: string | null;
  verified: boolean;
  credit_score: number;
  fpo_id: string | null;
  created_at: string;
}

interface UserState {
  // User profile data
  userId: string | null;
  role: UserRole | null;
  mobile: string | null;
  name: string | null;
  state: string | null;
  district: string | null;
  language: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | null;
  documentUrl: string | null;
  creditScore: number;
  fpoId: string | null;
  
  // Loading states
  isLoading: boolean;
  isHydrated: boolean;
  
  // Actions
  setUserId: (userId: string) => void;
  setRole: (role: UserRole) => void;
  setMobile: (mobile: string) => void;
  setName: (name: string) => void;
  setState: (state: string) => void;
  setDistrict: (district: string) => void;
  setLanguage: (language: string) => void;
  setLocation: (location: { lat: number; lng: number; address: string }) => void;
  setVerified: (status: boolean) => void;
  setVerificationStatus: (status: 'pending' | 'verified' | 'rejected') => void;
  setDocumentUrl: (url: string) => void;
  
  // Profile management
  fetchUserProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setHydrated: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: null,
      role: null,
      mobile: null,
      name: null,
      state: null,
      district: null,
      language: 'en',
      location: null,
      isVerified: false,
      verificationStatus: null,
      documentUrl: null,
      creditScore: 400,
      fpoId: null,
      isLoading: false,
      isHydrated: false,
      
      // Simple setters
      setUserId: (userId) => set({ userId }),
      setRole: (role) => set({ role }),
      setMobile: (mobile) => set({ mobile }),
      setName: (name) => set({ name }),
      setState: (state) => set({ state }),
      setDistrict: (district) => set({ district }),
      setLanguage: (language) => set({ language }),
      setLocation: (location) => set({ location }),
      setVerified: (status) => set({ isVerified: status }),
      setVerificationStatus: (status) => set({ verificationStatus: status }),
      setDocumentUrl: (url) => set({ documentUrl: url }),
      setHydrated: () => set({ isHydrated: true }),
      
      // Fetch user profile from Supabase (no-op in prototype)
      fetchUserProfile: async (userId: string) => {
        const { isPrototypeMode, PROTOTYPE_USER_ID } = await import('@/lib/prototype');
        if (isPrototypeMode && userId === PROTOTYPE_USER_ID) {
          return;
        }
        set({ isLoading: true });
        try {
          const { default: supabase } = await import('@/lib/supabase');
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
          if (error) throw error;
          if (data) {
            set({
              userId: data.id,
              role: data.account_type as UserRole,
              mobile: data.mobile,
              name: data.name,
              state: data.state,
              district: data.district,
              language: data.language || 'en',
              isVerified: data.verified,
              verificationStatus: data.verified ? 'verified' : 'pending',
              documentUrl: data.document_url,
              creditScore: data.credit_score || 400,
              fpoId: data.fpo_id,
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Update user profile in Supabase (no-op in prototype, only update local state)
      updateProfile: async (updates: Partial<UserProfile>) => {
        const { userId } = get();
        if (!userId) return;
        const { isPrototypeMode, PROTOTYPE_USER_ID } = await import('@/lib/prototype');
        if (isPrototypeMode && userId === PROTOTYPE_USER_ID) {
          set({
            ...updates,
            role: (updates.account_type as UserRole) || get().role,
            isVerified: updates.verified ?? get().isVerified,
          });
          return;
        }
        set({ isLoading: true });
        try {
          const { default: supabase } = await import('@/lib/supabase');
          const { error } = await supabase.from('users').update(updates).eq('id', userId);
          if (error) throw error;
          set({
            ...updates,
            role: updates.account_type as UserRole || get().role,
            isVerified: updates.verified ?? get().isVerified,
          });
        } catch (error) {
          console.error('Error updating user profile:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Reset store
      reset: () => set({
        userId: null,
        role: null,
        mobile: null,
        name: null,
        state: null,
        district: null,
        language: 'en',
        location: null,
        isVerified: false,
        verificationStatus: null,
        documentUrl: null,
        creditScore: 400,
        fpoId: null,
        isLoading: false,
      }),
    }),
    {
      name: 'agrio-user-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
