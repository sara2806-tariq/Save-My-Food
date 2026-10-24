import React, { useRef } from 'react';
import { Camera, Image, X, UploadCloud, Sparkles } from 'lucide-react';

export function ImageIngredientPicker({ images, setImages, onAnalyze }) {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Helper to convert File to base64 { mimeType, data }
  const processFiles = (files) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        // result is "data:image/jpeg;base64,....."
        const matches = result.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const newImg = {
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            mimeType: matches[1],
            data: matches[2],
            previewUrl: result,
            name: file.name
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGalleryChange = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleCameraChange = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>
      {/* Hidden file inputs */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryChange}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        style={{ display: 'none' }}
      />

      {/* Upload & Camera Buttons Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="btn-camera-action"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.92rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.28)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Camera size={18} />
          <span>Snap Photo with Camera</span>
        </button>

        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          style={{
            background: '#ffffff',
            color: '#1b4332',
            border: '1.5px solid #a7f3d0',
            fontWeight: 700,
            fontSize: '0.92rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Image size={18} color="#059669" />
          <span>Upload from Gallery</span>
        </button>

        {images.length > 0 && (
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '0.35rem 0.85rem', borderRadius: '9999px' }}>
            ✓ {images.length} photo{images.length > 1 ? 's' : ''} ready for Gemma 4
          </span>
        )}
      </div>

      {/* Thumbnails Preview Grid */}
      {images.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          marginTop: '1rem',
          padding: '0.85rem',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '16px',
          border: '1px dashed #6ee7b7'
        }}>
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                position: 'relative',
                width: '88px',
                height: '88px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
                border: '2px solid #ffffff'
              }}
            >
              <img
                src={img.previewUrl}
                alt={img.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(img.id)}
                title="Remove photo"
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={13} />
              </button>
            </div>
          ))}

          <div
            onClick={() => galleryInputRef.current?.click()}
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '12px',
              border: '2px dashed #a7f3d0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: '#f0fdf4'
            }}
          >
            <UploadCloud size={20} />
            <span style={{ marginTop: '4px' }}>+ Add more</span>
          </div>
        </div>
      )}
    </div>
  );
}
