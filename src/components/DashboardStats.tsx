
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Eye, Database } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<Stat[]>([
    {
      title: 'Critical Vulnerabilities',
      value: '23',
      change: +12,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-red-400',
    },
    {
      title: 'Addresses Monitored',
      value: '1,247',
      change: +89,
      icon: <Eye className="h-5 w-5" />,
      color: 'text-blue-400',
    },
    {
      title: 'R-Value Matches',
      value: '7',
      change: +3,
      icon: <Shield className="h-5 w-5" />,
      color: 'text-orange-400',
    },
    {
      title: 'Transactions Scanned',
      value: '45.2K',
      change: +1847,
      icon: <Database className="h-5 w-5" />,
      color: 'text-green-400',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.title === 'Transactions Scanned' 
            ? `${(parseFloat(stat.value.replace('K', '')) + 0.1).toFixed(1)}K`
            : stat.value,
          change: stat.change + (Math.random() > 0.5 ? 1 : 0),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
              {stat.title}
              <div className={stat.color}>
                {stat.icon}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className={`flex items-center text-sm ${
                stat.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stat.change)}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stat.change > 0 ? '+' : ''}{stat.change} from last hour
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
