import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  // Mock stats - in a real app, these would come from your analytics/database
  const stats = {
    projectsCompleted: "150+",
    yearsExperience: "15+",
    webinarsHosted: "50+",
    clientsSatisfied: "98%"
  };

  return (
    <section id="home" className="relative hero-gradient text-primary-foreground">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative container mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Designing Sustainable Cities, 
            <span className="text-secondary"> One Neighborhood at a Time</span>
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            Expert town planning and construction consulting services that transform communities and build sustainable urban environments for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" data-testid="button-view-projects">
              <Link href="/projects">View Our Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-join-webinar">
              <Link href="/webinars">Join Next Webinar</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="relative bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="stat-projects">{stats.projectsCompleted}</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="stat-experience">{stats.yearsExperience}</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="stat-webinars">{stats.webinarsHosted}</div>
              <div className="text-muted-foreground">Webinars Hosted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="stat-satisfaction">{stats.clientsSatisfied}</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
