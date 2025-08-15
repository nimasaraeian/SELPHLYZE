import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Center | Selphlyze",
  description: "Comprehensive psychology learning resources: expert articles, authoritative books, and educational podcasts in psychology and mental health",
  keywords: ["psychology articles", "psychology books", "psychology podcasts", "learning resources", "mental health"],
};

"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Headphones, 
  FileText, 
  Search, 
  Filter, 
  Star,
  Clock,
  User,
  Play,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

type ContentType = 'all' | 'articles' | 'books' | 'podcasts';
type FilterOption = 'all' | 'recent' | 'popular' | 'trending';

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'podcast';
  author: string;
  duration?: string; // for podcasts
  pages?: number; // for books
  readTime?: string; // for articles
  rating: number;
  tags: string[];
  thumbnail: string;
  url?: string;
  downloadUrl?: string;
  featured: boolean;
  publishedAt: Date;
}

export default function LearningCenter() {
  const [activeTab, setActiveTab] = useState<ContentType>('all');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will come from API in the future
  const resources: LearningResource[] = [
    {
      id: '1',
      title: 'Fundamentals of Cognitive Behavioral Therapy',
      description: 'Complete introduction to CBT principles and techniques for treating various psychological disorders',
      type: 'article',
      author: 'Dr. Sarah Johnson',
      readTime: '15 min read',
      rating: 4.8,
      tags: ['CBT', 'Psychology', 'Therapy'],
      thumbnail: '/image/CBT.jpg',
      featured: true,
      publishedAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      title: 'Positive Psychology and Well-being',
      description: 'Comprehensive guide to understanding positive psychology concepts and their application in daily life',
      type: 'book',
      author: 'Dr. Michael Peterson',
      pages: 320,
      rating: 4.6,
      tags: ['Positive Psychology', 'Well-being', 'Happiness'],
      thumbnail: '/books/positive-psychology.jpg',
      downloadUrl: '/downloads/positive-psychology.pdf',
      featured: false,
      publishedAt: new Date('2023-12-15'),
    },
    {
      id: '3',
      title: 'Managing Stress in Modern Life',
      description: 'Expert discussion on effective stress control and management techniques in contemporary living',
      type: 'podcast',
      author: 'Dr. Emily Chen',
      duration: '45 min',
      rating: 4.9,
      tags: ['Stress', 'Management', 'Mental Health'],
      thumbnail: '/podcasts/stress-management.jpg',
      url: '/podcasts/stress-management.mp3',
      featured: true,
      publishedAt: new Date('2024-01-08'),
    },
    {
      id: '4',
      title: 'Mindfulness Techniques for Anxiety Reduction',
      description: 'Practical and simple methods for practicing mindfulness and reducing daily anxiety levels',
      type: 'article',
      author: 'Dr. Lisa Martinez',
      readTime: '12 min read',
      rating: 4.7,
      tags: ['Mindfulness', 'Anxiety', 'Practice'],
      thumbnail: '/image/mindfulness.jpg',
      featured: false,
      publishedAt: new Date('2024-01-05'),
    },
    {
      id: '5',
      title: 'Child and Adolescent Psychology',
      description: 'Complete guide for parents and educators to better understand child and adolescent psychology',
      type: 'book',
      author: 'Dr. Robert Williams',
      pages: 280,
      rating: 4.5,
      tags: ['Child Psychology', 'Adolescent', 'Parenting'],
      thumbnail: '/books/child-psychology.jpg',
      downloadUrl: '/downloads/child-psychology.pdf',
      featured: false,
      publishedAt: new Date('2023-11-20'),
    },
    {
      id: '6',
      title: 'Healthy Relationships and Effective Communication',
      description: 'Key insights for creating and maintaining healthy relationships in family and workplace',
      type: 'podcast',
      author: 'Dr. Amanda Thompson',
      duration: '38 min',
      rating: 4.8,
      tags: ['Relationships', 'Communication', 'Family'],
      thumbnail: '/podcasts/relationships.jpg',
      url: '/podcasts/relationships.mp3',
      featured: false,
      publishedAt: new Date('2024-01-03'),
    },
  ];

  // Filter resources based on active tab and search
  const filteredResources = resources.filter(resource => {
    const matchesTab = activeTab === 'all' || resource.type === activeTab.slice(0, -1);
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

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

  const getMetaInfo = (resource: LearningResource) => {
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

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
          >
            Selphlyze Learning Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--muted)] max-w-3xl mx-auto"
          >
            Comprehensive psychology learning resources: articles, books & podcasts
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)] w-5 h-5" />
            <input
              type="text"
              placeholder="Search learning resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'All Resources', icon: FileText },
              { id: 'articles', label: 'Articles', icon: FileText },
              { id: 'books', label: 'Books', icon: BookOpen },
              { id: 'podcasts', label: 'Podcasts', icon: Headphones },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ContentType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Resources */}
        {activeTab === 'all' && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.filter(r => r.featured).map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <motion.div
                    key={resource.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        resource.type === 'article' ? 'bg-blue-100 text-blue-600' :
                        resource.type === 'book' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
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
                      <span>{getMetaInfo(resource)}</span>
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
              })}
            </div>
          </motion.section>
        )}

        {/* All Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {activeTab === 'all' ? 'All Resources' : 
               activeTab === 'articles' ? 'Articles' :
               activeTab === 'books' ? 'Books' : 'Podcasts'}
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[var(--muted)]" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-sm"
              >
                <option value="all">All</option>
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const TypeIcon = getTypeIcon(resource.type);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${
                        resource.type === 'article' ? 'bg-blue-100 text-blue-600' :
                        resource.type === 'book' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <TypeIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {getTypeLabel(resource.type)}
                      </span>
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
                        <span>{getMetaInfo(resource)}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.type === 'podcast' && (
                          <button className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {resource.downloadUrl && (
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-[var(--muted)]">
                Try different keywords or adjust your filters
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}