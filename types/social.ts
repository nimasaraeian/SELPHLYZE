// Social Network Types for Selphlyze

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  verified: boolean;
  profile: UserProfile;
  settings: UserSettings;
  createdAt: Date;
  lastActive: Date;
}

export type UserRole = 'client' | 'psychologist' | 'researcher' | 'admin';

export interface UserProfile {
  fullName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  
  // Professional fields
  credentials?: string[];
  specializations?: string[];
  experience?: number; // years
  education?: Education[];
  languages?: string[];
  
  // Client fields (optional/anonymous)
  ageRange?: string;
  interests?: string[];
  anonymousMode?: boolean;
  
  // Social stats
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
  verified: boolean;
}

export interface UserSettings {
  privacy: {
    profileVisibility: 'public' | 'professional' | 'private';
    allowMessages: boolean;
    showActivity: boolean;
    anonymousPosting: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    mentions: boolean;
    comments: boolean;
    followers: boolean;
  };
  feed: {
    algorithm: 'chronological' | 'relevance' | 'mixed';
    contentTypes: PostType[];
    showSensitiveContent: boolean;
  };
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  type: PostType;
  visibility: PostVisibility;
  tags: string[];
  attachments?: Attachment[];
  
  // Engagement
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  
  // AI Analysis
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative' | 'concerning';
    topics: string[];
    riskLevel: 'low' | 'medium' | 'high';
    suggestedTags: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export type PostType = 'text' | 'image' | 'poll' | 'test' | 'article' | 'question';
export type PostVisibility = 'public' | 'professional' | 'group' | 'followers';

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'link';
  url: string;
  title?: string;
  description?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string; // for replies
  likesCount: number;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  privacy: GroupPrivacy;
  avatar?: string;
  cover?: string;
  
  // Moderation
  moderated: boolean;
  moderators: string[]; // user IDs
  rules?: string[];
  
  // Stats
  membersCount: number;
  postsCount: number;
  
  createdAt: Date;
}

export type GroupType = 'support' | 'professional' | 'research' | 'local' | 'educational';
export type GroupPrivacy = 'public' | 'private' | 'invite_only';

export interface Feed {
  posts: Post[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'group_invite' 
  | 'message'
  | 'crisis_alert'
  | 'verification_update';

// Specialized Psychology Types
export interface PsychologyTest {
  id: string;
  title: string;
  description: string;
  category: TestCategory;
  questions: TestQuestion[];
  estimated_time: number; // minutes
  professional_only: boolean;
  created_by: string; // user ID
}

export type TestCategory = 
  | 'personality' 
  | 'mood' 
  | 'anxiety' 
  | 'depression' 
  | 'cognitive' 
  | 'relationship'
  | 'career'
  | 'trauma';

export interface TestQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'boolean';
  options?: string[];
  scale?: { min: number; max: number; labels: string[] };
}

export interface TestResult {
  id: string;
  test_id: string;
  user_id: string;
  answers: Record<string, any>;
  score?: number;
  interpretation?: string;
  ai_analysis?: string;
  shareable: boolean;
  created_at: Date;
}

// Crisis Detection
export interface CrisisAlert {
  id: string;
  user_id: string;
  trigger_type: 'post' | 'message' | 'test_result';
  trigger_id: string;
  risk_level: 'medium' | 'high' | 'critical';
  keywords: string[];
  reviewed: boolean;
  action_taken?: string;
  created_at: Date;
}
