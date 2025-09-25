import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Users, 
  Mail, 
  Plus, 
  Eye, 
  BarChart3, 
  Send, 
  Download,
  UserPlus,
  Filter,
  Search,
  Trash2,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Subscriber, Campaign } from "@shared/schema";

export default function NewsletterAdmin() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriberFilter, setSubscriberFilter] = useState<"all" | "active" | "inactive">("all");
  const [campaignFilter, setCampaignFilter] = useState<"all" | "draft" | "sent" | "scheduled">("all");
  const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Fetch subscribers
  const { data: subscribers = [], isLoading: subscribersLoading } = useQuery<Subscriber[]>({
    queryKey: ["/api/admin/subscribers", subscriberFilter],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/subscribers?active=${subscriberFilter === "active" ? "true" : subscriberFilter === "inactive" ? "false" : ""}`);
      return response as unknown as Subscriber[];
    },
  });

  // Fetch subscriber count
  const { data: subscriberCount = { count: 0 } } = useQuery<{ count: number }>({
    queryKey: ["/api/admin/subscribers/count"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/subscribers/count");
      return response as unknown as { count: number };
    },
  });

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/admin/campaigns", campaignFilter],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/admin/campaigns${campaignFilter !== "all" ? `?status=${campaignFilter}` : ""}`);
      return response as unknown as Campaign[];
    },
  });

  // Create subscriber mutation
  const createSubscriberMutation = useMutation({
    mutationFn: async (data: { email: string; name?: string; tags?: string[] }) => {
      return await apiRequest("POST", "/api/admin/subscribers", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Subscriber added successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscribers/count"] });
      setIsAddSubscriberOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add subscriber",
        variant: "destructive",
      });
    },
  });

  // Delete subscriber mutation
  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/subscribers/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Subscriber deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscribers/count"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete subscriber",
        variant: "destructive",
      });
    },
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: { name: string; subject: string; content: string; htmlContent?: string }) => {
      return await apiRequest("POST", "/api/admin/campaigns", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Campaign created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/campaigns"] });
      setIsCreateCampaignOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  // Filter subscribers based on search term
  const filteredSubscribers = subscribers.filter((subscriber: Subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add subscriber form submission
  const handleAddSubscriber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const tags = (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [];

    createSubscriberMutation.mutate({ email, name: name || undefined, tags });
  };

  // Handle create campaign form submission
  const handleCreateCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;

    createCampaignMutation.mutate({ name, subject, content });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "sending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Newsletter Management</h1>
        <p className="text-muted-foreground">
          Manage subscribers, create campaigns, and track newsletter performance
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-subscriber-count">
              {subscriberCount.count.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Active subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-campaign-count">
              {campaigns.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent This Month</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-sent-count">
              {campaigns.filter((c: Campaign) => c.status === "sent").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Campaigns sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-open-rate">
              {campaigns.length > 0 
                ? Math.round(campaigns.reduce((acc: number, c: Campaign) => acc + (c.openCount || 0), 0) / campaigns.length * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Email open rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscribers" data-testid="tab-subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns" data-testid="tab-campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Subscribers</CardTitle>
                <Dialog open={isAddSubscriberOpen} onOpenChange={setIsAddSubscriberOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-subscriber">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Subscriber
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Subscriber</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSubscriber} className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="subscriber@example.com"
                          data-testid="input-subscriber-email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          data-testid="input-subscriber-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          name="tags"
                          placeholder="newsletter, updates, marketing"
                          data-testid="input-subscriber-tags"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={createSubscriberMutation.isPending} data-testid="button-save-subscriber">
                          {createSubscriberMutation.isPending ? "Adding..." : "Add Subscriber"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subscribers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                      data-testid="input-search-subscribers"
                    />
                  </div>
                  <Select value={subscriberFilter} onValueChange={(value: any) => setSubscriberFilter(value)}>
                    <SelectTrigger className="w-[140px]" data-testid="select-subscriber-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" data-testid="button-export-subscribers">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribersLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading subscribers...
                        </TableCell>
                      </TableRow>
                    ) : filteredSubscribers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No subscribers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscribers.map((subscriber: Subscriber) => (
                        <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id!}`}>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell>{subscriber.name || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                              {subscriber.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{subscriber.source}</TableCell>
                          <TableCell>
                            {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteSubscriberMutation.mutate(subscriber.id!)}
                                disabled={deleteSubscriberMutation.isPending}
                                data-testid={`button-delete-subscriber-${subscriber.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Email Campaigns</CardTitle>
                <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-campaign">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Campaign</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                      <div>
                        <Label htmlFor="campaign-name">Campaign Name *</Label>
                        <Input
                          id="campaign-name"
                          name="name"
                          required
                          placeholder="Monthly Newsletter - January 2024"
                          data-testid="input-campaign-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="campaign-subject">Email Subject *</Label>
                        <Input
                          id="campaign-subject"
                          name="subject"
                          required
                          placeholder="Your Monthly Update from Yadnus Consultant"
                          data-testid="input-campaign-subject"
                        />
                      </div>
                      <div>
                        <Label htmlFor="campaign-content">Email Content *</Label>
                        <Textarea
                          id="campaign-content"
                          name="content"
                          required
                          rows={10}
                          placeholder="Write your email content here..."
                          data-testid="textarea-campaign-content"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={createCampaignMutation.isPending} data-testid="button-save-campaign">
                          {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Select value={campaignFilter} onValueChange={(value: any) => setCampaignFilter(value)}>
                  <SelectTrigger className="w-[140px]" data-testid="select-campaign-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Open Rate</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignsLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading campaigns...
                        </TableCell>
                      </TableRow>
                    ) : campaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No campaigns found
                        </TableCell>
                      </TableRow>
                    ) : (
                      campaigns.map((campaign: Campaign) => (
                        <TableRow key={campaign.id} data-testid={`row-campaign-${campaign.id}`}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{campaign.subject}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.recipientCount || 0}</TableCell>
                          <TableCell>
                            {(campaign.sentCount || 0) > 0 
                              ? `${Math.round((campaign.openCount || 0) / (campaign.sentCount || 1) * 100)}%`
                              : "0%"
                            }
                          </TableCell>
                          <TableCell>
                            {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-view-campaign-${campaign.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                data-testid={`button-edit-campaign-${campaign.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}