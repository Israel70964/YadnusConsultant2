import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Target, Heart, Building, Leaf, Globe } from "lucide-react";
const missionImg = "/images/town_planning_urban__c6b36ecb.jpg";
const architectureImg = "/images/modern_architecture__2168f8eb.jpg";
const teamImg = "/images/office_meeting_prese_3bf44d4c.jpg";

export default function About() {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Excellence",
      description: "We strive for the highest standards in every project, ensuring quality outcomes that exceed expectations."
    },
    {
      icon: <Leaf className="w-8 h-8 text-accent" />,
      title: "Sustainability",
      description: "Environmental responsibility is at the core of our planning and construction practices."
    },
    {
      icon: <Heart className="w-8 h-8 text-secondary" />,
      title: "Community Focus",
      description: "We believe that successful development starts with understanding and serving community needs."
    },
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "We embrace new technologies and methodologies to create smarter, more efficient solutions."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Principal Urban Planner",
      experience: "15+ years",
      specialties: ["Master Planning", "Zoning", "Environmental Assessment"]
    },
    {
      name: "Michael Rodriguez",
      role: "Construction Manager",
      experience: "12+ years",
      specialties: ["Project Management", "Quality Control", "Safety"]
    },
    {
      name: "Emily Johnson",
      role: "Community Engagement Specialist",
      experience: "8+ years",
      specialties: ["Public Consultation", "Stakeholder Relations", "Social Impact"]
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
              About Yadnus Consultant
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              With over 15 years of experience, we are passionate about creating sustainable, livable communities through expert town planning and construction consulting.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">150+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To transform communities through innovative town planning and construction consulting that balances economic growth with environmental sustainability and social responsibility.
              </p>
              <p className="text-muted-foreground">
                We believe that well-planned communities are the foundation of a sustainable future. Our mission is to work collaboratively with clients, stakeholders, and communities to create spaces that not only meet today's needs but also prepare for tomorrow's challenges.
              </p>
            </div>
            <div className="relative">
              <img
                src={missionImg}
                alt="Urban planning blueprints"
                className="rounded-xl shadow-lg w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8 rounded-b-xl">
                <h3 className="text-xl font-semibold text-white mb-2">Our Vision</h3>
                <p className="text-white/90 text-sm">
                  To be the leading town planning and construction consulting firm recognized for creating innovative, sustainable, and community-centered developments that serve as models for future urban growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These core values guide every decision we make and every project we undertake.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Expert Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the experienced professionals who bring your vision to life.
            </p>
          </div>

          <div className="mb-12 rounded-xl overflow-hidden">
            <img
              src={teamImg}
              alt="Professional consultation team"
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4">{member.experience}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-xl text-muted-foreground">
                Founded with a vision to create sustainable communities for future generations.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">The Beginning (2009)</h3>
                  <p className="text-muted-foreground">
                    Yadnus Consultant was founded by a team of passionate urban planners and construction professionals who shared a common vision: to create sustainable, community-centered developments that would stand the test of time.
                  </p>
                </div>
                <div className="bg-primary/5 rounded-xl p-6">
                  <Award className="w-12 h-12 text-primary mb-4" />
                  <h4 className="font-semibold text-foreground mb-2">First Major Project</h4>
                  <p className="text-muted-foreground text-sm">
                    Our first major project was the redevelopment of a historic downtown district, which set the standard for our community-focused approach.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-accent/5 rounded-xl p-6 md:order-2">
                  <Building className="w-12 h-12 text-accent mb-4" />
                  <h4 className="font-semibold text-foreground mb-2">Expansion & Growth</h4>
                  <p className="text-muted-foreground text-sm">
                    By 2015, we had expanded our services to include comprehensive construction management and environmental consulting.
                  </p>
                </div>
                <div className="md:order-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">Growth & Recognition (2015-2020)</h3>
                  <p className="text-muted-foreground">
                    Our reputation for excellence grew, and we began working on larger, more complex projects. We received several industry awards for our innovative approaches to sustainable development.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-4">Leading the Future (2020-Present)</h3>
                  <p className="text-muted-foreground">
                    Today, we continue to push the boundaries of what's possible in town planning and construction. Our focus on sustainability, community engagement, and innovative technology positions us as leaders in the industry.
                  </p>
                </div>
                <div className="bg-secondary/5 rounded-xl p-6">
                  <Globe className="w-12 h-12 text-secondary mb-4" />
                  <h4 className="font-semibold text-foreground mb-2">Industry Leadership</h4>
                  <p className="text-muted-foreground text-sm">
                    We now lead industry workshops and webinars, sharing our expertise with the next generation of planners and developers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
