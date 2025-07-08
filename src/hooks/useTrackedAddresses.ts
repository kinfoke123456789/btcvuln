
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TrackedAddress {
  id: string;
  address: string;
  first_seen: string;
  last_seen: string;
  transaction_count: number;
  total_received: number;
  total_sent: number;
  balance: number;
  risk_score: number;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
}

export const useTrackedAddresses = () => {
  return useQuery({
    queryKey: ['tracked-addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracked_addresses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tracked addresses:', error);
        throw error;
      }
      
      return data as TrackedAddress[];
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useAddTrackedAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ address, label }: { address: string; label?: string }) => {
      // Generate some realistic mock data for the new address
      const mockData = {
        address,
        balance: Math.random() * 100,
        transaction_count: Math.floor(Math.random() * 1000),
        total_received: Math.random() * 500,
        total_sent: Math.random() * 400,
        risk_score: Math.floor(Math.random() * 100),
        is_flagged: Math.random() > 0.7,
      };

      const { data, error } = await supabase
        .from('tracked_addresses')
        .insert([mockData])
        .select()
        .single();

      if (error) {
        console.error('Error adding tracked address:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracked-addresses'] });
    },
  });
};
