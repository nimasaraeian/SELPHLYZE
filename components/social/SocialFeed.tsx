"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Verified } from 'lucide-react';
import type { Post, User } from '@/types/social';

interface SocialFeedProps {
  initialPosts?: Post[];
  userId?: string;
}

export default function SocialFeed({ initialPosts = [], userId }: SocialFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: '1',
      userId: 'user1',
      user: {
        id: 'user1',
        email: 'dr.smith@example.com',
        username: 'dr_smith',
        role: 'psychologist',
        verified: true,
        profile: {
          fullName: 'Dr. Sarah Smith',
          avatar: 'https://i.pravatar.cc/150?img=1',
          bio: 'Clinical Psychologist specializing in anxiety and depression',
          credentials: ['PhD Psychology', 'Licensed Therapist'],
          specializations: ['CBT', 'Anxiety', 'Depression'],
          followersCount: 1250,
          followingCount: 450,
          postsCount: 89,
        },
        settings: {
          privacy: {
            profileVisibility: 'public',
            allowMessages: true,
            showActivity: true,
            anonymousPosting: false,
          },
          notifications: {
            email: true,
            push: true,
            mentions: true,
            comments: true,
            followers: true,
          },
          feed: {
            algorithm: 'relevance',
            contentTypes: ['text', 'article'],
            showSensitiveContent: false,
          },
        },
        createdAt: new Date('2022-01-15'),
        lastActive: new Date(),
      },
      content: "Important tip for dealing with anxiety: Learning deep breathing techniques can be very effective in reducing physical symptoms of anxiety. Regular practice of these techniques helps you maintain better control during stressful situations.",
      type: 'text',
      visibility: 'public',
      tags: ['anxiety', 'coping', 'breathing', 'mindfulness'],
      likesCount: 45,
      commentsCount: 12,
      sharesCount: 8,
      aiAnalysis: {
        sentiment: 'positive',
        topics: ['anxiety management', 'breathing techniques', 'stress relief'],
        riskLevel: 'low',
        suggestedTags: ['anxiety', 'coping', 'breathing'],
      },
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      userId: 'user2',
      user: {
        id: 'user2',
        email: 'researcher@uni.edu',
        username: 'research_mind',
        role: 'researcher',
        verified: true,
        profile: {
          fullName: 'Dr. Michael Johnson',
          avatar: 'https://i.pravatar.cc/150?img=2',
          bio: 'Psychology researcher studying cognitive behavioral therapy effectiveness',
          credentials: ['PhD Cognitive Psychology', 'Research Associate'],
          specializations: ['CBT Research', 'Statistical Analysis'],
          followersCount: 890,
          followingCount: 234,
          postsCount: 156,
        },
        settings: {
          privacy: {
            profileVisibility: 'public',
            allowMessages: true,
            showActivity: true,
            anonymousPosting: false,
          },
          notifications: {
            email: true,
            push: false,
            mentions: true,
            comments: true,
            followers: false,
          },
          feed: {
            algorithm: 'chronological',
            contentTypes: ['text', 'article', 'test'],
            showSensitiveContent: true,
          },
        },
        createdAt: new Date('2021-09-20'),
        lastActive: new Date(),
      },
      content: "Our new research results show that combining CBT with mindfulness can create up to 30% more improvement in depression treatment compared to traditional methods. This finding is promising! 📊",
      type: 'article',
      visibility: 'professional',
      tags: ['research', 'CBT', 'mindfulness', 'depression', 'study'],
      likesCount: 67,
      commentsCount: 23,
      sharesCount: 15,
      aiAnalysis: {
        sentiment: 'positive',
        topics: ['research findings', 'CBT effectiveness', 'depression treatment'],
        riskLevel: 'low',
        suggestedTags: ['research', 'CBT', 'depression'],
      },
      createdAt: new Date('2024-01-14T14:15:00'),
      updatedAt: new Date('2024-01-14T14:15:00'),
    },
  ];

  useEffect(() => {
    if (posts.length === 0) {
      setPosts(mockPosts);
    }
  }, []);

  const handleLike = async (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likesCount: post.likesCount + 1 }
          : post
      )
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'yesterday';
    return date.toLocaleDateString('en-US');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'psychologist': return 'text-blue-600';
      case 'researcher': return 'text-purple-600';
      case 'admin': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'psychologist': return 'Psychologist';
      case 'researcher': return 'Researcher';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">You</span>
          </div>
          <div className="flex-1">
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              What's on your mind?
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Post Header */}
          <div className="p-6 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.user.profile.avatar || 'https://i.pravatar.cc/150'}
                  alt={post.user.profile.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {post.user.profile.fullName}
                    </h3>
                    {post.user.verified && (
                      <Verified className="w-4 h-4 text-blue-500" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getRoleColor(post.user.role)}`}>
                      {getRoleLabel(post.user.role)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    @{post.user.username} • {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-6 pb-3">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* AI Analysis Indicator */}
            {post.aiAnalysis && (
              <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700">
                    AI Analysis: {post.aiAnalysis.sentiment === 'positive' ? 'Positive' : 'Neutral'} content - Topics: {post.aiAnalysis.topics.join(', ')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors group"
                >
                  <Heart className="w-5 h-5 group-hover:fill-current" />
                  <span className="text-sm">{post.likesCount}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.commentsCount}</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">{post.sharesCount}</span>
                </button>
              </div>

              {/* Visibility Indicator */}
              <div className="text-xs text-gray-400">
                {post.visibility === 'public' ? '🌍 Public' : '👥 Professional'}
              </div>
            </div>
          </div>
        </motion.article>
      ))}

      {/* Load More */}
      {posts.length > 0 && (
        <div className="text-center py-6">
          <button
            onClick={() => setLoading(!loading)}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
