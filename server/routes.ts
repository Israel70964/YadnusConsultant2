import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  contactFormSchema,
  webinarSignupSchema,
  projectInquirySchema,
  newsletterSchema,
  insertBlogPostSchema,
  insertProjectSchema,
  insertWebinarSchema,
} from "@shared/schema";
import {
  sendContactNotification,
  sendWebinarConfirmation,
  sendProjectInquiryNotification,
  sendNewsletterWelcome,
} from "./emailService";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Blog routes
  app.get('/api/posts', async (req, res) => {
    try {
      // Only filter by published status if explicitly requested
      const published = req.query.published === 'true' ? true : req.query.published === 'false' ? false : undefined;
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const posts = await storage.searchBlogPosts(query);
      res.json(posts);
    } catch (error) {
      console.error("Error searching posts:", error);
      res.status(500).json({ message: "Failed to search posts" });
    }
  });

  app.get('/api/posts/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put('/api/posts/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Project routes
  app.get('/api/projects', async (req, res) => {
    try {
      const featured = req.query.featured === 'true' ? true : undefined;
      const projects = await storage.getProjects(featured);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/projects/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Webinar routes
  app.get('/api/webinars', async (req, res) => {
    try {
      const webinars = await storage.getWebinars();
      res.json(webinars);
    } catch (error) {
      console.error("Error fetching webinars:", error);
      res.status(500).json({ message: "Failed to fetch webinars" });
    }
  });

  app.get('/api/webinars/upcoming', async (req, res) => {
    try {
      const webinars = await storage.getUpcomingWebinars();
      res.json(webinars);
    } catch (error) {
      console.error("Error fetching upcoming webinars:", error);
      res.status(500).json({ message: "Failed to fetch upcoming webinars" });
    }
  });

  app.get('/api/webinars/past', async (req, res) => {
    try {
      const webinars = await storage.getPastWebinars();
      res.json(webinars);
    } catch (error) {
      console.error("Error fetching past webinars:", error);
      res.status(500).json({ message: "Failed to fetch past webinars" });
    }
  });

  app.get('/api/webinars/:id', async (req, res) => {
    try {
      const webinar = await storage.getWebinar(req.params.id);
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found" });
      }
      res.json(webinar);
    } catch (error) {
      console.error("Error fetching webinar:", error);
      res.status(500).json({ message: "Failed to fetch webinar" });
    }
  });

  app.post('/api/webinars', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertWebinarSchema.parse(req.body);
      const webinar = await storage.createWebinar(validatedData);
      res.status(201).json(webinar);
    } catch (error) {
      console.error("Error creating webinar:", error);
      res.status(500).json({ message: "Failed to create webinar" });
    }
  });

  app.put('/api/webinars/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertWebinarSchema.partial().parse(req.body);
      const webinar = await storage.updateWebinar(req.params.id, validatedData);
      res.json(webinar);
    } catch (error) {
      console.error("Error updating webinar:", error);
      res.status(500).json({ message: "Failed to update webinar" });
    }
  });

  app.delete('/api/webinars/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteWebinar(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting webinar:", error);
      res.status(500).json({ message: "Failed to delete webinar" });
    }
  });

  // Form submission routes
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = contactFormSchema.parse(req.body);
      
      const submission = await storage.createSubmission({
        type: 'contact',
        payload: validatedData,
      });

      // Send email notification
      await sendContactNotification(validatedData);

      res.status(201).json({ message: "Contact form submitted successfully" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  app.post('/api/webinar-signup', async (req, res) => {
    try {
      const validatedData = webinarSignupSchema.parse(req.body);
      
      const webinar = await storage.getWebinar(validatedData.webinarId);
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found" });
      }

      const submission = await storage.createSubmission({
        type: 'webinar',
        payload: validatedData,
      });

      // Increment registration count
      await storage.incrementWebinarRegistration(validatedData.webinarId);

      // Send confirmation email
      await sendWebinarConfirmation(validatedData, webinar.title);

      res.status(201).json({ message: "Webinar registration successful" });
    } catch (error) {
      console.error("Error submitting webinar signup:", error);
      res.status(500).json({ message: "Failed to register for webinar" });
    }
  });

  app.post('/api/project-inquiry', upload.array('attachments'), async (req, res) => {
    try {
      const validatedData = projectInquirySchema.parse(req.body);
      
      const attachments = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

      const submission = await storage.createSubmission({
        type: 'project',
        payload: validatedData,
        attachments,
      });

      // Send email notification
      await sendProjectInquiryNotification(validatedData);

      res.status(201).json({ message: "Project inquiry submitted successfully" });
    } catch (error) {
      console.error("Error submitting project inquiry:", error);
      res.status(500).json({ message: "Failed to submit project inquiry" });
    }
  });

  app.post('/api/newsletter', async (req, res) => {
    try {
      const validatedData = newsletterSchema.parse(req.body);
      
      // Check if subscriber already exists
      const existingSubscriber = await storage.getSubscriber(validatedData.email);
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return res.status(400).json({ message: "Email already subscribed" });
        } else {
          // Reactivate the subscriber
          await storage.updateSubscriber(existingSubscriber.id, {
            isActive: true,
            unsubscribedAt: null,
          });
        }
      } else {
        // Create new subscriber
        await storage.createSubscriber({
          email: validatedData.email,
          source: 'website',
        });
      }

      // Also create submission for backward compatibility
      await storage.createSubmission({
        type: 'newsletter',
        payload: validatedData,
      });

      // Send welcome email
      await sendNewsletterWelcome(validatedData.email);

      res.status(201).json({ message: "Newsletter subscription successful" });
    } catch (error) {
      console.error("Error submitting newsletter signup:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Newsletter unsubscribe
  app.post('/api/newsletter/unsubscribe', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      await storage.unsubscribeEmail(email);
      res.json({ message: "Successfully unsubscribed" });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
    }
  });

  // Admin routes for submissions
  app.get('/api/admin/submissions', isAuthenticated, async (req, res) => {
    try {
      const type = req.query.type as string;
      const submissions = await storage.getSubmissions(type);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.delete('/api/admin/submissions/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteSubmission(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting submission:", error);
      res.status(500).json({ message: "Failed to delete submission" });
    }
  });

  // Admin newsletter management routes
  app.get('/api/admin/subscribers', isAuthenticated, async (req, res) => {
    try {
      const isActive = req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined;
      const subscribers = await storage.getSubscribers(isActive);
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  app.get('/api/admin/subscribers/count', isAuthenticated, async (req, res) => {
    try {
      const count = await storage.getSubscriberCount();
      res.json({ count });
    } catch (error) {
      console.error("Error fetching subscriber count:", error);
      res.status(500).json({ message: "Failed to fetch subscriber count" });
    }
  });

  app.post('/api/admin/subscribers', isAuthenticated, async (req, res) => {
    try {
      const { email, name, tags } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const existingSubscriber = await storage.getSubscriber(email);
      if (existingSubscriber) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const subscriber = await storage.createSubscriber({
        email,
        name: name || null,
        tags: tags || [],
        source: 'manual',
      });

      res.status(201).json(subscriber);
    } catch (error) {
      console.error("Error creating subscriber:", error);
      res.status(500).json({ message: "Failed to create subscriber" });
    }
  });

  app.put('/api/admin/subscribers/:id', isAuthenticated, async (req, res) => {
    try {
      const { name, tags, isActive } = req.body;
      const subscriber = await storage.updateSubscriber(req.params.id, {
        name,
        tags,
        isActive,
      });
      res.json(subscriber);
    } catch (error) {
      console.error("Error updating subscriber:", error);
      res.status(500).json({ message: "Failed to update subscriber" });
    }
  });

  app.delete('/api/admin/subscribers/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteSubscriber(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  // Campaign management routes
  app.get('/api/admin/campaigns', isAuthenticated, async (req, res) => {
    try {
      const status = req.query.status as string;
      const campaigns = status ? await storage.getCampaignsByStatus(status) : await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get('/api/admin/campaigns/:id', isAuthenticated, async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post('/api/admin/campaigns', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const campaignData = { ...req.body, createdBy: userId };
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.put('/api/admin/campaigns/:id', isAuthenticated, async (req, res) => {
    try {
      const campaign = await storage.updateCampaign(req.params.id, req.body);
      res.json(campaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete('/api/admin/campaigns/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteCampaign(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  app.get('/api/admin/campaigns/:id/analytics', isAuthenticated, async (req, res) => {
    try {
      const analytics = await storage.getCampaignAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching campaign analytics:", error);
      res.status(500).json({ message: "Failed to fetch campaign analytics" });
    }
  });

  // Enhanced file upload system
  app.post('/api/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const { category = 'media', relatedId, relatedType } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      // Create file record in database
      const file = await storage.createFile({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        category,
        relatedId: relatedId || null,
        relatedType: relatedType || null,
        uploadedBy: userId,
      });
      
      res.json({ 
        id: file.id,
        url: `/uploads/${req.file.filename}`,
        filename: file.filename,
        originalName: file.originalName,
        size: file.size,
        mimeType: file.mimeType
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Multiple file upload
  app.post('/api/upload-multiple', isAuthenticated, upload.array('files', 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      const { category = 'media', relatedId, relatedType } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const uploadedFiles = [];
      
      for (const file of files) {
        const fileRecord = await storage.createFile({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          path: file.path,
          category,
          relatedId: relatedId || null,
          relatedType: relatedType || null,
          uploadedBy: userId,
        });
        
        uploadedFiles.push({
          id: fileRecord.id,
          url: `/uploads/${file.filename}`,
          filename: fileRecord.filename,
          originalName: fileRecord.originalName,
          size: fileRecord.size,
          mimeType: fileRecord.mimeType
        });
      }
      
      res.json({ files: uploadedFiles });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ message: "Failed to upload files" });
    }
  });

  // Get files by category or project
  app.get('/api/files', isAuthenticated, async (req, res) => {
    try {
      const { category, relatedId } = req.query;
      const files = await storage.getFiles(category as string, relatedId as string);
      
      const filesWithUrls = files.map(file => ({
        ...file,
        url: `/uploads/${file.filename}`
      }));
      
      res.json(filesWithUrls);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Delete file
  app.delete('/api/files/:id', isAuthenticated, async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Delete file from filesystem
      const fs = await import('fs/promises');
      try {
        await fs.unlink(file.path);
      } catch (fsError) {
        console.warn("File not found on filesystem:", file.path);
      }
      
      // Delete from database
      await storage.deleteFile(req.params.id);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Advanced webinar streaming routes
  app.post('/api/webinars/:id/setup-youtube', isAuthenticated, async (req, res) => {
    try {
      const { youtubeAccessToken, youtubeRefreshToken } = req.body;
      const webinar = await storage.getWebinar(req.params.id);
      
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found" });
      }

      const { streamingService } = await import('./streamingService');
      
      const liveStream = await streamingService.setupYoutubeLive({
        title: webinar.title,
        description: webinar.description,
        scheduledStartTime: new Date(webinar.date),
        youtubeAccessToken,
        youtubeRefreshToken
      });

      // Update webinar with YouTube stream info
      await storage.updateWebinar(req.params.id, {
        streamingPlatform: 'youtube',
        youtubeLiveId: liveStream.broadcastId,
        youtubeStreamKey: liveStream.streamKey,
        streamMetadata: liveStream,
        streamingStatus: 'scheduled'
      });

      res.json(liveStream);
    } catch (error) {
      console.error("Error setting up YouTube Live:", error);
      res.status(500).json({ message: "Failed to setup YouTube Live stream" });
    }
  });

  app.post('/api/webinars/:id/setup-zoom', isAuthenticated, async (req, res) => {
    try {
      const { password, settings } = req.body;
      const webinar = await storage.getWebinar(req.params.id);
      
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found" });
      }

      const { streamingService } = await import('./streamingService');
      
      const meeting = await streamingService.setupZoomMeeting({
        title: webinar.title,
        description: webinar.description,
        scheduledStartTime: new Date(webinar.date),
        duration: 60, // Default 1 hour
        password,
        settings
      });

      // Update webinar with Zoom meeting info
      await storage.updateWebinar(req.params.id, {
        streamingPlatform: 'zoom',
        zoomMeetingId: meeting.meetingId,
        zoomPassword: meeting.password,
        streamMetadata: meeting,
        streamingStatus: 'scheduled'
      });

      res.json(meeting);
    } catch (error) {
      console.error("Error setting up Zoom meeting:", error);
      res.status(500).json({ message: "Failed to setup Zoom meeting" });
    }
  });

  app.post('/api/webinars/:id/start-stream', isAuthenticated, async (req, res) => {
    try {
      const webinar = await storage.getWebinar(req.params.id);
      
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found" });
      }

      const { streamingService } = await import('./streamingService');
      
      const streamId = webinar.streamingPlatform === 'youtube' 
        ? webinar.youtubeLiveId 
        : webinar.zoomMeetingId;

      if (!streamId) {
        return res.status(400).json({ message: "Stream not configured" });
      }

      const result = await streamingService.startLiveStream(
        webinar.streamingPlatform as 'youtube' | 'zoom',
        streamId
      );

      // Update webinar status
      await storage.updateWebinar(req.params.id, {
        streamingStatus: 'live',
        isLive: true
      });

      res.json(result);
    } catch (error) {
      console.error("Error starting live stream:", error);
      res.status(500).json({ message: "Failed to start live stream" });
    }
  });

  app.post('/api/webinars/:id/end-stream', isAuthenticated, async (req, res) => {
    try {
      const webinar = await storage.getWebinar(req.params.id);
      
      if (!webinar) {
        return res.status(404).json({ message: "Webinar not found" });
      }

      const { streamingService } = await import('./streamingService');
      
      const streamId = webinar.streamingPlatform === 'youtube' 
        ? webinar.youtubeLiveId 
        : webinar.zoomMeetingId;

      if (!streamId) {
        return res.status(400).json({ message: "Stream not configured" });
      }

      const result = await streamingService.endLiveStream(
        webinar.streamingPlatform as 'youtube' | 'zoom',
        streamId
      );

      // Update webinar status
      await storage.updateWebinar(req.params.id, {
        streamingStatus: 'ended',
        isLive: false
      });

      res.json(result);
    } catch (error) {
      console.error("Error ending live stream:", error);
      res.status(500).json({ message: "Failed to end live stream" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
