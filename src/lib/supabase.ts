// Mock Supabase client for development without real Supabase
import { createClient } from '@supabase/supabase-js';

// Mock environment variables for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// Check if we have real Supabase credentials
const hasRealSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mock database for development
const mockUsers = new Map();

// Create mock Supabase client
export const supabase = hasRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

function createMockSupabaseClient() {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: string) => ({
          single: () => Promise.resolve({
            data: mockUsers.get(value) || null,
            error: mockUsers.has(value) ? null : { code: 'PGRST116', message: 'No rows found' }
          })
        }),
        insert: (data: any) => ({
          select: () => ({
            single: () => {
              mockUsers.set(data.id, data);
              return Promise.resolve({ data, error: null });
            }
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: string) => ({
            single: () => {
              if (mockUsers.has(value)) {
                const updatedUser = { ...mockUsers.get(value), ...data };
                mockUsers.set(value, updatedUser);
                return Promise.resolve({ data: updatedUser, error: null });
              }
              return Promise.resolve({ data: null, error: { message: 'User not found' } });
            }
          })
        })
      })
    })
  };
}

// Helper function to create mock users for testing
export function createMockUser(userData: any) {
  mockUsers.set(userData.id, userData);
}

// Export mock database for testing
export { mockUsers };
