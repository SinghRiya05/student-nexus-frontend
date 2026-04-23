import { Search, Upload, Download, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { IResource } from "@/features/teacher/resources/resourceModel";
import { ASSET_URL } from "@/services/apiEndpoints";

interface StudyResourcesProps {
  resources: IResource[];
}

export default function StudyResources({ resources }: StudyResourcesProps) {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'resource';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab if fetch fails (e.g., CORS issues)
      window.open(url, '_blank');
    }
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-5 px-4 text-center space-y-4 bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400">
          <FileText size={32} />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-[#1a1a3b] text-lg">No Resources Available</h4>
          <p className="text-gray-400 font-bold text-sm max-w-[280px]">This professor hasn't uploaded any academic resources to the Nexus yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Class Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#302e56]/60">
              ACADEMIC REPOSITORY
            </h3>
          </div>
          <span className="text-[10px] font-bold text-primary/60 bg-primary/50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {resources.length} Total items
          </span>
        </div>

        <Card className="rounded-2xl border-none bg-white/50 p-0 overflow-hidden divide-y divide-gray-100 shadow-xl shadow-gray-200/20">
          {resources.map((resource, idx) => (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex items-center justify-between px-6 py-2 transition-all hover:bg-white cursor-pointer"
              onClick={() => window.open(`${ASSET_URL}${resource.fileUrl}`, '_blank')}
            >
              <div className="flex items-center gap-5">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all group-hover:scale-110 shadow-sm ${!resource.isPaid ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-600"
                  }`}>
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-[#1a1a3b] group-hover:text-indigo-600 transition-colors leading-tight">
                    {resource.title}
                  </h4>
                  <p className="text-[13px] font-bold text-gray-400 line-clamp-1 max-w-[300px]">{resource.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${!resource.isPaid ? "bg-emerald-100/50 text-emerald-700" : "bg-amber-100/50 text-amber-700"
                    }`}>
                    {!resource.isPaid ? "Free" : `₹${resource.price}`}
                  </span>
                  <span className="text-[10px] font-black text-gray-300 uppercase letter-spacing-wider">{new Date(resource.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 rounded-xl text-primary font-black text-xs hover:bg-primary/50 transition-all border border-transparent hover:border-primary/50 px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(`${ASSET_URL}${resource.fileUrl}`, resource.title);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              {/* Status bar */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-12 w-1.5 rounded-r-full transition-all group-hover:h-16 ${!resource.isPaid ? "bg-emerald-500" : "bg-amber-500"
                }`} />
            </motion.div>
          ))}
        </Card>
      </div>
    </div>
  );
}
