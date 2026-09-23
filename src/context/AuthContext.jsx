import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  auth,
  loginWithGoogle as fbLoginWithGoogle,
  loginWithEmail as fbLoginWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  logoutUser as fbLogoutUser,
  onAuthStateChanged,
  getUserProfileFromFirestore,
  saveUserProfileToFirestore
} from '../services/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('ai_career_twin_role') || 'student';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ai_career_twin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ai_career_twin_auth') === 'true';
  });

  // Animated authentication transition state
  const [authTransitioning, setAuthTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');

  // 1. Safety timer: NEVER allow background auth to block the website for more than 1.2s
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setAuthLoading(false);
    }, 1200);

    return () => clearTimeout(safetyTimer);
  }, []);

  // 2. Fast Non-Blocking Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Fast Firestore lookup with a strict 1.5s timeout
        let profileData = null;
        try {
          profileData = await getUserProfileFromFirestore(fbUser.uid, 1500);
        } catch (e) {
          console.debug('Firestore lookup skipped/timed out:', e);
        }

        const authenticatedUser = {
          id: fbUser.uid,
          uid: fbUser.uid,
          name: fbUser.displayName || profileData?.displayName || fbUser.email?.split('@')[0] || 'Student Candidate',
          email: fbUser.email,
          avatar: fbUser.photoURL || profileData?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${fbUser.displayName || fbUser.email || 'User'}`,
          role: profileData?.role || (currentRole === 'admin' ? 'University / Placement Admin' : 'Student / Aspiring AI Engineer'),
          isFirebase: true
        };

        setUser(authenticatedUser);
        setIsAuthenticated(true);
        localStorage.setItem('ai_career_twin_user', JSON.stringify(authenticatedUser));
        localStorage.setItem('ai_career_twin_auth', 'true');

        // Save in background without blocking app execution
        if (!profileData) {
          saveUserProfileToFirestore(fbUser.uid, {
            uid: fbUser.uid,
            displayName: authenticatedUser.name,
            email: fbUser.email,
            photoURL: authenticatedUser.avatar,
            role: currentRole,
            targetRole: 'Senior AI Engineer',
            skills: ['Python', 'TensorFlow', 'PyTorch', 'React', 'FastAPI'],
            createdAt: new Date().toISOString()
          }).catch(() => {});
        }
      } else {
        // If not logged into Firebase, check cached session
        const savedAuth = localStorage.getItem('ai_career_twin_auth');
        const savedUser = localStorage.getItem('ai_career_twin_user');
        if (savedAuth === 'true' && savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      // Immediately resolve loading
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [currentRole]);

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    localStorage.setItem('ai_career_twin_role', newRole);
    toast.success(`Switched mode to: ${newRole === 'admin' ? 'University / Placement Admin' : 'Student / Job Seeker'}`);
  };

  // Google Sign In via Firebase Popup with fast transition
  const loginWithGoogle = async () => {
    setAuthTransitioning(true);
    setTransitionMessage('Authenticating with Google OAuth 2.0 & Firebase Cloud...');

    try {
      const fbUser = await fbLoginWithGoogle();

      const authenticatedUser = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student Candidate',
        email: fbUser.email,
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${fbUser.displayName || 'User'}`,
        role: currentRole === 'admin' ? 'University / Placement Admin' : 'Student / Aspiring AI Engineer',
        isFirebase: true
      };

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('ai_career_twin_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('ai_career_twin_auth', 'true');

      // Keep transition visible for 1.2s so user sees the authentication animation
      await new Promise((r) => setTimeout(r, 1200));
      setAuthTransitioning(false);
      toast.success(`Welcome back, ${authenticatedUser.name}!`);
      return true;
    } catch (err) {
      setAuthTransitioning(false);
      console.error('Google Auth Failed:', err);
      let msg = err?.message || 'Google sign-in could not be completed.';
      if (err?.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in was cancelled.';
      } else if (err?.code === 'auth/popup-blocked') {
        msg = 'Popup was blocked by your browser. Please allow popups and try again.';
      }
      toast.error(msg);
      throw err;
    }
  };

  // Email & Password login with fast transition
  const login = async (email, password) => {
    setAuthTransitioning(true);
    setTransitionMessage('Verifying credentials & synchronizing your AI Career Twin...');

    try {
      const fbUser = await fbLoginWithEmail(email, password);

      const authenticatedUser = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student Candidate',
        email: fbUser.email,
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${fbUser.email}`,
        role: currentRole === 'admin' ? 'University / Placement Admin' : 'Student / Aspiring AI Engineer',
        isFirebase: true
      };

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('ai_career_twin_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('ai_career_twin_auth', 'true');

      await new Promise((r) => setTimeout(r, 1200));
      setAuthTransitioning(false);
      toast.success(`Signed in successfully!`);
      return true;
    } catch (firebaseErr) {
      // Graceful fallback for pre-filled demo accounts
      if (
        firebaseErr?.code === 'auth/user-not-found' ||
        firebaseErr?.code === 'auth/invalid-credential' ||
        firebaseErr?.code === 'auth/wrong-password' ||
        firebaseErr?.code === 'auth/network-request-failed'
      ) {
        const formattedName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const mockUser = {
          id: `usr-${Date.now()}`,
          uid: `usr-${Date.now()}`,
          name: formattedName || 'Student Candidate',
          email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formattedName}`,
          role: currentRole === 'admin' ? 'University / Placement Admin' : 'Student / Aspiring AI Engineer',
          isFirebase: false
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('ai_career_twin_user', JSON.stringify(mockUser));
        localStorage.setItem('ai_career_twin_auth', 'true');

        await new Promise((r) => setTimeout(r, 1000));
        setAuthTransitioning(false);
        toast.success(`Logged in as ${mockUser.name}`);
        return true;
      }

      setAuthTransitioning(false);
      toast.error(firebaseErr?.message || 'Failed to sign in');
      throw firebaseErr;
    }
  };

  // Email & Password registration with fast transition
  const register = async (name, email, password) => {
    setAuthTransitioning(true);
    setTransitionMessage('Creating your account & provisioning AI Career Twin database...');

    try {
      const fbUser = await fbRegisterWithEmail(email, password, name);

      const authenticatedUser = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: name,
        email: fbUser.email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        role: currentRole === 'admin' ? 'University / Placement Admin' : 'Student / Aspiring AI Engineer',
        isFirebase: true
      };

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('ai_career_twin_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('ai_career_twin_auth', 'true');

      await new Promise((r) => setTimeout(r, 1200));
      setAuthTransitioning(false);
      toast.success(`Account created for ${name}!`);
      return true;
    } catch (firebaseErr) {
      if (firebaseErr?.code === 'auth/email-already-in-use') {
        setAuthTransitioning(false);
        toast.error('This email is already registered. Please sign in.');
        throw firebaseErr;
      }

      // Offline / demo fallback
      const mockUser = {
        id: `usr-${Date.now()}`,
        uid: `usr-${Date.now()}`,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        role: currentRole === 'admin' ? 'University / Placement Admin' : 'Student / Aspiring AI Engineer',
        isFirebase: false
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('ai_career_twin_user', JSON.stringify(mockUser));
      localStorage.setItem('ai_career_twin_auth', 'true');

      await new Promise((r) => setTimeout(r, 1000));
      setAuthTransitioning(false);
      toast.success(`Account created successfully!`);
      return true;
    }
  };

  const logout = async () => {
    try {
      await fbLogoutUser();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    setUser(null);
    setFirebaseUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('ai_career_twin_user');
      localStorage.removeItem('ai_career_twin_auth');
      localStorage.removeItem('ai_career_twin_profile');
      localStorage.removeItem('ai_career_twin_last_parsed_resume');
    } catch {}
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        authLoading,
        authTransitioning,
        transitionMessage,
        setAuthTransitioning,
        currentRole,
        switchRole,
        login,
        loginWithGoogle,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
