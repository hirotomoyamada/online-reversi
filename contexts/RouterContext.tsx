import { useRouter } from 'next/router'
import { useEffect, createContext, FC, useState, ReactNode, useContext } from 'react'
import { AuthContext } from './AuthContext'

interface RouterContext {
  pathname: string
}

const defaultValue = {
  pathname: '/',
}

export const RouterContext = createContext<RouterContext>(defaultValue)

interface RouterProvider {
  children: ReactNode
}

export const RouterProvider: FC<RouterProvider> = ({ children }) => {
  const { isVerified } = useContext(AuthContext)
  const { pathname, ...router } = useRouter()

  // useEffect(() => {
  //   switch (isVerified) {
  //     case true: {
  //       const pathnames = ['/', '/auth']

  //       if (pathnames.includes(pathname)) router.replace('/dashboard')

  //       return
  //     }

  //     case false: {
  //       const pathnames = ['/auth']

  //       if (!pathnames.includes(pathname)) router.replace('/auth')

  //       return
  //     }

  //     default: {
  //       return
  //     }
  //   }
  // }, [isVerified, pathname, router])

  const value = {
    pathname,
  }

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}
