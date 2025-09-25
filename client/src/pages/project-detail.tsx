import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  Building, 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  Users,
  Target,
  Award
} from "lucide-react";
import { SiWhatsapp, SiX } from "react-icons/si";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams();
  
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const { data: relatedProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = project?.title || "Yadnus Consultant Project";
    
    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`);
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      default:
        navigator.clipboard.writeText(url);
    }
  };

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const related = relatedProjects
    .filter(p => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const placeholderImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600";
  const heroImage = project.images?.[0] || placeholderImage;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute top-6 left-6 z-10">
          <Button asChild variant="outline" size="sm" data-testid="button-back-to-projects">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
        
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                {project.category && (
                  <Badge className="mb-4 bg-primary/90 text-primary-foreground">
                    {project.category}
                  </Badge>
                )}
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="text-project-title">
                  {project.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  {project.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.completedAt && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Completed {new Date(project.completedAt).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-foreground mb-6">Project Overview</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {project.description}
                </p>
                
                {/* Project Images Gallery */}
                {project.images && project.images.length > 1 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Project Gallery</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.images.slice(1).map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <img 
                            src={image || placeholderImage}
                            alt={`${project.title} - Image ${index + 2}`}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Highlights */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Building className="w-5 h-5 text-primary mr-2" />
                          <h4 className="font-semibold text-foreground">Design Excellence</h4>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Innovative architectural design that balances functionality with aesthetic appeal.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Target className="w-5 h-5 text-accent mr-2" />
                          <h4 className="font-semibold text-foreground">Community Impact</h4>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Positive impact on the local community through thoughtful planning and development.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Users className="w-5 h-5 text-secondary mr-2" />
                          <h4 className="font-semibold text-foreground">Stakeholder Collaboration</h4>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Extensive collaboration with community members and local authorities.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Award className="w-5 h-5 text-primary mr-2" />
                          <h4 className="font-semibold text-foreground">Quality Delivery</h4>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Delivered on time and within budget while exceeding quality expectations.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Project Details Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Project Details</h3>
                    <div className="space-y-4">
                      {project.category && (
                        <div>
                          <div className="text-sm font-medium text-foreground">Category</div>
                          <div className="text-sm text-muted-foreground">{project.category}</div>
                        </div>
                      )}
                      {project.location && (
                        <div>
                          <div className="text-sm font-medium text-foreground">Location</div>
                          <div className="text-sm text-muted-foreground">{project.location}</div>
                        </div>
                      )}
                      {project.completedAt && (
                        <div>
                          <div className="text-sm font-medium text-foreground">Completion Date</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(project.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-foreground">Status</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Share */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Share Project</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare("whatsapp")}
                        data-testid="button-share-whatsapp"
                      >
                        <SiWhatsapp className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare("twitter")}
                        data-testid="button-share-twitter"
                      >
                        <SiX className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare("copy")}
                        data-testid="button-copy-link"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Interested in Similar Work?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Let's discuss how we can help with your project.
                    </p>
                    <Button asChild className="w-full" data-testid="button-contact-us">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Related Projects</h2>
              <p className="text-xl text-muted-foreground">
                Explore more projects in the {project.category} category.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((relatedProject) => (
                <Card key={relatedProject.id} className="overflow-hidden card-hover">
                  <img 
                    src={relatedProject.images?.[0] || placeholderImage}
                    alt={relatedProject.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-foreground">{relatedProject.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {relatedProject.description}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/projects/${relatedProject.id}`}>View Project</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
