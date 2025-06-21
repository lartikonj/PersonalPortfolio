import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Project not found");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-32 mb-4"></div>
            <div className="h-12 bg-slate-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="aspect-video bg-slate-200 rounded-xl"></div>
              <div className="aspect-video bg-slate-200 rounded-xl"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h1>
            <p className="text-secondary mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <a className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Back to Home
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="mb-8">
            <Link href="/">
              <a className="text-primary hover:text-blue-700 transition-colors inline-flex items-center gap-2 mb-4">
                <i className="fas fa-arrow-left"></i>
                Back to Projects
              </a>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{project.title}</h1>
            {project.description && (
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">{project.description}</p>
            )}
            <p className="text-sm text-secondary">
              Created: {new Date(project.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-12">
              {project.images.length === 1 ? (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              ) : project.images.length === 2 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.map((image, index) => (
                    <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={image}
                        alt={`${project.title} - Image ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.images.slice(0, 2).map((image, index) => (
                      <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src={image}
                          alt={`${project.title} - Image ${index + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                  {project.images.slice(2).map((image, index) => (
                    <div key={index + 2} className="rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={image}
                        alt={`${project.title} - Image ${index + 3}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Description (Markdown Content) */}
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">{children}</h2>,
                h2: ({ children }) => <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">{children}</h3>,
                h3: ({ children }) => <h4 className="text-lg font-medium text-slate-900 mt-4 mb-2">{children}</h4>,
                p: ({ children }) => <p className="text-slate-700 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-slate-700">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                code: ({ children }) => <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                pre: ({ children }) => <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
              }}
            >
              {project.markdown}
            </ReactMarkdown>
          </div>
        </div>
      </section>
    </div>
  );
}
