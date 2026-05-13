import React from 'react';
import Image from 'next/image';
import { Brand } from '@/lib/types';

interface BrandHeaderProps {
  brand: Brand;
}

export function BrandHeader({ brand }: BrandHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-3">
        {brand.logoUrl ? (
          <div className="flex-shrink-0">
            <Image
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              width={48}
              height={48}
              className="rounded-md object-contain"
              onError={(e) => {
                // Fallback to text if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-md flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {brand.name}
          </h1>
          {brand.description && (
            <p className="text-sm text-gray-600 truncate">
              {brand.description}
            </p>
          )}
        </div>

        {brand.website && (
          <div className="flex-shrink-0">
            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Visit Website →
            </a>
          </div>
        )}
      </div>
    </header>
  );
}