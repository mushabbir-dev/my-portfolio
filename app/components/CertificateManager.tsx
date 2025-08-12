'use client';

import { useState, useEffect } from 'react';

interface Certificate {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  filename: string;
  uploadedAt: string;
  isActive: boolean;
}

export default function CertificateManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState<'image' | 'pdf'>('pdf');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.data?.certificates || []);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-detect type based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        setCertificateType('pdf');
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        setCertificateType('image');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !certificateName.trim()) {
      setUploadMessage('Please select a file and enter a certificate name');
      return;
    }

    setIsUploading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('certificateName', certificateName.trim());
      formData.append('certificateType', certificateType);

      const response = await fetch('/api/upload/certificate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setUploadMessage('Certificate uploaded successfully!');
      
      // Reset form
      setSelectedFile(null);
      setCertificateName('');
      setCertificateType('pdf');
      if (document.getElementById('file-input')) {
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      }
      
      // Refresh certificates list
      fetchCertificates();
      
    } catch (error: any) {
      setUploadMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (certificateId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    try {
      const response = await fetch(`/api/upload/certificate?id=${certificateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      // Refresh certificates list
      fetchCertificates();
      
    } catch (error: any) {
      alert(`Delete failed: ${error.message}`);
    }
  };

  const toggleActive = async (certificateId: string) => {
    try {
      const updatedCertificates = certificates.map(cert => 
        cert.id === certificateId 
          ? { ...cert, isActive: !cert.isActive }
          : cert
      );

      const response = await fetch('/api/portfolio/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'certificates',
          data: updatedCertificates
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      setCertificates(updatedCertificates);
      
    } catch (error: any) {
      alert(`Update failed: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Upload New Certificate</h3>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Name
            </label>
            <input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., AI Foundations for Everyone"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Type
            </label>
            <select
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value as 'image' | 'pdf')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="image">Image (JPG, PNG, etc.)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              accept={certificateType === 'pdf' ? '.pdf' : '.jpg,.jpeg,.png,.gif,.webp'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !selectedFile || !certificateName.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Certificate'}
          </button>
        </form>

        {uploadMessage && (
          <div className={`mt-4 p-3 rounded-md ${
            uploadMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {uploadMessage}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Manage Certificates</h3>
        
        {certificates.length === 0 ? (
          <p className="text-gray-500">No certificates uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-500">
                      {cert.type.toUpperCase()} • {new Date(cert.uploadedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">{cert.filename}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleActive(cert.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        cert.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {cert.isActive ? 'Active' : 'Inactive'}
                    </button>
                    
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                    >
                      View
                    </a>
                    
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
