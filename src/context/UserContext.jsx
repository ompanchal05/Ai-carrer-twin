import React, { createContext, useState, useEffect } from 'react';
import { initialUserProfile } from '../utils/mockData';
import toast from 'react-hot-toast';
import { auth, getUserProfileFromFirestore, saveUserProfileToFirestore } from '../services/firebase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ai_career_twin_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  // Sync profile from Firestore when Firebase user changes
  useEffect(() => {
    const syncProfileWithFirebase = async (fbUser) => {
      if (!fbUser) return;
      try {
        const cloudData = await getUserProfileFromFirestore(fbUser.uid);
        if (cloudData) {
          setProfile((prev) => {
            const merged = {
              ...prev,
              ...cloudData,
              name: cloudData.displayName || fbUser.displayName || prev.name,
              email: cloudData.email || fbUser.email || prev.email,
              avatar: cloudData.photoURL || fbUser.photoURL || prev.avatar,
            };
            localStorage.setItem('ai_career_twin_profile', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not sync profile from Firestore:', err);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        syncProfileWithFirebase(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfileData = async (updatedFields) => {
    let nextProfile;
    setProfile((prev) => {
      nextProfile = { ...prev, ...updatedFields };
      localStorage.setItem('ai_career_twin_profile', JSON.stringify(nextProfile));
      return nextProfile;
    });

    // If signed into Firebase, persist to Firestore
    if (auth.currentUser?.uid) {
      try {
        await saveUserProfileToFirestore(auth.currentUser.uid, {
          displayName: nextProfile.name,
          email: nextProfile.email,
          photoURL: nextProfile.avatar,
          targetRole: nextProfile.targetRole,
          college: nextProfile.college,
          branch: nextProfile.branch,
          cgpa: Number(nextProfile.cgpa) || 8.9,
          skills: nextProfile.skills || [],
          role: nextProfile.role,
        });
      } catch (e) {
        console.warn('Firestore profile sync error:', e);
      }
    }

    toast.success('Profile updated & synced successfully!');
  };

  const addSkill = (skill) => {
    if (!skill || profile.skills?.includes(skill)) return;
    updateProfileData({ skills: [...(profile.skills || []), skill] });
  };

  const removeSkill = (skillToRemove) => {
    updateProfileData({ skills: (profile.skills || []).filter((s) => s !== skillToRemove) });
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateProfileData, addSkill, removeSkill }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
