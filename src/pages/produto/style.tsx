import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  maxWidth: '1000px',
  maxHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '$6',
  gap: '$6',
})

export const Image = styled('img', {
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius: '8px',
  margin: 'auto',
})
