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
      <div className="space-y-3">
        {documents.map((document, index) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-4 min-w-0">
                {/* Document Icon */}
                <div className="flex-shrink-0 mx-auto xs:mx-0">
                  <div className="bg-red-100 p-2 xs:p-3 rounded-lg">
                    <FileText className="h-5 w-5 xs:h-6 xs:w-6 text-red-600" />
                  </div>
                </div>
                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-medium text-gray-900 truncate min-w-0">{document.name}</h4>
                    <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(document)}
                        className="text-gray-600 hover:text-gray-900 w-full xs:w-auto"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadDocument(document)}
                        className="text-gray-600 hover:text-gray-900 w-full xs:w-auto"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  {/* Document Meta */}
                  <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-gray-600 mb-2 min-w-0">
                    <div className="flex items-center min-w-0">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{formatDate(document.uploadDate)}</span>
                    </div>
                    {document.size && (
                      <div className="flex items-center min-w-0">
                        <File className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{formatFileSize(document.size)}</span>
                      </div>
                    )}
                    <Badge variant="secondary" className="text-xs">PDF Document</Badge>
                  </div>
                  {/* AI Summary */}
                  <div className="text-xs sm:text-sm text-gray-700 break-words min-w-0">
                      {document.summary}
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
            <Button variant="outline" className="text-[#254F70] border-[#254F70] hover:bg-primary hover:text-white">
              Open AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentList;
