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
        console.log('useProfile: No user, resetting state');
        setProfile(null);
        setLoading(false);
        return;
      }

      console.log('useProfile: Loading profile for user:', user.id);
      try {
        setLoading(true);
        const userProfile = await getUserProfile(user.id);
        console.log('useProfile: Got profile:', userProfile);
        setProfile(userProfile);

        // Try to migrate localStorage data only if no profile exists
        if (!userProfile) {
          console.log('useProfile: No profile found, attempting migration');
          await migrateLocalStorageData(user.id);
          // Reload profile after migration
          const updatedProfile = await getUserProfile(user.id);
          console.log('useProfile: Profile after migration:', updatedProfile);
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