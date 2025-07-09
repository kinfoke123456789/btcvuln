
import { useState, useEffect } from 'react';
import { blockchainScanner, ScanOptions } from '@/utils/blockchainScanner';

export const useBlockchainScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    blockchainScanner.onProgress((progress) => {
      setScanProgress(progress);
    });

    const checkScanStatus = () => {
      setIsScanning(blockchainScanner.isCurrentlyScanning());
    };

    const interval = setInterval(checkScanStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const startScan = async (options?: ScanOptions) => {
    try {
      await blockchainScanner.startScan(options);
    } catch (error) {
      console.error('Failed to start scan:', error);
    }
  };

  const stopScan = () => {
    blockchainScanner.stopScan();
  };

  return {
    isScanning,
    scanProgress,
    startScan,
    stopScan
  };
};
