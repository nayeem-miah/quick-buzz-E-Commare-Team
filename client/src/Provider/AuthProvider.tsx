import { createContext, useEffect, useState, ReactNode } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  updateProfile,
} from "firebase/auth";

import auth from "../Firebase/FireBase.config";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createUser: (
    email: string,
    password: string,
    name: string,
    photo: string
  ) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  logOut: () => Promise<any>;
  updateUserProfile: (name: string, photo: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const googleProvider = new GoogleAuthProvider();

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createUser = async (
    email: string,
    password: string,
    name: string,
    photo: string
  ) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateUserProfile(name, photo);
    if (auth.currentUser) {
      setUser({ ...auth.currentUser });
    }
    setLoading(false);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
    return result;
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    setLoading(false);
    return result;
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    const result = await sendPasswordResetEmail(auth, email);
    setLoading(false);
    return result;
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
    toast.success("Logout successful ... :)")
  };

  const updateUserProfile = async (name: string, photo: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      setUser({ ...auth.currentUser, displayName: name, photoURL: photo });
    }
  };

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo: AuthContextType = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
