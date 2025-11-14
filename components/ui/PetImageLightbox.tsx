'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface PetImageLightboxProps {
  imageUrl: string | null;
  alt: string;
  className?: string;
}

export const PetImageLightbox: React.FC<PetImageLightboxProps> = ({
  imageUrl,
  alt,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!imageUrl) {
    return (
      <div className={`flex items-center justify-center h-full text-gray-400 ${className}`}>
        <span className="text-9xl">🐾</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative w-full cursor-pointer group ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover group-hover:opacity-90 transition-opacity"
          priority
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
            Clique para ampliar 🔍
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2"
            aria-label="Fechar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
              <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-contain rounded-lg"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
            Clique fora da imagem para fechar
          </div>
        </div>
      )}
    </>
  );
};

