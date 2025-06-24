
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
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">Homeowner Dashboard</span>
              {userStatus.isJoinedToHOA && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {userStatus.hoaName}
                </Badge>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6">
            <div className="space-y-6">
              {activeTab === 'join-hoa' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Home className="h-6 w-6 mr-2 text-primary" />
                        Join Your HOA Community
                      </CardTitle>
                      <CardDescription>
                        Find and request to join your HOA community to access documents, 
                        compliance information, and communicate with your board.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-6 w-6 mr-2 text-primary" />
                      Notices
                    </CardTitle>
                    <CardDescription>
                      View official notices from your HOA board including violations, 
                      maintenance updates, and community announcements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <HomeownerNotices />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'chat' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                        AI Assistant
                      </CardTitle>
                      <CardDescription>
                        Ask questions about your HOA documents and get instant, accurate answers 
                        based on official community documents.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChatInterface documents={hoaDocuments} />
                    </CardContent>
                  </Card>

                  {hoaDocuments.length === 0 && (
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents available</h3>
                        <p className="text-gray-600 mb-4">
                          Your HOA board hasn't uploaded any documents yet.
                        </p>
                        <Badge variant="outline" className="text-primary border-primary">
                          Check back later or contact your board
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'hoa-documents' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-6 w-6 mr-2 text-primary" />
                        HOA Documents
                      </CardTitle>
                      <CardDescription>
                        View and download official HOA documents, policies, and community guidelines 
                        uploaded by your board members.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <HOADocumentsList hoaName={userStatus.hoaName} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="h-6 w-6 mr-2 text-primary" />
                        Compliance Alerts
                      </CardTitle>
                      <CardDescription>
                        Stay informed about important compliance rules including pet restrictions, 
                        parking guidelines, and noise ordinances.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ComplianceAlerts />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-6 w-6 mr-2 text-primary" />
                        Account Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your profile information, notification preferences, and account settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
