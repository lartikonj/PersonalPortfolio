import { useQuery } from "@tanstack/react-query";

interface ResumeData {
  resumeUrl: string | null;
}

export default function Resume() {
  const { data: resumeData, isLoading } = useQuery<ResumeData>({
    queryKey: ["/api/resume"],
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <section className="py-12 bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Resume</h1>
            <p className="text-lg text-gray-400">My professional experience and qualifications</p>
          </div>

          {/* Resume Viewer */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            {/* PDF Viewer Container */}
            <div className="relative bg-gray-700" style={{ height: "800px" }}>
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-white">Loading resume...</p>
                  </div>
                </div>
              ) : resumeData?.resumeUrl ? (
                <iframe 
                  src={resumeData.resumeUrl}
                  className="w-full h-full border-0 rounded-xl"
                  title="Resume PDF"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <div className="text-center">
                    <i className="fas fa-file-pdf text-6xl text-gray-500 mb-4"></i>
                    <p className="text-lg font-medium text-white">No resume available</p>
                    <p className="text-sm text-gray-400 mt-2">Resume URL can be configured in the admin panel</p>
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
