import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Database, Building2 } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import UserManagement from "@/components/dashboard/UserManagement";
import HOAManagement from "@/components/dashboard/HOAManagement";
import { supabase } from "@/lib/supabaseClient";

/**
 * Admin Dashboard - Enhanced with sidebar navigation
 * Internal use only interface for platform administrators
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        navigate('/login', { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState('overview');

  // Add token usage to state
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalHOAs: 0,
    messagesThisMonth: 0,
    tokenUsage: 0,
  });
  // Update trends state to include raw values
  const [trends, setTrends] = useState({
    users: 0,
    hoas: 0,
    messages: 0,
    usersThisMonth: 0,
    usersLastMonth: 0,
    hoasThisMonth: 0,
    hoasLastMonth: 0,
    messagesThisMonth: 0,
    messagesLastMonth: 0,
    tokenUsageThisMonth: 0,
    tokenUsageLastMonth: 0,
  });
  const [topHOAs, setTopHOAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get current user's access token
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        // Fetch user trends from edge function (created_at from auth.users)
        const res = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/get-auth-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        const userStats = await res.json();

        // Fetch total users from profiles table
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        // Date helpers
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        // HOAs and messages logic unchanged
        // Total HOAs (all time)
        const { count: totalHOAs } = await supabase
          .from('hoa_communities')
          .select('id', { count: 'exact', head: true });
        // HOAs created this month
        const { count: hoasThisMonth } = await supabase
          .from('hoa_communities')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfThisMonth.toISOString());
        // HOAs created last month
        const { count: hoasLastMonth } = await supabase
          .from('hoa_communities')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString());

        // Messages This Month
        const { count: messagesThisMonth } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfThisMonth.toISOString());
        // Messages Last Month
        const { count: messagesLastMonth } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString());

        // --- Fetch OpenAI token usage ---
        // This month
        const { data: thisMonthData } = await supabase
          .from('token_usage')
          .select('tokens_used')
          .gte('created_at', startOfThisMonth.toISOString());
        const tokensThisMonth = thisMonthData?.reduce((sum, row) => sum + row.tokens_used, 0) ?? 0;
        // Last month
        const { data: lastMonthData } = await supabase
          .from('token_usage')
          .select('tokens_used')
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString());
        const tokensLastMonth = lastMonthData?.reduce((sum, row) => sum + row.tokens_used, 0) ?? 0;

        // Token Usage (for display)
        const tokenUsage = tokensThisMonth;

        // Top Performing HOAs (example: by most units)
        const { data: hoaData } = await supabase
          .from('hoa_communities')
          .select('id, name, units')
          .order('units', { ascending: false })
          .limit(5);

        // For each HOA, fetch the count of active members
        const hoaWithActiveCounts = await Promise.all(
          (hoaData || []).map(async (hoa, i) => {
            const { count: activeMembers } = await supabase
              .from('hoa_join_requests')
              .select('id', { count: 'exact', head: true })
              .eq('hoa_id', hoa.id)
              .eq('status', 'approved');
            // Calculate activePercent if units is available
            let activePercent = 0;
            if (hoa.units && hoa.units > 0) {
              activePercent = Math.round(((activeMembers ?? 0) / hoa.units) * 100);
            } else {
              activePercent = [89, 76, 65, 60, 55][i] || 50; // fallback
            }
            return {
              ...hoa,
              activeMembers: activeMembers ?? 0,
              activePercent,
              status: i === 0 ? 'High Activity' : 'Growing',
            };
          })
        );

        // Calculate trends
        const percent = (curr, prev) => prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / Math.max(prev, 1)) * 100);
        setTrends({
          users: percent(userStats.usersThisMonth ?? 0, userStats.usersLastMonth ?? 0),
          hoas: percent(hoasThisMonth ?? 0, hoasLastMonth ?? 0),
          messages: percent(messagesThisMonth ?? 0, messagesLastMonth ?? 0),
          usersThisMonth: userStats.usersThisMonth ?? 0,
          usersLastMonth: userStats.usersLastMonth ?? 0,
          hoasThisMonth: hoasThisMonth ?? 0,
          hoasLastMonth: hoasLastMonth ?? 0,
          messagesThisMonth: messagesThisMonth ?? 0,
          messagesLastMonth: messagesLastMonth ?? 0,
          tokenUsageThisMonth: tokensThisMonth,
          tokenUsageLastMonth: tokensLastMonth,
        });

        setPlatformStats({
          totalUsers: totalUsers ?? 0,
          totalHOAs: totalHOAs ?? 0,
          messagesThisMonth: messagesThisMonth ?? 0,
          tokenUsage: tokenUsage ?? 0,
        });
        setTopHOAs(hoaWithActiveCounts);
      } catch (err) {
        setError('Failed to load stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Helper for user-friendly trend display
  function getTrendString(curr, prev) {
    if (prev === 0 && curr === 0) return 'No change';
    if (prev === 0 && curr > 0) return '+100% from last month';
    const percent = Math.round(((curr - prev) / Math.max(prev, 1)) * 100);
    return `${percent >= 0 ? '+' : ''}${percent}% from last month`;
  }

  // Add a helper to format token usage
  function formatTokenUsage(value) {
    if (value < 1000) return value.toString();
    if (value < 1000000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }

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
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                            {loading ? '...' : platformStats.totalUsers.toLocaleString()}
                          </div>
                          <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Users</p>
                        <p className="text-xs text-green-600 mt-1">
                          {loading ? '...' : (() => {
                            const curr = trends.usersThisMonth;
                            const prev = trends.usersLastMonth;
                            if (prev === 0 && curr === 0) return 'No change';
                            const percent = Math.round(((curr - prev) / Math.max(prev, 1)) * 100);
                            return `${percent >= 0 ? '+' : ''}${percent}% from last month`;
                          })()}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                            {loading ? '...' : platformStats.totalHOAs}
                          </div>
                          <div className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 bg-blue-100 rounded-full flex items-center justify-center ml-auto flex-shrink-0">
                            <div className="h-2 w-2 sm:h-2 sm:w-2 lg:h-3 lg:w-3 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Active HOAs</p>
                        <p className="text-xs text-green-600 mt-1">
                          {loading ? '...' : getTrendString(trends.hoasThisMonth, trends.hoasLastMonth)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                            {loading ? '...' : platformStats.messagesThisMonth.toLocaleString()}
                          </div>
                          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Messages This Month</p>
                        <p className="text-xs text-green-600 mt-1">
                          {loading ? '...' : getTrendString(trends.messagesThisMonth, trends.messagesLastMonth)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                            {loading ? '...' : formatTokenUsage(platformStats.tokenUsage)}
                          </div>
                          <Database className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-600 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Token Usage</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {loading ? '...' : getTrendString(trends.tokenUsageThisMonth, trends.tokenUsageLastMonth)}
                        </p>
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
                        {loading ? (
                          <div>Loading...</div>
                        ) : (
                          topHOAs.map((hoa, idx) => (
                            <div key={hoa.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <div className="min-w-0">
                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{hoa.name}</p>
                                <p className="text-xs sm:text-sm text-gray-600">{hoa.activeMembers} members • {hoa.activePercent}% active</p>
                          </div>
                              <Badge variant="outline" className={hoa.status === 'High Activity' ? "text-green-600 border-green-600 w-fit text-xs sm:text-sm" : "text-[#254F70] border-[#254F70] w-fit text-xs sm:text-sm"}>
                                {hoa.status}
                          </Badge>
                        </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
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
