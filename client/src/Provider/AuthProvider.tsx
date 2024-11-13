/* eslint-disable react-refresh/only-export-components */


import { createContext, useEffect, useState, ReactNode } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,

  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
 
  User,
} from 'firebase/auth'
import auth from '../Firebase/FireBase.config'




interface AuthContextType {
  user: User | null
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  createUser: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  resetPassword: (email: string) => Promise<any>
  logOut: () => Promise<any>
  updateUserProfile: (name: string, photo: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)


const googleProvider = new GoogleAuthProvider()

interface AuthProviderProps {
  children: ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const createUser = (email: string, password: string) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email: string, password: string) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)
  }

  const resetPassword = (email: string) => {
    setLoading(true)
    return sendPasswordResetEmail(auth, email)
  }

  const logOut = () => {
    setLoading(true)
    return signOut(auth)
  }



  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      console.log('CurrentUser-->', currentUser)
      setLoading(false)
    })
    return () => {
      return unsubscribe()
    }
  }, [])

  const authInfo: AuthContextType = {
    user,
    loading,
    setLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    updateUserProfile: function (name: string, photo: string): Promise<void> {
      throw new Error('Function not implemented.')
    }
  }

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
