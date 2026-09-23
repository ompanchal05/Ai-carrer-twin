import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import PrimaryButton from '../Buttons/PrimaryButton';
import toast from 'react-hot-toast';

export const DropzoneUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|docx|doc)$/i)) {
      toast.error("Please select a PDF or DOCX file.");
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (validateFile(dropped)) {
        setFile(dropped);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  };

  const startAnalysisPipeline = () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(20);
    setStatusText("Reading document binary and structure...");

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setProgress(60);
      setStatusText("Extracting skills & evaluating ATS compliance...");

      // Also read as text if readable
      const textReader = new FileReader();
      textReader.onload = (te) => {
        const extractedText = typeof te.target.result === 'string' ? te.target.result : '';
        setProgress(100);
        setStatusText("AI Analysis ready!");
        setIsUploading(false);
        toast.success(`Parsed ${file.name}!`);
        if (onUploadSuccess) {
          onUploadSuccess(file, base64Data, file.type || 'application/pdf', extractedText);
        }
      };
      textReader.onerror = () => {
        setProgress(100);
        setIsUploading(false);
        if (onUploadSuccess) {
          onUploadSuccess(file, base64Data, file.type || 'application/pdf', '');
        }
      };
      try {
        textReader.readAsText(file);
      } catch {
        setProgress(100);
        setIsUploading(false);
        if (onUploadSuccess) {
          onUploadSuccess(file, base64Data, file.type || 'application/pdf', '');
        }
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-brand-500 bg-brand-500/10'
            : file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-brand-500/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleChange}
          className="hidden"
        />

        {!file ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 dark:text-white">
                Drag & Drop your Resume here, or <span className="text-brand-600 dark:text-brand-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Supports PDF, DOCX (Max size: 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setIsUploading(false);
                setProgress(0);
              }}
              className="text-xs text-rose-500 font-semibold hover:underline"
            >
              Choose different file
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="p-4 glass-card border border-brand-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-brand-600 dark:text-brand-400">{statusText}</span>
            <span className="text-slate-700 dark:text-slate-200">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-accent-violet h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {file && !isUploading && progress === 0 && (
        <PrimaryButton onClick={startAnalysisPipeline} className="w-full py-3">
          Analyze Resume with AI Twin
        </PrimaryButton>
      )}
    </div>
  );
};

export default DropzoneUpload;
