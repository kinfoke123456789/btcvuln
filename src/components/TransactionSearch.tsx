
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Calendar, Filter } from 'lucide-react';

interface SearchResult {
  txid: string;
  block: number;
  timestamp: Date;
  inputCount: number;
  outputCount: number;
  fee: number;
  size: number;
  vulnerabilities: string[];
  riskScore: number;
}

const TransactionSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blockRangeStart, setBlockRangeStart] = useState('');
  const [blockRangeEnd, setBlockRangeEnd] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockResults: SearchResult[] = [
    {
      txid: 'bc1qa5wkgaew2dkv56kfvj5x7epdj4zyrhfx5x7a1234',
      block: 870123,
      timestamp: new Date(Date.now() - 3600000),
      inputCount: 2,
      outputCount: 3,
      fee: 0.00001234,
      size: 250,
      vulnerabilities: ['R-value reuse', 'Address reuse'],
      riskScore: 9.2
    },
    {
      txid: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy5678',
      block: 870122,
      timestamp: new Date(Date.now() - 7200000),
      inputCount: 1,
      outputCount: 2,
      fee: 0.00000567,
      size: 180,
      vulnerabilities: ['Dust attack'],
      riskScore: 4.7
    },
    {
      txid: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa9101',
      block: 870121,
      timestamp: new Date(Date.now() - 10800000),
      inputCount: 3,
      outputCount: 1,
      fee: 0.00002345,
      size: 340,
      vulnerabilities: ['Non-standard script', 'OP_RETURN misuse'],
      riskScore: 7.8
    }
  ];

  const handleSearch = () => {
    if (!searchQuery && !blockRangeStart) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleBlockRangeSearch = () => {
    if (!blockRangeStart || !blockRangeEnd) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setResults(mockResults.filter(r => 
        r.block >= parseInt(blockRangeStart) && r.block <= parseInt(blockRangeEnd)
      ));
      setIsSearching(false);
    }, 2000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'bg-red-600';
    if (score >= 6) return 'bg-amber-500';
    if (score >= 4) return 'bg-blue-500';
    return 'bg-green-600';
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
            <Search className="mr-2 h-5 w-5" />
            Transaction Search & Historical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="txid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="txid" className="text-slate-300 data-[state=active]:text-white">
                Transaction ID Search
              </TabsTrigger>
              <TabsTrigger value="blocks" className="text-slate-300 data-[state=active]:text-white">
                Block Range Search
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="txid" className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter TXID, address, or search pattern..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={!searchQuery || isSearching}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="blocks" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Start block height"
                  value={blockRangeStart}
                  onChange={(e) => setBlockRangeStart(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  type="number"
                />
                <Input
                  placeholder="End block height"
                  value={blockRangeEnd}
                  onChange={(e) => setBlockRangeEnd(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  type="number"
                />
                <Button 
                  onClick={handleBlockRangeSearch}
                  disabled={!blockRangeStart || !blockRangeEnd || isSearching}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {isSearching ? 'Scanning...' : 'Scan Range'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                Search Results ({results.length})
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-slate-300 border-slate-600">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-slate-300 border-slate-600">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getRiskColor(result.riskScore)} text-white text-xs`}>
                          Risk: {result.riskScore}/10
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Block {result.block.toLocaleString()}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(result.timestamp)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm text-slate-300 mb-1">Transaction ID:</div>
                      <div className="text-xs font-mono text-slate-200 bg-slate-800 p-2 rounded break-all">
                        {result.txid}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-400">Inputs:</span>
                        <div className="text-white font-medium">{result.inputCount}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Outputs:</span>
                        <div className="text-white font-medium">{result.outputCount}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Fee:</span>
                        <div className="text-orange-400 font-medium">{result.fee} BTC</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Size:</span>
                        <div className="text-white font-medium">{result.size} bytes</div>
                      </div>
                    </div>

                    {result.vulnerabilities.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm text-slate-300">Detected Vulnerabilities:</div>
                        <div className="flex flex-wrap gap-2">
                          {result.vulnerabilities.map((vuln, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {vuln}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && searchQuery && !isSearching && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-8 text-center">
            <Search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-400">No results found for your search query</p>
            <p className="text-sm text-slate-500 mt-2">Try searching with a different transaction ID or address</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionSearch;
