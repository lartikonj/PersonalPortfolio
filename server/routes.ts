import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to check admin secret
  const checkAdminSecret = (req: any, res: any, next: any) => {
    const adminSecret = process.env.ADMIN_SECRET || "admin123";
    const providedSecret = req.headers["x-admin-secret"] || req.query.secret;
    
    if (providedSecret !== adminSecret) {
      return res.status(401).json({ message: "Unauthorized" });
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

  // Create project (admin only)
  app.post("/api/projects", checkAdminSecret, async (req, res) => {
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
  app.put("/api/projects/:id", checkAdminSecret, async (req, res) => {
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
  app.delete("/api/projects/:id", checkAdminSecret, async (req, res) => {
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
  app.put("/api/resume", checkAdminSecret, async (req, res) => {
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
