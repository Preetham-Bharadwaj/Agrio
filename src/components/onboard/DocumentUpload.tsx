'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { isPrototypeMode } from '@/lib/prototype';

interface DocumentUploadProps {
  userId: string;
  role: 'farmer' | 'retailer';
  onUploadComplete: (documentUrl: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export function DocumentUpload({ userId, role, onUploadComplete }: DocumentUploadProps) {
  const t = useTranslations('onboard');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t('invalidFileType'));
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(t('fileTooLarge'));
      return false;
    }
    return true;
  };

  const handleFileChange = (selectedFile: File) => {
    setError('');
    
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError(t('noFileSelected'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isPrototypeMode) {
        onUploadComplete('');
        return;
      }

      const { default: supabase } = await import('@/lib/supabase');
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `verification-documents/${role}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users')
        .update({ document_url: publicUrl, verified: false })
        .eq('id', userId);

      if (updateError) throw updateError;
      onUploadComplete(publicUrl);
    } catch (err: any) {
      console.error('Document upload error:', err);
      setError(err.message || t('uploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const documentRequirements = role === 'farmer' 
    ? [
        t('farmerDoc1'),
        t('farmerDoc2'),
        t('farmerDoc3'),
      ]
    : [
        t('retailerDoc1'),
        t('retailerDoc2'),
        t('retailerDoc3'),
      ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('verificationRequired')}</h2>
        <p className="text-muted-foreground">{t('uploadDocuments')}</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
        <h3 className="font-semibold text-sm">{t('requiredDocuments')}</h3>
        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
          {documentRequirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Document preview"
              className="max-h-48 mx-auto rounded"
            />
            <p className="text-sm font-medium">{file?.name}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {t('changeFile')}
            </Button>
          </div>
        ) : file ? (
          <div className="space-y-4">
            <div className="text-4xl">📄</div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {t('changeFile')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📁</div>
            <div>
              <p className="text-sm font-medium">{t('dragDropFile')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('or')}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {t('browseFiles')}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t('fileRequirements')}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full"
        size="lg"
      >
        {loading ? t('uploading') : t('uploadAndContinue')}
      </Button>

      {isPrototypeMode && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => onUploadComplete('')}
          disabled={loading}
        >
          Skip for demo
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        {t('verificationNote')}
      </p>
    </div>
  );
}
