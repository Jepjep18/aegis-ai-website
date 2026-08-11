"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumes } from "@/hooks/useResumes";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface ResumeUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ResumeUploadModal({
  open,
  onOpenChange,
}: ResumeUploadModalProps) {
  const { uploadResume, isUploading } = useResumes();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a resume file");
      return;
    }

    try {
      await uploadResume({ file, title });
      toast.success("Resume uploaded successfully!");
      setFile(null);
      setTitle("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Upload your resume (PDF or DOCX). Aegis will parse your experience to back every interview answer with evidence.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-2">
          <div className="space-y-2">
            <Label>Resume Title</Label>
            <Input
              placeholder="e.g. Senior Frontend Engineer 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-xl bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            {!file ? (
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] cursor-pointer transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 mb-2">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-white">
                  Click to choose file or drag & drop
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  PDF or DOCX up to 10MB
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-cyan-300/80">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !file}
              className="rounded-xl bg-cyan-400 text-[#051424] hover:bg-cyan-300 font-semibold"
            >
              {isUploading ? "Uploading..." : "Upload Resume"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
