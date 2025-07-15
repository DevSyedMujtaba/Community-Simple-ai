import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, FileText, Settings, Mail, TrendingUp, AlertTriangle } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import { BoardSidebar } from "@/components/layout/BoardSidebar";
import BoardMessages from "@/components/dashboard/BoardMessages";
import CommunityManagement from "@/components/dashboard/CommunityManagement";
import ComplianceOverview from "@/components/dashboard/ComplianceOverview";
import DocumentList from "@/components/dashboard/DocumentList";
import DocumentUpload from "@/components/dashboard/DocumentUpload";
import ChatInterface from "@/components/dashboard/ChatInterface";
import HOAManagement from "@/components/dashboard/HOAManagement";
import ResidentsManagement from "@/components/dashboard/ResidentsManagement";
import NoticeGeneration from "@/components/dashboard/NoticeGeneration";
import { supabase } from "@/lib/supabaseClient";

/**
 * Board Member Dashboard - Enhanced with sidebar navigation
 * Features comprehensive HOA management tools for board members
 */
const BoardDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'CC&R Document 2024',
      uploadDate: '2024-01-10',
      summary: 'Updated Covenants, Conditions, and Restrictions document covering pet policies, architectural guidelines, and community standards. Key changes include updated pet weight limits (80lbs), new fence height restrictions (6ft maximum), and revised noise ordinance hours (quiet time 10 PM - 7 AM).',
      size: 2456789
    },
    {
      id: '2', 
      name: 'Parking Regulations',
      uploadDate: '2024-01-08',
      summary: 'Comprehensive parking rules including visitor parking policies, assigned space regulations, and towing procedures. Covers 2-car limit per unit, visitor permits valid for 48 hours, and designated areas for motorcycles and bicycles.',
      size: 1234567
    }
  ]);
  const [userName, setUserName] = useState("");
  const [myCommunity, setMyCommunity] = useState(null);
  const [docListRefresh, setDocListRefresh] = useState(0);
  const [userId, setUserId] = useState("");
  const [joinRequests, setJoinRequests] = useState([]);
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      // 1. Auth check and get community
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        navigate('/login', { replace: true });
        return;
      }
      const { data: community } = await supabase
        .from("hoa_communities")
        .select("id")
        .eq("board_member_id", session.user.id)
        .single();
      if (!community) return;
      setMyCommunity(community);

      // Fetch board member profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name,last_name")
        .eq("id", session.user.id)
        .single();
      console.log('Fetched profile:', profile); // Debug log
      if (profile) {
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ");
        setUserName(fullName || "Board Member");
      } else {
        setUserName("Board Member");
      }

      // 2. Fetch all join requests for this HOA
      const { data: allReqs, error: allReqsError } = await supabase
        .from("hoa_join_requests")
        .select("id, user_id, unit_number, phone_number, message, status, created_at")
        .eq("hoa_id", community.id);
      if (allReqsError) {
        setJoinRequests([]);
        setResidents([]);
        return;
      }
      const joinReqs = allReqs.filter(r => r.status === 'pending');
      const residentReqs = allReqs.filter(r => r.status === 'approved');

      // 3. Collect all unique user_ids
      const allUserIds = Array.from(new Set(allReqs.map(r => String(r.user_id))));

      // 4. Fetch user info from Edge Function for all user_ids
      let users = [];
      try {
        const res = await fetch(`https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/get-hoa-users?user_ids=${allUserIds.join(',')}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          users = Array.isArray(data.users) ? data.users : [];
        } else {
          let errorData = {};
          try { errorData = await res.json(); } catch {}
          console.error("Edge Function error:", errorData);
          users = [];
        }
      } catch (e) {
        console.error("Network or parsing error calling Edge Function:", e);
        users = [];
      }
      // Merge join requests
      const mergedJoinReqs = Array.isArray(joinReqs) ? joinReqs.map(req => {
        const user = users.find(u => String(u.id) === String(req.user_id)) || {};
        return {
          id: req.id,
          name: user.name || "Unknown",
          email: user.email || "Unknown",
          phone: req.phone_number,
          requestedUnit: req.unit_number,
          requestDate: new Date(req.created_at).toLocaleDateString(),
          message: req.message,
          status: req.status
        };
      }) : [];
      setJoinRequests(mergedJoinReqs);
      // Merge residents
      const mergedResidents = Array.isArray(residentReqs) ? residentReqs.map(req => {
        const user = users.find(u => String(u.id) === String(req.user_id)) || {};
        return {
          id: req.id,
          name: user.name || "Unknown",
          email: user.email || "Unknown",
          phone: req.phone_number,
          unit: req.unit_number,
          status: 'active',
          joinDate: req.created_at,
          lastActive: ''
        };
      }) : [];
      setResidents(mergedResidents);
    };
    fetchAll();
  }, [navigate]);

  // Sample community statistics
  const communityStats = {
    totalHomes: 156,
    activeMember: 142,
    pendingCompliance: 8,
    messagesThisWeek: 23,
    pendingRequests: 3
  };

  // Handle document upload
  const handleDocumentUploaded = (newDocument: any) => {
    setDocuments(prev => [...prev, newDocument]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50">
        <BoardSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          communityName="Sunrise Valley HOA"
          pendingRequests={joinRequests.length}
        />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
              <span className="font-semibold truncate">Board Dashboard</span>
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs sm:text-sm flex-shrink-0">
                Sunrise Valley HOA
              </Badge>
              <button className="ml-4 px-3 py-1 bg-gray-200 text-[#254F70] rounded text-xs font-semibold cursor-not-allowed opacity-80" disabled>
                HOA - Property Lawyer Market Place
                <span className="ml-2 text-[10px] text-gray-500 font-normal">Beta - In Development - Coming soon</span>
              </button>
            </div>
            {/* User name at top right */}
            {userName && (
              <div className="ml-auto flex items-center gap-2">
                <span className="font-semibold text-[#254F70] text-sm sm:text-base truncate max-w-[160px]">{userName}</span>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                  {userName[0]}
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="space-y-4 sm:space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Community Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">{communityStats.totalHomes}</div>
                          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#254F70] ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Homes</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">{communityStats.activeMember}</div>
                          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-green-100 rounded-full flex items-center justify-center ml-auto flex-shrink-0">
                            <div className="h-2 w-2 sm:h-3 sm:w-3 bg-green-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Active Members</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">{communityStats.pendingCompliance}</div>
                          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-orange-100 rounded-full flex items-center justify-center ml-auto flex-shrink-0">
                            <div className="h-2 w-2 sm:h-3 sm:w-3 bg-orange-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Pending Issues</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">{communityStats.messagesThisWeek}</div>
                          <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 ml-auto flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Messages This Week</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-lg sm:text-xl">Recent Community Activity</CardTitle>
                      <CardDescription className="text-sm sm:text-base">Latest updates and actions in your community</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 sm:space-y-4">
                        {/* Activity: New HOA document uploaded */}
                        <div className="flex flex-col xs:flex-row items-start xs:items-center p-2 sm:p-4 bg-blue-50 rounded-lg gap-2 xs:gap-4 min-w-0">
                          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0 mb-1 xs:mb-0">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#254F70]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-xs sm:text-base break-words truncate">New HOA document uploaded</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Updated parking regulations - Unit 205A</p>
                          </div>
                          <span className="text-[11px] sm:text-xs text-gray-500 flex-shrink-0 ml-0 xs:ml-2">2 hours ago</span>
                        </div>
                        {/* Activity: Message from homeowner */}
                        <div className="flex flex-col xs:flex-row items-start xs:items-center p-2 sm:p-4 bg-green-50 rounded-lg gap-2 xs:gap-4 min-w-0">
                          <div className="bg-green-100 p-2 rounded-lg flex-shrink-0 mb-1 xs:mb-0">
                            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-xs sm:text-base break-words truncate">Message from homeowner</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">Question about pet policy - Unit 112B</p>
                          </div>
                          <span className="text-[11px] sm:text-xs text-gray-500 flex-shrink-0 ml-0 xs:ml-2">5 hours ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'hoa-management' && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Settings className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0 " />
                      HOA Management
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Create and manage HOA communities with geographic tagging
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <HOAManagement />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'residents' && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                      Residents Management
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Invite homeowners, approve requests, and manage resident accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ResidentsManagement joinRequests={joinRequests} residents={residents} hoaId={myCommunity?.id} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                        Document Management
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Upload official governing documents and view AI summaries
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Render DocumentUpload above the document list */}
                      <DocumentUpload hoaId={myCommunity?.id} onDocumentUploaded={() => setDocListRefresh(r => r + 1)} />
                      <DocumentList hoaId={myCommunity?.id} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="text-lg sm:text-xl">AI Assistant</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Ask questions about your uploaded documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ChatInterface documents={documents} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'messages' && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                      Messages
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Communicate with residents and board members
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <BoardMessages />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notices' && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                      Notice Management
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Create, edit, and manage official notices to residents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <NoticeGeneration hoaId={myCommunity?.id} userId={userId} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'compliance' && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70]   flex-shrink-0" />
                      Compliance Monitor
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Track violations, generate notices, and monitor community compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ComplianceOverview />
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

export default BoardDashboard;

