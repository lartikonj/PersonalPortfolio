import { Link } from "wouter";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Extract first image for thumbnail
  const thumbnailImage = project.images[0] || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450";
  
  // Use project description, fallback to extracting from markdown
  const getDisplayDescription = () => {
    if (project.description && project.description.trim()) {
      return project.description.length > 150 
        ? project.description.substring(0, 150) + "..." 
        : project.description;
    }
    
    // Fallback to markdown extraction for older projects
    const lines = project.markdown.split('\n');
    const firstParagraph = lines.find(line => line.trim() && !line.startsWith('#'));
    return firstParagraph?.trim().substring(0, 150) + "..." || "No description available";
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl dark:shadow-slate-900/20 transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700">
      <Link href={`/project/${project.id}`}>
        <a className="block">
          <div className="aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <img 
              src={thumbnailImage}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{project.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{getDisplayDescription()}</p>
          </div>
        </a>
      </Link>
    </div>
  );
}
