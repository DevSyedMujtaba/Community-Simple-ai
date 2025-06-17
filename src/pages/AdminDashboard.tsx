
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Database, Building2 } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import UserManagement from "@/components/dashboard/UserManagement";
import HOAManagement from "@/components/dashboard/HOAManagement";

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
          <main className="flex-1 p-4 lg:p-6">
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Platform Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <Card className="border-purple-200">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center">
                          <div className="text-xl lg:text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</div>
                          <Users className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 ml-auto" />
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Total Users</p>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center">
                          <div className="text-xl lg:text-2xl font-bold text-gray-900">{platformStats.totalHOAs}</div>
                          <div className="h-6 w-6 lg:h-8 lg:w-8 bg-blue-100 rounded-full flex items-center justify-center ml-auto">
                            <div className="h-2 w-2 lg:h-3 lg:w-3 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Active HOAs</p>
                        <p className="text-xs text-green-600 mt-1">+3 new this month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center">
                          <div className="text-xl lg:text-2xl font-bold text-gray-900">{platformStats.messagesThisMonth.toLocaleString()}</div>
                          <MessageSquare className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 ml-auto" />
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Messages This Month</p>
                        <p className="text-xs text-green-600 mt-1">+8% vs last month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardContent className="p-4 lg:p-6">
                        <div className="flex items-center">
                          <div className="text-xl lg:text-2xl font-bold text-gray-900">{(platformStats.tokenUsage / 1000000).toFixed(1)}M</div>
                          <Database className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600 ml-auto" />
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Token Usage</p>
                        <p className="text-xs text-blue-600 mt-1">Within budget limits</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Performing HOAs */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing HOAs</CardTitle>
                      <CardDescription>Communities with highest engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900">Sunrise Valley HOA</p>
                            <p className="text-sm text-gray-600">156 units • 89% active</p>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
                            High Activity
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900">Oak Ridge Community</p>
                            <p className="text-sm text-gray-600">203 units • 76% active</p>
                          </div>
                          <Badge variant="outline" className="text-blue-600 border-blue-600 w-fit">
                            Growing
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

              {activeTab === 'hoas' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-6 w-6 mr-2 text-primary" />
                      HOAs Management
                    </CardTitle>
                    <CardDescription>
                      View and manage all HOAs registered on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HOAManagement />
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
