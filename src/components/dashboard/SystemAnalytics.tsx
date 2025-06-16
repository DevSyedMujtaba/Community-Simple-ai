
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Database, MessageSquare, Users, Calendar, BarChart3 } from "lucide-react";

/**
 * System Analytics Component for Admin Dashboard
 * Provides detailed analytics on platform usage, performance, and trends
 * Includes metrics for user engagement, system health, and resource utilization
 */
const SystemAnalytics = () => {
  // Sample analytics data - in real implementation, this would come from APIs
  const analyticsData = {
    userGrowth: {
      thisMonth: 127,
      lastMonth: 98,
      percentChange: 29.6
    },
    messageVolume: {
      thisMonth: 15632,
      lastMonth: 12847,
      percentChange: 21.7
    },
    tokenConsumption: {
      thisMonth: 2847392,
      lastMonth: 2156789,
      percentChange: 32.0
    },
    systemUptime: 99.7,
    avgResponseTime: 245,
    peakUsageHours: ['9:00 AM', '2:00 PM', '7:00 PM'],
    topPerformingHOAs: [
      { name: 'Sunrise Valley HOA', users: 156, messages: 3420, growth: 15.2 },
      { name: 'Oak Ridge Community', users: 203, messages: 2890, growth: 8.7 },
      { name: 'Meadowbrook Village', users: 89, messages: 1560, growth: 22.4 },
      { name: 'Pine Creek Estates', users: 134, messages: 2100, growth: 12.1 }
    ],
    usageByCategory: [
      { category: 'Pet Policies', queries: 1240, percentage: 28.5 },
      { category: 'Parking Rules', queries: 980, percentage: 22.6 },
      { category: 'HOA Fees', queries: 756, percentage: 17.4 },
      { category: 'Noise Ordinances', queries: 623, percentage: 14.3 },
      { category: 'Architecture', queries: 445, percentage: 10.2 },
      { category: 'Other', queries: 298, percentage: 6.9 }
    ]
  };

  // Helper function to format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Helper function to get trend icon and color
  const getTrendDisplay = (change: number) => {
    const isPositive = change > 0;
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50'
    };
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Growth</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.userGrowth.thisMonth}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className={`flex items-center mt-4 text-sm ${getTrendDisplay(analyticsData.userGrowth.percentChange).color}`}>
              {(() => {
                const trend = getTrendDisplay(analyticsData.userGrowth.percentChange);
                const TrendIcon = trend.icon;
                return (
                  <>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    +{analyticsData.userGrowth.percentChange}% from last month
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Message Volume</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.messageVolume.thisMonth)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className={`flex items-center mt-4 text-sm ${getTrendDisplay(analyticsData.messageVolume.percentChange).color}`}>
              {(() => {
                const trend = getTrendDisplay(analyticsData.messageVolume.percentChange);
                const TrendIcon = trend.icon;
                return (
                  <>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    +{analyticsData.messageVolume.percentChange}% from last month
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Token Usage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analyticsData.tokenConsumption.thisMonth)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className={`flex items-center mt-4 text-sm ${getTrendDisplay(analyticsData.tokenConsumption.percentChange).color}`}>
              {(() => {
                const trend = getTrendDisplay(analyticsData.tokenConsumption.percentChange);
                const TrendIcon = trend.icon;
                return (
                  <>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    +{analyticsData.tokenConsumption.percentChange}% from last month
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.systemUptime}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Avg response: {analyticsData.avgResponseTime}ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Query Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.usageByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {category.queries.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-sm text-gray-500">
                    {category.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Peak Usage Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Today's Peak Hours</h4>
                <div className="flex space-x-4">
                  {analyticsData.peakUsageHours.map((hour, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                      {hour}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Morning (6AM - 12PM)</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-gray-600">75%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Afternoon (12PM - 6PM)</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-gray-600">95%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Evening (6PM - 12AM)</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-gray-600">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing HOAs */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing HOAs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topPerformingHOAs.map((hoa, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <span className="text-lg font-bold text-gray-700">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{hoa.name}</h4>
                    <p className="text-sm text-gray-600">
                      {hoa.users} users • {hoa.messages.toLocaleString()} messages
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`flex items-center text-sm ${getTrendDisplay(hoa.growth).color}`}>
                    {(() => {
                      const trend = getTrendDisplay(hoa.growth);
                      const TrendIcon = trend.icon;
                      return (
                        <>
                          <TrendIcon className="h-4 w-4 mr-1" />
                          +{hoa.growth}%
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">growth this month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-900">API Health</span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-green-700">Healthy</p>
              <p className="text-sm text-green-600">All endpoints responding normally</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Database</span>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-blue-700">Optimal</p>
              <p className="text-sm text-blue-600">Query performance within limits</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-900">Storage</span>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <p className="text-2xl font-bold text-yellow-700">78%</p>
              <p className="text-sm text-yellow-600">Used capacity - monitor closely</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAnalytics;
