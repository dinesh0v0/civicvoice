import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }
    
    initSession()

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          // Handled by initSession above, prevent duplicate fetch
          return
        }
        
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email, password, fullName, phone) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone }
      }
    })
    if (error) throw error

    // Profile is auto-created by database trigger (handle_new_user)
    // Wait briefly for the trigger to complete, then fetch profile
    if (data.user) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await fetchProfile(data.user.id)
    }

    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  async function getAccessToken() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    getAccessToken,
    isAdmin: profile?.role === 'admin',
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
