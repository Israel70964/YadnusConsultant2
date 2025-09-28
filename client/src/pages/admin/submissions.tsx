import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Trash2, 
  Eye, 
  MessageSquare,
  Search,
  Filter,
  Download,
  Mail,
  FileText,
  Calendar,
  Users
} from "lucide-react";
import type { Submission } from "@shared/schema";

export default function AdminSubmissions() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Get type filter from URL params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const typeFilter = urlParams.get('type') || 'all';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<Submission[]>({
    queryKey: ["/api/admin/submissions", typeFilter !== 'all' ? typeFilter : undefined],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/submissions/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (!searchQuery) return true;
    
    const payload = submission.payload as any;
    const searchLower = searchQuery.toLowerCase();
    
    return (
      submission.type.toLowerCase().includes(searchLower) ||
      payload.name?.toLowerCase().includes(searchLower) ||
      payload.email?.toLowerCase().includes(searchLower) ||
      payload.message?.toLowerCase().includes(searchLower) ||
      payload.description?.toLowerCase().includes(searchLower)
    );
  });

  const submissionsByType = {
    contact: submissions.filter(s => s.type === 'contact'),
    project: submissions.filter(s => s.type === 'project'),
    webinar: submissions.filter(s => s.type === 'webinar'),
    newsletter: submissions.filter(s => s.type === 'newsletter'),
  };

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case 'contact': return <MessageSquare className="w-4 h-4" />;
      case 'project': return <FileText className="w-4 h-4" />;
      case 'webinar': return <Calendar className="w-4 h-4" />;
      case 'newsletter': return <Mail className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const renderSubmissionDetails = (submission: Submission) => {
    const payload = submission.payload as any;
    
    switch (submission.type) {
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{payload.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{payload.email}</p>
              </div>
            </div>
            {payload.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-foreground">{payload.phone}</p>
              </div>
            )}
            {payload.projectType && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Project Type</label>
                <p className="text-foreground">{payload.projectType}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <p className="text-foreground whitespace-pre-wrap">{payload.message}</p>
            </div>
          </div>
        );
      
      case 'project':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{payload.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{payload.email}</p>
              </div>
            </div>
            {payload.budgetRange && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Budget Range</label>
                <p className="text-foreground">{payload.budgetRange}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-foreground whitespace-pre-wrap">{payload.description}</p>
            </div>
            {submission.attachments && submission.attachments.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                <div className="space-y-1">
                  {submission.attachments.map((attachment, index) => (
                    <p key={index} className="text-foreground text-sm">{attachment}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'webinar':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground">{payload.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{payload.email}</p>
              </div>
            </div>
            {payload.company && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p className="text-foreground">{payload.company}</p>
              </div>
            )}
            {payload.jobTitle && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                <p className="text-foreground">{payload.jobTitle}</p>
              </div>
            )}
            {payload.webinarId && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Webinar ID</label>
                <p className="text-foreground">{payload.webinarId}</p>
              </div>
            )}
          </div>
        );
      
      case 'newsletter':
        return (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground">{payload.email}</p>
          </div>
        );
      
      default:
        return (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Data</label>
            <pre className="text-foreground text-sm">{JSON.stringify(payload, null, 2)}</pre>
          </div>
        );
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Form Submissions</h1>
          <p className="text-muted-foreground">
            Review and manage submissions from your website forms.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-contact-submissions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Forms</p>
                  <p className="text-2xl font-bold text-foreground">{submissionsByType.contact.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-project-submissions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Inquiries</p>
                  <p className="text-2xl font-bold text-foreground">{submissionsByType.project.length}</p>
                </div>
                <FileText className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-webinar-submissions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Webinar Signups</p>
                  <p className="text-2xl font-bold text-foreground">{submissionsByType.webinar.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-newsletter-submissions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Newsletter Subs</p>
                  <p className="text-2xl font-bold text-foreground">{submissionsByType.newsletter.length}</p>
                </div>
                <Mail className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-submissions"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-export-submissions">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Tabs */}
        <Tabs value={typeFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all" data-testid="tab-all-submissions">All ({submissions.length})</TabsTrigger>
            <TabsTrigger value="contact" data-testid="tab-contact-submissions">Contact ({submissionsByType.contact.length})</TabsTrigger>
            <TabsTrigger value="project" data-testid="tab-project-submissions">Projects ({submissionsByType.project.length})</TabsTrigger>
            <TabsTrigger value="webinar" data-testid="tab-webinar-submissions">Webinars ({submissionsByType.webinar.length})</TabsTrigger>
            <TabsTrigger value="newsletter" data-testid="tab-newsletter-submissions">Newsletter ({submissionsByType.newsletter.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={typeFilter}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {typeFilter === 'all' ? 'All Submissions' : 
                   typeFilter === 'contact' ? 'Contact Forms' :
                   typeFilter === 'project' ? 'Project Inquiries' :
                   typeFilter === 'webinar' ? 'Webinar Signups' :
                   'Newsletter Subscriptions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submissionsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? "No submissions found" : "No submissions yet"}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search terms"
                        : "Submissions will appear here when visitors use your contact forms"
                      }
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Preview</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => {
                        const payload = submission.payload as any;
                        return (
                          <TableRow key={submission.id} data-testid={`row-submission-${submission.id}`}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getSubmissionIcon(submission.type)}
                                <Badge variant="outline" className="capitalize">
                                  {submission.type}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{payload.name || payload.email}</div>
                                {payload.name && payload.email && (
                                  <div className="text-sm text-muted-foreground">{payload.email}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {submission.type === 'newsletter' 
                                  ? `Newsletter subscription: ${payload.email}`
                                  : payload.message || payload.description || 'No preview available'
                                }
                              </p>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(submission.createdAt!).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => setSelectedSubmission(submission)}
                                      data-testid={`button-view-submission-${submission.id}`}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        {getSubmissionIcon(submission.type)}
                                        <span className="capitalize">{submission.type} Submission</span>
                                        <Badge variant="outline">{new Date(submission.createdAt!).toLocaleDateString()}</Badge>
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      {renderSubmissionDetails(submission)}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDelete(submission.id)}
                                  disabled={deleteMutation.isPending}
                                  data-testid={`button-delete-submission-${submission.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}
