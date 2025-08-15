"use client";

import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  User, 
  Play, 
  Download, 
  ExternalLink,
  FileText,
  BookOpen,
  Headphones,
  ChevronRight
} from 'lucide-react';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'podcast';
  author: string;
  duration?: string;
  pages?: number;
  readTime?: string;
  rating: number;
  tags: string[];
  thumbnail: string;
  url?: string;
  downloadUrl?: string;
  featured: boolean;
  publishedAt: Date;
}

interface ResourceCardProps {
  resource: LearningResource;
  index?: number;
  variant?: 'default' | 'featured';
}

export default function ResourceCard({ resource, index = 0, variant = 'default' }: ResourceCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return FileText;
      case 'book': return BookOpen;
      case 'podcast': return Headphones;
      default: return FileText;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Article';
      case 'book': return 'Book';
      case 'podcast': return 'Podcast';
      default: return 'Content';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-600';
      case 'book': return 'bg-green-100 text-green-600';
      case 'podcast': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getMetaInfo = () => {
    switch (resource.type) {
      case 'article':
        return resource.readTime;
      case 'book':
        return `${resource.pages} pages`;
      case 'podcast':
        return resource.duration;
      default:
        return '';
    }
  };

  const TypeIcon = getTypeIcon(resource.type);

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
            <TypeIcon className="w-6 h-6" />
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Featured
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-4">
          <span>{resource.author}</span>
          <span>{getMetaInfo()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{resource.rating}</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
            Read More
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      {/* Thumbnail - اختیاری */}
      {resource.thumbnail && (
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <span className="text-xs bg-white/90 text-gray-700 px-2 py-1 rounded-full">
              {getTypeLabel(resource.type)}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
            <TypeIcon className="w-6 h-6" />
          </div>
          {!resource.thumbnail && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {getTypeLabel(resource.type)}
            </span>
          )}
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-[var(--muted)] text-sm mb-4 line-clamp-3">
          {resource.description}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-[var(--muted)] mb-4">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{getMetaInfo()}</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="text-xs px-2 py-1 text-gray-500">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{resource.rating}</span>
            <span className="text-xs text-[var(--muted)]">rating</span>
          </div>
          
          <div className="flex items-center gap-2">
            {resource.type === 'podcast' && (
              <button 
                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                title="Play Podcast"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
            {resource.downloadUrl && (
              <button 
                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button 
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View Full"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
