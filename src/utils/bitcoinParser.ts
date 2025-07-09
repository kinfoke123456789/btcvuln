export interface BitcoinTransaction {
  txid: string;
  version: number;
  locktime: number;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  blockHeight?: number;
  blockHash?: string;
  timestamp?: Date;
}

export interface TransactionInput {
  txid: string;
  vout: number;
  scriptSig: string;
  sequence: number;
  witness?: string[];
  decodedScript?: string[];
  signatures?: ECDSASignature[];
}

export interface TransactionOutput {
  value: number;
  scriptPubKey: string;
  decodedScript?: string[];
  type?: string;
}

export interface ECDSASignature {
  r: string;
  s: string;
  hashType: number;
  der: string;
}

export interface VulnerabilityResult {
  type: 'r_reuse' | 'address_reuse' | 'dust_attack' | 'non_standard' | 'op_return_spam';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  details?: string;
  affectedInputs?: number[];
  affectedOutputs?: number[];
  rValue?: string;
  addresses?: string[];
  privateKeyRecovered?: boolean;
  privateKeyHex?: string;
  privateKeyWIF?: string;
}

export class BitcoinTransactionParser {
  static parseRawTransaction(hexData: string): BitcoinTransaction {
    // Basic hex to transaction parsing
    const buffer = Buffer.from(hexData, 'hex');
    let offset = 0;

    // Parse version (4 bytes, little endian)
    const version = buffer.readUInt32LE(offset);
    offset += 4;

    // Parse input count (varint)
    const { value: inputCount, bytesRead: inputCountBytes } = this.readVarInt(buffer, offset);
    offset += inputCountBytes;

    const inputs: TransactionInput[] = [];
    for (let i = 0; i < inputCount; i++) {
      const input = this.parseInput(buffer, offset);
      inputs.push(input.input);
      offset = input.newOffset;
    }

    // Parse output count (varint)
    const { value: outputCount, bytesRead: outputCountBytes } = this.readVarInt(buffer, offset);
    offset += outputCountBytes;

    const outputs: TransactionOutput[] = [];
    for (let i = 0; i < outputCount; i++) {
      const output = this.parseOutput(buffer, offset);
      outputs.push(output.output);
      offset = output.newOffset;
    }

    // Parse locktime (4 bytes, little endian)
    const locktime = buffer.readUInt32LE(offset);

    // Generate transaction ID (double SHA256 of transaction data)
    const txid = this.calculateTxId(hexData);

    return {
      txid,
      version,
      locktime,
      inputs,
      outputs
    };
  }

  private static readVarInt(buffer: Buffer, offset: number): { value: number; bytesRead: number } {
    const firstByte = buffer[offset];
    
    if (firstByte < 0xFD) {
      return { value: firstByte, bytesRead: 1 };
    } else if (firstByte === 0xFD) {
      return { value: buffer.readUInt16LE(offset + 1), bytesRead: 3 };
    } else if (firstByte === 0xFE) {
      return { value: buffer.readUInt32LE(offset + 1), bytesRead: 5 };
    } else {
      // For 0xFF, we'd need to handle 8-byte values, but for most cases 4 bytes is sufficient
      return { value: buffer.readUInt32LE(offset + 1), bytesRead: 5 };
    }
  }

  private static parseInput(buffer: Buffer, offset: number): { input: TransactionInput; newOffset: number } {
    // Previous transaction hash (32 bytes)
    const txid = buffer.subarray(offset, offset + 32).reverse().toString('hex');
    offset += 32;

    // Previous output index (4 bytes, little endian)
    const vout = buffer.readUInt32LE(offset);
    offset += 4;

    // Script length (varint)
    const { value: scriptLength, bytesRead: scriptLengthBytes } = this.readVarInt(buffer, offset);
    offset += scriptLengthBytes;

    // Script data
    const scriptSig = buffer.subarray(offset, offset + scriptLength).toString('hex');
    offset += scriptLength;

    // Sequence (4 bytes, little endian)
    const sequence = buffer.readUInt32LE(offset);
    offset += 4;

    const input: TransactionInput = {
      txid,
      vout,
      scriptSig,
      sequence,
      decodedScript: this.decodeScript(scriptSig),
      signatures: this.extractSignatures(scriptSig)
    };

    return { input, newOffset: offset };
  }

  private static parseOutput(buffer: Buffer, offset: number): { output: TransactionOutput; newOffset: number } {
    // Value (8 bytes, little endian)
    const value = Number(buffer.readBigUInt64LE(offset)) / 100000000; // Convert satoshis to BTC
    offset += 8;

    // Script length (varint)
    const { value: scriptLength, bytesRead: scriptLengthBytes } = this.readVarInt(buffer, offset);
    offset += scriptLengthBytes;

    // Script data
    const scriptPubKey = buffer.subarray(offset, offset + scriptLength).toString('hex');
    offset += scriptLength;

    const output: TransactionOutput = {
      value,
      scriptPubKey,
      decodedScript: this.decodeScript(scriptPubKey),
      type: this.identifyScriptType(scriptPubKey)
    };

    return { output, newOffset: offset };
  }

  private static decodeScript(scriptHex: string): string[] {
    if (!scriptHex) return [];
    
    const opcodes: string[] = [];
    const buffer = Buffer.from(scriptHex, 'hex');
    let i = 0;

    while (i < buffer.length) {
      const opcode = buffer[i];
      
      if (opcode <= 75) {
        // Push data of opcode length
        const data = buffer.subarray(i + 1, i + 1 + opcode).toString('hex');
        opcodes.push(data);
        i += 1 + opcode;
      } else {
        // Standard opcodes
        opcodes.push(this.getOpcodeString(opcode));
        i++;
      }
    }

    return opcodes;
  }

  private static getOpcodeString(opcode: number): string {
    const opcodeMap: { [key: number]: string } = {
      0: 'OP_0',
      76: 'OP_PUSHDATA1',
      77: 'OP_PUSHDATA2',
      118: 'OP_DUP',
      169: 'OP_HASH160',
      136: 'OP_EQUALVERIFY',
      172: 'OP_CHECKSIG',
      106: 'OP_RETURN',
      81: 'OP_1',
      82: 'OP_2'
    };
    
    return opcodeMap[opcode] || `OP_UNKNOWN_${opcode}`;
  }

  private static identifyScriptType(scriptHex: string): string {
    if (!scriptHex) return 'UNKNOWN';
    
    const script = Buffer.from(scriptHex, 'hex');
    
    // P2PKH: OP_DUP OP_HASH160 <20 bytes> OP_EQUALVERIFY OP_CHECKSIG
    if (script.length === 25 && script[0] === 0x76 && script[1] === 0xa9 && script[2] === 0x14) {
      return 'P2PKH';
    }
    
    // P2SH: OP_HASH160 <20 bytes> OP_EQUAL
    if (script.length === 23 && script[0] === 0xa9 && script[1] === 0x14) {
      return 'P2SH';
    }
    
    // OP_RETURN
    if (script[0] === 0x6a) {
      return 'NULL_DATA';
    }
    
    return 'NON_STANDARD';
  }

  private static extractSignatures(scriptSig: string): ECDSASignature[] {
    if (!scriptSig) return [];
    
    const signatures: ECDSASignature[] = [];
    const script = Buffer.from(scriptSig, 'hex');
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
  }

  private static parseDERSignature(derData: Buffer): ECDSASignature | null {
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

  private static calculateTxId(hexData: string): string {
    // For now, return a mock txid. In a real implementation, 
    // this would calculate double SHA256 hash
    return `mock_txid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
