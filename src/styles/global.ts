import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray800',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
    fontFamily: `'Montserrat', 'Roboto', sans-serif`,
  },

  'h1, h2, h3, h4, h5, h6': {
    fontFamily: `'Montserrat', sans-serif`,
    fontWeight: 700,
  },

  'button, input, textarea': {
    fontFamily: `'Roboto', sans-serif`,
  },
})
