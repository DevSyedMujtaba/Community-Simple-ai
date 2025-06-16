
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  onDocumentUploaded: (document: any) => void;
}

/**
 * Document Upload Component
 * Handles PDF file uploads with drag-and-drop functionality
 * Simulates AI processing and summary generation
 */
const DocumentUpload = ({ onDocumentUploaded }: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

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
  };

  // Simulate AI processing and upload
  const processFile = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadingFiles(prev => [...prev, fileId]);
    
    try {
      // Simulate upload and AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock AI summary
      const mockSummary = generateMockSummary(file.name);
      
      const processedDocument = {
        id: fileId,
        name: file.name,
        uploadDate: new Date().toISOString(),
        summary: mockSummary,
        size: file.size
      };
      
      onDocumentUploaded(processedDocument);
      
      toast({
        title: "Document processed successfully",
        description: `${file.name} has been analyzed and summarized.`
      });
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: `Failed to process ${file.name}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setUploadingFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  // Generate mock AI summary based on document name
  const generateMockSummary = (fileName: string) => {
    const summaries = [
      "Key compliance areas: Pet restrictions (2 pets max, breed restrictions apply), Parking (2 spaces per unit, guest parking limited), Noise ordinances (quiet hours 10 PM - 7 AM), Architectural changes require approval.",
      "HOA fee structure: Monthly dues $245, Special assessments for major repairs, Late fees $25 after 15 days, Payment methods accepted include online portal and check.",
      "Community rules: Pool hours 6 AM - 10 PM, Fitness center access with key fob, Guest policies (max 14 days per year), Common area reservations required for events.",
      "Violation procedures: Written notice for first offense, $50 fine for second offense, Hearing process for disputes, Appeal procedures available through board."
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  // Upload all selected files
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    // Process each file
    for (const file of selectedFiles) {
      await processFile(file);
    }
    
    // Clear selected files after upload
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Upload className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop your HOA documents here
            </p>
            <p className="text-sm text-gray-600 mt-1">
              or click to browse files
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Supports PDF files up to 25MB each
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={uploadFiles}
                className="bg-primary hover:bg-primary/90"
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
