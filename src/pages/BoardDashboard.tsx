
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, FileText, Settings, Mail, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import MessageCenter from "@/components/dashboard/MessageCenter";
import CommunityManagement from "@/components/dashboard/CommunityManagement";
import ComplianceOverview from "@/components/dashboard/ComplianceOverview";

/**
 * Board Member Dashboard - Interface for HOA board members to:
 * - Manage community settings and members
 * - Communicate with homeowners
 * - Monitor compliance across the community
 * - Access community analytics and insights
 */
const BoardDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample community statistics
  const communityStats = {
    totalHomes: 156,
    activeMember: 142,
    pendingCompliance: 8,
    messagesThisWeek: 23
  };

  // Navigation tabs for board dashboard
  const tabs = [
    { id: 'overview', label: 'Community Overview', icon: TrendingUp },
    { id: 'messages', label: 'Message Center', icon: MessageSquare },
    { id: 'community', label: 'Community Management', icon: Users },
    { id: 'compliance', label: 'Compliance Monitor', icon: FileText },
    { id: 'settings', label: 'HOA Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Board Member Dashboard</h1>
                <p className="text-gray-600">Manage your HOA community and communications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Sunrise Valley HOA
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Community Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-gray-900">{communityStats.totalHomes}</div>
                      <Users className="h-8 w-8 text-blue-600 ml-auto" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Total Homes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-gray-900">{communityStats.activeMember}</div>
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center ml-auto">
                        <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Active Members</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-gray-900">{communityStats.pendingCompliance}</div>
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center ml-auto">
                        <div className="h-3 w-3 bg-orange-600 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Pending Issues</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-gray-900">{communityStats.messagesThisWeek}</div>
                      <Mail className="h-8 w-8 text-purple-600 ml-auto" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Messages This Week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Community Activity</CardTitle>
                  <CardDescription>Latest updates and actions in your community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">New HOA document uploaded</p>
                        <p className="text-sm text-gray-600">Updated parking regulations - Unit 205A</p>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-lg mr-4">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Message from homeowner</p>
                        <p className="text-sm text-gray-600">Question about pet policy - Unit 112B</p>
                      </div>
                      <span className="text-sm text-gray-500">5 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'messages' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                  Message Center
                </CardTitle>
                <CardDescription>
                  Communicate with homeowners and manage community discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageCenter />
              </CardContent>
            </Card>
          )}

          {activeTab === 'community' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-primary" />
                  Community Management
                </CardTitle>
                <CardDescription>
                  Manage homeowners, create neighborhoods, and oversee community settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommunityManagement />
              </CardContent>
            </Card>
          )}

          {activeTab === 'compliance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-primary" />
                  Compliance Monitor
                </CardTitle>
                <CardDescription>
                  Monitor community-wide compliance and manage rule enforcement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplianceOverview />
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-6 w-6 mr-2 text-primary" />
                  HOA Settings
                </CardTitle>
                <CardDescription>
                  Configure your HOA community settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Community Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Community Name</label>
                        <input 
                          type="text" 
                          defaultValue="Sunrise Valley HOA"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Units</label>
                        <input 
                          type="number" 
                          defaultValue="156"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDashboard;
