import { forwardRef, ReactNode } from 'react'
import { Box } from 'ui'

interface FooterProps {
  children?: ReactNode
}

export const Footer = forwardRef<HTMLDivElement, FooterProps>(({ children }, ref) => {
  return (
    <Box ref={ref} position='absolute' bottom='md' left='md' right='md' zIndex='kurillin'>
      {children}
    </Box>
  )
})

Footer.displayName = 'Footer'
