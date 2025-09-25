import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Calendar, MessageSquare, BarChart3, Settings } from "lucide-react";
import type { BlogPost, Project, Webinar, Submission } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  
  const { data: recentPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"],
  });

  const { data: recentProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: upcomingWebinars = [] } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars/upcoming"],
  });

  const { data: recentSubmissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/admin/submissions"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName || 'Admin'}!
          </h1>
          <p className="text-muted-foreground">
            Manage your Yadnus Consultant website content and view analytics.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
                  <p className="text-2xl font-bold text-foreground">{recentPosts.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projects</p>
                  <p className="text-2xl font-bold text-foreground">{recentProjects.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Webinars</p>
                  <p className="text-2xl font-bold text-foreground">{upcomingWebinars.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submissions</p>
                  <p className="text-2xl font-bold text-foreground">{recentSubmissions.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/posts">Manage Blog Posts</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/projects">Manage Projects</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/webinars">Manage Webinars</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Communications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/submissions?type=contact">Contact Forms</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/submissions?type=project">Project Inquiries</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/submissions?type=newsletter">Newsletter Subs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Public Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/blog">View Blog</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
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
                <p className="text-muted-foreground">No blog posts yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {post.published ? 'Published' : 'Draft'} • {new Date(post.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/posts`}>Edit</Link>
                      </Button>
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
                <p className="text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentSubmissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground capitalize">{submission.type} Submission</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(submission.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/submissions`}>View</Link>
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
