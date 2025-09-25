import {
  users,
  blogPosts,
  projects,
  webinars,
  submissions,
  files,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or, sql, gte, lt } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
}

export const storage = new DatabaseStorage();
