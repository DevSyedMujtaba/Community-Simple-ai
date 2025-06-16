import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, MessageSquare, FileText, AlertCircle, Home, User } from "lucide-react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import { HomeownerSidebar } from "@/components/layout/HomeownerSidebar";
import DocumentUpload from "@/components/dashboard/DocumentUpload";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import DocumentList from "@/components/dashboard/DocumentList";
import HOAJoinRequest from "@/components/dashboard/HOAJoinRequest";
import HomeownerSettings from "@/components/dashboard/HomeownerSettings";

/**
 * Homeowner Dashboard - Enhanced with sidebar navigation
 * Features comprehensive homeowner management tools with responsive design
 */
const HomeownerDashboard = () => {
  const [activeTab, setActiveTab] = useState('join-hoa');
  const [documents, setDocuments] = useState<Array<{
    id: string;
    name: string;
    uploadDate: string;
    summary: string;
    size?: number;
  }>>([]);

  // User status - in real app this would come from authentication
  const userStatus = {
    isJoinedToHOA: false, // Set to true if user has joined an HOA
    hoaName: 'Sunrise Valley HOA',
    pendingDocuments: documents.length
  };

  // Handle document upload completion
  const handleDocumentUploaded = (document: any) => {
    setDocuments(prev => [...prev, document]);
    console.log('Document uploaded:', document);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gray-50">
        <HomeownerSidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hoaName={userStatus.isJoinedToHOA ? userStatus.hoaName : "Select HOA"}
          pendingDocuments={userStatus.pendingDocuments}
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
          <main className="flex-1 p-6">
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

              {activeTab === 'upload' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Upload className="h-6 w-6 mr-2 text-primary" />
                        Upload HOA Documents
                      </CardTitle>
                      <CardDescription>
                        Upload your HOA documents to receive AI-powered plain-English summaries 
                        and enable chat-based Q&A support.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
                    </CardContent>
                  </Card>

                  {/* Quick Upload Tips */}
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg mt-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Upload Tips</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Upload CC&Rs, bylaws, and community rules</li>
                            <li>• Maximum file size: 25MB per document</li>
                            <li>• AI analysis typically takes 1-2 minutes</li>
                            <li>• Documents are processed securely and privately</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                        based on your uploaded documents.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChatInterface documents={documents} />
                    </CardContent>
                  </Card>

                  {documents.length === 0 && (
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="p-8 text-center">
                        <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents to chat about</h3>
                        <p className="text-gray-600 mb-4">
                          Upload your HOA documents first to start asking questions.
                        </p>
                        <Badge variant="outline" className="text-primary border-primary">
                          Upload documents in the "Upload Documents" tab
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-6 w-6 mr-2 text-primary" />
                        Document Library
                      </CardTitle>
                      <CardDescription>
                        View and manage all your uploaded HOA documents and their AI-generated summaries.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DocumentList documents={documents} />
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
