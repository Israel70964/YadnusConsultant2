import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Video,
  Search,
  Calendar,
  Users
} from "lucide-react";
import { insertWebinarSchema } from "@shared/schema";
import type { Webinar } from "@shared/schema";
import type { z } from "zod";

type WebinarFormData = z.infer<typeof insertWebinarSchema>;

export default function AdminWebinars() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Show loading state while auth is loading
  if (isLoading) {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  const { data: webinars = [], isLoading: webinarsLoading } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars"],
    enabled: isAuthenticated,
  });

  const form = useForm<WebinarFormData>({
    resolver: zodResolver(insertWebinarSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      speakers: [],
      videoUrl: "",
      thumbnailUrl: "",
      isLive: false,
      registrationCount: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: WebinarFormData) => {
      // Ensure date is properly formatted
      const formattedData = {
        ...data,
        date: data.date instanceof Date ? data.date : new Date(data.date),
      };
      await apiRequest("POST", "/api/webinars", formattedData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webinar created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create webinar",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WebinarFormData> }) => {
      await apiRequest("PUT", `/api/webinars/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webinar updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      setEditingWebinar(null);
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update webinar",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/webinars/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webinar deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete webinar",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (webinar: Webinar) => {
    setEditingWebinar(webinar);
    form.reset({
      title: webinar.title,
      description: webinar.description,
      date: new Date(webinar.date),
      speakers: webinar.speakers as any[] || [],
      videoUrl: webinar.videoUrl || "",
      thumbnailUrl: webinar.thumbnailUrl || "",
      isLive: webinar.isLive,
      registrationCount: webinar.registrationCount || 0,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this webinar?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: WebinarFormData) => {
    if (editingWebinar) {
      updateMutation.mutate({ id: editingWebinar.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredWebinars = webinars.filter(webinar =>
    !searchQuery || 
    webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webinar.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingWebinars = webinars.filter(w => new Date(w.date) > new Date());
  const pastWebinars = webinars.filter(w => new Date(w.date) <= new Date());

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Webinars</h1>
            <p className="text-muted-foreground">
              Manage your webinar series and educational content.
            </p>
          </div>
          <Dialog open={isCreateDialogOpen || !!editingWebinar} onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingWebinar(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-webinar">
                <Plus className="w-4 h-4 mr-2" />
                Create Webinar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingWebinar ? "Edit Webinar" : "Create New Webinar"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter webinar title" {...field} data-testid="input-webinar-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the webinar..." rows={4} {...field} data-testid="textarea-webinar-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time *</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            value={field.value instanceof Date && !isNaN(field.value.getTime()) ? field.value.toISOString().slice(0, 16) : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : new Date())}
                            data-testid="input-webinar-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/..." {...field} data-testid="input-webinar-video" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thumbnail URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} data-testid="input-webinar-thumbnail" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isLive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Live Webinar</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Mark as upcoming/live webinar
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-webinar-live"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        setEditingWebinar(null);
                        form.reset();
                      }}
                      data-testid="button-cancel-webinar"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-save-webinar"
                    >
                      {createMutation.isPending || updateMutation.isPending 
                        ? "Saving..." 
                        : editingWebinar ? "Update Webinar" : "Create Webinar"
                      }
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search webinars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-webinars"
                />
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <span>Total: {webinars.length}</span>
                <span>Upcoming: {upcomingWebinars.length}</span>
                <span>Past: {pastWebinars.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webinars Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Webinars</CardTitle>
          </CardHeader>
          <CardContent>
            {webinarsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredWebinars.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery ? "No webinars found" : "No webinars yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "Try adjusting your search terms"
                    : "Create your first webinar to start educating your audience"
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-webinar">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Webinar
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registrations</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWebinars.map((webinar) => {
                    const isUpcoming = new Date(webinar.date) > new Date();
                    return (
                      <TableRow key={webinar.id} data-testid={`row-webinar-${webinar.id}`}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="line-clamp-1">{webinar.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                              {webinar.description.substring(0, 50)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div>{new Date(webinar.date).toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(webinar.date).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isUpcoming ? "default" : "secondary"}>
                            {isUpcoming ? "Upcoming" : "Past"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{webinar.registrationCount || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(webinar.createdAt!).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="ghost" size="sm" data-testid={`button-view-webinar-${webinar.id}`}>
                              <a href={`/webinars/${webinar.id}`} target="_blank">
                                <Eye className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(webinar)}
                              data-testid={`button-edit-webinar-${webinar.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(webinar.id)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-webinar-${webinar.id}`}
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
      </div>
      
      <Footer />
    </div>
  );
}
