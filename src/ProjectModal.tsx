import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  images: string[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, projectTitle, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        prevImage();
      } else if (event.key === 'ArrowRight') {
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex]);

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full h-full max-w-7xl max-h-[95vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {projectTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative flex-1 h-full">
          {images.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="relative h-[calc(95vh-160px)] bg-slate-800 flex items-center justify-center p-4">
                <img
                  src={images[currentImageIndex]}
                  alt={`${projectTitle} screenshot ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-slate-700"
                  style={{ maxHeight: 'calc(100% - 2rem)' }}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-slate-900/90 text-white rounded-full hover:bg-slate-800/90 transition-all duration-200 shadow-lg border border-slate-600"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-slate-900/90 text-white rounded-full hover:bg-slate-800/90 transition-all duration-200 shadow-lg border border-slate-600"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-slate-900/90 text-white px-4 py-2 rounded-full text-sm font-medium border border-slate-600">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="p-4 bg-slate-800/50 border-t border-slate-700 max-h-32 overflow-hidden">
                  <div className="flex gap-2 justify-center overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                          index === currentImageIndex
                            ? 'border-blue-500 opacity-100 shadow-lg'
                            : 'border-slate-600 opacity-60 hover:opacity-80'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${projectTitle} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-[calc(95vh-160px)] flex flex-col items-center justify-center text-slate-400">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-lg">No images available for this project</p>
              <p className="text-sm mt-2">Images will be added soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;