
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
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-32 mb-4"></div>
            <div className="h-12 bg-slate-700 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="aspect-video bg-slate-700 rounded-xl"></div>
              <div className="aspect-video bg-slate-700 rounded-xl"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-6xl text-cyan-400 mb-4"></i>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Project Not Found</h1>
            <p className="text-slate-300 mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <a className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 tech-glow">
                Back to Home
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <section className="py-12 bg-slate-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <div className="mb-8">
            <Link href="/">
              <a className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2 mb-4 group">
                <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform duration-300"></i>
                Back to Projects
              </a>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-lg text-slate-300 mb-4 leading-relaxed">{project.description}</p>
            )}
            <p className="text-sm text-slate-400">
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
                <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 tech-border">
                  <img 
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </div>
              ) : project.images.length === 2 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.map((image, index) => (
                    <div key={index} className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 tech-border">
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
                      <div key={index} className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 tech-border">
                        <img 
                          src={image}
                          alt={`${project.title} - Image ${index + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                  {project.images.slice(2).map((image, index) => (
                    <div key={index + 2} className="rounded-xl overflow-hidden shadow-2xl border border-slate-700 tech-border">
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
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2 className="text-2xl font-bold text-slate-100 mt-8 mb-4 border-b border-slate-700 pb-2">{children}</h2>,
                h2: ({ children }) => <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">{children}</h3>,
                h3: ({ children }) => <h4 className="text-lg font-medium text-slate-200 mt-4 mb-2">{children}</h4>,
                p: ({ children }) => <p className="text-slate-300 mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-300">{children}</ol>,
                li: ({ children }) => <li className="text-slate-300">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-cyan-400">{children}</strong>,
                code: ({ children }) => <code className="bg-slate-800 border border-slate-600 px-2 py-1 rounded text-sm font-mono text-cyan-300">{children}</code>,
                pre: ({ children }) => <pre className="bg-slate-800 border border-slate-600 p-4 rounded-lg overflow-x-auto mb-4 text-slate-200">{children}</pre>,
                a: ({ children, href }) => <a href={href} className="text-cyan-400 hover:text-cyan-300 underline transition-colors">{children}</a>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-slate-300 bg-slate-800/50 py-2 my-4">{children}</blockquote>,
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
