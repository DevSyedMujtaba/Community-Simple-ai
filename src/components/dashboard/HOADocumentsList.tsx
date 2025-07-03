
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar, File } from "lucide-react";

interface HOADocument {
  id: string;
  name: string;
  uploadDate: string;
  summary: string;
  size?: number;
  category: string;
  uploadedBy: string;
}

interface HOADocumentsListProps {
  hoaName?: string;
}

/**
 * HOA Documents List Component
 * Displays official HOA documents uploaded by board members
 * Homeowners can view and download but not upload documents
 */
const HOADocumentsList = ({ hoaName = "Your HOA" }: HOADocumentsListProps) => {
  // Sample HOA documents - in real app this would come from the HOA's document collection
  const hoaDocuments: HOADocument[] = [
    {
      id: '1',
      name: 'CC&Rs - Covenants, Conditions & Restrictions 2024',
      uploadDate: '2024-01-10',
      summary: 'Official governing document outlining community rules, architectural guidelines, and homeowner responsibilities. Covers pet policies (80lb weight limit), parking regulations, noise ordinances (quiet hours 10 PM - 7 AM), and architectural approval processes.',
      size: 2456789,
      category: 'Governing Documents',
      uploadedBy: 'Board Secretary'
    },
    {
      id: '2', 
      name: 'Parking and Vehicle Regulations',
      uploadDate: '2024-01-08',
      summary: 'Comprehensive parking rules including assigned space policies, visitor parking procedures, and towing guidelines. Details the 2-car limit per unit, 48-hour visitor permits, and designated areas for motorcycles and recreational vehicles.',
      size: 1234567,
      category: 'Policies',
      uploadedBy: 'Property Manager'
    },
    {
      id: '3',
      name: 'Architectural Review Guidelines',
      uploadDate: '2024-01-05',
      summary: 'Standards and procedures for home modifications including paint colors, landscaping, fencing, and structural changes. Includes approved color palette, fence height restrictions (6ft max), and submission requirements for architectural requests.',
      size: 1876543,
      category: 'Guidelines',
      uploadedBy: 'Architectural Committee'
    },
    {
      id: '4',
      name: 'Community Amenities Rules',
      uploadDate: '2024-01-03',
      summary: 'Usage guidelines for community facilities including pool hours (6 AM - 10 PM), fitness center access, guest policies, and event reservation procedures. Covers safety requirements and capacity limits for common areas.',
      size: 987654,
      category: 'Amenities',
      uploadedBy: 'Facilities Manager'
    }
  ];

  // Handle document actions
  const handleViewDocument = (document: HOADocument) => {
    console.log('Viewing document:', document.name);
    // In a real implementation, this would open the document viewer
  };

  const handleDownloadDocument = (document: HOADocument) => {
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

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Governing Documents': return 'bg-red-100 text-red-800 border-red-200';
      case 'Policies': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Guidelines': return 'bg-green-100 text-green-800 border-green-200';
      case 'Amenities': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            HOA Documents ({hoaDocuments.length})
          </h2>
          <p className="text-sm text-gray-600">
            Official documents and policies from {hoaName}
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
          Read-Only Access
        </Badge>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['Governing Documents', 'Policies', 'Guidelines', 'Amenities'].map((category) => {
          const count = hoaDocuments.filter(doc => doc.category === category).length;
          return (
            <Card key={category}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{category}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {hoaDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Document Icon */}
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">
                      {document.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
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
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
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
                    <Badge variant="outline" className={getCategoryColor(document.category)}>
                      {document.category}
                    </Badge>
                    <span className="text-xs">Uploaded by {document.uploadedBy}</span>
                  </div>
                  
                  {/* Document Summary */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 p-1 rounded mr-2">
                        <FileText className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-green-900">
                        Document Summary
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs text-green-600 border-green-600">
                        Official
                      </Badge>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed">
                      {document.summary}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Footer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Need help understanding these documents?
              </p>
              <p className="text-xs text-blue-700">
                Use the AI Assistant to ask questions about any HOA document
              </p>
            </div>
            <Button variant="outline" className="text-[#254F70] border-[#254F70] hover:bg-blue-600 hover:text-white w-full sm:w-auto">
              Open AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HOADocumentsList;
