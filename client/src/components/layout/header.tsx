import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building, Menu, LogOut } from "lucide-react";
import { SiWhatsapp, SiX, SiInstagram } from "react-icons/si";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Webinars", href: "/webinars" },
    { name: "Contact", href: "/contact" },
  ];

  const adminNavigation = [
    { name: "Dashboard", href: "/admin" },
    { name: "Posts", href: "/admin/posts" },
    { name: "Projects", href: "/admin/projects" },
    { name: "Webinars", href: "/admin/webinars" },
    { name: "Files", href: "/admin/files" },
    { name: "Submissions", href: "/admin/submissions" },
  ];

  const socialLinks = [
    { name: "WhatsApp", href: "https://wa.me/1234567890", icon: SiWhatsapp },
    { name: "Twitter", href: "https://twitter.com/yadnusconsultant", icon: SiX },
    { name: "Instagram", href: "https://instagram.com/yadnusconsultant", icon: SiInstagram },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Yadnus Consultant</h1>
              <p className="text-xs text-muted-foreground">Town Planning & Construction</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-colors font-medium ${
                      location === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-colors font-medium ${
                      location === item.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </div>
          
          {/* Social Icons & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuthenticated && socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid={`social-${social.name.toLowerCase()}`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.firstName || 'Admin'}
                </span>
                <Button
                  onClick={() => window.location.href = '/api/logout'}
                  variant="outline"
                  size="sm"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button asChild data-testid="button-consultation">
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
                <Button
                  onClick={() => window.location.href = '/api/login'}
                  variant="outline"
                  size="sm"
                  data-testid="button-admin-login"
                >
                  Admin Login
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden" data-testid="button-mobile-menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="py-6">
                <div className="space-y-4">
                  {(isAuthenticated ? adminNavigation : navigation).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block py-2 px-4 rounded-lg transition-colors ${
                        location === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                {!isAuthenticated && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex justify-center space-x-6 mb-6">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <social.icon className="w-6 h-6" />
                        </a>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <Button asChild className="w-full">
                        <Link href="/contact" onClick={() => setIsOpen(false)}>
                          Schedule Consultation
                        </Link>
                      </Button>
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = '/api/login';
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Admin Login
                      </Button>
                    </div>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <Button
                      onClick={() => window.location.href = '/api/logout'}
                      variant="outline"
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
