
-- Create table for storing vulnerability scan results
CREATE TABLE public.vulnerabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  txid TEXT NOT NULL,
  block_height INTEGER,
  vulnerability_type TEXT NOT NULL CHECK (vulnerability_type IN ('r_reuse', 'address_reuse', 'dust_attack', 'non_standard', 'op_return_spam')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  description TEXT NOT NULL,
  details TEXT,
  amount_btc DECIMAL,
  address TEXT,
  script_hex TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking addresses
CREATE TABLE public.tracked_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT NOT NULL UNIQUE,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  transaction_count INTEGER NOT NULL DEFAULT 1,
  total_received DECIMAL NOT NULL DEFAULT 0,
  total_sent DECIMAL NOT NULL DEFAULT 0,
  balance DECIMAL NOT NULL DEFAULT 0,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for R-value reuse detection
CREATE TABLE public.r_value_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  r_value TEXT NOT NULL,
  txid_1 TEXT NOT NULL,
  txid_2 TEXT NOT NULL,
  input_index_1 INTEGER NOT NULL,
  input_index_2 INTEGER NOT NULL,
  address TEXT,
  private_key_recovered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for transaction analysis
CREATE TABLE public.transaction_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  txid TEXT NOT NULL UNIQUE,
  block_height INTEGER,
  block_hash TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  input_count INTEGER NOT NULL,
  output_count INTEGER NOT NULL,
  total_input_value DECIMAL,
  total_output_value DECIMAL,
  fee DECIMAL,
  script_analysis JSONB,
  vulnerability_flags TEXT[],
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for scan statistics
CREATE TABLE public.scan_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  blocks_scanned INTEGER NOT NULL DEFAULT 0,
  transactions_scanned INTEGER NOT NULL DEFAULT 0,
  vulnerabilities_found INTEGER NOT NULL DEFAULT 0,
  addresses_tracked INTEGER NOT NULL DEFAULT 0,
  r_value_matches INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(scan_date)
);

-- Enable Row Level Security
ALTER TABLE public.vulnerabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.r_value_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (vulnerability scanner is public-facing)
CREATE POLICY "Anyone can view vulnerabilities" ON public.vulnerabilities
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view tracked addresses" ON public.tracked_addresses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view r-value matches" ON public.r_value_matches
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view transaction analysis" ON public.transaction_analysis
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view scan statistics" ON public.scan_statistics
  FOR SELECT USING (true);

-- Create policies for system operations (allow insert/update for scan operations)
CREATE POLICY "System can insert vulnerabilities" ON public.vulnerabilities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update vulnerabilities" ON public.vulnerabilities
  FOR UPDATE USING (true);

CREATE POLICY "System can insert tracked addresses" ON public.tracked_addresses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update tracked addresses" ON public.tracked_addresses
  FOR UPDATE USING (true);

CREATE POLICY "System can insert r-value matches" ON public.r_value_matches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert transaction analysis" ON public.transaction_analysis
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update transaction analysis" ON public.transaction_analysis
  FOR UPDATE USING (true);

CREATE POLICY "System can insert scan statistics" ON public.scan_statistics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update scan statistics" ON public.scan_statistics
  FOR UPDATE USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_vulnerabilities_txid ON public.vulnerabilities(txid);
CREATE INDEX idx_vulnerabilities_type ON public.vulnerabilities(vulnerability_type);
CREATE INDEX idx_vulnerabilities_severity ON public.vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_created_at ON public.vulnerabilities(created_at DESC);

CREATE INDEX idx_tracked_addresses_address ON public.tracked_addresses(address);
CREATE INDEX idx_tracked_addresses_risk_score ON public.tracked_addresses(risk_score DESC);
CREATE INDEX idx_tracked_addresses_flagged ON public.tracked_addresses(is_flagged);

CREATE INDEX idx_r_value_matches_r_value ON public.r_value_matches(r_value);
CREATE INDEX idx_r_value_matches_txid_1 ON public.r_value_matches(txid_1);
CREATE INDEX idx_r_value_matches_txid_2 ON public.r_value_matches(txid_2);

CREATE INDEX idx_transaction_analysis_txid ON public.transaction_analysis(txid);
CREATE INDEX idx_transaction_analysis_block_height ON public.transaction_analysis(block_height);

CREATE INDEX idx_scan_statistics_date ON public.scan_statistics(scan_date DESC);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vulnerabilities_updated_at 
    BEFORE UPDATE ON public.vulnerabilities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracked_addresses_updated_at 
    BEFORE UPDATE ON public.tracked_addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scan_statistics_updated_at 
    BEFORE UPDATE ON public.scan_statistics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
