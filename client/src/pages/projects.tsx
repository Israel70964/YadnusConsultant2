import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProjectCard from "@/components/cards/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const categories = ["all", ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredProjects = projects.filter(p => p.featured);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Our Project Portfolio
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore our portfolio of successful town planning and construction projects that have transformed communities across the region.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{projects.length}+</div>
                <div className="text-muted-foreground">Completed Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{categories.length - 1}</div>
                <div className="text-muted-foreground">Project Types</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Featured Projects</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Highlighting some of our most impactful and innovative developments.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 6).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-projects"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="md:w-48" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* All Projects */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">All Projects</h2>
            <p className="text-xl text-muted-foreground">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                className="mt-4"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Categories Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Project Types</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We specialize in a diverse range of development projects across multiple sectors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Mixed-Use Development", count: projects.filter(p => p.category === "Mixed-Use Development").length },
              { name: "Residential", count: projects.filter(p => p.category === "Residential").length },
              { name: "Commercial", count: projects.filter(p => p.category === "Commercial").length },
              { name: "Public Spaces", count: projects.filter(p => p.category === "Public Spaces").length },
              { name: "Urban Renewal", count: projects.filter(p => p.category === "Urban Renewal").length },
              { name: "Infrastructure", count: projects.filter(p => p.category === "Infrastructure").length },
              { name: "Historic Preservation", count: projects.filter(p => p.category === "Historic Preservation").length },
              { name: "Sustainable Design", count: projects.filter(p => p.category === "Sustainable Design").length },
            ].map((category, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                <div className="text-2xl font-bold text-primary">{category.count}</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
