import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, AlertCircle, HelpCircle } from 'lucide-react';
import { validateUrl } from '../../services/urlValidator';

interface DocumentUploadProps {
  documents: Array<{
    type: string;
    value: string;
    size?: number;
    file?: File;
  }>;
  onUpdate: (documents: Array<{
    type: string;
    value: string;
    size?: number;
    file?: File;
  }>) => void;
}

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const MAX_TOTAL_SIZE = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = ['application/pdf'];
const ALLOWED_EXTENSIONS = ['.pdf'];
const MAX_URLS = 3;

export default function DocumentUpload({ documents, onUpdate }: DocumentUploadProps) {
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);
  const [guidance, setGuidance] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTotalSize = () => {
    return documents.reduce((total, doc) => total + (doc.size || 0), 0);
  };

  const getUrlCount = () => {
    return documents.filter(doc => doc.type === 'url').length;
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    if (files.length === 0) {
      setError('Only PDF files are allowed');
      return;
    }
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (files: File[]) => {
    setError(null);
    
    try {
      const newDocuments = [];
      
      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          setError(error);
          continue;
        }

        newDocuments.push({
          type: 'file',
          value: file.name,
          size: file.size,
          file: file
        });
      }

      onUpdate([...documents, ...newDocuments]);
    } catch (error) {
      setError('Failed to add documents. Please try again.');
    }
  };

  const handleAddUrl = async () => {
    if (!url) return;

    if (getUrlCount() >= MAX_URLS) {
      setError(`Maximum number of URLs (${MAX_URLS}) has been reached`);
      return;
    }

    try {
      setError(null);
      setShowGuidance(false);

      const validation = validateUrl(url);
      
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }
      
      if (validation.isSecuredPlatform) {
        setGuidance(validation.platformGuidance || '');
        setShowGuidance(true);
        setUrl('');
        return;
      }

      onUpdate([...documents, { 
        type: 'url', 
        value: url
      }]);
      
      setUrl('');
    } catch (error) {
      setError('Failed to add URL. Please check the URL and try again.');
    }
  };

  const handleRemove = (index: number) => {
    onUpdate(documents.filter((_, i) => i !== index));
  };

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Add Supporting Documents</h2>
        <button
          onClick={() => setShowGuidance(!showGuidance)}
          className="text-gray-400 hover:text-gray-600"
          title="Show guidance for secured platforms"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>

      {showGuidance && guidance && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 whitespace-pre-wrap">{guidance}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={handleZoneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-500 hover:bg-gray-50'
        }`}
      >
        <Upload className={`mx-auto h-12 w-12 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop PDF files here, or click to select files
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
          onChange={handleFileInput}
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddUrl}
              disabled={!url || getUrlCount() >= MAX_URLS}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add URL
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Add up to {MAX_URLS} URLs. For secured platforms (LinkedIn, etc.), save as PDF and upload.
          </p>
        </div>

        {documents.length > 0 && (
          <div className="mt-4 space-y-2">            
            <div className="text-sm text-gray-500">
              Total size: {formatFileSize(getTotalSize())} / {formatFileSize(MAX_TOTAL_SIZE)}
            </div>
            
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  {doc.type === 'url' ? (
                    <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <div>
                    <span className="text-sm text-gray-900 truncate max-w-md block">
                      {doc.value}
                    </span>
                    {doc.size && (
                      <span className="text-xs text-gray-500">
                        {formatFileSize(doc.size)}
                      </span>
                    )}
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
    </div>
  );
}