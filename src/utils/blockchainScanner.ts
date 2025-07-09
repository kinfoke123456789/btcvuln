
import { supabase } from '@/integrations/supabase/client';
import { VulnerabilityScanner } from './vulnerabilityScanner';
import { BitcoinTransactionParser } from './bitcoinParser';

export interface ScanOptions {
  startBlock?: number;
  endBlock?: number;
  realTime?: boolean;
  batchSize?: number;
}

export class BlockchainScanner {
  private isScanning = false;
  private scanProgress = 0;
  private onProgressCallback?: (progress: number) => void;

  async startScan(options: ScanOptions = {}) {
    if (this.isScanning) {
      console.log('Scan already in progress...');
      return;
    }

    this.isScanning = true;
    console.log('🔍 Starting Bitcoin vulnerability scan...');

    const {
      startBlock = 870000, // Recent block range
      endBlock = startBlock + 100,
      batchSize = 10
    } = options;

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
      
      console.log(`📦 Scanning blocks ${blockHeight} to ${blockHeight + blockBatch - 1}...`);

      // Simulate block scanning with mock data for now
      const blockResults = await this.scanBlockBatch(blockHeight, blockBatch);
      
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

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ Scan completed!');
    console.log(`📊 Results: ${totalVulnerabilities} vulnerabilities found in ${totalTransactions} transactions`);
  }

  private async scanBlockBatch(startBlock: number, batchSize: number) {
    let vulnerabilities = 0;
    let transactions = 0;

    // Simulate scanning multiple blocks
    for (let i = 0; i < batchSize; i++) {
      const blockHeight = startBlock + i;
      const blockResults = await this.scanSingleBlock(blockHeight);
      vulnerabilities += blockResults.vulnerabilities;
      transactions += blockResults.transactions;
    }

    return { vulnerabilities, transactions };
  }

  private async scanSingleBlock(blockHeight: number) {
    // Generate mock transaction data for demonstration
    const txCount = Math.floor(Math.random() * 50) + 10; // 10-60 transactions per block
    let vulnerabilities = 0;

    for (let i = 0; i < txCount; i++) {
      const mockTransaction = this.generateMockTransaction(blockHeight, i);
      const vulnerabilityResults = await VulnerabilityScanner.scanTransaction(mockTransaction);

      // Store vulnerabilities in database
      for (const vuln of vulnerabilityResults) {
        await this.storeVulnerability(mockTransaction, vuln, blockHeight);
        vulnerabilities++;
      }

      // Store transaction analysis
      await this.storeTransactionAnalysis(mockTransaction, vulnerabilityResults, blockHeight);
    }

    return { vulnerabilities, transactions: txCount };
  }

  private generateMockTransaction(blockHeight: number, txIndex: number) {
    const txid = `${blockHeight.toString(16).padStart(8, '0')}${txIndex.toString(16).padStart(4, '0')}${'0'.repeat(56)}`;
    
    // Occasionally generate transactions with vulnerabilities for testing
    const hasRReuse = Math.random() < 0.02; // 2% chance
    const hasAddressReuse = Math.random() < 0.15; // 15% chance
    const hasDustAttack = Math.random() < 0.05; // 5% chance

    return {
      txid,
      version: 2,
      locktime: 0,
      blockHeight,
      timestamp: new Date(),
      inputs: this.generateMockInputs(hasRReuse),
      outputs: this.generateMockOutputs(hasAddressReuse, hasDustAttack)
    };
  }

  private generateMockInputs(hasRReuse: boolean) {
    const inputCount = Math.floor(Math.random() * 3) + 1;
    const inputs = [];

    for (let i = 0; i < inputCount; i++) {
      const signatures = hasRReuse && i > 0 ? 
        [{ r: 'duplicate_r_value_12345', s: 'random_s_value', hashType: 1, der: 'mock_der' }] :
        [{ r: `r_value_${Math.random().toString(36).substr(2, 20)}`, s: 'random_s_value', hashType: 1, der: 'mock_der' }];

      inputs.push({
        txid: `input_tx_${i}_${Math.random().toString(36).substr(2, 10)}`,
        vout: 0,
        scriptSig: 'mock_script_sig',
        sequence: 0xffffffff,
        signatures
      });
    }

    return inputs;
  }

  private generateMockOutputs(hasAddressReuse: boolean, hasDustAttack: boolean) {
    const outputCount = hasDustAttack ? Math.floor(Math.random() * 8) + 5 : Math.floor(Math.random() * 3) + 1;
    const outputs = [];

    for (let i = 0; i < outputCount; i++) {
      const value = hasDustAttack && i > 1 ? 
        0.00000300 : // Dust amount
        Math.random() * 10 + 0.001; // Normal amount

      const address = hasAddressReuse && i > 0 ? 
        'reused_address_12345' : 
        `address_${Math.random().toString(36).substr(2, 10)}`;

      outputs.push({
        value,
        scriptPubKey: 'mock_script_pubkey',
        type: 'P2PKH',
        decodedScript: ['OP_DUP', 'OP_HASH160', address, 'OP_EQUALVERIFY', 'OP_CHECKSIG']
      });
    }

    return outputs;
  }

  private async storeVulnerability(transaction: any, vulnerability: any, blockHeight: number) {
    try {
      await supabase.from('vulnerabilities').insert({
        txid: transaction.txid,
        block_height: blockHeight,
        vulnerability_type: vulnerability.type,
        severity: vulnerability.severity,
        description: vulnerability.description,
        details: vulnerability.details,
        amount_btc: transaction.outputs?.[0]?.value || null,
        address: vulnerability.addresses?.[0] || null
      });
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
        total_input_value: null,
        total_output_value: transaction.outputs.reduce((sum: number, out: any) => sum + out.value, 0),
        fee: null,
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
}

// Export singleton instance
export const blockchainScanner = new BlockchainScanner();
