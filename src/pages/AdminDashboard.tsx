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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-3 sm:px-4">
            <SidebarTrigger className="-ml-1 text-blue-700 hover:bg-blue-50" />
            <div className="flex items-center gap-2 text-sm text-blue-900 flex-1 min-w-0">
              <span className="font-semibold truncate">Admin Dashboard</span>
              <Badge variant="outline" className="text-[#254F70] border-[#254F70] bg-blue-50 text-xs sm:text-sm flex-shrink-0">
                Admin Access
              </Badge>
              <button className="ml-4 px-3 py-1 bg-gray-200 text-[#254F70] rounded text-xs font-semibold cursor-not-allowed opacity-80" disabled>
                HOA - Property Lawyer Market Place
                <span className="ml-2 text-[10px] text-gray-500 font-normal">Beta - In Development - Coming soon</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="space-y-4 sm:space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Platform Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <Card className="border-purple-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</div>
                          <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Users</p>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{platformStats.totalHOAs}</div>
                          <div className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 bg-blue-100 rounded-full flex items-center justify-center ml-auto flex-shrink-0">
                            <div className="h-2 w-2 sm:h-2 sm:w-2 lg:h-3 lg:w-3 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Active HOAs</p>
                        <p className="text-xs text-green-600 mt-1">+3 new this month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{platformStats.messagesThisMonth.toLocaleString()}</div>
                          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Messages This Month</p>
                        <p className="text-xs text-green-600 mt-1">+8% vs last month</p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{(platformStats.tokenUsage / 1000000).toFixed(1)}M</div>
                          <Database className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-600 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Token Usage</p>
                        <p className="text-xs text-blue-600 mt-1">Within budget limits</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Performing HOAs */}
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-lg sm:text-xl">Top Performing HOAs</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Communities with highest engagement</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Sunrise Valley HOA</p>
                            <p className="text-xs sm:text-sm text-gray-600">156 units • 89% active</p>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600 w-fit text-xs sm:text-sm">
                            High Activity
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Oak Ridge Community</p>
                            <p className="text-xs sm:text-sm text-gray-600">203 units • 76% active</p>
                          </div>
                          <Badge variant="outline" className="text-[#254F70] border-[#254F70] w-fit text-xs sm:text-sm">
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
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                      User Management
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      View and manage all registered users across the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <UserManagement />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'hoas' && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Building2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                      HOAs Management
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      View and manage all HOAs registered on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
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
