import { onAuthStateChanged, User as _User } from 'firebase/auth'
import { createContext, FC, useState, ReactNode, useContext, useEffect, useCallback } from 'react'
import { auth } from 'libs/firebase'
import functions from 'libs/functions'
import { User } from 'types/firestore'
// import { NoticeContext, LoadingContext } from 'ui'

interface AuthContext {
  user: User
  isVerified: boolean | null
  signIn: () => void
  signOut: (message?: string) => void
}

const defaultValue = {
  user: {} as User,
  isVerified: null,
  signIn: () => {},
  signOut: () => {},
}

export const AuthContext = createContext<AuthContext>(defaultValue)

interface UserProvider {
  children: ReactNode
}

export const AuthProvider: FC<UserProvider> = ({ children }) => {
  const [user, setUser] = useState<User>({} as User)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  // const { addNoticeInfo, addNoticeError } = useContext(NoticeContext)
  // const { startScreenLoading, stopScreenLoading } = useContext(LoadingContext)

  const signIn = useCallback(
    async (): Promise<void> => {
      try {
        // startScreenLoading()

        const { user } = await functions.auth.signIn()

        setUser(user)
        setIsVerified(true)
      } catch (e) {
        // if (e instanceof Error) addNoticeError(e.message)
      } finally {
        // stopScreenLoading()
      }
    },
    [],
    // [addNoticeError, startScreenLoading, stopScreenLoading]
  )

  const signOut = useCallback(
    async (message?: string): Promise<void> => {
      try {
        // startScreenLoading()

        await functions.auth.signOut()

        setUser({} as User)
        setIsVerified(false)

        // if (message) addNoticeInfo(message)
      } catch (e) {
        // if (e instanceof Error) addNoticeError(e.message)
      } finally {
        // stopScreenLoading()
      }
    },
    [],
    // [addNoticeError, addNoticeInfo, startScreenLoading, stopScreenLoading],
  )

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        void signIn()
      } else {
        void signOut()
      }
    })
  }, [signIn, signOut])

  const value = {
    user,
    isVerified,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
