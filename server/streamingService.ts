import { google } from 'googleapis';
import axios from 'axios';

// YouTube Live Streaming Service
export class YouTubeLiveService {
  private youtube: any;
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  setCredentials(accessToken: string, refreshToken?: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  async createLiveBroadcast(title: string, description: string, scheduledStartTime: Date) {
    try {
      const response = await this.youtube.liveBroadcasts.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title,
            description,
            scheduledStartTime: scheduledStartTime.toISOString(),
          },
          status: {
            privacyStatus: 'public',
            selfDeclaredMadeForKids: false
          }
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create YouTube broadcast: ${error.message}`);
    }
  }

  async createLiveStream(title: string) {
    try {
      const response = await this.youtube.liveStreams.insert({
        part: 'snippet,cdn',
        requestBody: {
          snippet: {
            title
          },
          cdn: {
            format: '1080p',
            ingestionType: 'rtmp'
          }
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create YouTube stream: ${error.message}`);
    }
  }

  async bindStreamToBroadcast(broadcastId: string, streamId: string) {
    try {
      const response = await this.youtube.liveBroadcasts.bind({
        part: 'id,contentDetails',
        id: broadcastId,
        streamId: streamId
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to bind stream to broadcast: ${error.message}`);
    }
  }

  async transitionBroadcast(broadcastId: string, status: 'testing' | 'live' | 'complete') {
    try {
      const response = await this.youtube.liveBroadcasts.transition({
        part: 'status',
        broadcastStatus: status,
        id: broadcastId
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to transition broadcast: ${error.message}`);
    }
  }

  async startLiveStream(title: string, description: string, scheduledStartTime: Date) {
    try {
      // Create broadcast
      const broadcast = await this.createLiveBroadcast(title, description, scheduledStartTime);
      
      // Create stream
      const stream = await this.createLiveStream(title);
      
      // Bind stream to broadcast
      await this.bindStreamToBroadcast(broadcast.id, stream.id);

      return {
        broadcastId: broadcast.id,
        streamId: stream.id,
        watchUrl: `https://www.youtube.com/watch?v=${broadcast.id}`,
        streamKey: stream.cdn.ingestionInfo.streamName,
        rtmpUrl: stream.cdn.ingestionInfo.ingestionAddress
      };
    } catch (error: any) {
      throw new Error(`Failed to start YouTube live stream: ${error.message}`);
    }
  }
}

// Zoom Meeting Service
export class ZoomService {
  private baseUrl = 'https://api.zoom.us/v2';

  async getAccessToken(): Promise<string> {
    try {
      const credentials = Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
      ).toString('base64');

      const response = await axios({
        method: 'POST',
        url: `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.access_token;
    } catch (error: any) {
      throw new Error(`Zoom token generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async createMeeting(meetingData: {
    topic: string;
    duration: number;
    startTime: Date;
    password?: string;
    settings?: any;
  }) {
    try {
      const token = await this.getAccessToken();
      
      const meetingConfig = {
        topic: meetingData.topic,
        type: 2, // Scheduled meeting
        start_time: meetingData.startTime.toISOString(),
        duration: meetingData.duration,
        timezone: 'UTC',
        password: meetingData.password,
        settings: {
          join_before_host: true,
          waiting_room: false,
          participant_video: true,
          host_video: true,
          mute_upon_entry: false,
          email_notification: true,
          ...meetingData.settings
        }
      };

      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/users/me/meetings`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: meetingConfig
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Zoom meeting creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async updateMeeting(meetingId: string, updateData: any) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'PATCH',
        url: `${this.baseUrl}/meetings/${meetingId}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: updateData
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
  }

  async deleteMeeting(meetingId: string) {
    try {
      const token = await this.getAccessToken();
      
      await axios({
        method: 'DELETE',
        url: `${this.baseUrl}/meetings/${meetingId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true };
    } catch (error: any) {
      throw new Error(`Failed to delete Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
  }

  async getMeeting(meetingId: string) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios({
        method: 'GET',
        url: `${this.baseUrl}/meetings/${meetingId}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get Zoom meeting: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Main Streaming Service that orchestrates both platforms
export class StreamingService {
  private youtubeService: YouTubeLiveService;
  private zoomService: ZoomService;

  constructor() {
    this.youtubeService = new YouTubeLiveService();
    this.zoomService = new ZoomService();
  }

  async setupYoutubeLive(webinarData: {
    title: string;
    description: string;
    scheduledStartTime: Date;
    youtubeAccessToken: string;
    youtubeRefreshToken?: string;
  }) {
    try {
      this.youtubeService.setCredentials(
        webinarData.youtubeAccessToken,
        webinarData.youtubeRefreshToken
      );

      const liveStream = await this.youtubeService.startLiveStream(
        webinarData.title,
        webinarData.description,
        webinarData.scheduledStartTime
      );

      return {
        platform: 'youtube',
        broadcastId: liveStream.broadcastId,
        streamId: liveStream.streamId,
        watchUrl: liveStream.watchUrl,
        streamKey: liveStream.streamKey,
        rtmpUrl: liveStream.rtmpUrl
      };
    } catch (error: any) {
      throw new Error(`YouTube Live setup failed: ${error.message}`);
    }
  }

  async setupZoomMeeting(webinarData: {
    title: string;
    description: string;
    scheduledStartTime: Date;
    duration: number;
    password?: string;
    settings?: any;
  }) {
    try {
      const meeting = await this.zoomService.createMeeting({
        topic: webinarData.title,
        duration: webinarData.duration,
        startTime: webinarData.scheduledStartTime,
        password: webinarData.password,
        settings: webinarData.settings
      });

      return {
        platform: 'zoom',
        meetingId: meeting.id,
        joinUrl: meeting.join_url,
        startUrl: meeting.start_url,
        password: meeting.password,
        meetingNumber: meeting.id
      };
    } catch (error: any) {
      throw new Error(`Zoom meeting setup failed: ${error.message}`);
    }
  }

  async startLiveStream(platform: 'youtube' | 'zoom', streamId: string) {
    try {
      if (platform === 'youtube') {
        return await this.youtubeService.transitionBroadcast(streamId, 'live');
      } else if (platform === 'zoom') {
        // Zoom meetings start automatically at scheduled time
        return await this.zoomService.getMeeting(streamId);
      }
    } catch (error: any) {
      throw new Error(`Failed to start live stream: ${error.message}`);
    }
  }

  async endLiveStream(platform: 'youtube' | 'zoom', streamId: string) {
    try {
      if (platform === 'youtube') {
        return await this.youtubeService.transitionBroadcast(streamId, 'complete');
      } else if (platform === 'zoom') {
        return await this.zoomService.deleteMeeting(streamId);
      }
    } catch (error: any) {
      throw new Error(`Failed to end live stream: ${error.message}`);
    }
  }
}

export const streamingService = new StreamingService();