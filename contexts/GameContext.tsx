import { useEffect, createContext, FC, useState, ReactNode } from 'react'

interface GameContext {
  timeline: undefined
}

const defaultValue = {
  timeline: undefined,
}

export const GameContext = createContext<GameContext>(defaultValue)

interface GameProvider {
  children: ReactNode
}

export const GameProvider: FC<GameProvider> = ({ children }) => {
  const [timeline, setTimeline] = useState<undefined>(undefined)

  useEffect(() => {
    return
  }, [])

  const value = {
    timeline,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
