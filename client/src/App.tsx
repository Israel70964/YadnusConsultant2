import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

// Pages
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Webinars from "@/pages/webinars";
import WebinarDetail from "@/pages/webinar-detail";
import Contact from "@/pages/contact";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminPosts from "@/pages/admin/posts";
import AdminProjects from "@/pages/admin/projects";
import AdminWebinars from "@/pages/admin/webinars";
import AdminSubmissions from "@/pages/admin/submissions";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - always available */}
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/webinars" component={Webinars} />
      <Route path="/webinars/:id" component={WebinarDetail} />
      <Route path="/contact" component={Contact} />
      
      {/* Home route - different based on auth */}
      {isAuthenticated ? (
        <Route path="/" component={Home} />
      ) : (
        <Route path="/" component={Landing} />
      )}
      
      {/* Admin routes - only when authenticated */}
      {isAuthenticated && (
        <>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/posts" component={AdminPosts} />
          <Route path="/admin/projects" component={AdminProjects} />
          <Route path="/admin/webinars" component={AdminWebinars} />
          <Route path="/admin/submissions" component={AdminSubmissions} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
