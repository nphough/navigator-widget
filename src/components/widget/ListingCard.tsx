import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { ListingItem } from '@/lib/types';
import { formatDistance } from '@/lib/geolocation';

interface ListingCardProps {
  listing: ListingItem;
  onHover?: () => void;
  onLeave?: () => void;
}

export function ListingCard({ listing, onHover, onLeave }: ListingCardProps) {
  const handleClick = () => {
    window.open(listing.detailUrl, '_blank', 'noopener,noreferrer');
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getCategoryDisplay = () => {
    if (listing.subcategoryName && listing.categoryName) {
      return `${listing.categoryName} | ${listing.subcategoryName}`;
    }
    return listing.categoryName || '';
  };

  const getLocationDisplay = () => {
    if (listing.entityType === 'event' && listing.startDateTime) {
      const dateTime = formatDateTime(listing.startDateTime);
      if (listing.city && listing.state) {
        return `${dateTime} • ${listing.city}, ${listing.state}`;
      }
      return dateTime;
    }
    
    if (listing.city && listing.state) {
      return `${listing.city}, ${listing.state}`;
    }
    
    return listing.formattedAddress || '';
  };

  const getAfBadgeVariant = () => {
    return listing.alcoholFreeStatus === 'ALCOHOL_FREE' ? 'success' : 'warning';
  };

  const getAfBadgeText = () => {
    return listing.alcoholFreeStatus === 'ALCOHOL_FREE' ? '100% AF' : 'AF Options';
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex space-x-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-md overflow-hidden">
            {listing.imageUrl ? (
              <Image
                src={listing.imageUrl}
                alt={listing.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Category */}
          {getCategoryDisplay() && (
            <p className="text-sm text-gray-500 truncate">
              {getCategoryDisplay()}
            </p>
          )}

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {listing.name}
          </h3>

          {/* Description */}
          {listing.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {listing.description}
            </p>
          )}

          {/* Location and badges row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 truncate">
                {getLocationDisplay()}
              </p>
              {listing.distanceMiles && (
                <p className="text-xs text-gray-400">
                  {formatDistance(listing.distanceMiles)} away
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Format badge for online/hybrid */}
              {listing.format !== 'IN_PERSON' && (
                <Badge variant="default" size="sm">
                  {listing.format === 'ONLINE' ? 'Online' : 'Hybrid'}
                </Badge>
              )}
              
              {/* AF status badge */}
              <Badge 
                variant={getAfBadgeVariant()}
                size="sm"
              >
                {getAfBadgeText()}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}