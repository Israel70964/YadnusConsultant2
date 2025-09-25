import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Upload, Trash2, Eye, Download, Image, FileText, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { File } from "@shared/schema";

interface FileWithUrl extends File {
  url: string;
}

interface FileManagerProps {
  category?: string;
  relatedId?: string;
  relatedType?: string;
  title?: string;
  allowedTypes?: string[];
  maxFiles?: number;
}

export function FileManager({
  category = "media",
  relatedId,
  relatedType,
  title = "File Manager",
  allowedTypes,
  maxFiles = 10,
}: FileManagerProps) {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadCategory, setUploadCategory] = useState(category);

  const { data: files = [], isLoading } = useQuery<FileWithUrl[]>({
    queryKey: ["/api/files", { category: uploadCategory, relatedId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (uploadCategory) params.append("category", uploadCategory);
      if (relatedId) params.append("relatedId", relatedId);
      
      const response = await fetch(`/api/files?${params}`);
      if (!response.ok) throw new Error("Failed to fetch files");
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/upload-multiple", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      setSelectedFiles(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      await apiRequest("DELETE", `/api/files/${fileId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.length > maxFiles) {
      toast({
        title: "Error",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Check file type if restrictions are set
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: `File type ${file.type} not allowed`,
          variant: "destructive",
        });
        return;
      }
      
      formData.append("files", file);
    }
    
    formData.append("category", uploadCategory);
    if (relatedId) formData.append("relatedId", relatedId);
    if (relatedType) formData.append("relatedType", relatedType);

    uploadMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (mimeType.includes("pdf") || mimeType.includes("document")) return <FileText className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "bg-green-100 text-green-800";
    if (mimeType.includes("pdf")) return "bg-red-100 text-red-800";
    if (mimeType.includes("document")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file-upload">Select Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept={allowedTypes?.join(",")}
                onChange={(e) => setSelectedFiles(e.target.files)}
                data-testid="input-file-upload"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger data-testid="select-file-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="project">Project Files</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={handleFileUpload}
            disabled={!selectedFiles || uploadMutation.isPending}
            className="w-full"
            data-testid="button-upload-files"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadMutation.isPending ? "Uploading..." : "Upload Files"}
          </Button>
        </div>

        {/* Files List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Files</h3>
          
          {isLoading ? (
            <div className="text-center py-4">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No files uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`file-item-${file.id}`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.mimeType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.originalName}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getFileTypeColor(file.mimeType)}>
                          {file.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.mimeType.startsWith("image/") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                        data-testid={`button-preview-${file.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = file.url;
                        link.download = file.originalName;
                        link.click();
                      }}
                      data-testid={`button-download-${file.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(file.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${file.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}