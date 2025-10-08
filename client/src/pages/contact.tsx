import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/forms/contact-form";
import ProjectInquiry from "@/components/forms/project-inquiry";
import NewsletterSignup from "@/components/forms/newsletter-signup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  FileText,
  Calendar,
  Users
} from "lucide-react";
import { SiWhatsapp, SiX, SiInstagram, SiLinkedin } from "react-icons/si";
const contactHeroImg = "/images/construction_site_bu_47df4ab7.jpg";

export default function Contact() {
  const [activeTab, setActiveTab] = useState("contact");

  const contactInfo = [
    {
      icon: <MapPin className="text-primary w-6 h-6" />,
      title: "Office Location",
      details: "123 Planning Avenue, Suite 400\nMetropolitan City, MC 12345",
      action: "Get Directions"
    },
    {
      icon: <Phone className="text-primary w-6 h-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      action: "Call Now"
    },
    {
      icon: <Mail className="text-primary w-6 h-6" />,
      title: "Email",
      details: "info@yadnusconsultant.com",
      action: "Send Email"
    },
    {
      icon: <Clock className="text-primary w-6 h-6" />,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM",
      action: "Schedule Call"
    }
  ];

  const socialLinks = [
    { 
      name: "WhatsApp", 
      href: "https://wa.me/15551234567", 
      icon: SiWhatsapp,
      description: "Message us directly"
    },
    { 
      name: "Twitter", 
      href: "https://twitter.com/yadnusconsultant", 
      icon: SiX,
      description: "Follow for updates"
    },
    { 
      name: "Instagram", 
      href: "https://instagram.com/yadnusconsultant", 
      icon: SiInstagram,
      description: "See our projects"
    },
    { 
      name: "LinkedIn", 
      href: "https://linkedin.com/company/yadnusconsultant", 
      icon: SiLinkedin,
      description: "Professional network"
    }
  ];

  const formTypes = [
    {
      id: "contact",
      title: "General Contact",
      description: "General inquiries and information requests",
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      id: "project",
      title: "Project Inquiry",
      description: "Detailed project consultation requests",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={contactHeroImg}
            alt="Construction consulting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        </div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Ready to start your next project? We're here to help bring your vision to life with expert planning and construction consulting.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">24h</div>
                <div className="text-white/80">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">Free</div>
                <div className="text-white/80">Initial Consultation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Contact Information</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple ways to reach us. Choose what works best for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center card-hover" data-testid={`card-contact-${index}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {info.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{info.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                    {info.details}
                  </p>
                  <Button variant="outline" size="sm" data-testid={`button-${info.action.toLowerCase().replace(' ', '-')}`}>
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social Media */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-6">Connect With Us</h3>
            <div className="flex justify-center gap-6">
              {socialLinks.map((social) => (
                <div key={social.name} className="text-center">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors mx-auto mb-2"
                    data-testid={`social-${social.name.toLowerCase()}`}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                  <p className="text-xs text-muted-foreground">{social.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Send Us a Message</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the form that best matches your inquiry type for a more personalized response.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
                {formTypes.map((form) => (
                  <TabsTrigger 
                    key={form.id} 
                    value={form.id} 
                    className="flex items-center gap-2"
                    data-testid={`tab-${form.id}`}
                  >
                    {form.icon}
                    {form.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="text-center mb-8">
                <p className="text-muted-foreground">
                  {formTypes.find(f => f.id === activeTab)?.description}
                </p>
              </div>

              <TabsContent value="contact">
                <ContactForm />
              </TabsContent>

              <TabsContent value="project">
                <ProjectInquiry />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Quick answers to common questions about our services and process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "What is your typical project timeline?",
                answer: "Project timelines vary based on complexity and scope. Most planning projects take 3-6 months, while construction management can span 6-24 months. We provide detailed timelines during initial consultation."
              },
              {
                question: "Do you work with projects outside your local area?",
                answer: "Yes, we work on projects throughout the region and can travel for the right opportunities. We also offer remote consulting services for planning and design phases."
              },
              {
                question: "What makes your approach different?",
                answer: "We focus on sustainable, community-centered development with extensive stakeholder engagement. Our integrated approach combines planning expertise with construction knowledge."
              },
              {
                question: "Do you offer free consultations?",
                answer: "Yes, we provide a free initial consultation to discuss your project needs and determine how we can help. This allows us to understand your vision and provide accurate project estimates."
              },
              {
                question: "What types of permits do you help with?",
                answer: "We assist with all types of development permits including zoning approvals, building permits, environmental clearances, and special use permits."
              },
              {
                question: "Can you help with project financing guidance?",
                answer: "While we don't provide financing, we can help prepare documentation for funding applications and work with your financial team to ensure project feasibility."
              }
            ].map((faq, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Stay Updated</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest insights, industry news, and updates on our webinar series.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterSignup />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Visit Our Office</h2>
            <p className="text-xl text-muted-foreground">
              Located in the heart of the metropolitan area, easily accessible by public transportation.
            </p>
          </div>
          
          <div className="bg-muted rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Map</h3>
            <p className="text-muted-foreground mb-6">
              Map integration would be implemented here with your preferred mapping service (Google Maps, Mapbox, etc.)
            </p>
            <Button variant="outline" data-testid="button-view-map">
              View on Google Maps
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
