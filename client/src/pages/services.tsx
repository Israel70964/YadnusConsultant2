import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  MapPin, 
  HardHat, 
  Users, 
  Check, 
  FileText, 
  Calculator, 
  Shield, 
  Leaf,
  Building,
  Globe,
  Target,
  ArrowRight 
} from "lucide-react";

export default function Services() {
  const mainServices = [
    {
      icon: <MapPin className="text-primary w-8 h-8" />,
      title: "Town Planning",
      description: "Strategic urban planning solutions that balance community needs with sustainable development practices and regulatory compliance.",
      features: ["Master Planning", "Zoning Analysis", "Environmental Assessment", "Community Engagement"],
      color: "primary"
    },
    {
      icon: <HardHat className="text-secondary w-8 h-8" />,
      title: "Construction Management",
      description: "Full-service construction oversight ensuring projects are delivered on time, within budget, and to the highest quality standards.",
      features: ["Project Management", "Quality Control", "Safety Compliance", "Cost Management"],
      color: "secondary"
    },
    {
      icon: <Users className="text-accent w-8 h-8" />,
      title: "Development Consulting",
      description: "Expert advisory services for developers, municipalities, and organizations navigating complex planning and development challenges.",
      features: ["Feasibility Studies", "Permit Acquisition", "Stakeholder Relations", "Strategic Planning"],
      color: "accent"
    }
  ];

  const additionalServices = [
    {
      icon: <FileText className="text-primary w-6 h-6" />,
      title: "Regulatory Compliance",
      description: "Navigate complex regulations and ensure your project meets all requirements."
    },
    {
      icon: <Calculator className="text-secondary w-6 h-6" />,
      title: "Cost Estimation",
      description: "Accurate project budgeting and financial planning services."
    },
    {
      icon: <Shield className="text-accent w-6 h-6" />,
      title: "Risk Assessment",
      description: "Identify and mitigate potential project risks before they become issues."
    },
    {
      icon: <Leaf className="text-primary w-6 h-6" />,
      title: "Sustainability Consulting",
      description: "Green building practices and environmental impact reduction strategies."
    },
    {
      icon: <Building className="text-secondary w-6 h-6" />,
      title: "Site Analysis",
      description: "Comprehensive evaluation of development sites and their potential."
    },
    {
      icon: <Globe className="text-accent w-6 h-6" />,
      title: "GIS Mapping",
      description: "Geographic information systems for better planning and analysis."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We begin with a comprehensive discussion of your project goals, timeline, and budget requirements."
    },
    {
      step: "02",
      title: "Site Assessment",
      description: "Our team conducts thorough site analysis including regulatory, environmental, and feasibility studies."
    },
    {
      step: "03", 
      title: "Planning & Design",
      description: "We develop comprehensive plans that balance your vision with regulatory requirements and best practices."
    },
    {
      step: "04",
      title: "Implementation Support",
      description: "From permits to construction oversight, we provide ongoing support throughout project execution."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Our Expert Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive town planning and construction consulting services designed to create sustainable, thriving communities that stand the test of time.
            </p>
            <Button asChild size="lg" data-testid="button-get-quote">
              <Link href="/contact">Get a Free Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Core Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our three pillars of expertise that have made us a trusted partner for communities and developers.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="card-hover" data-testid={`card-service-${index}`}>
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-${service.color}/10 rounded-lg flex items-center justify-center mb-6`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="text-accent mr-2 w-4 h-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Additional Expertise</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized services to support every aspect of your development project.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h4 className="font-semibold mb-2 text-foreground">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A proven approach that ensures successful project outcomes from concept to completion.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Industries We Serve</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our expertise spans across multiple sectors and project types.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Residential Development",
              "Commercial Projects", 
              "Municipal Planning",
              "Infrastructure Development",
              "Mixed-Use Communities",
              "Industrial Sites",
              "Public Spaces",
              "Historic Preservation"
            ].map((industry, index) => (
              <Badge key={index} variant="outline" className="p-4 text-center bg-card border-border">
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-xl p-8 lg:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Let's discuss how our expertise can help bring your vision to life. Schedule a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/projects">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
