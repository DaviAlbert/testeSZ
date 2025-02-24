import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
