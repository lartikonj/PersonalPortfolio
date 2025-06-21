import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function extractFirstParagraph(markdown: string, maxLength = 150) {
  const lines = markdown.split('\n');
  const firstParagraph = lines.find(line => line.trim() && !line.startsWith('#'));
  const text = firstParagraph?.trim() || "No description available";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function getProjectDescription(project: { description?: string; markdown: string }, maxLength = 150) {
  // Use project description if available, otherwise extract from markdown
  if (project.description && project.description.trim()) {
    return project.description.length > maxLength 
      ? project.description.substring(0, maxLength) + "..." 
      : project.description;
  }
  
  return extractFirstParagraph(project.markdown, maxLength);
}
