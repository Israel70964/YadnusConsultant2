import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import ProjectCard from "@/components/cards/project-card";
import BlogCard from "@/components/cards/blog-card";
import WebinarCard from "@/components/cards/webinar-card";
import ContactForm from "@/components/forms/contact-form";
import NewsletterSignup from "@/components/forms/newsletter-signup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  User,
  ArrowRight,
  Check,
  Building,
  HardHat,
  Users as UsersIcon,
  Play,
} from "lucide-react";
import type { Project, BlogPost, Webinar } from "@shared/schema";
import townPlanningImg from "@assets/stock_images/town_planning_urban__372a6021.jpg";
import constructionImg from "@assets/stock_images/construction_site_bu_5a501201.jpg";
import architectureImg from "@assets/stock_images/modern_architecture__06302b96.jpg";

export default function Landing() {
  const { data: featuredProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects?featured=true"],
  });

  const { data: recentPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts?published=true"],
  });

  const { data: upcomingWebinars = [] } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars/upcoming"],
  });

  const { data: pastWebinars = [] } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars/past"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section id="services" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Expert Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive town planning and construction consulting services
              designed to create sustainable, thriving communities.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Card className="card-hover overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={townPlanningImg}
                  alt="Town planning and urban development"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <MapPin className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Town Planning
                </h3>
                <p className="text-muted-foreground mb-6">
                  Strategic urban planning solutions that balance community
                  needs with sustainable development practices and regulatory
                  compliance.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Master
                    Planning
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Zoning
                    Analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Environmental
                    Assessment
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Community
                    Engagement
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 2 */}
            <Card className="card-hover overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={constructionImg}
                  alt="Construction site management"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <HardHat className="text-secondary w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Construction Management
                </h3>
                <p className="text-muted-foreground mb-6">
                  Full-service construction oversight ensuring projects are
                  delivered on time, within budget, and to the highest quality
                  standards.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Project
                    Management
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Quality
                    Control
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Safety
                    Compliance
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Cost
                    Management
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service 3 */}
            <Card className="card-hover overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={architectureImg}
                  alt="Development consulting services"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <UsersIcon className="text-accent w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Development Consulting
                </h3>
                <p className="text-muted-foreground mb-6">
                  Expert advisory services for developers, municipalities, and
                  organizations navigating complex planning and development
                  challenges.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Feasibility
                    Studies
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Permit
                    Acquisition
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Stakeholder
                    Relations
                  </li>
                  <li className="flex items-center">
                    <Check className="text-accent mr-2 w-4 h-4" /> Strategic
                    Planning
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our portfolio of successful town planning and construction
              projects that have transformed communities across the region.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Webinars Section */}
      <section id="webinars" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Expert Webinars
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our educational webinar series where industry experts share
              insights on town planning, construction management, and
              sustainable development.
            </p>
          </div>

          {/* Upcoming Webinar Highlight */}
          {upcomingWebinars.length > 0 && (
            <div className="hero-gradient rounded-xl p-8 lg:p-12 text-primary-foreground mb-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      <Calendar className="w-4 h-4 mr-1 inline" />
                      Upcoming Live
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    {upcomingWebinars[0].title}
                  </h3>
                  <p className="text-lg mb-6 text-primary-foreground/90">
                    {upcomingWebinars[0].description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm mb-6">
                    <div className="flex items-center">
                      <Calendar className="mr-2 w-4 h-4" />
                      <span>
                        {new Date(
                          upcomingWebinars[0].date,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 w-4 h-4" />
                      <span>
                        {new Date(
                          upcomingWebinars[0].date,
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 w-4 h-4" />
                      <span>
                        {upcomingWebinars[0].registrationCount} registered
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="secondary" size="lg">
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
          )}

          {/* Past Webinars Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastWebinars.slice(0, 3).map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} isPast={true} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="mr-4">
              <Link href="/webinars">View All Webinars</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Subscribe to Newsletter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Latest Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with our latest articles on urban planning trends,
              construction innovations, and sustainable development practices.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {recentPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/blog">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to start your next project? We're here to help bring your
              vision to life with expert planning and construction consulting.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-foreground">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        Office Location
                      </div>
                      <div className="text-muted-foreground">
                        123 Alausa Ikeja, Lagos
                        <br />
                        Ikeja City
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <Building className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Phone</div>
                      <div className="text-muted-foreground">
                        +234 (802) 351-4195
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <Building className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-muted-foreground">
                        info@yadnusconsultant.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div>
                <h4 className="font-medium mb-4 text-foreground">
                  Stay Updated
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to our newsletter for the latest insights and
                  updates.
                </p>
                <NewsletterSignup />
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
