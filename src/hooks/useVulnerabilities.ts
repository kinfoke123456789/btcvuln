
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Vulnerability {
  id: string;
  txid: string;
  vulnerability_type: string;
  severity: string;
  description: string;
  details: string | null;
  amount_btc: number | null;
  address: string | null;
  created_at: string;
  block_height: number | null;
}

export const useVulnerabilities = () => {
  return useQuery({
    queryKey: ['vulnerabilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vulnerabilities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching vulnerabilities:', error);
        throw error;
      }
      
      return data as Vulnerability[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });
};

export const useVulnerabilityStats = () => {
  return useQuery({
    queryKey: ['vulnerability-stats'],
    queryFn: async () => {
      const { data: vulnerabilities, error: vulnError } = await supabase
        .from('vulnerabilities')
        .select('severity');
      
      const { data: addresses, error: addrError } = await supabase
        .from('tracked_addresses')
        .select('id');
        
      const { data: rMatches, error: rError } = await supabase
        .from('r_value_matches')
        .select('id');
        
      const { data: transactions, error: txError } = await supabase
        .from('transaction_analysis')
        .select('id');

      if (vulnError || addrError || rError || txError) {
        throw new Error('Failed to fetch stats');
      }

      const criticalCount = vulnerabilities?.filter(v => v.severity === 'critical').length || 0;
      
      return {
        criticalVulnerabilities: criticalCount,
        addressesMonitored: addresses?.length || 0,
        rValueMatches: rMatches?.length || 0,
        transactionsScanned: transactions?.length || 0,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
