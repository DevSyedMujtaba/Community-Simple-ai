import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Download, Eye, Calendar, File, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  summary: string;
  size?: number;
  file_url?: string;
  status?: string;
}

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onDeleteDocument?: (documentId: string) => Promise<void>;
}

/**
 * Document List Component
 * Displays uploaded documents with summaries and management options
 * Provides document viewing, downloading, and summary display
 */
const DocumentList = ({ documents, loading, onToggleChat, isChatOpen, onDeleteDocument }: DocumentListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle document actions
  const handleViewDocument = (document: Document) => {
    if (document.file_url) {
      window.open(document.file_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadDocument = (doc: Document) => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteClick = (documentId: string, documentName: string) => {
    setDocumentToDelete({ id: documentId, name: documentName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (documentToDelete && onDeleteDocument) {
      setIsDeleting(true);
      try {
        await onDeleteDocument(documentToDelete.id);
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
      } catch (error) {
        console.error('Error deleting document:', error);
        // Error is already handled by the parent component
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
    setIsDeleting(false);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 Bytes';
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

  if (loading) {
    return <div>Loading documents...</div>;
  }

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
    <div className="space-y-4 w-full max-w-full px-2 sm:px-4 mx-auto box-border">
      {/* Document Count Header */}
      <div className="flex items-center justify-between flex-wrap w-full min-w-0">
        <div>
          <div className="flex items-center gap-2 mt-8">
            <FileText className="h-5 w-5 text-[#254F70]" />
            <CardTitle className="text-lg sm:text-xl">Uploaded Documents</CardTitle>
          </div>
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

      {/* Uploaded Documents Title */}
      

      {/* Documents List */}
      <div className="space-y-3 w-full min-w-0">
        {documents.map((document, index) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow w-full max-w-full box-border">
            <CardContent className="p-3 sm:p-4 w-full max-w-full box-border">
              <div className="flex flex-col xs:flex-row xs:items-start gap-2 xs:gap-4 min-w-0 w-full flex-wrap">
                {/* Document Icon */}
                <div className="flex-shrink-0 mx-auto xs:mx-0">
                  <div className="bg-red-100 p-2 xs:p-3 rounded-lg">
                    <FileText className="h-5 w-5 xs:h-6 xs:w-6 text-red-600" />
                  </div>
                </div>
                {/* Document Info */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-1 min-w-0 w-full flex-wrap">
                    <h4 className="text-[8px] sm:text-lg font-medium text-gray-900 truncate w-full min-w-0 flex-1 xs:w-auto">{document.name}</h4>
                    <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto flex-wrap min-w-0 max-w-full flex-shrink overflow-hidden break-all sm:break-normal">
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
                      {onDeleteDocument && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(document.id, document.name)}
                          className="text-red-600 hover:text-red-900 w-full xs:w-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {isDeleting ? (
                            <>
                              Deleting...
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Document Meta */}
                  <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 text-xs sm:text-sm text-gray-600 mb-2 min-w-0 w-full flex-wrap">
                    <div className="flex items-center min-w-0 w-full xs:w-auto">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate break-all sm:break-normal w-full xs:w-auto">{formatDate(document.uploadDate)}</span>
                    </div>
                    {document.size && (
                      <div className="flex items-center min-w-0 w-full xs:w-auto">
                        <File className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate break-all sm:break-normal w-full xs:w-auto">{formatFileSize(document.size)}</span>
                      </div>
                    )}
                    <Badge variant="secondary" className="text-xs">PDF Document</Badge>
                  </div>
                  {/* AI Summary */}
                  {document.summary && document.summary.trim() !== '' ? (
                    <div className="text-xs sm:text-sm text-gray-700 break-words min-w-0 w-full">
                        {document.summary}
                    </div>
                  ) : document.status === 'processing' ? (
                    <div className="text-xs sm:text-sm text-gray-500 italic flex items-center w-full">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      AI summary is being generated...
                      <span className="ml-1 text-[10px] text-gray-400">(This may take a few moments)</span>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-gray-500 italic">
                      No AI summary available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions Footer */}
      <Card className="bg-gray-50 w-full max-w-full box-border">
        
        <CardContent className="p-4 w-full max-w-full box-border">
          <div className="flex items-center justify-between flex-wrap w-full min-w-0">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ready to ask questions?
              </p>
              <p className="text-xs text-gray-600">
                Use the AI Assistant tab to chat about your documents
              </p>
            </div>
            <Button 
              variant="outline" 
              className="text-[#254F70] border-[#254F70] hover:bg-primary hover:text-white"
              onClick={onToggleChat}
            >
              {isChatOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentList;
