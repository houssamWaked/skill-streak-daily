import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile, UserProfile, migrateLocalStorageData } from '@/services/supabaseService';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);

        // Try to migrate localStorage data if profile is new
        if (!userProfile || userProfile.interests.length === 0) {
          await migrateLocalStorageData(user.id);
          // Reload profile after migration
          const updatedProfile = await getUserProfile(user.id);
          setProfile(updatedProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      await updateUserProfile(user.id, updates);
      const updatedProfile = await getUserProfile(user.id);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    isNewUser: profile?.interests.length === 0
  };
};