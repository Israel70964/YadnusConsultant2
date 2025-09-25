import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WebinarSignup from "@/components/forms/webinar-signup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Calendar,
  Clock, 
  Users,
  Play,
  Share2,
  Download,
  ExternalLink
} from "lucide-react";
import { SiWhatsapp, SiX } from "react-icons/si";
import type { Webinar } from "@shared/schema";

export default function WebinarDetail() {
  const { id } = useParams();
  const [showSignupForm, setShowSignupForm] = useState(false);
  
  const { data: webinar, isLoading, error } = useQuery<Webinar>({
    queryKey: ["/api/webinars", id],
    enabled: !!id,
  });

  const { data: relatedWebinars = [] } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars"],
  });

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = webinar?.title || "Yadnus Consultant Webinar";
    
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

  if (error || !webinar) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Webinar Not Found</h1>
            <p className="text-muted-foreground mb-8">The webinar you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/webinars">View All Webinars</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isUpcoming = new Date(webinar.date) > new Date();
  const isPast = !isUpcoming;
  
  const related = relatedWebinars
    .filter(w => w.id !== webinar.id)
    .slice(0, 3);

  const speakers = webinar.speakers as any[] || [];
  const placeholderImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600";
  const thumbnailImage = webinar.thumbnailUrl || placeholderImage;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-6">
          <Button asChild variant="outline" size="sm" data-testid="button-back-to-webinars">
            <Link href="/webinars">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Webinars
            </Link>
          </Button>
        </div>
      </section>

      {/* Webinar Header */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Status Badge */}
              <div className="mb-6">
                <Badge className={isUpcoming ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}>
                  {isUpcoming ? "Upcoming Live" : "Past Recording"}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-webinar-title">
                {webinar.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(webinar.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{new Date(webinar.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{webinar.registrationCount || 0} {isUpcoming ? 'registered' : 'attended'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {webinar.description}
                </p>
              </div>

              {/* Video Embed or Thumbnail */}
              <div className="rounded-xl overflow-hidden mb-8">
                {isPast && webinar.videoUrl ? (
                  <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
                    {webinar.videoUrl.includes('youtube.com') || webinar.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={webinar.videoUrl}
                        title={webinar.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={webinar.videoUrl}
                        controls
                        poster={thumbnailImage}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={thumbnailImage}
                      alt={webinar.title}
                      className="w-full h-[400px] lg:h-[500px] object-cover"
                    />
                    {isUpcoming && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Calendar className="w-16 h-16 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
                          <p>This webinar will be available live on the scheduled date.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Speakers */}
              {speakers.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Featured Speakers</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {speakers.map((speaker, index) => (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{speaker.name || "Expert Speaker"}</h4>
                              <p className="text-muted-foreground">{speaker.title || "Industry Professional"}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">
                            {speaker.bio || "Experienced professional in town planning and construction consulting."}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Registration Card */}
                {isUpcoming ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Register for Free</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!showSignupForm ? (
                        <div className="text-center space-y-4">
                          <div className="text-3xl font-bold text-primary">
                            {webinar.registrationCount || 0}
                          </div>
                          <p className="text-muted-foreground text-sm">people registered</p>
                          <Button 
                            onClick={() => setShowSignupForm(true)}
                            className="w-full"
                            data-testid="button-register-webinar"
                          >
                            Register Now
                          </Button>
                        </div>
                      ) : (
                        <WebinarSignup 
                          webinarId={webinar.id}
                          webinarTitle={webinar.title}
                          onSuccess={() => setShowSignupForm(false)}
                        />
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center flex items-center justify-center">
                        <Play className="w-5 h-5 mr-2" />
                        Watch Recording
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div className="text-3xl font-bold text-primary">
                          {webinar.registrationCount || 0}
                        </div>
                        <p className="text-muted-foreground text-sm">people attended</p>
                        <p className="text-sm text-muted-foreground">
                          This session has been completed. You can watch the recording above.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Share */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Share Webinar</h3>
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

                {/* Contact CTA */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Have Questions?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Need more information about this topic? Our experts are here to help.
                    </p>
                    <Button asChild variant="outline" className="w-full" data-testid="button-contact-experts">
                      <Link href="/contact">Contact Our Experts</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Webinars */}
      {related.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Related Webinars</h2>
              <p className="text-xl text-muted-foreground">
                Explore more sessions on similar topics.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((relatedWebinar) => {
                const relatedIsUpcoming = new Date(relatedWebinar.date) > new Date();
                const relatedThumbnail = relatedWebinar.thumbnailUrl || placeholderImage;
                
                return (
                  <Card key={relatedWebinar.id} className="overflow-hidden card-hover">
                    <img 
                      src={relatedThumbnail}
                      alt={relatedWebinar.title}
                      className="w-full h-40 object-cover"
                    />
                    <CardContent className="p-6">
                      <Badge variant={relatedIsUpcoming ? "default" : "secondary"} className="mb-3">
                        {relatedIsUpcoming ? "Upcoming" : "Past Recording"}
                      </Badge>
                      <h3 className="font-semibold mb-2 text-foreground line-clamp-2">
                        {relatedWebinar.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {relatedWebinar.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(relatedWebinar.date).toLocaleDateString()}
                        </span>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/webinars/${relatedWebinar.id}`}>
                            {relatedIsUpcoming ? "Register" : "Watch"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
