import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Clock } from "lucide-react";
import type { BlogPost } from "@shared/schema";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200";
  const imageUrl = post.imageUrl || placeholderImage;

  return (
    <Card className="overflow-hidden card-hover" data-testid={`card-blog-${post.id}`}>
      <img 
        src={imageUrl} 
        alt={post.title} 
        className="w-full h-48 object-cover" 
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          {post.category && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {post.category}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(post.createdAt!).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-3 text-foreground" data-testid={`text-blog-title-${post.id}`}>
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt || post.content.substring(0, 150) + "..."}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="w-4 h-4 mr-1" />
            <span>Admin</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>5 min read</span>
          </div>
          <Button asChild variant="ghost" size="sm" data-testid={`button-read-post-${post.id}`}>
            <Link href={`/blog/${post.slug}`}>
              Read More
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
