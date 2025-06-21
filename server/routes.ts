import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";
import "./types/session";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.isAuthenticated) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get single project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        return res.status(500).json({ message: "Admin credentials not configured" });
      }

      if (username !== adminUsername) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For demo purposes, we'll hash the password on first use
      // In production, you'd store a pre-hashed password
      const isValidPassword = await bcrypt.compare(password, adminPassword) || password === adminPassword;

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.isAuthenticated = true;
      req.session.username = username;

      res.json({ message: "Login successful", username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session?.isAuthenticated) {
      res.json({ 
        isAuthenticated: true, 
        username: req.session.username 
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  // Create project (admin only)
  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Update project (admin only)
  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Delete project (admin only)
  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Get resume URL
  app.get("/api/resume", async (req, res) => {
    try {
      const resumeSetting = await storage.getSetting("resumeUrl");
      res.json({ resumeUrl: resumeSetting?.value || null });
    } catch (error) {
      console.error("Error fetching resume URL:", error);
      res.status(500).json({ message: "Failed to fetch resume URL" });
    }
  });

  // Update resume URL (admin only)
  app.put("/api/resume", requireAuth, async (req, res) => {
    try {
      const { resumeUrl } = req.body;
      
      if (!resumeUrl || typeof resumeUrl !== "string") {
        return res.status(400).json({ message: "Resume URL is required" });
      }
      
      await storage.setSetting("resumeUrl", resumeUrl);
      res.json({ message: "Resume URL updated successfully", resumeUrl });
    } catch (error) {
      console.error("Error updating resume URL:", error);
      res.status(500).json({ message: "Failed to update resume URL" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
