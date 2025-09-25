import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Play } from "lucide-react";
import type { Webinar } from "@shared/schema";

interface WebinarCardProps {
  webinar: Webinar;
  isPast?: boolean;
}

export default function WebinarCard({ webinar, isPast = false }: WebinarCardProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200";
  const imageUrl = webinar.thumbnailUrl || placeholderImage;

  const formatDuration = (minutes: number = 45) => `${minutes} min`;

  return (
    <Card className="overflow-hidden card-hover" data-testid={`card-webinar-${webinar.id}`}>
      <img 
        src={imageUrl} 
        alt={webinar.title} 
        className="w-full h-40 object-cover" 
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={isPast ? "secondary" : "default"} className={isPast ? "bg-muted text-muted-foreground" : ""}>
            {isPast ? "Past Recording" : "Upcoming"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDuration()}
          </span>
        </div>
        <h4 className="font-semibold mb-2 text-foreground" data-testid={`text-webinar-title-${webinar.id}`}>
          {webinar.title}
        </h4>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {webinar.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(webinar.date).toLocaleDateString()}</span>
          </div>
          <Button asChild variant="ghost" size="sm" data-testid={`button-view-webinar-${webinar.id}`}>
            <Link href={`/webinars/${webinar.id}`}>
              {isPast ? (
                <>
                  Watch Now <Play className="w-4 h-4 ml-1" />
                </>
              ) : (
                "Register"
              )}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
