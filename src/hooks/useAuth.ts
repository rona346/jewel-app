import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged, signInWithPopup, googleProvider, signOut, db, doc, getDoc, setDoc, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userPath = `users/${firebaseUser.uid}`;
          let userDoc;
          try {
            userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, userPath);
          }

          if (userDoc?.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              wishlist: [],
              recentlyViewed: [],
              createdAt: new Date().toISOString(),
            };
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, userPath);
            }
            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth State Change Error:", error);
        // If it's a JSON string from handleFirestoreError, we can parse it for more info if needed
        toast.error("Failed to load user profile. Please check your connection.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Login Error:", error);
      if (error.code === 'auth/popup-blocked') {
        toast.error("Sign-in popup was blocked. Please allow popups for this site.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User closed the popup, no need to show error
      } else {
        toast.error(`Login failed: ${error.message || "Unknown error"}`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully signed out.");
    } catch (error: any) {
      console.error("Logout Error:", error);
      toast.error("Failed to sign out.");
    }
  };

  return { user, loading, login, logout };
}
