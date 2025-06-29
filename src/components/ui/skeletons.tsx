import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
        "bg-[length:200%_100%] animate-shimmer rounded",
        className
      )}
    />
  );
};

// Post skeleton for feed loading
export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Image placeholder */}
      <Skeleton className="h-64 w-full rounded-lg" />
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};

// Playlist card skeleton
export const PlaylistSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3 animate-fadeIn">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  );
};

// Comment skeleton
export const CommentSkeleton: React.FC = () => {
  return (
    <div className="flex space-x-3 p-3 animate-fadeIn">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

// Music match skeleton for sidebar
export const MusicMatchSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl animate-fadeIn">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-2 w-12" />
        </div>
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </div>
  );
};

// Trending playlist skeleton
export const TrendingPlaylistSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-3 p-3 animate-fadeIn">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-16" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
};

// Event skeleton
export const EventSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
      <div className="flex items-start space-x-3 mb-3">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
};

// Community chat skeleton
export const CommunityChatSkeleton: React.FC = () => {
  return (
    <div className="flex items-center p-2 animate-fadeIn">
      <Skeleton className="h-8 w-8 rounded-lg mr-3" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-12" />
        </div>
      </div>
    </div>
  );
};

// Generic grid skeleton
interface GridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  SkeletonComponent: React.ComponentType;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({ 
  count = 6, 
  columns = 4, 
  SkeletonComponent 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

// Feed skeleton (list of posts)
export const FeedSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;