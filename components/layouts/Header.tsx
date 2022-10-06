import { forwardRef, ReactNode } from 'react'
import { Box } from 'ui'

interface HeaderProps {
  children?: ReactNode
}

export const Header = forwardRef<HTMLDivElement, HeaderProps>(({ children }, ref) => {
  return (
    <Box ref={ref} position='absolute' top='md' left='md' right='md' zIndex='kurillin'>
      {children}
    </Box>
  )
})

Header.displayName = 'Header'
