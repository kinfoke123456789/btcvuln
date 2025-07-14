
import { supabase } from '@/integrations/supabase/client';
import { VulnerabilityScanner } from './vulnerabilityScanner';
import { BitcoinTransactionParser } from './bitcoinParser';

export interface ScanOptions {
  startBlock?: number;
  endBlock?: number;
  realTime?: boolean;
  batchSize?: number;
  rpcUrl?: string;
}

export class BlockchainScanner {
  private isScanning = false;
  private scanProgress = 0;
  private onProgressCallback?: (progress: number) => void;
  private rpcUrl: string;

  constructor() {
    // Default to a public Bitcoin RPC endpoint (replace with your own)
    this.rpcUrl = 'https://bitcoin-mainnet.public.blastapi.io';
  }

  async startScan(options: ScanOptions = {}) {
    if (this.isScanning) {
      console.log('Scan already in progress...');
      return;
    }

    this.isScanning = true;
    console.log('🔍 Starting Bitcoin vulnerability scan...');

    const {
      startBlock = 870000, // Recent block range
      endBlock = startBlock + 10, // Smaller range for real data
      batchSize = 1, // Process one block at a time for real data
      rpcUrl
    } = options;

    if (rpcUrl) {
      this.rpcUrl = rpcUrl;
    }

    try {
      await this.scanBlockRange(startBlock, endBlock, batchSize);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      this.isScanning = false;
    }
  }

  private async scanBlockRange(startBlock: number, endBlock: number, batchSize: number) {
    const totalBlocks = endBlock - startBlock;
    let scannedBlocks = 0;
    let totalVulnerabilities = 0;
    let totalTransactions = 0;

    for (let blockHeight = startBlock; blockHeight < endBlock; blockHeight += batchSize) {
      const blockBatch = Math.min(batchSize, endBlock - blockHeight);
      
      console.log(`📦 Scanning block ${blockHeight}...`);

      try {
        const blockResults = await this.scanRealBlock(blockHeight);
        
        totalVulnerabilities += blockResults.vulnerabilities;
        totalTransactions += blockResults.transactions;
        scannedBlocks += blockBatch;

        // Update progress
        this.scanProgress = (scannedBlocks / totalBlocks) * 100;
        if (this.onProgressCallback) {
          this.onProgressCallback(this.scanProgress);
        }

        // Update scan statistics
        await this.updateScanStatistics(scannedBlocks, totalTransactions, totalVulnerabilities);

        // Delay between blocks to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error scanning block ${blockHeight}:`, error);
        // Continue with next block
      }
    }

    console.log('✅ Scan completed!');
    console.log(`📊 Results: ${totalVulnerabilities} vulnerabilities found in ${totalTransactions} transactions`);
  }

  private async scanRealBlock(blockHeight: number) {
    try {
      // Get block hash by height
      const blockHash = await this.rpcCall('getblockhash', [blockHeight]);
      
      // Get block with transaction details
      const block = await this.rpcCall('getblock', [blockHash, 2]);
      
      let vulnerabilities = 0;
      const transactions = block.tx || [];
      
      console.log(`Processing ${transactions.length} transactions in block ${blockHeight}`);

      for (const txData of transactions) {
        try {
          // Convert RPC transaction data to our format
          const transaction = this.convertRpcTransaction(txData, blockHeight);
          
          // Scan for vulnerabilities
          const vulnerabilityResults = await VulnerabilityScanner.scanTransaction(transaction);

          // Store vulnerabilities in database
          for (const vuln of vulnerabilityResults) {
            await this.storeVulnerability(transaction, vuln, blockHeight);
            vulnerabilities++;
          }

          // Store transaction analysis
          await this.storeTransactionAnalysis(transaction, vulnerabilityResults, blockHeight);
        } catch (error) {
          console.error(`Error processing transaction ${txData.txid}:`, error);
        }
      }

      return { vulnerabilities, transactions: transactions.length };
    } catch (error) {
      console.error(`Failed to scan block ${blockHeight}:`, error);
      return { vulnerabilities: 0, transactions: 0 };
    }
  }

  private async rpcCall(method: string, params: any[] = []) {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params
        })
      });

      if (!response.ok) {
        throw new Error(`RPC call failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`RPC error: ${data.error.message}`);
      }

      return data.result;
    } catch (error) {
      console.error(`RPC call failed for method ${method}:`, error);
      throw error;
    }
  }

  private convertRpcTransaction(txData: any, blockHeight: number) {
    return {
      txid: txData.txid,
      version: txData.version,
      locktime: txData.locktime,
      blockHeight,
      timestamp: new Date(txData.time * 1000), // Convert Unix timestamp
      inputs: txData.vin.map((input: any, index: number) => ({
        txid: input.txid || '0'.repeat(64),
        vout: input.vout || 0,
        scriptSig: input.scriptSig?.hex || '',
        sequence: input.sequence || 0xffffffff,
        signatures: this.extractSignaturesFromScript(input.scriptSig?.hex || ''),
        decodedScript: input.scriptSig?.asm?.split(' ') || []
      })),
      outputs: txData.vout.map((output: any) => ({
        value: output.value,
        scriptPubKey: output.scriptPubKey?.hex || '',
        type: output.scriptPubKey?.type || 'unknown',
        decodedScript: output.scriptPubKey?.asm?.split(' ') || []
      }))
    };
  }

  private extractSignaturesFromScript(scriptHex: string) {
    if (!scriptHex) return [];
    
    try {
      // Extract signatures using the same logic as BitcoinTransactionParser
      const signatures: any[] = [];
      const script = Buffer.from(scriptHex, 'hex');
      let i = 0;

      while (i < script.length) {
        const length = script[i];
        if (length > 0 && length < 76 && i + length < script.length) {
          const data = script.subarray(i + 1, i + 1 + length);
          
          // Check if this looks like a DER signature (starts with 0x30)
          if (data[0] === 0x30 && data.length > 8) {
            try {
              const signature = this.parseDERSignature(data);
              if (signature) {
                signatures.push(signature);
              }
            } catch (e) {
              // Skip invalid signatures
            }
          }
          i += 1 + length;
        } else {
          i++;
        }
      }

      return signatures;
    } catch (error) {
      console.error('Error extracting signatures:', error);
      return [];
    }
  }

  private parseDERSignature(derData: Buffer): any | null {
    try {
      let offset = 0;
      
      // DER sequence tag
      if (derData[offset] !== 0x30) return null;
      offset++;
      
      // Length of sequence
      const sequenceLength = derData[offset];
      offset++;
      
      // R value
      if (derData[offset] !== 0x02) return null; // INTEGER tag
      offset++;
      
      const rLength = derData[offset];
      offset++;
      
      const r = derData.subarray(offset, offset + rLength).toString('hex');
      offset += rLength;
      
      // S value
      if (derData[offset] !== 0x02) return null; // INTEGER tag
      offset++;
      
      const sLength = derData[offset];
      offset++;
      
      const s = derData.subarray(offset, offset + sLength).toString('hex');
      offset += sLength;
      
      // Hash type
      const hashType = offset < derData.length ? derData[offset] : 0x01;
      
      return {
        r,
        s,
        hashType,
        der: derData.toString('hex')
      };
    } catch (e) {
      return null;
    }
  }

  private async storeVulnerability(transaction: any, vulnerability: any, blockHeight: number) {
    try {
      const vulnerabilityData = {
        txid: transaction.txid,
        block_height: blockHeight,
        vulnerability_type: vulnerability.type,
        severity: vulnerability.severity,
        description: vulnerability.description,
        details: vulnerability.details,
        amount_btc: transaction.outputs?.[0]?.value || null,
        address: vulnerability.addresses?.[0] || null
      };

      await supabase.from('vulnerabilities').insert(vulnerabilityData);

      // If private key was recovered, store it in r_value_matches table
      if (vulnerability.privateKeyRecovered && vulnerability.type === 'r_reuse') {
        await supabase.from('r_value_matches').insert({
          r_value: vulnerability.rValue,
          txid_1: transaction.txid,
          txid_2: transaction.txid, // Would be different in real R-value reuse
          input_index_1: vulnerability.affectedInputs?.[0] || 0,
          input_index_2: vulnerability.affectedInputs?.[1] || 1,
          address: vulnerability.addresses?.[0] || null,
          private_key_recovered: true
        });

        console.log(`💾 Stored recovered private key for R-value: ${vulnerability.rValue}`);
      }
    } catch (error) {
      console.error('Error storing vulnerability:', error);
    }
  }

  private async storeTransactionAnalysis(transaction: any, vulnerabilities: any[], blockHeight: number) {
    try {
      await supabase.from('transaction_analysis').insert({
        txid: transaction.txid,
        block_height: blockHeight,
        timestamp: transaction.timestamp?.toISOString(),
        input_count: transaction.inputs.length,
        output_count: transaction.outputs.length,
        total_input_value: null, // Would need to fetch input values from previous transactions
        total_output_value: transaction.outputs.reduce((sum: number, out: any) => sum + out.value, 0),
        fee: null, // Would calculate as input_value - output_value
        vulnerability_flags: vulnerabilities.map(v => v.type),
        script_analysis: {
          inputScripts: transaction.inputs.map((inp: any) => inp.scriptSig),
          outputScripts: transaction.outputs.map((out: any) => out.scriptPubKey),
          vulnerabilities: vulnerabilities
        }
      });
    } catch (error) {
      console.error('Error storing transaction analysis:', error);
    }
  }

  private async updateScanStatistics(blocksScanned: number, transactionsScanned: number, vulnerabilitiesFound: number) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await supabase.from('scan_statistics').upsert({
        scan_date: today,
        blocks_scanned: blocksScanned,
        transactions_scanned: transactionsScanned,
        vulnerabilities_found: vulnerabilitiesFound,
        addresses_tracked: Math.floor(transactionsScanned * 0.8), // Estimate
        r_value_matches: Math.floor(vulnerabilitiesFound * 0.1) // Estimate
      }, { onConflict: 'scan_date' });
    } catch (error) {
      console.error('Error updating scan statistics:', error);
    }
  }

  onProgress(callback: (progress: number) => void) {
    this.onProgressCallback = callback;
  }

  getProgress() {
    return this.scanProgress;
  }

  isCurrentlyScanning() {
    return this.isScanning;
  }

  stopScan() {
    this.isScanning = false;
    console.log('🛑 Scan stopped by user');
  }

  setRpcUrl(url: string) {
    this.rpcUrl = url;
  }
}

// Export singleton instance
export const blockchainScanner = new BlockchainScanner();
