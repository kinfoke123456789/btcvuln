
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Search, TrendingUp, Clock, MapPin, Loader2, Plus } from 'lucide-react';
import { useTrackedAddresses, useAddTrackedAddress } from '@/hooks/useTrackedAddresses';
import { toast } from 'sonner';

const AddressTracker = () => {
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  
  const { data: addresses = [], isLoading, error } = useTrackedAddresses();
  const addAddressMutation = useAddTrackedAddress();

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'bg-red-600';
    if (risk >= 60) return 'bg-amber-500';
    if (risk >= 40) return 'bg-blue-500';
    return 'bg-green-600';
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return 'critical';
    if (risk >= 60) return 'high';
    if (risk >= 40) return 'medium';
    return 'low';
  };

  const addAddress = async () => {
    if (!newAddress.trim()) {
      toast.error('Please enter a Bitcoin address');
      return;
    }
    
    try {
      await addAddressMutation.mutateAsync({ 
        address: newAddress.trim(), 
        label: newLabel.trim() 
      });
      
      setNewAddress('');
      setNewLabel('');
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (error) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6 text-center text-red-400">
          <p>Error loading tracked addresses</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Address Tracker & Reuse Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Enter Bitcoin address to track..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Label (optional)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button 
                onClick={addAddress}
                disabled={addAddressMutation.isPending}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                {addAddressMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Tracked Addresses ({addresses.length})
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-400">Live monitoring</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-slate-400">
                  <Loader2 className="mx-auto h-12 w-12 mb-4 animate-spin" />
                  <p>Loading tracked addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Eye className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No addresses tracked yet</p>
                  <p className="text-sm mt-2">Add Bitcoin addresses above to start monitoring</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-white font-medium">Bitcoin Address</h4>
                          <Badge className={`${getRiskColor(addr.risk_score)} text-white text-xs`}>
                            {getRiskLevel(addr.risk_score).toUpperCase()}
                          </Badge>
                          {!addr.is_flagged && (
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-slate-300 font-mono break-all">
                          {addr.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-400">
                          {addr.balance.toFixed(4)} BTC
                        </div>
                        <div className="text-xs text-slate-400 flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTimeAgo(addr.last_seen)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Transactions:</span>
                        <div className="text-white font-medium">{addr.transaction_count.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Risk Score:</span>
                        <div className="text-white font-medium flex items-center">
                          {addr.risk_score}%
                          {addr.risk_score > 70 && (
                            <TrendingUp className="ml-1 h-3 w-3 text-red-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <div className="text-white font-medium">
                          {addr.is_flagged ? 'Flagged' : 'Clean'}
                        </div>
                      </div>
                    </div>
                    
                    {addr.is_flagged && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                        ⚠️ Address flagged for suspicious activity
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressTracker;
