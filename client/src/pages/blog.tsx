import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import BlogCard from "@/components/cards/blog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, BookOpen } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts?published=true"],
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts/search", searchQuery],
    enabled: searchQuery.length > 2,
    queryFn: async () => {
      const res = await fetch(`/api/posts/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
  });

  const categories = ["all", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const displayPosts = searchQuery.length > 2 ? searchResults : posts;
  
  const filteredPosts = displayPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesCategory;
  });

  const featuredPosts = posts.filter(p => p.imageUrl).slice(0, 3);

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
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Industry Insights & News
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stay informed with our latest articles on urban planning trends, construction innovations, and sustainable development practices.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{posts.length}+</div>
                <div className="text-muted-foreground">Articles Published</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{categories.length - 1}</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Weekly</div>
                <div className="text-muted-foreground">New Content</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Featured Articles</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Don't miss these highlighted insights from our experts.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-articles"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="md:w-48" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {searchQuery.length > 2 ? "Search Results" : "All Articles"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              {searchQuery.length > 2 && ` for "${searchQuery}"`}
            </p>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery.length > 2 
                  ? "No articles found matching your search criteria."
                  : "No articles found matching your criteria."
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Popular Topics</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore articles by topic to find content that interests you most.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.filter(cat => cat !== "all").map((category) => {
              const count = posts.filter(p => p.category === category).length;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                  data-testid={`button-category-${category}`}
                >
                  {category}
                  <Badge variant="secondary" className="ml-2">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-xl p-8 lg:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest insights delivered directly to your inbox.
            </p>
            <Button asChild size="lg" variant="secondary" data-testid="button-subscribe-newsletter">
              <a href="#newsletter">Subscribe Now</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
