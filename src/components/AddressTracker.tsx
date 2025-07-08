
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Search, TrendingUp, Clock, MapPin } from 'lucide-react';

interface TrackedAddress {
  address: string;
  label: string;
  balance: number;
  txCount: number;
  reuseCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: Date;
  isActive: boolean;
}

const AddressTracker = () => {
  const [addresses, setAddresses] = useState<TrackedAddress[]>([
    {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      label: 'Genesis Block Address',
      balance: 50.0,
      txCount: 1847,
      reuseCount: 15,
      riskLevel: 'high',
      lastActivity: new Date(Date.now() - 3600000),
      isActive: true
    },
    {
      address: 'bc1qa5wkgaew2dkv56kfvj5x7epdj4zyrhfx5x7a',
      label: 'High-Value Wallet',
      balance: 127.5,
      txCount: 234,
      reuseCount: 8,
      riskLevel: 'medium',
      lastActivity: new Date(Date.now() - 7200000),
      isActive: false
    },
    {
      address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      label: 'Exchange Hot Wallet',
      balance: 2543.2,
      txCount: 50000,
      reuseCount: 120,
      riskLevel: 'critical',
      lastActivity: new Date(Date.now() - 300000),
      isActive: true
    }
  ]);
  
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const addAddress = () => {
    if (!newAddress) return;
    
    const newTrackedAddress: TrackedAddress = {
      address: newAddress,
      label: newLabel || 'Unlabeled Address',
      balance: Math.random() * 100,
      txCount: Math.floor(Math.random() * 1000),
      reuseCount: Math.floor(Math.random() * 50),
      riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
      lastActivity: new Date(),
      isActive: Math.random() > 0.5
    };
    
    setAddresses(prev => [...prev, newTrackedAddress]);
    setNewAddress('');
    setNewLabel('');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

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
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Eye className="h-4 w-4" />
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
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-white font-medium">{addr.label}</h4>
                        <Badge className={`${getRiskColor(addr.riskLevel)} text-white text-xs`}>
                          {addr.riskLevel.toUpperCase()}
                        </Badge>
                        {addr.isActive && (
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
                        {formatTimeAgo(addr.lastActivity)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Transactions:</span>
                      <div className="text-white font-medium">{addr.txCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Reuse Count:</span>
                      <div className="text-white font-medium flex items-center">
                        {addr.reuseCount}
                        {addr.reuseCount > 10 && (
                          <TrendingUp className="ml-1 h-3 w-3 text-red-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Privacy Score:</span>
                      <div className="text-white font-medium">
                        {addr.reuseCount < 5 ? 'Good' : addr.reuseCount < 15 ? 'Fair' : 'Poor'}
                      </div>
                    </div>
                  </div>
                  
                  {addr.reuseCount > 10 && (
                    <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-300">
                      ⚠️ High address reuse detected - Privacy compromised
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressTracker;
