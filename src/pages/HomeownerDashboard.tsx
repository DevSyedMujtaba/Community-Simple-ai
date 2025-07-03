import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, AlertCircle, Home, User, Mail, Bell } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { HomeownerSidebar } from "@/components/layout/HomeownerSidebar";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import HOAJoinRequest from "@/components/dashboard/HOAJoinRequest";
import HomeownerSettings from "@/components/dashboard/HomeownerSettings";
import HomeownerMessages from "@/components/dashboard/HomeownerMessages";
import HOADocumentsList from "@/components/dashboard/HOADocumentsList";
import HomeownerNotices from "@/components/dashboard/HomeownerNotices";

/**
 * Homeowner Dashboard - Enhanced with sidebar navigation
 * Features comprehensive homeowner management tools with responsive design
 */
const HomeownerDashboard = () => {
  const [activeTab, setActiveTab] = useState('join-hoa');

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
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="space-y-4 sm:space-y-6">
              {activeTab === 'join-hoa' && (
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center text-lg sm:text-xl">
                        <Home className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary flex-shrink-0" />
                        Join Your HOA Community
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Find and request to join your HOA community to access documents, 
                        compliance information, and communicate with your board.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <HOAJoinRequest />
                    </CardContent>
                  </Card>
                </div>
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default HomeownerDashboard;
