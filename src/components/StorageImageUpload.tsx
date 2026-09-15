import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, CheckCircle2, FolderOpen } from 'lucide-react';

interface StorageImageUploadProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
  aspectRatio?: 'square' | 'banner' | 'video' | 'auto';
  helperText?: string;
  id?: string;
}

export const StorageImageUpload: React.FC<StorageImageUploadProps> = ({
  label,
  value,
  onChange,
  required = false,
  aspectRatio = 'auto',
  helperText = 'Select photo from internal device storage (JPG, PNG, WEBP)',
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setFileName(file.name);
    setFileSize(formatBytes(file.size));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Optional client-side optimization if large:
        // We can pass the data URL directly
        onChange(result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError('Failed to read image from device storage.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setFileName(null);
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-h-48'
      : aspectRatio === 'banner'
      ? 'aspect-21/9 max-h-40'
      : aspectRatio === 'video'
      ? 'aspect-video max-h-48'
      : 'max-h-52';

  return (
    <div className="space-y-1.5" id={id}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-800">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Loaded from storage</span>
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        <div
          className={`relative group rounded-xl border-2 border-stone-200 overflow-hidden bg-stone-900 ${aspectClass} flex items-center justify-center`}
        >
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
          />

          {/* Hover / Action Overlay */}
          <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center gap-2">
            <p className="text-white text-xs font-medium truncate max-w-xs px-2">
              {fileName || 'Photo from internal storage'} {fileSize && `(${fileSize})`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Replace from Device</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Quick Clear Floating Button */}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-stone-900/80 hover:bg-rose-600 text-white rounded-full shadow-md transition-colors group-hover:opacity-0"
            title="Remove photo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-amber-500/60'
          }`}
        >
          {isProcessing ? (
            <div className="py-4 flex flex-col items-center justify-center gap-2 text-stone-600">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
              <span className="text-xs font-medium">Reading photo from storage...</span>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-800 block">
                  Select photo from internal storage
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Browse device files or drag and drop image here
                </span>
              </div>
              <button
                type="button"
                className="mt-1 px-3 py-1 bg-stone-900 text-white rounded-md text-[11px] font-semibold hover:bg-stone-800 pointer-events-none"
              >
                Browse Storage
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 font-medium">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-[10px] text-stone-500">{helperText}</p>
      )}
    </div>
  );
};
