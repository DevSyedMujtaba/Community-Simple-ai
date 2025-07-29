/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar, File } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

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
  hoaName: string;
  onNavigateToChat: () => void;
  hoaId?: string;
  refreshTrigger?: number;
}

/**
 * HOA Documents List Component for Homeowners
 * Provides read-only access to official community documents
 * and links to the AI Assistant for document queries.
 */
const HOADocumentsList = ({ hoaName, onNavigateToChat, hoaId, refreshTrigger }: HOADocumentsListProps) => {
  // State for real documents
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || "");
    };
    fetchUser();
  }, []);

  // Helper function to transform a raw DB record into the state shape
  const transformDocument = (doc: any) => ({
    id: doc.id,
    name: doc.file_name,
    uploadDate: doc.uploaded_at,
    summary: doc.summary || '',
    size: doc.size_bytes,
    category: doc.category || 'Guidelines',
    uploadedBy: doc.profiles ? `${doc.profiles.first_name || ''} ${doc.profiles.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
    fileUrl: doc.file_url
  });

  // Fetch documents for this HOA
  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      if (!hoaId) { setDocuments([]); setLoading(false); return; }
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;
      const { data, error } = await supabase
        .from('hoa_documents')
        .select('*, profiles:profiles!uploader_id(first_name, last_name, role)')
        .eq('hoa_id', hoaId)
        .order('uploaded_at', { ascending: false });
      // Only show: (1) board/admin uploads, (2) docs uploaded by current user
      const filteredDocs = (data || []).filter(doc =>
        (doc.uploader_id === null) ||
        (doc.profiles && (doc.profiles.role === 'board' || doc.profiles.role === 'admin')) ||
        (doc.uploader_id === currentUserId)
      );
      const transformedDocs = filteredDocs.map(transformDocument);
      setDocuments(transformedDocs);
      setLoading(false);
    };
    fetchDocs();
  }, [hoaId, uploadSuccess, refreshTrigger]);

  // Real-time subscription for document updates
  useEffect(() => {
    if (!hoaId) return;

    const channel = supabase
      .channel(`documents-realtime-homeowner-${hoaId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'hoa_documents',
          filter: `hoa_id=eq.${hoaId}`,
        },
        (payload) => {
          console.log("Homeowner realtime event received:", payload.eventType);
          
          // For UPDATE events, update the document immediately
          if (payload.eventType === 'UPDATE' && payload.new) {
            const newDoc = payload.new;
            setDocuments(prev => prev.map(doc => 
              doc.id === newDoc.id 
                ? transformDocument(newDoc)
                : doc
            ));
            return; // Don't trigger full refresh for updates
          }
          
          // For INSERT and DELETE events, trigger full refresh
          setUploadSuccess(prev => prev === "" ? "refresh" : prev);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log("Homeowner successfully subscribed to document changes");
        } else if (status === 'CHANNEL_ERROR') {
          console.error("Homeowner realtime subscription error");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hoaId]);

  // Handle file input change (from drag-and-drop or click)
  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAndProcess = async () => {
    setUploadError("");
    setUploadSuccess("");
    setUploading(true);
    const file = selectedFile;
    if (!file || !hoaId || !userId) {
      setUploadError("Missing file, HOA, or user info.");
      setUploading(false);
      return;
    }
    const filePath = `community-${hoaId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('hoa-documents')
      .upload(filePath, file);
    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('hoa-documents').getPublicUrl(filePath);
    const { data: insertData, error: dbError } = await supabase.from('hoa_documents').insert([{
      hoa_id: hoaId,
      uploader_id: userId,
      file_name: file.name,
      file_url: urlData.publicUrl,
      size_bytes: file.size,
      mime_type: file.type,
      status: 'processing'
    }]).select();
    
    if (dbError) {
      setUploadError(dbError.message);
      setUploading(false);
      return;
    }

    // Add the new document optimistically to the list
    if (insertData && insertData.length > 0) {
      const newDoc = insertData[0];
      const transformedDoc = transformDocument(newDoc);
      setDocuments(prev => [transformedDoc, ...prev]);
    }

    setUploadSuccess("File uploaded successfully!");
    setUploading(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
            HOA Documents ({documents.length})
          </h2>
          <p className="text-sm text-gray-600">
            Official documents and policies from {hoaName}
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600 w-fit">
          Read-Only Access
        </Badge>
      </div>

      {/* File upload UI for board members */}
      {/* <div className="mb-6">
       
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ position: 'relative' }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            disabled={uploading}
            className="mt-2"
          />
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 rounded-full p-3 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
            </div>
            <span className="font-semibold text-lg text-gray-800">Drop your HOA documents here</span>
            <span className="text-sm text-gray-600">or click to browse files</span>
            <span className="text-xs text-gray-400 mt-1">Supports PDF files up to 25MB each</span>
            {uploadError && <div className="text-red-600 text-sm mt-2">{uploadError}</div>}
            {uploadSuccess && <div className="text-green-600 text-sm mt-2">{uploadSuccess}</div>}
          </div>
        </div>
        
        {selectedFile && (
          <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="text-red-500" />
                <span className="font-semibold">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button className="text-gray-400 hover:text-red-500" onClick={() => setSelectedFile(null)}>&times;</button>
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base mt-2"
              onClick={handleUploadAndProcess}
              disabled={uploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
              Upload & Process
            </Button>
          </div>
        )}
      </div> */}

      {/* Document Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['Governing Documents', 'Policies', 'Guidelines', 'Amenities'].map((category) => {
          const count = documents.filter(doc => doc.category === category).length;
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
        {loading ? (
          <div>Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-gray-500">No documents uploaded yet.</div>
        ) : (
          documents.map((document) => (
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
                      <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        {document.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(document.fileUrl, '_blank')}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(document.fileUrl, '_blank')}
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
                        {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                      </div>
                      {document.size && (
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-1" />
                          {formatFileSize(document.size)}
                        </div>
                      )}
                      {document.category && (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-xs font-semibold ${getCategoryColor(document.category)}`}
                        >
                          {document.category}
                        </span>
                      )}
                      <span className="text-xs">
                        Uploaded by {document.uploadedBy}
                      </span>
                    </div>
                    {/* Document Summary (if available) */}
                    {document.summary ? (
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
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          <span className="text-sm text-gray-600">
                            AI summary is being generated...
                          </span>
                          <span className="ml-1 text-xs text-gray-400">(This may take a few moments)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* AI Assistant Call to Action */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="font-semibold text-blue-900">Need help understanding these documents?</h4>
            <p className="text-sm text-blue-800">Use the AI Assistant to ask questions about any HOA document.</p>
          </div>
          <Button 
            variant="outline" 
            className="bg-white text-blue-700 border-blue-300 hover:bg-blue-100 w-full sm:w-auto flex-shrink-0"
            onClick={onNavigateToChat}
          >
            Open AI Assistant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HOADocumentsList;
