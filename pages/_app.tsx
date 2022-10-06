import type { AppProps } from 'next/app'
import { UIProvider } from 'ui'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <UIProvider>
      <Component {...pageProps} />
    </UIProvider>
  )
}

export default MyApp
