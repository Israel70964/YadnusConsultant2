import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  User,
  Share2,
  Tag,
  BookOpen
} from "lucide-react";
import { SiWhatsapp, SiX } from "react-icons/si";
import type { BlogPost } from "@shared/schema";

export default function BlogPostDetail() {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/posts", slug],
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts?published=true"],
  });

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "Yadnus Consultant Article";
    
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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/blog">View All Articles</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const related = relatedPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags?.some(tag => post.tags?.includes(tag))))
    .slice(0, 3);

  const placeholderImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600";
  const heroImage = post.imageUrl || placeholderImage;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Navigation */}
      <section className="py-6 bg-muted/30">
        <div className="container mx-auto px-6">
          <Button asChild variant="outline" size="sm" data-testid="button-back-to-blog">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Header */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              {post.category && (
                <Badge className="bg-primary/10 text-primary">
                  {post.category}
                </Badge>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>Admin</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-article-title">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-sm font-medium text-foreground mr-2">Share:</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleShare("whatsapp")}
                data-testid="button-share-whatsapp"
              >
                <SiWhatsapp className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleShare("twitter")}
                data-testid="button-share-twitter"
              >
                <SiX className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleShare("copy")}
                data-testid="button-copy-link"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="mb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl overflow-hidden">
              <img 
                src={heroImage}
                alt={post.title}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="max-w-3xl">
                <div 
                  className="prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  data-testid="article-content"
                />
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Article Details */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Article Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium text-foreground">Published</div>
                        <div className="text-muted-foreground">
                          {new Date(post.createdAt!).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      {post.category && (
                        <div>
                          <div className="font-medium text-foreground">Category</div>
                          <div className="text-muted-foreground">{post.category}</div>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-foreground">Reading Time</div>
                        <div className="text-muted-foreground">5 minutes</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter CTA */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest insights delivered to your inbox.
                    </p>
                    <Button asChild className="w-full" data-testid="button-subscribe">
                      <Link href="/contact">Subscribe Now</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact CTA */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Need Expert Advice?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Let's discuss how our expertise can help with your project.
                    </p>
                    <Button asChild variant="outline" className="w-full" data-testid="button-contact-expert">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Related Articles</h2>
              <p className="text-xl text-muted-foreground">
                Continue reading with these related insights.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {related.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden card-hover">
                  <img 
                    src={relatedPost.imageUrl || placeholderImage}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    {relatedPost.category && (
                      <Badge variant="outline" className="mb-3">
                        {relatedPost.category}
                      </Badge>
                    )}
                    <h3 className="font-semibold mb-2 text-foreground line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {relatedPost.excerpt || relatedPost.content.substring(0, 150) + "..."}
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/blog/${relatedPost.slug}`}>Read Article</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
