import { styled } from '@ignite-ui/react'

export const FooterContainer = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray900',
  padding: '$6',
  color: '$gray100',
  position: 'relative',
  bottom: '0',
  width: '100%',
  gap: '$4',
  textAlign: 'center',
  marginTop: '138px',
})

export const LogoFooter = styled('img', {
  width: '120px',
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
