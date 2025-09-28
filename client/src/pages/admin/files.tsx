import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FileManager } from "@/components/admin/file-manager";

export default function AdminFiles() {
  const { isAuthenticated, isLoading } = useAuth();

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
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              File Management
            </h1>
            <p className="text-muted-foreground">
              Manage and organize your uploaded files and media
            </p>
          </div>
          
          <FileManager
            title="Media Library"
            category="media"
            maxFiles={20}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}