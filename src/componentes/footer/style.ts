import { styled } from '@ignite-ui/react'

export const FooterContainer = styled('footer', {
  position: 'realtive',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray900',
  padding: '$6',
  color: '$gray100',
  bottom: '0',
  width: '100%',
  gap: '$4',
  textAlign: 'center',

  div: {
    display: 'flex',
    h3: {
      marginTop: '3px',
    },
  },
})

export const LogoFooter = styled('img', {
  width: '30px',
  height: 'auto',
  marginBottom: '$4',
})

export const Address = styled('p', {
  fontSize: '$md',
  margin: '0',
  color: '$gray400',
})

export const Copyright = styled('p', {
  fontSize: '$sm',
  color: '$gray500',
})
