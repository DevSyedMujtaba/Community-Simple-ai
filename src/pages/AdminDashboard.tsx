import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, MessageSquare, BarChart3, Database, Settings } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import UserManagement from "@/components/dashboard/UserManagement";
import SystemAnalytics from "@/components/dashboard/SystemAnalytics";

/**
 * Admin Dashboard - Enhanced with sidebar navigation
 * Internal use only interface for platform administrators
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample platform statistics
  const platformStats = {
    totalUsers: 1247,
    totalHOAs: 89,
    messagesThisMonth: 15632,
    tokenUsage: 2847392
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50">
        <AdminSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-gradient-to-r from-purple-600 to-purple-700 px-4">
            <SidebarTrigger className="-ml-1 text-white hover:bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="font-semibold">Admin Dashboard</span>
              <Badge variant="secondary" className="bg-white bg-opacity-20 text-white border-white border-opacity-20">
                Admin Access
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Platform Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-purple-200">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</div>
                          <Users className="h-8 w-8 text-purple-600 ml-auto" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Total Users</p>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-gray-900">{platformStats.totalHOAs}</div>
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center ml-auto">
                            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Active HOAs</p>
                        <p className="text-xs text-green-600 mt-1">+3 new this month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-gray-900">{platformStats.messagesThisMonth.toLocaleString()}</div>
                          <MessageSquare className="h-8 w-8 text-green-600 ml-auto" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Messages This Month</p>
                        <p className="text-xs text-green-600 mt-1">+8% vs last month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-gray-900">{(platformStats.tokenUsage / 1000000).toFixed(1)}M</div>
                          <Database className="h-8 w-8 text-orange-600 ml-auto" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Token Usage</p>
                        <p className="text-xs text-blue-600 mt-1">Within budget limits</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* System Health Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Platform Activity</CardTitle>
                        <CardDescription>Latest system events and user activities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center p-4 bg-green-50 rounded-lg">
                            <div className="bg-green-100 p-2 rounded-lg mr-4">
                              <Users className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">New HOA registered</p>
                              <p className="text-sm text-gray-600">Meadowbrook Community - 67 units</p>
                            </div>
                            <span className="text-sm text-gray-500">1 hour ago</span>
                          </div>
                          
                          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-lg mr-4">
                              <Database className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">High token usage detected</p>
                              <p className="text-sm text-gray-600">Sunrise Valley HOA - 15K tokens in 24h</p>
                            </div>
                            <span className="text-sm text-gray-500">3 hours ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Performing HOAs</CardTitle>
                        <CardDescription>Communities with highest engagement</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Sunrise Valley HOA</p>
                              <p className="text-sm text-gray-600">156 units • 89% active</p>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              High Activity
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Oak Ridge Community</p>
                              <p className="text-sm text-gray-600">203 units • 76% active</p>
                            </div>
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              Growing
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-6 w-6 mr-2 text-primary" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      View and manage all registered users across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserManagement />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'analytics' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-6 w-6 mr-2 text-primary" />
                      System Analytics
                    </CardTitle>
                    <CardDescription>
                      Detailed analytics on platform usage, performance, and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SystemAnalytics />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'settings' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-6 w-6 mr-2 text-primary" />
                      Platform Settings
                    </CardTitle>
                    <CardDescription>
                      Configure system-wide settings and platform parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens per Request</label>
                            <input 
                              type="number" 
                              defaultValue="4000"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Daily Token Limit per User</label>
                            <input 
                              type="number" 
                              defaultValue="50000"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Limits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max File Upload Size (MB)</label>
                            <input 
                              type="number" 
                              defaultValue="25"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Documents per User</label>
                            <input 
                              type="number" 
                              defaultValue="50"
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
