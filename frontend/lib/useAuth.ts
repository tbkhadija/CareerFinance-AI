'use client'

import { useState, useEffect } from 'react'

interface User {
  name: string
  email: string
  isLoggedIn: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Charger l'utilisateur depuis localStorage
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.isLoggedIn) {
          setUser(parsedUser)
        }
      }
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error)
      localStorage.removeItem('user')
    }

    setIsLoading(false)
  }, [mounted])

  const login = (userData: User) => {
    setUser(userData)
    if (mounted) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    if (mounted) {
      localStorage.removeItem('user')
      localStorage.removeItem('userStats')
    }
  }

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData }
      setUser(newUser)
      if (mounted) {
        localStorage.setItem('user', JSON.stringify(newUser))
      }
    }
  }

  return {
    user,
    isLoading: isLoading || !mounted,
    isLoggedIn: mounted && !!user?.isLoggedIn,
    login,
    logout,
    updateUser
  }
}
