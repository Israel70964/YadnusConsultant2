import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WebinarCard from "@/components/cards/webinar-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  Users,
  Play,
  Video,
  Award,
  Globe
} from "lucide-react";
import { Link } from "wouter";
import type { Webinar } from "@shared/schema";

export default function Webinars() {
  const { data: upcomingWebinars = [], isLoading: upcomingLoading } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars/upcoming"],
  });

  const { data: pastWebinars = [], isLoading: pastLoading } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars/past"],
  });

  const { data: allWebinars = [], isLoading: allLoading } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars"],
  });

  const isLoading = upcomingLoading || pastLoading || allLoading;

  const totalRegistrations = allWebinars.reduce((sum, w) => sum + (w.registrationCount || 0), 0);

  const topics = [
    {
      title: "Sustainable Urban Development",
      description: "Environmental responsibility in modern city planning",
      icon: <Globe className="w-6 h-6" />,
      count: pastWebinars.filter(w => w.title.toLowerCase().includes('sustainable')).length
    },
    {
      title: "Smart Cities & Technology",
      description: "Integrating IoT and AI in urban environments",
      icon: <Video className="w-6 h-6" />,
      count: pastWebinars.filter(w => w.title.toLowerCase().includes('smart')).length
    },
    {
      title: "Construction Management",
      description: "Modern project delivery methodologies",
      icon: <Award className="w-6 h-6" />,
      count: pastWebinars.filter(w => w.title.toLowerCase().includes('construction')).length
    },
    {
      title: "Community Engagement",
      description: "Best practices for stakeholder involvement",
      icon: <Users className="w-6 h-6" />,
      count: pastWebinars.filter(w => w.title.toLowerCase().includes('community')).length
    }
  ];

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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Expert Webinar Series
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our educational webinar series where industry experts share insights on town planning, construction management, and sustainable development.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{allWebinars.length}+</div>
                <div className="text-muted-foreground">Webinars Hosted</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{totalRegistrations}+</div>
                <div className="text-muted-foreground">Total Attendees</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Free</div>
                <div className="text-muted-foreground">All Sessions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Webinar Highlight */}
      {upcomingWebinars.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="hero-gradient rounded-xl p-8 lg:p-12 text-primary-foreground">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Badge className="bg-secondary text-secondary-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      Upcoming Live
                    </Badge>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    {upcomingWebinars[0].title}
                  </h2>
                  <p className="text-lg mb-6 text-primary-foreground/90">
                    {upcomingWebinars[0].description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm mb-6">
                    <div className="flex items-center">
                      <Calendar className="mr-2 w-4 h-4" />
                      <span>{new Date(upcomingWebinars[0].date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 w-4 h-4" />
                      <span>{new Date(upcomingWebinars[0].date).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 w-4 h-4" />
                      <span>{upcomingWebinars[0].registrationCount} registered</span>
                    </div>
                  </div>
                  <Button asChild size="lg" variant="secondary" data-testid="button-register-featured">
                    <Link href={`/webinars/${upcomingWebinars[0].id}`}>
                      Register Now - Free
                    </Link>
                  </Button>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                    alt="Professional webinar setup" 
                    className="rounded-lg shadow-lg max-w-full h-auto" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Webinar Topics */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Popular Topics</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our webinars cover the most important topics in urban planning and construction.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {topic.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                  <Badge variant="outline">{topic.count} sessions</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Webinar Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16">
              <TabsTrigger value="upcoming" data-testid="tab-upcoming">
                Upcoming ({upcomingWebinars.length})
              </TabsTrigger>
              <TabsTrigger value="past" data-testid="tab-past">
                Past ({pastWebinars.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Webinars</h2>
                <p className="text-muted-foreground">
                  {upcomingWebinars.length === 0 
                    ? "No upcoming webinars scheduled at the moment. Check back soon!"
                    : "Register for these upcoming sessions and join our community of professionals."
                  }
                </p>
              </div>
              
              {upcomingWebinars.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No upcoming webinars scheduled.</p>
                  <Button asChild variant="outline" data-testid="button-newsletter-notify">
                    <Link href="/contact">Get Notified of New Sessions</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingWebinars.map((webinar) => (
                    <WebinarCard key={webinar.id} webinar={webinar} isPast={false} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">Past Webinars</h2>
                <p className="text-muted-foreground">
                  Access recordings from our previous webinar sessions.
                </p>
              </div>
              
              {pastWebinars.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No past webinars available yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastWebinars.map((webinar) => (
                    <WebinarCard key={webinar.id} webinar={webinar} isPast={true} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Never Miss a Session</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter to get notified about upcoming webinars and access exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" data-testid="button-subscribe-webinars">
                <Link href="/contact">Subscribe to Newsletter</Link>
              </Button>
              <Button asChild size="lg" variant="outline" data-testid="button-contact-webinars">
                <Link href="/contact">Suggest a Topic</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
