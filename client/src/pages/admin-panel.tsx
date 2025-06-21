import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@shared/schema";
import type { Project } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

const adminSecret = import.meta.env.VITE_ADMIN_SECRET || "admin123";

// Form schemas
const projectFormSchema = insertProjectSchema.extend({
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

const resumeFormSchema = z.object({
  resumeUrl: z.string().url("Please enter a valid URL"),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;
type ResumeFormData = z.infer<typeof resumeFormSchema>;

interface ResumeData {
  resumeUrl: string | null;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imageInputs, setImageInputs] = useState<string[]>([""]);

  // Queries
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: resumeData } = useQuery<ResumeData>({
    queryKey: ["/api/resume"],
  });

  // Forms
  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      markdown: "",
      images: [""],
    },
  });

  const resumeForm = useForm<ResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      resumeUrl: "",
    },
  });

  // Set resume form value when data loads
  useEffect(() => {
    if (resumeData?.resumeUrl) {
      resumeForm.setValue("resumeUrl", resumeData.resumeUrl);
    }
  }, [resumeData, resumeForm]);

  // Mutations
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return apiRequest("POST", "/api/projects", {
        ...data,
        headers: { "x-admin-secret": adminSecret },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      projectForm.reset();
      setImageInputs([""]);
      toast({ title: "Success", description: "Project created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create project",
        variant: "destructive" 
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectFormData> }) => {
      return apiRequest("PUT", `/api/projects/${id}`, {
        ...data,
        headers: { "x-admin-secret": adminSecret },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditingProject(null);
      projectForm.reset();
      setImageInputs([""]);
      toast({ title: "Success", description: "Project updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update project",
        variant: "destructive" 
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/projects/${id}?secret=${adminSecret}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Success", description: "Project deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete project",
        variant: "destructive" 
      });
    },
  });

  const updateResumeMutation = useMutation({
    mutationFn: async (data: ResumeFormData) => {
      return apiRequest("PUT", "/api/resume", {
        ...data,
        headers: { "x-admin-secret": adminSecret },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resume"] });
      toast({ title: "Success", description: "Resume URL updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update resume",
        variant: "destructive" 
      });
    },
  });

  // Handlers
  const handleProjectSubmit = (data: ProjectFormData) => {
    const validImages = data.images.filter(img => img.trim() !== "");
    
    if (editingProject) {
      updateProjectMutation.mutate({ 
        id: editingProject.id, 
        data: { ...data, images: validImages } 
      });
    } else {
      createProjectMutation.mutate({ ...data, images: validImages });
    }
  };

  const handleResumeSubmit = (data: ResumeFormData) => {
    updateResumeMutation.mutate(data);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    projectForm.setValue("title", project.title);
    projectForm.setValue("markdown", project.markdown);
    projectForm.setValue("images", project.images);
    setImageInputs(project.images.length > 0 ? project.images : [""]);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    projectForm.reset();
    setImageInputs([""]);
  };

  const addImageInput = () => {
    setImageInputs([...imageInputs, ""]);
  };

  const removeImageInput = (index: number) => {
    const newInputs = imageInputs.filter((_, i) => i !== index);
    setImageInputs(newInputs.length === 0 ? [""] : newInputs);
    
    const currentImages = projectForm.getValues("images");
    const newImages = currentImages.filter((_, i) => i !== index);
    projectForm.setValue("images", newImages.length === 0 ? [""] : newImages);
  };

  const updateImageInput = (index: number, value: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = value;
    setImageInputs(newInputs);
    
    const currentImages = projectForm.getValues("images");
    const newImages = [...currentImages];
    newImages[index] = value;
    projectForm.setValue("images", newImages);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Admin Panel</h1>
            <p className="text-lg text-secondary">Manage your portfolio content</p>
          </div>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-8">
              {/* Add/Edit Project Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        {...projectForm.register("title")}
                        placeholder="Enter project title"
                      />
                      {projectForm.formState.errors.title && (
                        <p className="text-sm text-red-600 mt-1">
                          {projectForm.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Project Images (URLs)</Label>
                      <div className="space-y-2">
                        {imageInputs.map((image, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={image}
                              onChange={(e) => updateImageInput(index, e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="flex-1"
                            />
                            {imageInputs.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImageInput(index)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addImageInput}
                          className="w-full"
                        >
                          <i className="fas fa-plus mr-2"></i>
                          Add Another Image
                        </Button>
                      </div>
                      {projectForm.formState.errors.images && (
                        <p className="text-sm text-red-600 mt-1">
                          {projectForm.formState.errors.images.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="markdown">Project Description (Markdown)</Label>
                      <Textarea
                        id="markdown"
                        {...projectForm.register("markdown")}
                        rows={12}
                        className="font-mono text-sm"
                        placeholder={`# Project Title

## Overview
Describe your project here...

## Features
- Feature 1
- Feature 2

## Technologies Used
- React
- Node.js
- PostgreSQL`}
                      />
                      {projectForm.formState.errors.markdown && (
                        <p className="text-sm text-red-600 mt-1">
                          {projectForm.formState.errors.markdown.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                      >
                        {(createProjectMutation.isPending || updateProjectMutation.isPending) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save mr-2"></i>
                            {editingProject ? "Update Project" : "Save Project"}
                          </>
                        )}
                      </Button>
                      {editingProject && (
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border border-slate-200 rounded-lg p-4 animate-pulse">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : projects && projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-900 mb-1">{project.title}</h3>
                              <p className="text-sm text-secondary mb-2">
                                Created: {new Date(project.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex gap-2">
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                  {project.images.length} images
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProject(project)}
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteProjectMutation.mutate(project.id)}
                                disabled={deleteProjectMutation.isPending}
                                className="text-red-600 hover:text-red-700"
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="fas fa-folder-open text-4xl text-slate-300 mb-4"></i>
                      <p className="text-secondary">No projects created yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume">
              <Card>
                <CardHeader>
                  <CardTitle>Update Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={resumeForm.handleSubmit(handleResumeSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="resumeUrl">Resume PDF URL</Label>
                      <Input
                        id="resumeUrl"
                        {...resumeForm.register("resumeUrl")}
                        placeholder="https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/resume.pdf"
                      />
                      <p className="text-xs text-secondary mt-1">
                        Upload your PDF to Cloudinary and paste the public URL here
                      </p>
                      {resumeForm.formState.errors.resumeUrl && (
                        <p className="text-sm text-red-600 mt-1">
                          {resumeForm.formState.errors.resumeUrl.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={updateResumeMutation.isPending}
                    >
                      {updateResumeMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Update Resume
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Current Resume Preview */}
                  {resumeData?.resumeUrl && (
                    <div className="mt-8 pt-8 border-t border-slate-200">
                      <h3 className="text-lg font-medium text-slate-900 mb-4">Current Resume</h3>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <iframe
                          src={resumeData.resumeUrl}
                          className="w-full h-64 border-0 rounded"
                          title="Resume Preview"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
