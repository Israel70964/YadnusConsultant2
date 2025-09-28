import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp
} from "lucide-react";
import type { BlogPost, Project, Webinar, Submission } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: posts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"],
    enabled: isAuthenticated,
  });

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  const { data: webinars = [] } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars"],
    enabled: isAuthenticated,
  });

  const { data: submissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/admin/submissions"],
    enabled: isAuthenticated,
  });

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

  const publishedPosts = posts.filter(p => p.published);
  const draftPosts = posts.filter(p => !p.published);
  const upcomingWebinars = webinars.filter(w => new Date(w.date) > new Date());
  const recentSubmissions = submissions.slice(0, 5);
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Yadnus Consultant website content and monitor activity.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-blog-posts">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
                  <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {publishedPosts.length} published, {draftPosts.length} drafts
                  </p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-projects">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projects</p>
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {projects.filter(p => p.featured).length} featured
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-webinars">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Webinars</p>
                  <p className="text-2xl font-bold text-foreground">{webinars.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {upcomingWebinars.length} upcoming
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-submissions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                  <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {submissions.filter(s => new Date(s.createdAt!) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-create-post">
                <Link href="/admin/posts">New Blog Post</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-create-project">
                <Link href="/admin/projects">New Project</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-create-webinar">
                <Link href="/admin/webinars">New Webinar</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="w-5 h-5 mr-2" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-manage-posts">
                <Link href="/admin/posts">Manage Posts</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-manage-projects">
                <Link href="/admin/projects">Manage Projects</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-manage-webinars">
                <Link href="/admin/webinars">Manage Webinars</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Communications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-contacts">
                <Link href="/admin/submissions?type=contact">Contact Forms</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-inquiries">
                <Link href="/admin/submissions?type=project">Project Inquiries</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-newsletter">
                <Link href="/admin/submissions?type=newsletter">Newsletter Subs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Eye className="w-5 h-5 mr-2" />
                Public View
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-blog">
                <Link href="/blog">View Blog</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-projects">
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start" data-testid="button-view-webinars">
                <Link href="/webinars">View Webinars</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No blog posts yet.</p>
                  <Button asChild className="mt-4" data-testid="button-create-first-post">
                    <Link href="/admin/posts">Create Your First Post</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`recent-post-${post.id}`}>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground line-clamp-1">{post.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button asChild variant="ghost" size="sm" data-testid={`button-edit-post-${post.id}`}>
                          <Link href={`/admin/posts`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`recent-submission-${submission.id}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {submission.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(submission.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {submission.type === 'contact' && (submission.payload as any).name}
                          {submission.type === 'project' && (submission.payload as any).name}
                          {submission.type === 'newsletter' && (submission.payload as any).email}
                          {submission.type === 'webinar' && (submission.payload as any).name}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm" data-testid={`button-view-submission-${submission.id}`}>
                        <Link href={`/admin/submissions`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
