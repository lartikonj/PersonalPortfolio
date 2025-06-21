import { useQuery } from "@tanstack/react-query";

interface ResumeData {
  resumeUrl: string | null;
}

export default function Resume() {
  const { data: resumeData, isLoading } = useQuery<ResumeData>({
    queryKey: ["/api/resume"],
  });

  const handleDownload = () => {
    if (resumeData?.resumeUrl) {
      window.open(resumeData.resumeUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Resume</h1>
            <p className="text-lg text-secondary">My professional experience and qualifications</p>
          </div>

          {/* Resume Viewer */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">John_Doe_Resume.pdf</h2>
              {resumeData?.resumeUrl && (
                <button 
                  onClick={handleDownload}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <i className="fas fa-download"></i>
                  Download PDF
                </button>
              )}
            </div>
            
            {/* PDF Viewer Container */}
            <div className="relative bg-slate-100" style={{ height: "800px" }}>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-slate-600">Loading resume...</p>
                  </div>
                </div>
              ) : resumeData?.resumeUrl ? (
                <iframe 
                  src={resumeData.resumeUrl}
                  className="w-full h-full border-0"
                  title="Resume PDF"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <div className="text-center">
                    <i className="fas fa-file-pdf text-6xl text-slate-400 mb-4"></i>
                    <p className="text-lg font-medium text-slate-600">No resume available</p>
                    <p className="text-sm text-slate-500 mt-2">Resume URL can be configured in the admin panel</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
