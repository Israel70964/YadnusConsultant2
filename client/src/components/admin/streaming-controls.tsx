import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Play, 
  Square, 
  Settings, 
  Youtube, 
  Video, 
  Key, 
  Link,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Webinar } from "@shared/schema";

interface StreamingControlsProps {
  webinar: Webinar;
  onUpdate: () => void;
}

export function StreamingControls({ webinar, onUpdate }: StreamingControlsProps) {
  const { toast } = useToast();
  const [youtubeToken, setYoutubeToken] = useState("");
  const [youtubeRefreshToken, setYoutubeRefreshToken] = useState("");
  const [zoomPassword, setZoomPassword] = useState("");
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);

  const setupYoutubeMutation = useMutation({
    mutationFn: async (data: { youtubeAccessToken: string; youtubeRefreshToken?: string }) => {
      return await apiRequest("POST", `/api/webinars/${webinar.id}/setup-youtube`, data);
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "YouTube Live stream configured successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      onUpdate();
      setIsSetupDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to setup YouTube Live stream",
        variant: "destructive",
      });
    },
  });

  const setupZoomMutation = useMutation({
    mutationFn: async (data: { password?: string; settings?: any }) => {
      return await apiRequest("POST", `/api/webinars/${webinar.id}/setup-zoom`, data);
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Zoom meeting configured successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      onUpdate();
      setIsSetupDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to setup Zoom meeting",
        variant: "destructive",
      });
    },
  });

  const startStreamMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/webinars/${webinar.id}/start-stream`, {});
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Live stream started successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      onUpdate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start live stream",
        variant: "destructive",
      });
    },
  });

  const endStreamMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/webinars/${webinar.id}/end-stream`, {});
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Live stream ended successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      onUpdate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to end live stream",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <Play className="w-3 h-3" />;
      case "scheduled":
        return <CheckCircle className="w-3 h-3" />;
      case "ended":
        return <Square className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const isStreamConfigured = webinar.streamingPlatform && 
    (webinar.youtubeLiveId || webinar.zoomMeetingId);

  const streamMetadata = webinar.streamMetadata as any;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Streaming Controls</span>
          {webinar.streamingStatus && (
            <Badge className={getStatusColor(webinar.streamingStatus)}>
              {getStatusIcon(webinar.streamingStatus)}
              <span className="ml-1 capitalize">{webinar.streamingStatus}</span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Setup */}
        {!isStreamConfigured ? (
          <div className="text-center py-8">
            <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Setup Live Streaming</h3>
            <p className="text-muted-foreground mb-4">
              Configure YouTube Live or Zoom to enable streaming for this webinar
            </p>
            
            <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-setup-streaming">
                  <Settings className="w-4 h-4 mr-2" />
                  Setup Streaming
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Setup Live Streaming</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="youtube" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="youtube" data-testid="tab-youtube">
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube Live
                    </TabsTrigger>
                    <TabsTrigger value="zoom" data-testid="tab-zoom">
                      <Video className="w-4 h-4 mr-2" />
                      Zoom
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="youtube" className="space-y-4">
                    <div>
                      <Label htmlFor="youtube-token">YouTube Access Token *</Label>
                      <Input
                        id="youtube-token"
                        type="password"
                        value={youtubeToken}
                        onChange={(e) => setYoutubeToken(e.target.value)}
                        placeholder="Enter YouTube OAuth access token"
                        data-testid="input-youtube-token"
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtube-refresh-token">YouTube Refresh Token</Label>
                      <Input
                        id="youtube-refresh-token"
                        type="password"
                        value={youtubeRefreshToken}
                        onChange={(e) => setYoutubeRefreshToken(e.target.value)}
                        placeholder="Enter YouTube OAuth refresh token (optional)"
                        data-testid="input-youtube-refresh-token"
                      />
                    </div>
                    <Button
                      onClick={() => setupYoutubeMutation.mutate({
                        youtubeAccessToken: youtubeToken,
                        youtubeRefreshToken: youtubeRefreshToken || undefined
                      })}
                      disabled={!youtubeToken || setupYoutubeMutation.isPending}
                      className="w-full"
                      data-testid="button-setup-youtube"
                    >
                      {setupYoutubeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Youtube className="w-4 h-4 mr-2" />
                      )}
                      Setup YouTube Live
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="zoom" className="space-y-4">
                    <div>
                      <Label htmlFor="zoom-password">Meeting Password</Label>
                      <Input
                        id="zoom-password"
                        type="password"
                        value={zoomPassword}
                        onChange={(e) => setZoomPassword(e.target.value)}
                        placeholder="Enter meeting password (optional)"
                        data-testid="input-zoom-password"
                      />
                    </div>
                    <Button
                      onClick={() => setupZoomMutation.mutate({
                        password: zoomPassword || undefined
                      })}
                      disabled={setupZoomMutation.isPending}
                      className="w-full"
                      data-testid="button-setup-zoom"
                    >
                      {setupZoomMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Video className="w-4 h-4 mr-2" />
                      )}
                      Setup Zoom Meeting
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stream Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Platform</Label>
                <div className="flex items-center mt-1">
                  {webinar.streamingPlatform === 'youtube' ? (
                    <Youtube className="w-4 h-4 mr-2 text-red-600" />
                  ) : (
                    <Video className="w-4 h-4 mr-2 text-blue-600" />
                  )}
                  <span className="capitalize">{webinar.streamingPlatform}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center mt-1">
                  {getStatusIcon(webinar.streamingStatus || "scheduled")}
                  <span className="ml-2 capitalize">{webinar.streamingStatus || "scheduled"}</span>
                </div>
              </div>
            </div>

            {/* Stream Details */}
            {webinar.streamingPlatform === 'youtube' && streamMetadata && (
              <div className="space-y-3">
                <h4 className="font-medium">YouTube Live Details</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-sm">Watch URL</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        value={streamMetadata.watchUrl || ''}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(streamMetadata.watchUrl);
                          toast({ title: "Copied to clipboard" });
                        }}
                        data-testid="button-copy-youtube-url"
                      >
                        <Link className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm">Stream Key</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        type="password"
                        value={webinar.youtubeStreamKey || ''}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(webinar.youtubeStreamKey || '');
                          toast({ title: "Stream key copied to clipboard" });
                        }}
                        data-testid="button-copy-stream-key"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {webinar.streamingPlatform === 'zoom' && streamMetadata && (
              <div className="space-y-3">
                <h4 className="font-medium">Zoom Meeting Details</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-sm">Meeting ID</Label>
                    <Input
                      value={webinar.zoomMeetingId || ''}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Join URL</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        value={streamMetadata.joinUrl || ''}
                        readOnly
                        className="bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(streamMetadata.joinUrl);
                          toast({ title: "Join URL copied to clipboard" });
                        }}
                        data-testid="button-copy-zoom-url"
                      >
                        <Link className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {webinar.zoomPassword && (
                    <div>
                      <Label className="text-sm">Password</Label>
                      <Input
                        type="password"
                        value={webinar.zoomPassword}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stream Controls */}
            <div className="flex gap-3">
              {webinar.streamingStatus === 'scheduled' && (
                <Button
                  onClick={() => startStreamMutation.mutate()}
                  disabled={startStreamMutation.isPending}
                  className="flex-1"
                  data-testid="button-start-stream"
                >
                  {startStreamMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Start Live Stream
                </Button>
              )}
              
              {webinar.streamingStatus === 'live' && (
                <Button
                  onClick={() => endStreamMutation.mutate()}
                  disabled={endStreamMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-end-stream"
                >
                  {endStreamMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Square className="w-4 h-4 mr-2" />
                  )}
                  End Live Stream
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}