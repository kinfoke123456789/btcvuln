
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Eye, Database, Loader2 } from 'lucide-react';
import { useVulnerabilityStats } from '@/hooks/useVulnerabilities';

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useVulnerabilityStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 col-span-full">
          <CardContent className="p-6 text-center text-red-400">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
            <p>Error loading statistics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Critical Vulnerabilities',
      value: stats?.criticalVulnerabilities?.toString() || '0',
      change: 0,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-red-400',
    },
    {
      title: 'Addresses Monitored',
      value: stats?.addressesMonitored?.toLocaleString() || '0',
      change: 0,
      icon: <Eye className="h-5 w-5" />,
      color: 'text-blue-400',
    },
    {
      title: 'R-Value Matches',
      value: stats?.rValueMatches?.toString() || '0',
      change: 0,
      icon: <Shield className="h-5 w-5" />,
      color: 'text-orange-400',
    },
    {
      title: 'Transactions Scanned',
      value: stats?.transactionsScanned?.toLocaleString() || '0',
      change: 0,
      icon: <Database className="h-5 w-5" />,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
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
              <div className="flex items-center text-sm text-slate-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                Live
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time from database
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
