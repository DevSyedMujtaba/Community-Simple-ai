/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { extractTextFromPDF } from "@/lib/pdfExtract";

interface DocumentUploadProps {
  onDocumentUploaded: (document: any) => void;
  hoaId: string; // <-- Add this prop
}

/**
 * Document Upload Component
 * Handles PDF file uploads with drag-and-drop functionality
 * Simulates AI processing and summary generation
 */
const DocumentUpload = ({ onDocumentUploaded, hoaId }: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [fileCategories, setFileCategories] = useState<{ [fileName: string]: string }>({});

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || "");
    };
    fetchUser();
  }, []);

  // Handle drag events for file upload
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== droppedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload only PDF files.",
        variant: "destructive"
      });
    }
    
    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles]);
    }
  }, [toast]);

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFileCategories(prev => {
      const newCategories = { ...prev };
      if (selectedFiles[index]) delete newCategories[selectedFiles[index].name];
      return newCategories;
    });
  };

  // Upload and process a file
  const processFile = async (file: File) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    const category = fileCategories[file.name];
    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category for each file.",
        variant: "destructive"
      });
      return;
    }
    if (!hoaId) {
      toast({
        title: "Missing HOA",
        description: "No HOA selected. Please select an HOA before uploading.",
        variant: "destructive"
      });
      return;
    }
    if (!userId) {
      toast({
        title: "Missing User",
        description: "User not authenticated. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload documents.",
        variant: "destructive",
      });
      return;
    }
    const accessToken = session.access_token;

    const fileId = `${file.name}-${Date.now()}`;
    setUploadingFiles(prev => [...prev, fileId]);
    try {
      // 1. Upload to Supabase Storage
      const filePath = `community-${hoaId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('hoa-documents')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage.from('hoa-documents').getPublicUrl(filePath);

      // 3. Insert metadata into DB and get the inserted row (to get the document id)
      const { data: inserted, error: dbError } = await supabase.from('hoa_documents').insert([
        {
          hoa_id: hoaId,
          uploader_id: userId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          size_bytes: file.size,
          mime_type: file.type,
          status: 'processing',
          category
        }
      ]).select().single();
      if (dbError || !inserted) throw dbError || new Error("Failed to insert document record");

      // 4. Extract text from PDF in browser
      const text = await extractTextFromPDF(file);

      // 5. Call Supabase Edge Function for summarization with Authorization header
      const summarizeRes = await fetch("https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/summarize-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ document_id: inserted.id, text }),
      });
      const summarizeData = await summarizeRes.json();
      // Log token usage if available
      if (summarizeData.tokens_used) {
        await supabase.from('token_usage').insert([
          {
            user_id: userId,
            tokens_used: summarizeData.tokens_used,
            created_at: new Date().toISOString(),
          }
        ]);
      }

      // 5b. Call compliance extraction Edge Function (with auth header)
      try {
        const complianceRes = await fetch("https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/extract_compliance_alerts", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`
          },
          body: (() => {
            const fd = new FormData();
            fd.append("hoa_id", hoaId);
            fd.append("text", text);
            return fd;
          })(),
        });
        const complianceResult = await complianceRes.json();
        if (!complianceRes.ok || !complianceResult.success) {
          toast({
            title: "Compliance Extraction Failed",
            description: complianceResult.error || "Could not extract compliance alerts from the document.",
            variant: "destructive"
          });
        }
      } catch (err) {
        toast({
          title: "Compliance Extraction Error",
          description: err?.message || "Could not extract compliance alerts from the document.",
          variant: "destructive"
        });
      }

      // 6. Notify parent and show toast
      onDocumentUploaded(inserted);
      toast({
        title: "Document uploaded successfully",
        description: `${file.name} has been uploaded and is being summarized.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploadingFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  // Upload all selected files
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    // Check all categories selected
    for (const file of selectedFiles) {
      if (!fileCategories[file.name]) {
        toast({
          title: "Category required",
          description: `Please select a category for ${file.name} before uploading.`,
          variant: "destructive"
        });
        return;
      }
    }
    // Process each file
    for (const file of selectedFiles) {
      await processFile(file);
    }
    // Clear selected files and categories after upload
    setSelectedFiles([]);
    setFileCategories({});
  };

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 xs:p-6 sm:p-8 text-center transition-colors w-full min-w-0 ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2 xs:space-y-3">
          <div className="mx-auto w-10 h-10 xs:w-12 xs:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Upload className="h-5 w-5 xs:h-6 xs:w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-base xs:text-lg font-medium text-gray-900 break-words">Drop your HOA documents here</p>
            <p className="text-xs xs:text-sm text-gray-600 mt-1 break-words">or click to browse files</p>
          </div>
          <p className="text-xs text-gray-500 break-words">Supports PDF files up to 25MB each</p>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <Card className="w-full max-w-xs mx-auto sm:max-w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4">
            <h3 className="font-medium text-gray-900 mb-2 xs:mb-4">Selected Files</h3>
            <div className="space-y-2 xs:space-y-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-2 xs:p-3 bg-gray-50 rounded-lg min-w-0 w-full">
                  <div className="flex items-center gap-2 min-w-0 w-full">
                    <FileText className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div className="min-w-0 w-full">
                      <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-gray-900 truncate min-w-0 w-full">{file.name}</p>
                      <p className="text-xs xs:text-sm text-gray-600 truncate min-w-0 w-full">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <select
                      value={fileCategories[file.name] || ""}
                      onChange={e => setFileCategories(prev => ({ ...prev, [file.name]: e.target.value }))}
                      className="ml-4 border rounded px-2 py-1 text-sm"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Governing Documents">Governing Documents</option>
                      <option value="Policies">Policies</option>
                      <option value="Guidelines">Guidelines</option>
                      <option value="Amenities">Amenities</option>
                    </select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-600 w-full xs:w-auto mx-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-2 xs:mt-4 flex flex-col xs:flex-row xs:justify-end gap-2">
              <Button 
                onClick={uploadFiles}
                className="bg-primary hover:bg-primary/90 w-auto mx-auto xs:w-auto h-8 text-xs px-3 py-1 sm:h-11 sm:text-base sm:px-6 sm:py-2"
                disabled={uploadingFiles.length > 0}
              >
                {uploadingFiles.length > 0 ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Process
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {uploadingFiles.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Processing Documents</p>
                <p className="text-sm text-blue-700">
                  AI is analyzing your documents and generating summaries...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;
