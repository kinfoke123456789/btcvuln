
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Settings, Activity } from 'lucide-react';
import { useBlockchainScanner } from '@/hooks/useBlockchainScanner';

const ScanControls = () => {
  const [startBlock, setStartBlock] = useState('870000');
  const [endBlock, setEndBlock] = useState('870100');
  const [batchSize, setBatchSize] = useState('10');
  
  const { isScanning, scanProgress, startScan, stopScan } = useBlockchainScanner();

  const handleStartScan = () => {
    const options = {
      startBlock: parseInt(startBlock),
      endBlock: parseInt(endBlock),
      batchSize: parseInt(batchSize)
    };
    
    startScan(options);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-orange-400" />
          Blockchain Scanner Controls
          {isScanning && (
            <Badge className="ml-2 bg-green-600 animate-pulse">
              SCANNING
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
              placeholder="870100"
              type="number"
              disabled={isScanning}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Batch Size</label>
            <Input
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              placeholder="10"
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
              Scanning blocks {startBlock} to {endBlock}...
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
              Start Scan
            </Button>
          ) : (
            <Button
              onClick={stopScan}
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
            Advanced
          </Button>
        </div>

        {/* Current Status */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Scanner Status:</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-white">
                {isScanning ? 'Active' : 'Idle'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-slate-400">Block Range:</span>
            <span className="text-slate-200 font-mono">
              {startBlock} → {endBlock}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanControls;
