import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseFile } from '../utils/fileParser';
import LoadingSpinner from './LoadingSpinner';
import type { PortfolioData } from './PortfolioAIChat';

interface FileUploadProps {
  onUploadSuccess: (sessionId: string, data: PortfolioData) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
      setMessageType('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      setMessageType('error');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      // Parse file locally for preview
      const portfolioData = await parseFile(file);
      
      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/upload_portfolio', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'File uploaded successfully!');
        setMessageType('success');
        onUploadSuccess(data.session_id, portfolioData);
      } else {
        setMessage(`Error: ${data.detail || 'Unknown error'}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessageType('error');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
      setMessage('');
      setMessageType('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-forest-50 to-forest-100 p-8 rounded-xl border border-forest-200 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Upload className="w-6 h-6 mr-2 text-forest-700" />
        Upload Your Portfolio
      </h2>

      {/* File Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          file 
            ? 'border-forest-400 bg-forest-50' 
            : 'border-forest-300 bg-white hover:border-forest-400 hover:bg-forest-50'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            file ? 'bg-forest-100' : 'bg-forest-100'
          }`}>
            {file ? (
              <CheckCircle className="w-8 h-8 text-forest-700" />
            ) : (
              <FileText className="w-8 h-8 text-forest-700" />
            )}
          </div>
          
          {file ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-forest-800">{file.name}</p>
              <p className="text-sm text-forest-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drop your portfolio file here
              </p>
              <p className="text-gray-500 mb-4">
                Supports CSV and XLSX files
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-forest-700 hover:bg-forest-800 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Choose File
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
          !file || isUploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-forest-800 to-forest-900 hover:from-forest-900 hover:to-forest-950 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {isUploading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Uploading...</span>
          </div>
        ) : (
          'Upload & Start Chat'
        )}
      </button>

      {/* Status Message */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
          messageType === 'success' 
            ? 'bg-forest-100 text-forest-800 border border-forest-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;