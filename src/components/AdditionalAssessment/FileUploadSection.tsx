import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadSectionProps {
  files: Array<{
    name: string;
    url: string;
    size: number;
    file?: File;
  }>;
  onUpdate: (files: Array<{ name: string; url: string; size: number; file?: File }>) => void;
}

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const MAX_TOTAL_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = ['application/pdf'];

export default function FileUploadSection({ files, onUpdate }: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTotalSize = () => {
    return files.reduce((total, doc) => total + (doc.size || 0), 0);
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Only PDF files are allowed`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds maximum limit of ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB`;
    }
    if (getTotalSize() + file.size > MAX_TOTAL_SIZE) {
      return `Total size would exceed maximum limit of ${(MAX_TOTAL_SIZE / 1024 / 1024).toFixed(1)}MB`;
    }
    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      const error = validateFile(file);
      if (error) {
        alert(error);
        return false;
      }
      return true;
    });

    // Create file objects with URLs
    const newFiles = validFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      file: file // Store the actual file for processing
    }));

    onUpdate([...files, ...newFiles]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onUpdate(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Supporting Documents</h2>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-50"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Click to upload PDF documents
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Maximum file size: {formatFileSize(MAX_FILE_SIZE)} | Total maximum: {formatFileSize(MAX_TOTAL_SIZE)}
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <div className="text-sm text-gray-500">
            Total size: {formatFileSize(getTotalSize())} / {formatFileSize(MAX_TOTAL_SIZE)}
          </div>
          
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center">
                <Upload className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}