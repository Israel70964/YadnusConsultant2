import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "@/pages/landing";
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
import AdminFiles from "@/pages/admin/files";
import AdminNewsletter from "@/pages/admin/newsletter";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
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
      
      {/* Login route */}
      <Route path="/login" component={LoginPage} />
      
      {/* Home route - always shows public landing page */}
      <Route path="/" component={Landing} />
      
      {/* Admin routes - protected with ProtectedRoute component */}
      <Route path="/admin">
        {() => (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/posts">
        {() => (
          <ProtectedRoute>
            <AdminPosts />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/projects">
        {() => (
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/webinars">
        {() => (
          <ProtectedRoute>
            <AdminWebinars />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/submissions">
        {() => (
          <ProtectedRoute>
            <AdminSubmissions />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/files">
        {() => (
          <ProtectedRoute>
            <AdminFiles />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/newsletter">
        {() => (
          <ProtectedRoute>
            <AdminNewsletter />
          </ProtectedRoute>
        )}
      </Route>
      
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
