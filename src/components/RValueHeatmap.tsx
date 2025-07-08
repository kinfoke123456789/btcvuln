
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, RefreshCw, Download } from 'lucide-react';

interface RValueMatch {
  rValue: string;
  transactions: string[];
  addresses: string[];
  riskLevel: 'critical' | 'high';
  discoveredAt: Date;
  potentialLeak: boolean;
}

const RValueHeatmap = () => {
  const [matches, setMatches] = useState<RValueMatch[]>([
    {
      rValue: '0x89abcdef12345678901234567890abcdef123456789',
      transactions: ['bc1qa5w...x7a', '3J98t1...NLy', '1A1zP1...fNa'],
      addresses: ['bc1qa5w...x7a', '1A1zP1...fNa'],
      riskLevel: 'critical',
      discoveredAt: new Date(Date.now() - 1800000),
      potentialLeak: true
    },
    {
      rValue: '0x12345678901234567890abcdef123456789abcdef',
      transactions: ['4f47af...83c7', 'bc1qxy...0wlh'],
      addresses: ['bc1qxy...0wlh'],
      riskLevel: 'high',
      discoveredAt: new Date(Date.now() - 3600000),
      potentialLeak: false
    }
  ]);

  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => (prev + 5) % 100);
      
      // Occasionally add new matches
      if (Math.random() > 0.95) {
        const newMatch: RValueMatch = {
          rValue: `0x${Math.random().toString(16).substr(2, 40)}`,
          transactions: [`tx${Math.random().toString(36).substr(2, 6)}...${Math.random().toString(36).substr(2, 3)}`],
          addresses: [`addr${Math.random().toString(36).substr(2, 6)}...${Math.random().toString(36).substr(2, 3)}`],
          riskLevel: Math.random() > 0.7 ? 'critical' : 'high',
          discoveredAt: new Date(),
          potentialLeak: Math.random() > 0.5
        };
        
        setMatches(prev => [newMatch, ...prev.slice(0, 19)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-400" />
              ECDSA R-Value Reuse Detection
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsScanning(!isScanning)}
                className="text-slate-300 border-slate-600"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Paused'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-400">{matches.filter(m => m.riskLevel === 'critical').length}</div>
                <div className="text-sm text-slate-400">Critical Matches</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-400">{matches.filter(m => m.riskLevel === 'high').length}</div>
                <div className="text-sm text-slate-400">High Risk Matches</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-400">
                  {matches.reduce((acc, m) => acc + m.transactions.length, 0)}
                </div>
                <div className="text-sm text-slate-400">Affected TXs</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-700/30 border-slate-600">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-400">
                  {matches.filter(m => m.potentialLeak).length}
                </div>
                <div className="text-sm text-slate-400">Potential Leaks</div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-400" />
                <span className="text-amber-200 text-sm">
                  Scanning blockchain for ECDSA signature reuse patterns...
                </span>
              </div>
              <div className="text-amber-200 text-sm">{scanProgress}%</div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">R-Value Reuse Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {matches.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Shield className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No R-value reuse detected yet</p>
                  <p className="text-sm mt-2">Monitoring blockchain signatures...</p>
                </div>
              ) : (
                matches.map((match, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${match.riskLevel === 'critical' ? 'bg-red-600' : 'bg-amber-500'} text-white text-xs`}>
                          {match.riskLevel.toUpperCase()}
                        </Badge>
                        {match.potentialLeak && (
                          <Badge variant="destructive" className="text-xs">
                            PRIVATE KEY LEAK
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(match.discoveredAt)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm text-slate-300 mb-1">R-Value:</div>
                      <div className="text-xs font-mono text-slate-200 bg-slate-800 p-2 rounded break-all">
                        {match.rValue}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400 mb-1">Affected Transactions ({match.transactions.length}):</div>
                        <div className="space-y-1">
                          {match.transactions.map((tx, i) => (
                            <div key={i} className="text-slate-200 font-mono text-xs">
                              {tx}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Compromised Addresses ({match.addresses.length}):</div>
                        <div className="space-y-1">
                          {match.addresses.map((addr, i) => (
                            <div key={i} className="text-slate-200 font-mono text-xs">
                              {addr}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {match.potentialLeak && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                        🚨 <strong>Critical Security Alert:</strong> Private key may be mathematically derivable from these signatures
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

export default RValueHeatmap;
