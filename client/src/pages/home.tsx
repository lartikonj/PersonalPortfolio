import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@shared/schema";

export default function Home() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Hi, I'm <span className="text-blue-500">John Doe</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Full Stack Developer & UI/UX Designer passionate about creating beautiful, functional web experiences
            </p>
            <div className="flex justify-center">
              <div className="text-center">
                <p className="text-gray-400 text-lg">
                  Scroll down to explore my projects and work
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">My Projects</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A collection of my recent work showcasing various technologies and design approaches
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-600 animate-pulse">
                  <div className="aspect-video bg-gray-600"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded mb-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <i className="fas fa-folder-open text-6xl text-gray-500 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Projects Yet</h3>
              <p className="text-gray-400">Projects will appear here once added through the admin panel.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}