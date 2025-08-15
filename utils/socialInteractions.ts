// Social interaction utilities

export interface UserConnection {
  userId: string;
  targetUserId: string;
  type: 'follow' | 'block' | 'mute';
  timestamp: string;
}

export interface SocialStats {
  followers: number;
  following: number;
  posts: number;
  likes: number;
}

export class SocialInteractionManager {
  private static instance: SocialInteractionManager;

  static getInstance(): SocialInteractionManager {
    if (!SocialInteractionManager.instance) {
      SocialInteractionManager.instance = new SocialInteractionManager();
    }
    return SocialInteractionManager.instance;
  }

  // Follow/Unfollow functionality
  followUser(currentUserId: string, targetUserId: string): boolean {
    try {
      const connections = this.getUserConnections(currentUserId);
      const existingConnection = connections.find(
        conn => conn.targetUserId === targetUserId && conn.type === 'follow'
      );

      if (existingConnection) {
        return false; // Already following
      }

      const newConnection: UserConnection = {
        userId: currentUserId,
        targetUserId,
        type: 'follow',
        timestamp: new Date().toISOString()
      };

      connections.push(newConnection);
      this.saveUserConnections(currentUserId, connections);

      // Update follower count for target user
      this.updateFollowerCount(targetUserId, 1);
      // Update following count for current user
      this.updateFollowingCount(currentUserId, 1);

      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }

  unfollowUser(currentUserId: string, targetUserId: string): boolean {
    try {
      const connections = this.getUserConnections(currentUserId);
      const filteredConnections = connections.filter(
        conn => !(conn.targetUserId === targetUserId && conn.type === 'follow')
      );

      if (filteredConnections.length === connections.length) {
        return false; // Wasn't following
      }

      this.saveUserConnections(currentUserId, filteredConnections);

      // Update follower count for target user
      this.updateFollowerCount(targetUserId, -1);
      // Update following count for current user
      this.updateFollowingCount(currentUserId, -1);

      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }

  isFollowing(currentUserId: string, targetUserId: string): boolean {
    try {
      const connections = this.getUserConnections(currentUserId);
      return connections.some(
        conn => conn.targetUserId === targetUserId && conn.type === 'follow'
      );
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  // Get user connections
  getUserConnections(userId: string): UserConnection[] {
    try {
      const connections = localStorage.getItem(`socialConnections_${userId}`);
      return connections ? JSON.parse(connections) : [];
    } catch (error) {
      console.error('Error loading user connections:', error);
      return [];
    }
  }

  saveUserConnections(userId: string, connections: UserConnection[]): void {
    try {
      localStorage.setItem(`socialConnections_${userId}`, JSON.stringify(connections));
    } catch (error) {
      console.error('Error saving user connections:', error);
    }
  }

  // Social stats management
  getUserStats(userId: string): SocialStats {
    try {
      const stats = localStorage.getItem(`socialStats_${userId}`);
      if (stats) {
        return JSON.parse(stats);
      }
      
      // Return default stats
      return {
        followers: 0,
        following: 0,
        posts: 0,
        likes: 0
      };
    } catch (error) {
      console.error('Error loading user stats:', error);
      return { followers: 0, following: 0, posts: 0, likes: 0 };
    }
  }

  updateUserStats(userId: string, updates: Partial<SocialStats>): void {
    try {
      const currentStats = this.getUserStats(userId);
      const newStats = { ...currentStats, ...updates };
      localStorage.setItem(`socialStats_${userId}`, JSON.stringify(newStats));
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  updateFollowerCount(userId: string, change: number): void {
    const stats = this.getUserStats(userId);
    this.updateUserStats(userId, { 
      followers: Math.max(0, stats.followers + change) 
    });
  }

  updateFollowingCount(userId: string, change: number): void {
    const stats = this.getUserStats(userId);
    this.updateUserStats(userId, { 
      following: Math.max(0, stats.following + change) 
    });
  }

  updatePostCount(userId: string, change: number): void {
    const stats = this.getUserStats(userId);
    this.updateUserStats(userId, { 
      posts: Math.max(0, stats.posts + change) 
    });
  }

  updateLikeCount(userId: string, change: number): void {
    const stats = this.getUserStats(userId);
    this.updateUserStats(userId, { 
      likes: Math.max(0, stats.likes + change) 
    });
  }

  // Get suggested users to follow
  getSuggestedUsers(currentUserId: string, limit: number = 5): any[] {
    // This would typically fetch from a backend
    // For now, return mock suggested users
    const mockSuggestions = [
      {
        id: 'user_1',
        name: 'Dr. Sarah Johnson',
        username: 'drsarahjohnson',
        avatar: 'https://i.pravatar.cc/60?img=1',
        bio: 'Clinical Psychologist specializing in anxiety disorders',
        verified: true,
        mutualConnections: 3
      },
      {
        id: 'user_2', 
        name: 'Michael Chen',
        username: 'michaelchen',
        avatar: 'https://i.pravatar.cc/60?img=2',
        bio: 'PhD student in Cognitive Psychology',
        verified: false,
        mutualConnections: 1
      },
      {
        id: 'user_3',
        name: 'Dr. Emily Rodriguez',
        username: 'dremilyrod',
        avatar: 'https://i.pravatar.cc/60?img=3',
        bio: 'Researcher in behavioral psychology',
        verified: true,
        mutualConnections: 5
      }
    ];

    // Filter out users already followed
    const connections = this.getUserConnections(currentUserId);
    const followedIds = connections
      .filter(conn => conn.type === 'follow')
      .map(conn => conn.targetUserId);

    return mockSuggestions
      .filter(user => !followedIds.includes(user.id) && user.id !== currentUserId)
      .slice(0, limit);
  }

  // Get user's followers
  getUserFollowers(userId: string): any[] {
    // This would typically fetch from backend
    // For now, scan all users' connections
    const allUsers = this.getAllUsers();
    const followers = [];

    for (const user of allUsers) {
      const connections = this.getUserConnections(user.id);
      const isFollowing = connections.some(
        conn => conn.targetUserId === userId && conn.type === 'follow'
      );
      
      if (isFollowing) {
        followers.push(user);
      }
    }

    return followers;
  }

  // Get users that current user is following
  getUserFollowing(userId: string): any[] {
    const connections = this.getUserConnections(userId);
    const followingIds = connections
      .filter(conn => conn.type === 'follow')
      .map(conn => conn.targetUserId);

    const allUsers = this.getAllUsers();
    return allUsers.filter(user => followingIds.includes(user.id));
  }

  private getAllUsers(): any[] {
    // Mock method - in real app this would come from backend
    return [
      { id: 'user_1', name: 'Dr. Sarah Johnson', username: 'drsarahjohnson' },
      { id: 'user_2', name: 'Michael Chen', username: 'michaelchen' },
      { id: 'user_3', name: 'Dr. Emily Rodriguez', username: 'dremilyrod' }
    ];
  }

  // Clear all social data for a user (for logout/reset)
  clearUserSocialData(userId: string): void {
    try {
      localStorage.removeItem(`socialConnections_${userId}`);
      localStorage.removeItem(`socialStats_${userId}`);
    } catch (error) {
      console.error('Error clearing user social data:', error);
    }
  }
}

// Export singleton instance
export const socialManager = SocialInteractionManager.getInstance();
