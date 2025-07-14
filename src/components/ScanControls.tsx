
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Settings, Activity, AlertCircle } from 'lucide-react';
import { useBlockchainScanner } from '@/hooks/useBlockchainScanner';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ScanControls = () => {
  const [startBlock, setStartBlock] = useState('870000');
  const [endBlock, setEndBlock] = useState('870010');
  const [batchSize, setBatchSize] = useState('1');
  
  const { isScanning, scanProgress, stopScan } = useBlockchainScanner();
  const { toast } = useToast();

  const handleStartScan = async () => {
    try {
      console.log(`🚀 Starting real Bitcoin blockchain scan from block ${startBlock} to ${endBlock}`);
      
      // Call the edge function to start scanning real Bitcoin data
      const { data, error } = await supabase.functions.invoke('bitcoin-scanner', {
        body: {
          startBlock: parseInt(startBlock),
          endBlock: Math.min(parseInt(startBlock) + 10, parseInt(endBlock)), // Limit to 10 blocks for safety
          batchSize: parseInt(batchSize)
        }
      });

      if (error) {
        console.error('Failed to start scan:', error);
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: error.message || "Failed to start Bitcoin blockchain scan. Check RPC configuration."
        });
        return;
      }

      toast({
        title: "Real Scan Started",
        description: `Bitcoin blockchain scan initiated from block ${startBlock}`,
      });

      console.log('Scan response:', data);
    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start scan. Please check your connection."
      });
    }
  };

  const handleStopScan = () => {
    stopScan();
    toast({
      title: "Scan Stopped",
      description: "Blockchain scanning has been stopped",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-orange-400" />
          Real Bitcoin Blockchain Scanner
          {isScanning && (
            <Badge className="ml-2 bg-green-600 animate-pulse">
              SCANNING LIVE DATA
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bitcoin RPC Configuration Notice */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="text-amber-200 font-medium">Bitcoin RPC Configuration Required</h4>
              <p className="text-amber-200/80 text-sm">
                To scan real Bitcoin data, configure these secrets in Supabase:
              </p>
              <ul className="text-amber-200/70 text-xs space-y-1 ml-4">
                <li>• <code className="bg-amber-500/20 px-1 rounded">BITCOIN_RPC_URL</code> - Your Bitcoin node RPC endpoint</li>
                <li>• <code className="bg-amber-500/20 px-1 rounded">BITCOIN_RPC_USER</code> - RPC username</li>
                <li>• <code className="bg-amber-500/20 px-1 rounded">BITCOIN_RPC_PASSWORD</code> - RPC password</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scan Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Start Block</label>
            <Input
              value={startBlock}
              onChange={(e) => setStartBlock(e.target.value)}
              placeholder="870000"
              type="number"
              disabled={isScanning}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-2 block">End Block</label>
            <Input
              value={endBlock}
              onChange={(e) => setEndBlock(e.target.value)}
              placeholder="870010"
              type="number"
              disabled={isScanning}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400 mt-1">
              Limited to 10 blocks per scan for performance
            </p>
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Batch Size</label>
            <Input
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              placeholder="1"
              type="number"
              disabled={isScanning}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Scan Progress</span>
              <span className="text-white font-medium">{scanProgress.toFixed(1)}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
            <div className="text-xs text-slate-400 text-center">
              Processing real Bitcoin blocks {startBlock} to {endBlock}...
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex space-x-3">
          {!isScanning ? (
            <Button
              onClick={handleStartScan}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Real Bitcoin Scan
            </Button>
          ) : (
            <Button
              onClick={handleStopScan}
              variant="destructive"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Scan
            </Button>
          )}
          
          <Button
            variant="outline"
            disabled={isScanning}
            className="text-slate-300 border-slate-600 hover:bg-slate-700"
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure RPC
          </Button>
        </div>

        {/* Current Status */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Scanner Status:</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-white">
                {isScanning ? 'Processing Real Bitcoin Data' : 'Ready for Real Scan'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-400">Block Range:</span>
            <span className="text-slate-200 font-mono">
              {startBlock} → {Math.min(parseInt(startBlock) + 10, parseInt(endBlock))}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-400">Data Source:</span>
            <span className="text-blue-400 text-xs">
              Live Bitcoin Network (Real RPC)
            </span>
          </div>
        </div>

        {/* Real Data Information */}
        <div className="text-xs text-slate-400 space-y-1">
          <p>• Processes real Bitcoin blockchain transactions</p>
          <p>• Detects actual R-value reuse for private key recovery</p>
          <p>• Requires Bitcoin RPC node access for real data</p>
          <p>• Performance depends on Bitcoin network and RPC response times</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanControls;
