import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

export default function PageDetail() {
  const { slug } = useParams();

  const { data: page, isLoading, error } = useQuery({
    queryKey: [`/api/page/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
              <span className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                ← Back to Home
              </span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/">
              <span className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2 mb-4 cursor-pointer">
                ← Back to Home
              </span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {page.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Page Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown>{page.content}</ReactMarkdown>
          </div>
        </div>
      </section>
    </div>
  );
}