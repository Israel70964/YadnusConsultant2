import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { projectInquirySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload, X } from "lucide-react";
import type { z } from "zod";

type ProjectInquiryData = z.infer<typeof projectInquirySchema>;

export default function ProjectInquiry() {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ProjectInquiryData>({
    resolver: zodResolver(projectInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      budgetRange: "",
      description: "",
    },
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: ProjectInquiryData) => {
      const formData = new FormData();
      
      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add files
      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/project-inquiry', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your project inquiry. We'll get back to you within 24 hours!",
      });
      form.reset();
      setFiles([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit project inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectInquiryData) => {
    inquiryMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card data-testid="form-project-inquiry">
      <CardHeader>
        <CardTitle>Project Inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} data-testid="input-inquiry-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} data-testid="input-inquiry-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-budget-range">
                        <SelectValue placeholder="Select budget range (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="under-50k">Under $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="over-1m">Over $1,000,000</SelectItem>
                      <SelectItem value="tbd">To be determined</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={6} 
                      placeholder="Describe your project in detail. Include scope, timeline, location, and any specific requirements..." 
                      className="resize-none" 
                      {...field} 
                      data-testid="textarea-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* File Upload */}
            <div>
              <FormLabel>Project Files (Optional)</FormLabel>
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center mt-2 hover:border-primary transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <CloudUpload className="mx-auto text-muted-foreground text-2xl mb-2" />
                <p className="text-muted-foreground text-sm mb-2">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Plans, sketches, photos, documents (PDF, DOC, images up to 10MB each)
                </p>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
                  className="hidden" 
                  id="file-upload"
                  data-testid="input-project-files"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Select Files
                </Button>
              </div>
              
              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Selected Files:</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          data-testid={`button-remove-file-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={inquiryMutation.isPending}
              data-testid="button-submit-inquiry"
            >
              {inquiryMutation.isPending ? "Submitting..." : "Submit Project Inquiry"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We'll review your inquiry and respond within 24 hours. For urgent matters, please call us directly.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
