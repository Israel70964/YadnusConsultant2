import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500";
  const imageUrl = project.images?.[0] || placeholderImage;

  return (
    <Card className="overflow-hidden card-hover" data-testid={`card-project-${project.id}`}>
      <img 
        src={imageUrl} 
        alt={project.title} 
        className="w-full h-48 object-cover" 
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {project.category && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {project.category}
            </Badge>
          )}
          {project.completedAt && (
            <span className="text-muted-foreground text-sm">
              Completed {new Date(project.completedAt).getFullYear()}
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground" data-testid={`text-project-title-${project.id}`}>
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          {project.location && (
            <div className="text-sm text-muted-foreground flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{project.location}</span>
            </div>
          )}
          <Button asChild variant="ghost" size="sm" data-testid={`button-view-project-${project.id}`}>
            <Link href={`/projects/${project.id}`}>
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
