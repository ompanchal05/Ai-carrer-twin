import React, { createContext, useState, useEffect, useRef } from 'react';
import { initialUserProfile } from '../utils/mockData';
import toast from 'react-hot-toast';
import { auth, getUserProfileFromFirestore, saveUserProfileToFirestore } from '../services/firebase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const currentUidRef = useRef(null);

  // Initialize profile with user-scoped storage
  const [profile, setProfile] = useState(() => {
    try {
      const savedUserStr = localStorage.getItem('ai_career_twin_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      const uid = savedUser?.uid || savedUser?.id;

      if (uid) {
        currentUidRef.current = uid;
        const userScopedProfile = localStorage.getItem(`ai_career_twin_profile_${uid}`);
        if (userScopedProfile) {
          const parsed = JSON.parse(userScopedProfile);
          // Preserve authenticated name
          if (savedUser.name) parsed.name = savedUser.name;
          if (savedUser.email) parsed.email = savedUser.email;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Profile hydration note:', e);
    }

    return {
      ...initialUserProfile,
      lastResumeFilename: null,
      lastResumeEvaluation: null
    };
  });

  // Reset profile to clean state on logout
  const resetProfile = () => {
    currentUidRef.current = null;
    setProfile({
      ...initialUserProfile,
      name: 'Guest Candidate',
      email: '',
      lastResumeFilename: null,
      lastResumeEvaluation: null
    });
  };

  // Sync profile when Firebase Auth user changes (Switching Gmail accounts)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        currentUidRef.current = null;
        return;
      }

      const uid = fbUser.uid;
      currentUidRef.current = uid;

      // 1. Check if we already have local cache for this specific user
      let localCachedProfile = null;
      try {
        const cached = localStorage.getItem(`ai_career_twin_profile_${uid}`);
        if (cached) {
          localCachedProfile = JSON.parse(cached);
        }
      } catch {}

      // 2. Fetch from Firestore with fast timeout
      let cloudData = null;
      try {
        cloudData = await getUserProfileFromFirestore(uid, 1800);
      } catch (err) {
        console.warn('Could not sync profile from Firestore:', err);
      }

      if (cloudData) {
        // User has an existing profile in Firestore
        const merged = {
          ...initialUserProfile,
          ...localCachedProfile,
          ...cloudData,
          uid,
          name: cloudData.displayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Student Candidate',
          email: fbUser.email,
          avatar: cloudData.photoURL || fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${fbUser.email}`,
          lastResumeFilename: cloudData.lastResumeFilename || localCachedProfile?.lastResumeFilename || null,
          lastResumeEvaluation: cloudData.lastResumeEvaluation || localCachedProfile?.lastResumeEvaluation || null,
          atsScore: cloudData.atsScore || localCachedProfile?.atsScore || 85,
          skills: cloudData.skills || localCachedProfile?.skills || ['Python', 'JavaScript', 'React', 'SQL', 'FastAPI']
        };

        setProfile(merged);
        localStorage.setItem(`ai_career_twin_profile_${uid}`, JSON.stringify(merged));
      } else if (localCachedProfile) {
        // Use local cached profile for this user
        setProfile(localCachedProfile);
      } else {
        // Brand NEW Gmail user! Initialize clean fresh profile without ANY data from previous accounts
        const newDisplayName = fbUser.displayName || fbUser.email?.split('@')[0]?.replace('.', ' ')?.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Student Candidate';
        const freshProfile = {
          ...initialUserProfile,
          uid,
          name: newDisplayName,
          email: fbUser.email,
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${fbUser.email}`,
          role: 'Student / Aspiring AI Engineer',
          targetRole: 'Senior Full-Stack AI Engineer',
          lastResumeFilename: null,
          lastResumeEvaluation: null,
          skills: ['Python', 'JavaScript', 'React', 'SQL', 'FastAPI'],
          atsScore: 80,
          readinessScore: 78,
          cgpa: 8.5
        };

        setProfile(freshProfile);
        localStorage.setItem(`ai_career_twin_profile_${uid}`, JSON.stringify(freshProfile));

        // Save fresh profile to Firestore in background
        saveUserProfileToFirestore(uid, {
          displayName: newDisplayName,
          email: fbUser.email,
          photoURL: freshProfile.avatar,
          role: freshProfile.role,
          targetRole: freshProfile.targetRole,
          skills: freshProfile.skills,
          createdAt: new Date().toISOString()
        }).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfileData = async (updatedFields) => {
    let nextProfile;
    setProfile((prev) => {
      const fieldsToApply = { ...updatedFields };
      // Never overwrite authenticated user's name with document candidate name
      if (fieldsToApply.preventNameOverwrite || fieldsToApply.fromResume) {
        delete fieldsToApply.name;
      }
      nextProfile = { ...prev, ...fieldsToApply };

      const activeUid = nextProfile.uid || auth.currentUser?.uid;
      if (activeUid) {
        localStorage.setItem(`ai_career_twin_profile_${activeUid}`, JSON.stringify(nextProfile));
      }
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
          atsScore: nextProfile.atsScore,
          lastResumeFilename: nextProfile.lastResumeFilename,
          lastResumeEvaluation: nextProfile.lastResumeEvaluation
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
    <UserContext.Provider value={{ profile, setProfile, updateProfileData, addSkill, removeSkill, resetProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
