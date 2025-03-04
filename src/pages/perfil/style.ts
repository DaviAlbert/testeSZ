import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '$6',
  gap: '$6',
  backgroundColor: '$gray800',
  minHeight: '100vh',
})

export const ProfileCard = styled('div', {
  backgroundColor: '$gray900',
  padding: '$6',
  borderRadius: '$md',
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  width: '90%',
  maxWidth: '500px',
  textAlign: 'center',
})

export const ProfileField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '$4',

  label: {
    fontSize: '$lg',
    fontWeight: 'bold',
    color: '$gray300',
    marginBottom: '$2',
  },

  span: {
    fontSize: '$md',
    color: '$gray100',
  },

  input: {
    width: '100%',
    maxWidth: '300px',
    padding: '$2',
    fontSize: '$md',
    borderRadius: '$sm',
    border: '1px solid $gray500',
    backgroundColor: '$gray700',
    color: '$gray100',

    '&::placeholder': {
      color: '$gray400',
    },
  },
})

export const EditButton = styled('button', {
  backgroundColor: '$ignite500',
  color: 'white',
  padding: '$2 $4',
  fontSize: '$md',
  borderRadius: '$sm',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
  marginTop: '$4',

  '&:hover': {
    backgroundColor: '$ignite300',
  },
})

export const SaveButton = styled(EditButton, {
  backgroundColor: '$ignite500',

  '&:hover': {
    backgroundColor: '$ignite700',
  },
})

export const Message = styled('p', {
  color: '$red500',
  fontSize: '$md',
  marginTop: '$3',
})

export const File = styled('input', {
  width:'115px',
  marginTop: '40px',
})

export const Foto = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  margin: 'auto',
  alignItems: 'center',
  marginBottom: '10px',
})