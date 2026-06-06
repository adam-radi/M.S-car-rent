import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTrash, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { uploadCarImages } from '../api/carApi';
import '../styles/ImageUpload.css';

const API_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const ImageUpload = ({ images, setImages }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await uploadCarImages(formData);
      if (res.success) {
        setImages(prev => [...prev, ...res.data]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const makeMainImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      const mainImg = newImages.splice(index, 1)[0];
      newImages.unshift(mainImg);
      return newImages;
    });
  };

  return (
    <div className="image-upload-container">
      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div className="upload-status">
            <FaSpinner className="spinner-icon" />
            <p>Uploading your images...</p>
          </div>
        ) : (
          <div className="upload-prompt">
            <FaCloudUploadAlt className="upload-icon" />
            <p>Drag & drop images here or <span>browse</span></p>
            <p className="upload-hint">Supported formats: JPG, PNG. Max size: 5MB</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((url, index) => (
            <div key={index} className={`preview-item ${index === 0 ? 'main-image-admin' : ''}`}>
              <img src={`${API_URL}${url.startsWith('/') ? url : '/' + url}`} alt={`Preview ${index}`} />
              <div className="preview-overlay">
                <button 
                  type="button" 
                  className="btn-remove" 
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  title="Remove image"
                >
                  <FaTrash />
                </button>
                {index !== 0 && (
                  <button 
                    type="button" 
                    className="btn-main" 
                    onClick={(e) => { e.stopPropagation(); makeMainImage(index); }}
                  >
                    Set Main
                  </button>
                )}
              </div>
              {index === 0 && (
                <div className="main-badge">
                  <FaCheckCircle /> Main Photo
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
