import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import {
  getInstalledInjectedConnectors,
  StarknetProvider,
} from '@starknet-react/core'
import { AuthContextProvider } from 'contexts/AuthContext'

function MyApp({ Component, pageProps }: AppProps) {
  const connectors = getInstalledInjectedConnectors()

  return (
    <StarknetProvider connectors={connectors} autoConnect>
      <AuthContextProvider>
        <NextHead>
          <title>Vascue</title>
        </NextHead>
        <Component {...pageProps} />
      </AuthContextProvider>
    </StarknetProvider>
  )
}

export default MyApp
