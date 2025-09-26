import {
  users,
  blogPosts,
  projects,
  webinars,
  submissions,
  files,
  subscribers,
  campaigns,
  campaignEvents,
  type User,
  type UpsertUser,
  type BlogPost,
  type InsertBlogPost,
  type Project,
  type InsertProject,
  type Webinar,
  type InsertWebinar,
  type Submission,
  type InsertSubmission,
  type File,
  type InsertFile,
  type Subscriber,
  type InsertSubscriber,
  type Campaign,
  type InsertCampaign,
  type CampaignEvent,
  type InsertCampaignEvent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or, sql, gte, lt } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth and username/password auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Blog operations
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;
  searchBlogPosts(query: string): Promise<BlogPost[]>;

  // Project operations
  getProjects(featured?: boolean): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Webinar operations
  getWebinars(): Promise<Webinar[]>;
  getUpcomingWebinars(): Promise<Webinar[]>;
  getPastWebinars(): Promise<Webinar[]>;
  getWebinar(id: string): Promise<Webinar | undefined>;
  createWebinar(webinar: InsertWebinar): Promise<Webinar>;
  updateWebinar(id: string, webinar: Partial<InsertWebinar>): Promise<Webinar>;
  deleteWebinar(id: string): Promise<void>;
  incrementWebinarRegistration(id: string): Promise<void>;

  // Submission operations
  getSubmissions(type?: string): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  deleteSubmission(id: string): Promise<void>;

  // File operations
  getFiles(category?: string, relatedId?: string): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: string): Promise<void>;
  getFilesByProject(projectId: string): Promise<File[]>;

  // Newsletter operations
  getSubscribers(isActive?: boolean): Promise<Subscriber[]>;
  getSubscriber(email: string): Promise<Subscriber | undefined>;
  getSubscriberById(id: string): Promise<Subscriber | undefined>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: string, subscriber: Partial<InsertSubscriber>): Promise<Subscriber>;
  deleteSubscriber(id: string): Promise<void>;
  unsubscribeEmail(email: string): Promise<void>;
  getSubscriberCount(): Promise<number>;

  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  getCampaignsByStatus(status: string): Promise<Campaign[]>;
  updateCampaignStats(id: string, stats: { sentCount?: number; openCount?: number; clickCount?: number; bounceCount?: number }): Promise<void>;

  // Campaign events operations
  createCampaignEvent(event: InsertCampaignEvent): Promise<CampaignEvent>;
  getCampaignEvents(campaignId: string): Promise<CampaignEvent[]>;
  getCampaignAnalytics(campaignId: string): Promise<{ opens: number; clicks: number; bounces: number; unsubscribes: number }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Blog operations
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const query = db.select().from(blogPosts);
    if (published !== undefined) {
      query.where(eq(blogPosts.published, published));
    }
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async searchBlogPosts(query: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          or(
            ilike(blogPosts.title, `%${query}%`),
            ilike(blogPosts.content, `%${query}%`),
            ilike(blogPosts.excerpt, `%${query}%`)
          )
        )
      )
      .orderBy(desc(blogPosts.createdAt));
  }

  // Project operations
  async getProjects(featured?: boolean): Promise<Project[]> {
    const query = db.select().from(projects);
    if (featured !== undefined) {
      query.where(eq(projects.featured, featured));
    }
    return await query.orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Webinar operations
  async getWebinars(): Promise<Webinar[]> {
    return await db.select().from(webinars).orderBy(desc(webinars.date));
  }

  async getUpcomingWebinars(): Promise<Webinar[]> {
    const now = new Date();
    return await db
      .select()
      .from(webinars)
      .where(gte(webinars.date, now))
      .orderBy(webinars.date);
  }

  async getPastWebinars(): Promise<Webinar[]> {
    const now = new Date();
    return await db
      .select()
      .from(webinars)
      .where(lt(webinars.date, now))
      .orderBy(desc(webinars.date));
  }

  async getWebinar(id: string): Promise<Webinar | undefined> {
    const [webinar] = await db.select().from(webinars).where(eq(webinars.id, id));
    return webinar;
  }

  async createWebinar(webinar: InsertWebinar): Promise<Webinar> {
    const [newWebinar] = await db.insert(webinars).values(webinar).returning();
    return newWebinar;
  }

  async updateWebinar(id: string, webinar: Partial<InsertWebinar>): Promise<Webinar> {
    const [updatedWebinar] = await db
      .update(webinars)
      .set({ ...webinar, updatedAt: new Date() })
      .where(eq(webinars.id, id))
      .returning();
    return updatedWebinar;
  }

  async deleteWebinar(id: string): Promise<void> {
    await db.delete(webinars).where(eq(webinars.id, id));
  }

  async incrementWebinarRegistration(id: string): Promise<void> {
    await db
      .update(webinars)
      .set({ registrationCount: sql`${webinars.registrationCount} + 1` })
      .where(eq(webinars.id, id));
  }

  // Submission operations
  async getSubmissions(type?: string): Promise<Submission[]> {
    const query = db.select().from(submissions);
    if (type) {
      query.where(eq(submissions.type, type));
    }
    return await query.orderBy(desc(submissions.createdAt));
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async deleteSubmission(id: string): Promise<void> {
    await db.delete(submissions).where(eq(submissions.id, id));
  }

  // File operations
  async getFiles(category?: string, relatedId?: string): Promise<File[]> {
    if (category && relatedId) {
      return await db
        .select()
        .from(files)
        .where(and(eq(files.category, category), eq(files.relatedId, relatedId)))
        .orderBy(desc(files.createdAt));
    } else if (category) {
      return await db
        .select()
        .from(files)
        .where(eq(files.category, category))
        .orderBy(desc(files.createdAt));
    } else if (relatedId) {
      return await db
        .select()
        .from(files)
        .where(eq(files.relatedId, relatedId))
        .orderBy(desc(files.createdAt));
    }
    
    return await db.select().from(files).orderBy(desc(files.createdAt));
  }

  async getFile(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  }

  async deleteFile(id: string): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  async getFilesByProject(projectId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(and(eq(files.relatedType, 'project'), eq(files.relatedId, projectId)))
      .orderBy(desc(files.createdAt));
  }

  // Newsletter operations
  async getSubscribers(isActive?: boolean): Promise<Subscriber[]> {
    const query = db.select().from(subscribers);
    if (isActive !== undefined) {
      query.where(eq(subscribers.isActive, isActive));
    }
    return await query.orderBy(desc(subscribers.subscribedAt));
  }

  async getSubscriber(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }

  async getSubscriberById(id: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.id, id));
    return subscriber;
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSubscriber] = await db.insert(subscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async updateSubscriber(id: string, subscriber: Partial<InsertSubscriber>): Promise<Subscriber> {
    const [updatedSubscriber] = await db
      .update(subscribers)
      .set(subscriber)
      .where(eq(subscribers.id, id))
      .returning();
    return updatedSubscriber;
  }

  async deleteSubscriber(id: string): Promise<void> {
    await db.delete(subscribers).where(eq(subscribers.id, id));
  }

  async unsubscribeEmail(email: string): Promise<void> {
    await db
      .update(subscribers)
      .set({ isActive: false, unsubscribedAt: new Date() })
      .where(eq(subscribers.email, email));
  }

  async getSubscriberCount(): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscribers)
      .where(eq(subscribers.isActive, true));
    return result.count;
  }

  // Campaign operations
  async getCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set({ ...campaign, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async getCampaignsByStatus(status: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.status, status))
      .orderBy(desc(campaigns.createdAt));
  }

  async updateCampaignStats(id: string, stats: { sentCount?: number; openCount?: number; clickCount?: number; bounceCount?: number }): Promise<void> {
    await db
      .update(campaigns)
      .set(stats)
      .where(eq(campaigns.id, id));
  }

  // Campaign events operations
  async createCampaignEvent(event: InsertCampaignEvent): Promise<CampaignEvent> {
    const [newEvent] = await db.insert(campaignEvents).values(event).returning();
    return newEvent;
  }

  async getCampaignEvents(campaignId: string): Promise<CampaignEvent[]> {
    return await db
      .select()
      .from(campaignEvents)
      .where(eq(campaignEvents.campaignId, campaignId))
      .orderBy(desc(campaignEvents.createdAt));
  }

  async getCampaignAnalytics(campaignId: string): Promise<{ opens: number; clicks: number; bounces: number; unsubscribes: number }> {
    const events = await this.getCampaignEvents(campaignId);
    
    const analytics = events.reduce(
      (acc, event) => {
        switch (event.eventType) {
          case 'opened':
            acc.opens++;
            break;
          case 'clicked':
            acc.clicks++;
            break;
          case 'bounced':
            acc.bounces++;
            break;
          case 'unsubscribed':
            acc.unsubscribes++;
            break;
        }
        return acc;
      },
      { opens: 0, clicks: 0, bounces: 0, unsubscribes: 0 }
    );

    return analytics;
  }
}

export const storage = new DatabaseStorage();
