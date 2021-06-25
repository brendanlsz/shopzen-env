import React, { useContext, useState, useEffect } from "react"

import { useHistory } from "react-router-dom"

import { auth } from "./../../firebase/utils"

const AuthContext = React.createContext()

export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }) {
  const [user, setUser] = useState()
  const history = useHistory()

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user)
      history.push('/chats')
    })
  }, [user, history])

  const value = { user }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}