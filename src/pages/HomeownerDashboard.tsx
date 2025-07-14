import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, AlertCircle, Home, User, Mail, Bell, MapPin, Clock } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { HomeownerSidebar } from "@/components/layout/HomeownerSidebar";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import HOAJoinRequest from "@/components/dashboard/HOAJoinRequest";
import HomeownerSettings from "@/components/dashboard/HomeownerSettings";
import HomeownerMessages from "@/components/dashboard/HomeownerMessages";
import HOADocumentsList from "@/components/dashboard/HOADocumentsList";
import HomeownerNotices from "@/components/dashboard/HomeownerNotices";
import { useToast } from "@/hooks/use-toast";

/**
 * Homeowner Dashboard - Enhanced with sidebar navigation
 * Features comprehensive homeowner management tools with responsive design
 */
const HomeownerDashboard = () => {
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

  const [activeTab, setActiveTab] = useState<string>('join-hoa');
  const [userName, setUserName] = useState<string | null>(null);
  const [hoaCommunities, setHoaCommunities] = useState<any[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [communitiesError, setCommunitiesError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<any | null>(null);
  const [unitNumber, setUnitNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pendingRequest, setPendingRequest] = useState<any | null>(null);
  const { toast } = useToast();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();
        if (!error && data) {
          setUserName(`${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User');
        } else {
          setUserName('User');
        }
      }
    };
    fetchProfile();
  }, []);

  // Fetch HOA communities when state/city/search changes
  useEffect(() => {
    setCommunitiesLoading(true);
    setCommunitiesError(null);
    let query = supabase.from('hoa_communities');
    let supaQuery = query.select('id, name, city, state, description, units, board_member_id');
    if (selectedState) {
      supaQuery = supaQuery.eq('state', selectedState);
    }
    if (selectedCity) {
      supaQuery = supaQuery.eq('city', selectedCity);
    }
    if (searchTerm) {
      supaQuery = supaQuery.ilike('name', `%${searchTerm}%`);
    }
    supaQuery
      .then(({ data, error }) => {
        if (error) {
          setCommunitiesError('Failed to load communities.');
          setHoaCommunities([]);
        } else {
          setHoaCommunities(data || []);
        }
        setCommunitiesLoading(false);
      });
  }, [selectedState, selectedCity, searchTerm]);

  // Fetch pending join request for this user
  useEffect(() => {
    const fetchPendingRequest = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setPendingRequest(null);
        return;
      }
      const { data, error } = await supabase
        .from('hoa_join_requests')
        .select('id, hoa_id, status, created_at, hoa_communities(name, city, state)')
        .eq('user_id', user.id)
        .in('status', ['pending'])
        .order('created_at', { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        setPendingRequest(data[0]);
      } else {
        setPendingRequest(null);
      }
    };
    fetchPendingRequest();
  }, [submitSuccess]);

  // Handle join request
  const handleJoinRequest = async (communityId: string) => {
    // Instead of sending the request immediately, show the form
    const comm = hoaCommunities.find(c => c.id === communityId);
    setSelectedCommunity(comm);
  };

  const handleSubmitJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    const session = sessionData.session;
    if (!user || !selectedCommunity || !session) {
      setSubmitError('You must be logged in and select a community.');
      setSubmitting(false);
      return;
    }
    const board_member_id = selectedCommunity.board_member_id;
    if (!board_member_id) {
      setSubmitError('This community does not have a board member assigned.');
      setSubmitting(false);
      return;
    }
    const payload = {
      hoa_id: selectedCommunity.id,
      board_member_id,
      user_id: user.id,
      unit_number: unitNumber,
      phone_number: phoneNumber,
      message,
    };
    try {
      const response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/submit_join_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setSubmitError(data?.error || 'Failed to submit request.');
      } else {
        setSubmitSuccess(true);
        setUnitNumber('');
        setPhoneNumber('');
        setMessage('');
        setSelectedCommunity(null);
        toast({
          title: 'Request Sent',
          description: 'Your join request has been sent and is pending board approval.',
        });
      }
    } catch (err: any) {
      setSubmitError('Failed to submit request.');
    }
    setSubmitting(false);
  };

  // User status - in real app this would come from authentication
  const userStatus = {
    isJoinedToHOA: false, // Set to true if user has joined an HOA
    hoaName: 'Sunrise Valley HOA',
    unreadMessages: 3,
    unreadNotices: 2
  };

  // Sample HOA documents for AI chat - these would be the board-uploaded documents
  const hoaDocuments = [
    {
      id: '1',
      name: 'CC&Rs - Covenants, Conditions & Restrictions 2024',
      uploadDate: '2024-01-10',
      summary: 'Official governing document outlining community rules and homeowner responsibilities.',
      size: 2456789
    },
    {
      id: '2', 
      name: 'Parking and Vehicle Regulations',
      uploadDate: '2024-01-08',
      summary: 'Comprehensive parking rules and towing procedures for the community.',
      size: 1234567
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50">
        <HomeownerSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hoaName={userStatus.isJoinedToHOA ? userStatus.hoaName : "Select HOA"}
          unreadMessages={userStatus.unreadMessages}
          unreadNotices={userStatus.unreadNotices}
        />
        
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
              <span className="font-semibold truncate">Homeowner Dashboard</span>
              {userStatus.isJoinedToHOA && (
                <Badge variant="outline" className="text-[#254F70] border-[#254F70] text-xs sm:text-sm flex-shrink-0">
                  {userStatus.hoaName}
                </Badge>
              )}
              <button className="ml-4 px-3 py-1 bg-gray-200 text-[#254F70] rounded text-xs font-semibold cursor-not-allowed opacity-80" disabled>
                HOA - Property Lawyer Market Place
                <span className="ml-2 text-[10px] text-gray-500 font-normal">Beta - In Development - Coming soon</span>
              </button>
            </div>
            {/* User Name Display - styled as a badge */}
            <span className="ml-auto flex items-center gap-2 bg-[#254F70] text-white px-3 py-1 rounded-full font-medium text-sm shadow-sm">
              <User className="w-4 h-4 mr-1 text-white opacity-80" />
              {userName === null ? 'Loading...' : userName}
            </span>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
              {activeTab === 'join-hoa' && (
              <>
                {pendingRequest && (
                  <div className="mb-6">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-blue-900 text-lg">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Your Join Request
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-white mb-6">
                          <div>
                            <p className="font-bold text-gray-900 mb-1">{pendingRequest.hoa_communities?.name}</p>
                            <div className="flex items-center text-sm text-gray-700 mb-1">
                              <Clock className="h-4 w-4 text-yellow-600 mr-1" />
                              Requested on {new Date(pendingRequest.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {pendingRequest.hoa_communities?.city}, {pendingRequest.hoa_communities?.state}
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
                            Pending
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <Home className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                      Find Your HOA Community
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                      Find and request to join your HOA community to access documents, compliance information, and communicate with your board.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                    {/* State, City, Search Inputs */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <select
                        className="border rounded px-3 py-2 text-sm"
                        value={selectedState}
                        onChange={e => setSelectedState(e.target.value)}
                      >
                        <option value="">Select State</option>
                        {/* Add your state options here */}
                        <option value="California">California</option>
                        <option value="Texas">Texas</option>
                        {/* ...other states... */}
                      </select>
                      <select
                        className="border rounded px-3 py-2 text-sm"
                        value={selectedCity}
                        onChange={e => setSelectedCity(e.target.value)}
                      >
                        <option value="">Select City</option>
                        {/* Add your city options here, or dynamically based on state */}
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="San Francisco">San Francisco</option>
                        {/* ...other cities... */}
                      </select>
                      <input
                        className="border rounded px-3 py-2 text-sm flex-1"
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    {/* Communities List */}
                    {communitiesLoading ? (
                      <div className="text-center py-4 text-gray-500">Loading communities...</div>
                    ) : communitiesError ? (
                      <div className="text-center py-4 text-red-500">{communitiesError}</div>
                    ) : hoaCommunities.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No communities found.</div>
                    ) : (
                      <div className="space-y-3">
                        {hoaCommunities.map(comm => (
                          <div key={comm.id} className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                              <div className="font-bold text-black text-lg flex items-center gap-2">
                                {comm.name}
                                <span className="ml-2 px-2 py-0.5 rounded-full border border-primary text-primary text-xs flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {comm.units || 0} members
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                {comm.city}, {comm.state}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">{comm.description}</div>
                            </div>
                            <button
                              className="mt-3 sm:mt-0 sm:ml-4 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded font-semibold text-sm flex items-center gap-2 shadow"
                              onClick={() => handleJoinRequest(comm.id)}
                              disabled={!!pendingRequest}
                            >
                              <Mail className="w-4 h-4" /> Request to Join
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    </CardContent>
                  </Card>
              </>
              )}

              {activeTab === 'messages' && (
                <HomeownerMessages />
              )}

              {activeTab === 'notices' && (
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center text-lg sm:text-xl">
                      <Bell className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
                      Notices
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      View official notices from your HOA board including violations, 
                      maintenance updates, and community announcements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <HomeownerNotices />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'chat' && (
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                        AI Assistant
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Ask questions about your HOA documents and get instant, accurate answers 
                        based on official community documents.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ChatInterface documents={hoaDocuments} />
                    </CardContent>
                  </Card>

                  {hoaDocuments.length === 0 && (
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="p-6 sm:p-8 text-center">
                        <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No documents available</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                          Your HOA board hasn't uploaded any documents yet.
                        </p>
                        <Badge variant="outline" className="text-primary border-primary text-xs sm:text-sm">
                          Check back later or contact your board
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'hoa-documents' && (
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                        HOA Documents
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        View and download official HOA documents, policies, and community guidelines 
                        uploaded by your board members.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <HOADocumentsList hoaName={userStatus.hoaName} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                        Compliance Alerts
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Stay informed about important compliance rules including pet restrictions, 
                        parking guidelines, and noise ordinances.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ComplianceAlerts />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                        Account Settings
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Manage your profile information, notification preferences, and account settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <HomeownerSettings />
                    </CardContent>
                  </Card>
                </div>
              )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default HomeownerDashboard;
