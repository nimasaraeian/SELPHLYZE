"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Shield, Users } from 'lucide-react';
import { socialManager } from '@/utils/socialInteractions';
import { useUserTracking } from '@/hooks/useUserTracking';

export default function SuggestedUsers() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followStates, setFollowStates] = useState<{ [key: string]: boolean }>({});
  const { getUserContext } = useUserTracking();
  const user = getUserContext();

  useEffect(() => {
    if (user) {
      loadSuggestedUsers();
    }
  }, [user]);

  const loadSuggestedUsers = () => {
    if (!user) return;
    
    const suggestions = socialManager.getSuggestedUsers(user.id, 5);
    setSuggestedUsers(suggestions);

    // Check follow states
    const states: { [key: string]: boolean } = {};
    suggestions.forEach(suggestedUser => {
      states[suggestedUser.id] = socialManager.isFollowing(user.id, suggestedUser.id);
    });
    setFollowStates(states);
  };

  const handleFollow = (targetUserId: string) => {
    if (!user) return;

    const isCurrentlyFollowing = followStates[targetUserId];
    
    if (isCurrentlyFollowing) {
      // Unfollow
      const success = socialManager.unfollowUser(user.id, targetUserId);
      if (success) {
        setFollowStates(prev => ({ ...prev, [targetUserId]: false }));
      }
    } else {
      // Follow
      const success = socialManager.followUser(user.id, targetUserId);
      if (success) {
        setFollowStates(prev => ({ ...prev, [targetUserId]: true }));
      }
    }
  };

  if (!user || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Suggested Connections
        </h3>
      </div>

      <div className="space-y-4">
        {suggestedUsers.map((suggestedUser: any) => (
          <div key={suggestedUser.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <img
                src={suggestedUser.avatar}
                alt={suggestedUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {suggestedUser.name}
                  </p>
                  {suggestedUser.verified && (
                    <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @{suggestedUser.username}
                </p>
                {suggestedUser.mutualConnections > 0 && (
                  <p className="text-xs text-blue-600">
                    {suggestedUser.mutualConnections} mutual connections
                  </p>
                )}
              </div>
            </div>

            {/* Follow Button */}
            <button
              onClick={() => handleFollow(suggestedUser.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                followStates[suggestedUser.id]
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {followStates[suggestedUser.id] ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Follow
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all suggestions
        </button>
      </div>
    </motion.div>
  );
}
