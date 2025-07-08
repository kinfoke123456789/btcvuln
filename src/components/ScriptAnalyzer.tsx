
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Code, AlertTriangle, CheckCircle } from 'lucide-react';

const ScriptAnalyzer = () => {
  const [txid, setTxid] = useState('');
  const [rawHex, setRawHex] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockAnalysis = {
    txid: 'bc1qa5wkgaew2dkv56kfvj5x7epdj4zyrhfx5x7a',
    inputs: [
      {
        scriptSig: 'OP_PUSHDATA1 72 304502210089abcdef...',
        decodedScript: ['OP_PUSHDATA1', '304502210089abcdef...', 'OP_PUSHDATA1', '021f2f6e1e50cb6a953935c3601284925decd3fd21bc0b6c86c4b6e436d7b8b8b'],
        type: 'P2PKH',
        vulnerabilities: ['Reused R-value detected in signature'],
        severity: 'critical'
      }
    ],
    outputs: [
      {
        scriptPubKey: 'OP_DUP OP_HASH160 89abcdefabbaabbaabbaabbaabbaabbaabbaabba OP_EQUALVERIFY OP_CHECKSIG',
        decodedScript: ['OP_DUP', 'OP_HASH160', '89abcdefabbaabbaabbaabbaabbaabbaabbaabba', 'OP_EQUALVERIFY', 'OP_CHECKSIG'],
        type: 'P2PKH',
        vulnerabilities: [],
        severity: 'safe'
      },
      {
        scriptPubKey: 'OP_RETURN 48656c6c6f20426974636f696e',
        decodedScript: ['OP_RETURN', 'Hello Bitcoin'],
        type: 'NULL_DATA',
        vulnerabilities: ['Potential data leak in OP_RETURN'],
        severity: 'medium'
      }
    ],
    overallRisk: 'high',
    recommendations: [
      'Private key may be compromised due to R-value reuse',
      'Consider this transaction as high-risk',
      'Monitor associated addresses for further activity'
    ]
  };

  const handleAnalyze = async () => {
    if (!txid && !rawHex) return;
    
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-600';
      case 'safe': return 'bg-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Code className="mr-2 h-5 w-5" />
            Bitcoin Script Analyzer & Disassembler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Transaction ID</label>
              <Input
                placeholder="Enter TXID to analyze..."
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Or Raw Transaction Hex</label>
              <Input
                placeholder="Paste raw transaction hex..."
                value={rawHex}
                onChange={(e) => setRawHex(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <Button 
            onClick={handleAnalyze}
            disabled={(!txid && !rawHex) || isAnalyzing}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            <Search className="mr-2 h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Transaction'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Scripts */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Input Scripts (scriptSig)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {analysis.inputs.map((input: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          Input #{index + 1} - {input.type}
                        </Badge>
                        <Badge className={`${getSeverityColor(input.severity)} text-white text-xs`}>
                          {input.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-slate-300 font-mono mb-2 break-all">
                        {input.scriptSig}
                      </div>
                      
                      <div className="text-sm text-slate-400 mb-2">
                        <strong>Decoded:</strong>
                        <div className="mt-1 space-x-1">
                          {input.decodedScript.map((op: string, i: number) => (
                            <span key={i} className="inline-block px-2 py-1 bg-slate-600 rounded text-xs">
                              {op}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {input.vulnerabilities.length > 0 && (
                        <div className="mt-2">
                          {input.vulnerabilities.map((vuln: string, i: number) => (
                            <div key={i} className="flex items-center text-red-400 text-xs">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {vuln}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Output Scripts */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Output Scripts (scriptPubKey)</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {analysis.outputs.map((output: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          Output #{index + 1} - {output.type}
                        </Badge>
                        <Badge className={`${getSeverityColor(output.severity)} text-white text-xs`}>
                          {output.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-slate-300 font-mono mb-2 break-all">
                        {output.scriptPubKey}
                      </div>
                      
                      <div className="text-sm text-slate-400 mb-2">
                        <strong>Decoded:</strong>
                        <div className="mt-1 space-x-1">
                          {output.decodedScript.map((op: string, i: number) => (
                            <span key={i} className="inline-block px-2 py-1 bg-slate-600 rounded text-xs">
                              {op}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {output.vulnerabilities.length > 0 ? (
                        <div className="mt-2">
                          {output.vulnerabilities.map((vuln: string, i: number) => (
                            <div key={i} className="flex items-center text-amber-400 text-xs">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {vuln}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center text-green-400 text-xs mt-2">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          No vulnerabilities detected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {analysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Analysis Summary
              <Badge className={`${getSeverityColor(analysis.overallRisk)} text-white`}>
                {analysis.overallRisk.toUpperCase()} RISK
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="text-slate-300 font-medium">Recommendations:</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start text-slate-300">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScriptAnalyzer;
