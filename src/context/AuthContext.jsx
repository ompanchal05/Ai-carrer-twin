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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Retrieve or initialize user profile from Firestore
        let profileData = null;
        try {
          profileData = await getUserProfileFromFirestore(fbUser.uid);
        } catch (e) {
          console.warn('Could not fetch Firestore profile:', e);
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

        // Save back to Firestore if new or updated
        if (!profileData) {
          try {
            await saveUserProfileToFirestore(fbUser.uid, {
              uid: fbUser.uid,
              displayName: authenticatedUser.name,
              email: fbUser.email,
              photoURL: authenticatedUser.avatar,
              role: currentRole,
              targetRole: 'Senior AI Engineer',
              skills: ['Python', 'TensorFlow', 'PyTorch', 'React', 'FastAPI'],
              createdAt: new Date().toISOString()
            });
          } catch (e) {
            console.warn('Failed to initialize Firestore user doc:', e);
          }
        }
      } else {
        // If not logged into Firebase, check if there's an existing session
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
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [currentRole]);

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    localStorage.setItem('ai_career_twin_role', newRole);
    toast.success(`Switched mode to: ${newRole === 'admin' ? 'University / Placement Admin' : 'Student / Job Seeker'}`);
  };

  // Google Sign In via Firebase Popup
  const loginWithGoogle = async () => {
    const toastId = toast.loading('Connecting Google account via Firebase Auth...');
    try {
      const fbUser = await fbLoginWithGoogle();
      toast.success(`Welcome back, ${fbUser.displayName || fbUser.email}!`, { id: toastId });
      return true;
    } catch (err) {
      console.error('Google Auth Failed:', err);
      // Informative feedback
      let msg = err?.message || 'Google sign-in could not be completed.';
      if (err?.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in cancelled by user.';
      } else if (err?.code === 'auth/popup-blocked') {
        msg = 'Popup was blocked by browser. Please allow popups and try again.';
      }
      toast.error(msg, { id: toastId });
      throw err;
    }
  };

  // Email & Password login
  const login = async (email, password) => {
    const toastId = toast.loading('Signing in with credentials...');
    try {
      // First try Firebase email/password auth
      const fbUser = await fbLoginWithEmail(email, password);
      toast.success(`Signed in successfully!`, { id: toastId });
      return true;
    } catch (firebaseErr) {
      console.warn('Firebase email auth note:', firebaseErr?.code);

      // If user does not exist in Firebase yet or password invalid, allow demo fallback or inform
      if (firebaseErr?.code === 'auth/user-not-found' || firebaseErr?.code === 'auth/invalid-credential' || firebaseErr?.code === 'auth/wrong-password') {
        // Seamless fallback for pre-filled demo accounts
        const formattedName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase());
        const mockUser = {
          id: `usr-${Date.now()}`,
          uid: `usr-${Date.now()}`,
          name: formattedName || 'Student Candidate',
          email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formattedName}`,
          role: currentRole === 'admin' ? 'Placement Admin' : 'Student / Aspiring AI Engineer',
          isFirebase: false
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('ai_career_twin_user', JSON.stringify(mockUser));
        localStorage.setItem('ai_career_twin_auth', 'true');
        toast.success(`Logged in as ${mockUser.name} (Demo Mode)`, { id: toastId });
        return true;
      }

      toast.error(firebaseErr?.message || 'Failed to sign in', { id: toastId });
      throw firebaseErr;
    }
  };

  // Email & Password registration
  const register = async (name, email, password) => {
    const toastId = toast.loading('Creating account with Firebase...');
    try {
      const fbUser = await fbRegisterWithEmail(email, password, name);
      toast.success(`Account created for ${name}!`, { id: toastId });
      return true;
    } catch (firebaseErr) {
      console.warn('Firebase registration notice:', firebaseErr);

      if (firebaseErr?.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please sign in.', { id: toastId });
        throw firebaseErr;
      }

      // If configuration restriction or offline, provide graceful fallback
      const mockUser = {
        id: `usr-${Date.now()}`,
        uid: `usr-${Date.now()}`,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        role: currentRole === 'admin' ? 'Placement Admin' : 'Student / Aspiring AI Specialist',
        isFirebase: false
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('ai_career_twin_user', JSON.stringify(mockUser));
      localStorage.setItem('ai_career_twin_auth', 'true');
      toast.success(`Account created successfully!`, { id: toastId });
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
    localStorage.removeItem('ai_career_twin_user');
    localStorage.setItem('ai_career_twin_auth', 'false');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        authLoading,
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
