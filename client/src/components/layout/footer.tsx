import { Link } from "wouter";
import { Building } from "lucide-react";
import { SiWhatsapp, SiX, SiInstagram, SiLinkedin } from "react-icons/si";
import NewsletterSignup from "@/components/forms/newsletter-signup";

export default function Footer() {
  const services = [
    { name: "Town Planning", href: "/services" },
    { name: "Construction Management", href: "/services" },
    { name: "Development Consulting", href: "/services" },
    { name: "Environmental Assessment", href: "/services" },
    { name: "Community Engagement", href: "/services" },
  ];

  const resources = [
    { name: "Blog", href: "/blog" },
    { name: "Webinars", href: "/webinars" },
    { name: "Case Studies", href: "/projects" },
    { name: "Industry Reports", href: "/blog" },
    { name: "Newsletter", href: "/contact" },
  ];

  const socialLinks = [
    { name: "WhatsApp", href: "https://wa.me/15551234567", icon: SiWhatsapp },
    { name: "Twitter", href: "https://twitter.com/yadnusconsultant", icon: SiX },
    { name: "Instagram", href: "https://instagram.com/yadnusconsultant", icon: SiInstagram },
    { name: "LinkedIn", href: "https://linkedin.com/company/yadnusconsultant", icon: SiLinkedin },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building className="text-primary-foreground w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Yadnus Consultant</h3>
                <p className="text-xs text-background/70">Town Planning & Construction</p>
              </div>
            </div>
            <p className="text-background/80 text-sm mb-6">
              Expert town planning and construction consulting services creating sustainable communities for future generations.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-primary transition-colors"
                  data-testid={`footer-social-${social.name.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-background/80">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href} className="hover:text-primary transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-background/80">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link href={resource.href} className="hover:text-primary transition-colors">
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter Signup */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-background/80 mb-4">Subscribe to our newsletter for the latest insights and updates.</p>
            <NewsletterSignup />
          </div>
        </div>
        
        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-sm text-background/70">
            © 2024 Yadnus Consultant. All rights reserved. | 
            <Link href="/privacy" className="hover:text-primary transition-colors ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-primary transition-colors ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
