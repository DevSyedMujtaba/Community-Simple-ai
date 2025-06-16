
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, FileText, Settings, Mail, TrendingUp } from "lucide-react";
import Header from "@/components/layout/Header";
import BoardNavigation from "@/components/dashboard/BoardNavigation";
import MessageCenter from "@/components/dashboard/MessageCenter";
import CommunityManagement from "@/components/dashboard/CommunityManagement";
import ComplianceOverview from "@/components/dashboard/ComplianceOverview";
import DocumentList from "@/components/dashboard/DocumentList";
import DocumentUpload from "@/components/dashboard/DocumentUpload";
import ChatInterface from "@/components/dashboard/ChatInterface";
import HOAManagement from "@/components/dashboard/HOAManagement";
import ResidentsManagement from "@/components/dashboard/ResidentsManagement";
import NoticeGeneration from "@/components/dashboard/NoticeGeneration";

/**
 * Board Member Dashboard - Enhanced with mobile navigation
 * Features comprehensive HOA management tools for board members
 */
const BoardDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample community statistics
  const communityStats = {
    totalHomes: 156,
    activeMember: 142,
    pendingCompliance: 8,
    messagesThisWeek: 23,
    pendingRequests: 3
  };

  // Sample documents for the documents tab
  const sampleDocuments = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header - Desktop Only */}
      <div className="hidden lg:block bg-white shadow-sm">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <BoardNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          communityName="Sunrise Valley HOA"
          pendingRequests={communityStats.pendingRequests}
        />

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

          {activeTab === 'hoa-management' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-6 w-6 mr-2 text-primary" />
                  HOA Management
                </CardTitle>
                <CardDescription>
                  Create and manage HOA communities with geographic tagging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HOAManagement />
              </CardContent>
            </Card>
          )}

          {activeTab === 'residents' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-primary" />
                  Residents Management
                </CardTitle>
                <CardDescription>
                  Invite homeowners, approve requests, and manage resident accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResidentsManagement />
              </CardContent>
            </Card>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-primary" />
                    Document Management
                  </CardTitle>
                  <CardDescription>
                    Upload official governing documents and view AI summaries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentUpload />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                  <CardDescription>
                    AI-analyzed documents with summaries and Q&A support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentList documents={sampleDocuments} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Ask questions about your uploaded documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChatInterface />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                    Communications Center
                  </CardTitle>
                  <CardDescription>
                    Message individual residents and broadcast community updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MessageCenter />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notice Generation</CardTitle>
                  <CardDescription>
                    Create and send official notices to residents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NoticeGeneration />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'compliance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-primary" />
                  Compliance Monitor
                </CardTitle>
                <CardDescription>
                  Track violations, generate notices, and monitor community compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplianceOverview />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDashboard;
