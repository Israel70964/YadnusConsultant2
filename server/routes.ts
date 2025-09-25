import type { Express } from "express";
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
      
      const submission = await storage.createSubmission({
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

  // File upload for admin
  app.post('/api/upload', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
