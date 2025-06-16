
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, MessageSquare, FileText, AlertCircle, Home, User } from "lucide-react";
import Header from "@/components/layout/Header";
import DocumentUpload from "@/components/dashboard/DocumentUpload";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import DocumentList from "@/components/dashboard/DocumentList";

/**
 * Homeowner Dashboard - Main interface for homeowners to:
 * - Upload HOA documents and receive AI summaries
 * - Chat with AI about document contents
 * - View compliance alerts and rules
 * - Manage their document library
 */
const HomeownerDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{
    id: string;
    name: string;
    uploadDate: string;
    summary: string;
  }>>([]);

  // Handle document upload completion
  const handleDocumentUploaded = (document: any) => {
    setUploadedDocuments(prev => [...prev, document]);
    console.log('Document uploaded:', document);
  };

  // Navigation tabs configuration
  const tabs = [
    { id: 'upload', label: 'Upload Documents', icon: Upload },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'documents', label: 'My Documents', icon: FileText },
    { id: 'alerts', label: 'Compliance Alerts', icon: AlertCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Homeowner Dashboard</h1>
                <p className="text-gray-600">Manage your HOA documents and compliance</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="h-5 w-5 mr-2" />
              <span>Welcome, Homeowner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
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
                  <ChatInterface documents={uploadedDocuments} />
                </CardContent>
              </Card>
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
                  <DocumentList documents={uploadedDocuments} />
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
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
