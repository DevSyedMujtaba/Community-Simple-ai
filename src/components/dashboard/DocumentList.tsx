import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar, File } from "lucide-react";

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  summary: string;
  size?: number;
}

interface DocumentListProps {
  documents: Document[];
}

/**
 * Document List Component
 * Displays uploaded documents with summaries and management options
 * Provides document viewing, downloading, and summary display
 */
const DocumentList = ({ documents }: DocumentListProps) => {
  // Handle document actions
  const handleViewDocument = (document: Document) => {
    console.log('Viewing document:', document.name);
    // In a real implementation, this would open the document viewer
  };

  const handleDownloadDocument = (document: Document) => {
    console.log('Downloading document:', document.name);
    // In a real implementation, this would trigger the download
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format upload date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (documents.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
          <p className="text-gray-600 mb-4">
            Upload your first HOA document to get started with AI-powered summaries and Q&A.
          </p>
          <p className="text-sm text-gray-500">
            Supported format: PDF files up to 25MB
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Document Count Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Your Documents ({documents.length})
          </h3>
          <p className="text-sm text-gray-600">
            AI-analyzed HOA documents and summaries
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          All Processed
        </Badge>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((document, index) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Document Icon */}
                <div className="flex-shrink-0">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                
                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {document.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(document)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(document)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  {/* Document Meta */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(document.uploadDate)}
                    </div>
                    {document.size && (
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-1" />
                        {formatFileSize(document.size)}
                      </div>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      PDF Document
                    </Badge>
                  </div>
                  
                  {/* AI Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-1 rounded mr-2">
                        <FileText className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-blue-900">
                        AI Summary
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs text-blue-600 border-blue-600">
                        Auto-generated
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {document.summary}
                    </p>
                  </div>
                  
                  {/* Compliance Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Pet Policy
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Parking Rules
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Noise Ordinance
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      HOA Fees
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions Footer */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ready to ask questions?
              </p>
              <p className="text-xs text-gray-600">
                Use the AI Assistant tab to chat about your documents
              </p>
            </div>
            <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
              Open AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentList;
