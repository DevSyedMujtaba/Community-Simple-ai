import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Eye } from "lucide-react";

interface ComplianceIssue {
  id: string;
  homeowner: string;
  unit: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  reportDate: string;
  lastUpdate: string;
}

/**
 * Compliance Overview Component for Board Members
 * Provides community-wide compliance monitoring and management
 * Tracks violations, trends, and enforcement actions
 */
const ComplianceOverview = () => {
  // Sample compliance issues data
  const complianceIssues: ComplianceIssue[] = [
    {
      id: '1',
      homeowner: 'Mike Chen',
      unit: '102B',
      category: 'Parking',
      description: 'Guest vehicle parked in resident spot for 4+ days',
      severity: 'medium',
      status: 'open',
      reportDate: '2024-01-14',
      lastUpdate: '2024-01-14'
    },
    {
      id: '2',
      homeowner: 'David Wilson',
      unit: '104A',
      category: 'Noise',
      description: 'Loud music past quiet hours (reported 3 times this month)',
      severity: 'high',
      status: 'in-progress',
      reportDate: '2024-01-12',
      lastUpdate: '2024-01-13'
    },
    {
      id: '3',
      homeowner: 'Unknown',
      unit: '205C',
      category: 'Pets',
      description: 'Unregistered dog observed in common areas',
      severity: 'low',
      status: 'open',
      reportDate: '2024-01-11',
      lastUpdate: '2024-01-11'
    },
    {
      id: '4',
      homeowner: 'Sarah Johnson',
      unit: '101A',
      category: 'Architecture',
      description: 'Unapproved door color change (resolved after approval)',
      severity: 'low',
      status: 'resolved',
      reportDate: '2024-01-08',
      lastUpdate: '2024-01-10'
    },
    {
      id: '5',
      homeowner: 'Linda Rodriguez',
      unit: '103C',
      category: 'Maintenance',
      description: 'Balcony items not properly secured during wind advisory',
      severity: 'medium',
      status: 'resolved',
      reportDate: '2024-01-07',
      lastUpdate: '2024-01-09'
    }
  ];

  // Calculate statistics
  const stats = {
    total: complianceIssues.length,
    open: complianceIssues.filter(issue => issue.status === 'open').length,
    inProgress: complianceIssues.filter(issue => issue.status === 'in-progress').length,
    resolved: complianceIssues.filter(issue => issue.status === 'resolved').length,
    high: complianceIssues.filter(issue => issue.severity === 'high').length,
    medium: complianceIssues.filter(issue => issue.severity === 'medium').length,
    low: complianceIssues.filter(issue => issue.severity === 'low').length
  };

  // Category breakdown
  const categoryStats = complianceIssues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get severity colors
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle issue actions
  const handleViewIssue = (issueId: string) => {
    console.log('Viewing issue:', issueId);
    // In real implementation, this would open issue details
  };

  const handleUpdateStatus = (issueId: string, newStatus: string) => {
    console.log('Updating issue:', issueId, 'to status:', newStatus);
    // In real implementation, this would update the issue status
  };

  return (
    <div className="space-y-6">
      {/* Compliance Stats Overview */}
      <div className="flex flex-col gap-2 w-full">
        <Card className="border-blue-200 rounded-xl">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl sm:text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs xs:text-sm text-gray-600">Total Issues</div>
            <div className="flex items-center justify-center mt-1 text-xs text-green-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -12% vs last month
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 rounded-xl">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl sm:text-2xl font-bold text-red-600">{stats.open}</div>
            <div className="text-xs xs:text-sm text-gray-600">Open Issues</div>
            <div className="flex items-center justify-center mt-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 rounded-xl">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl sm:text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-xs xs:text-sm text-gray-600">In Progress</div>
            <div className="flex items-center justify-center mt-1 text-xs text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              Avg 3.2 days
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 rounded-xl">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center">
            <div className="text-base xs:text-xl sm:text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-xs xs:text-sm text-gray-600">Resolved</div>
            <div className="flex items-center justify-center mt-1 text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              80% this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">High Priority</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(stats.high / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.high}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">Medium Priority</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(stats.medium / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.medium}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Low Priority</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.low / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.low}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Compliance Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-4">
            {complianceIssues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-2 xs:p-3 sm:p-4">
                <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 mb-2 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate min-w-0">{issue.homeowner} - Unit {issue.unit}</h4>
                      <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                      <Badge className={getSeverityColor(issue.severity)} variant="outline">{issue.severity}</Badge>
                    </div>
                    <p className="text-xs xs:text-sm text-gray-700 mb-2 break-words min-w-0">{issue.description}</p>
                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 text-xs text-gray-500 min-w-0">
                      <span>Reported: {new Date(issue.reportDate).toLocaleDateString()}</span>
                      <span>Updated: {new Date(issue.lastUpdate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col xs:flex-row gap-2 flex-shrink-0 w-full xs:w-auto mt-2 xs:mt-0">
                    <Badge className={getStatusColor(issue.status)} variant="secondary">{issue.status.replace('-', ' ')}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewIssue(issue.id)}
                      className="text-gray-600 hover:text-gray-900 w-full xs:w-auto"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">
              View All Issues
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <Button variant="outline" className="h-auto p-3 xs:p-4 flex flex-col items-start w-full">
              <div className="flex items-center w-full mb-2">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                <span className="font-medium">Create Violation</span>
              </div>
              <span className="text-xs xs:text-sm text-gray-600 text-left">
                Report a new compliance violation
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-3 xs:p-4 flex flex-col items-start w-full">
              <div className="flex items-center w-full mb-2">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Generate Report</span>
              </div>
              <span className="text-xs xs:text-sm text-gray-600 text-left">
                Export compliance activity report
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-3 xs:p-4 flex flex-col items-start w-full">
              <div className="flex items-center w-full mb-2">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">View Analytics</span>
              </div>
              <span className="text-xs xs:text-sm text-gray-600 text-left">
                Detailed compliance trends and metrics
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceOverview;
