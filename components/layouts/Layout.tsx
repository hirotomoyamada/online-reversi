import { forwardRef, ReactNode } from 'react'
import { VStack } from 'ui'

interface LayoutPropsType {
  children?: ReactNode
}

export const Layout = forwardRef<HTMLDivElement, LayoutPropsType>(({ children }, ref) => {
  return (
    <VStack
      ref={ref}
      position='relative'
      p='md'
      w='100vw'
      h='100vh'
      spacing='md'
      justify='center'
      align='center'
      overflowY='scroll'
    >
      {children}
    </VStack>
  )
})

Layout.displayName = 'Layout'
