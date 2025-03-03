import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  padding: '$6',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  maxWidth: '800px',
  margin: 'auto',
  backgroundColor: '$gray900',
  color: '$gray100',
  borderRadius: '$sm',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
})

export const Title = styled('h1', {
  fontSize: '$2xl',
  color: '$ignite500',
  textAlign: 'center',
  marginBottom: '$4',
})

export const Section = styled('div', {
  marginBottom: '$4',
})

export const SectionTitle = styled('h2', {
  fontSize: '$lg',
  color: '$gray300',
  borderBottom: '2px solid $ignite500',
  paddingBottom: '$2',
  marginBottom: '$3',
})

export const Text = styled('p', {
  fontSize: '$md',
  color: '$gray200',
  lineHeight: 1.6,
  textAlign: 'justify',
})

export const ButtonContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginTop: '$5',
  justifyContent: 'center',
})

export const AcceptButton = styled('button', {
  padding: '$3',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: '$ignite500',
  color: '$white',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$ignite300',
  },
})

export const DeclineButton = styled('button', {
  padding: '$3',
  width: '45%',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: '$red500',
  color: '$white',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$red300',
  },
})
