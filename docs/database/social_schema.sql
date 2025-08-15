-- Selphlyze Social Network Database Schema
-- ================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Roles Enum
CREATE TYPE user_role AS ENUM ('client', 'psychologist', 'researcher', 'admin');

-- Post Types Enum  
CREATE TYPE post_type AS ENUM ('text', 'image', 'poll', 'test', 'article', 'question');
CREATE TYPE post_visibility AS ENUM ('public', 'professional', 'group', 'followers');

-- Group Types Enum
CREATE TYPE group_type AS ENUM ('support', 'professional', 'research', 'local', 'educational');
CREATE TYPE group_privacy AS ENUM ('public', 'private', 'invite_only');

-- Crisis Risk Levels
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Users Table (Enhanced)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    role user_role DEFAULT 'client',
    verified BOOLEAN DEFAULT FALSE,
    
    -- Profile Information
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255),
    
    -- Professional Information
    credentials TEXT[], -- ["PhD Psychology", "Licensed Therapist"]
    specializations TEXT[], -- ["CBT", "Anxiety", "Depression"]
    experience_years INTEGER,
    education JSONB, -- [{"degree": "PhD", "institution": "Harvard", "year": 2015}]
    languages TEXT[] DEFAULT ARRAY['English'],
    
    -- Client Information
    age_range VARCHAR(20),
    interests TEXT[],
    anonymous_mode BOOLEAN DEFAULT FALSE,
    
    -- Social Stats
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Settings
    profile_visibility VARCHAR(20) DEFAULT 'public',
    allow_messages BOOLEAN DEFAULT TRUE,
    show_activity BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT valid_profile_visibility CHECK (profile_visibility IN ('public', 'professional', 'private'))
);

-- Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type post_type DEFAULT 'text',
    visibility post_visibility DEFAULT 'public',
    
    -- Tags and Categories
    tags TEXT[],
    category VARCHAR(50),
    
    -- Attachments
    attachments JSONB, -- [{"type": "image", "url": "...", "title": "..."}]
    
    -- Engagement Metrics
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- AI Analysis
    ai_analysis JSONB, -- {"sentiment": "positive", "topics": [...], "risk_level": "low"}
    
    -- Group Association
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for nested replies
    
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    
    -- AI Analysis
    ai_analysis JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT comment_content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

-- Groups Table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type group_type DEFAULT 'support',
    privacy group_privacy DEFAULT 'public',
    
    -- Visual
    avatar_url TEXT,
    cover_url TEXT,
    
    -- Moderation
    moderated BOOLEAN DEFAULT TRUE,
    rules TEXT[],
    
    -- Stats
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Owner
    created_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members Table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    role VARCHAR(20) DEFAULT 'member', -- member, moderator, admin
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(group_id, user_id),
    CONSTRAINT valid_member_role CHECK (role IN ('member', 'moderator', 'admin'))
);

-- Followers/Following Table
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Likes Table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Either post_id or comment_id should be set, not both
    CONSTRAINT like_target_check CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    ),
    
    -- Unique constraint per user per target
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB, -- Additional context data
    
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Psychology Tests Table
CREATE TABLE psychology_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    
    questions JSONB NOT NULL, -- Array of question objects
    estimated_time INTEGER, -- minutes
    professional_only BOOLEAN DEFAULT FALSE,
    
    created_by UUID REFERENCES users(id),
    published BOOLEAN DEFAULT FALSE,
    
    -- Stats
    taken_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Results Table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES psychology_tests(id),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    answers JSONB NOT NULL,
    score DECIMAL(5,2),
    interpretation TEXT,
    ai_analysis TEXT,
    
    shareable BOOLEAN DEFAULT FALSE,
    anonymous BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(test_id, user_id, created_at)
);

-- Crisis Alerts Table
CREATE TABLE crisis_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    trigger_type VARCHAR(20) NOT NULL, -- 'post', 'message', 'test_result'
    trigger_id UUID NOT NULL,
    risk_level risk_level NOT NULL,
    
    keywords TEXT[],
    ai_confidence DECIMAL(3,2), -- 0.0 to 1.0
    
    reviewed BOOLEAN DEFAULT FALSE,
    reviewed_by UUID REFERENCES users(id),
    action_taken TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_trigger_type CHECK (trigger_type IN ('post', 'message', 'test_result'))
);

-- Professional Verification Requests
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    request_type VARCHAR(20) DEFAULT 'professional', -- 'professional', 'institution'
    documents JSONB, -- URLs to uploaded documents
    credentials TEXT[],
    
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT valid_verification_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Messages Table (for private messaging)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file'
    attachments JSONB,
    
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT no_self_message CHECK (sender_id != recipient_id)
);

-- ================================================
-- Indexes for Performance
-- ================================================

-- Users indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_verified ON users(verified);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Posts indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_group_id ON posts(group_id);
CREATE INDEX idx_posts_tags ON posts USING gin(tags);

-- Comments indexes
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Social indexes
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);

-- Groups indexes
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;

-- ================================================
-- Functions and Triggers
-- ================================================

-- Update followers count
CREATE OR REPLACE FUNCTION update_followers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
        UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
        UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_followers_count
    AFTER INSERT OR DELETE ON follows
    FOR EACH ROW EXECUTE FUNCTION update_followers_count();

-- Update posts count
CREATE OR REPLACE FUNCTION update_posts_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET posts_count = posts_count + 1 WHERE id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET posts_count = posts_count - 1 WHERE id = OLD.user_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_posts_count
    AFTER INSERT OR DELETE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_posts_count();

-- Update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        ELSIF NEW.comment_id IS NOT NULL THEN
            UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.post_id IS NOT NULL THEN
            UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        ELSIF OLD.comment_id IS NOT NULL THEN
            UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_likes_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- Update comments count
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comments_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- ================================================
-- Row Level Security (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

-- Users can read public profiles, update their own
CREATE POLICY "Public profiles are viewable by everyone" ON users
    FOR SELECT USING (profile_visibility = 'public' OR auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Posts visibility policies
CREATE POLICY "Public posts are viewable by everyone" ON posts
    FOR SELECT USING (visibility = 'public');

CREATE POLICY "Professional posts viewable by professionals" ON posts
    FOR SELECT USING (
        visibility = 'professional' AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('psychologist', 'researcher'))
    );

CREATE POLICY "Users can create posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments visible if post is visible" ON comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = comments.post_id
        )
    );

CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications are private
CREATE POLICY "Users can only see own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Messages are private
CREATE POLICY "Users can see own messages" ON messages
    FOR SELECT USING (auth.uid() IN (sender_id, recipient_id));

-- Crisis alerts - only admins and the user
CREATE POLICY "Crisis alerts restricted access" ON crisis_alerts
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- ================================================
-- Sample Data (Optional)
-- ================================================

-- Insert sample users (uncomment if needed)
/*
INSERT INTO users (email, username, role, full_name, verified, bio) VALUES
('dr.smith@example.com', 'dr_smith', 'psychologist', 'Dr. Sarah Smith', true, 'Clinical psychologist specializing in anxiety and depression'),
('researcher1@uni.edu', 'research_mind', 'researcher', 'Dr. Michael Johnson', true, 'Psychology researcher at State University'),
('user123@email.com', 'anonymous_user', 'client', 'Anonymous User', false, 'Seeking support and community');

-- Insert sample groups
INSERT INTO groups (name, description, type, created_by) VALUES
('Anxiety Support', 'A supportive community for people dealing with anxiety', 'support', (SELECT id FROM users WHERE username = 'dr_smith')),
('CBT Professionals', 'Network for Cognitive Behavioral Therapy practitioners', 'professional', (SELECT id FROM users WHERE username = 'dr_smith')),
('Research Collaboration', 'Space for academic collaboration', 'research', (SELECT id FROM users WHERE username = 'research_mind'));
*/
