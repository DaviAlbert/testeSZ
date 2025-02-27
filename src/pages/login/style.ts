import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  padding: '$6',
  display: 'flex',
  gap: '$5',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  },
})

export const Campo = styled('div', {
  display: 'flex',
  margin: 'auto',
  flexDirection: 'column',
  gap: '$2',
})

export const Label = styled('label', {
  borderBottom: '2px solid $gray900',
  width: '55%',
  fontWeight: 'bold',
  color: '$gray100',
})

export const Input = styled('input', {
  textAlign: 'center',
  padding: '$3',
  width: 300,
  border: '1px solid $gray500',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: '$gray900',
  color: '$gray100',

  '&::placeholder': {
    color: '$gray400',
  },
})

export const Button = styled('button', {
  textAlign: 'center',
  padding: '$3',
  width: '100%',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: '$ignite500',
  color: '$white',
  marginTop: '$2',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$ignite300',
  },
})

export const Button1 = styled('button', {
  textAlign: 'center',
  padding: '$3',
  width: '75%',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: '$red500',
  color: '$white',
  margin: '$2 auto',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$red300',
  },
})

export const CheckboxContainer = styled('div', {
  display: 'flex',
  margin: 'auto',
  alignItems: 'center',
  gap: '$2',
})

export const CheckboxInput = styled('input', {
  width: 20,
  height: 20,
  cursor: 'pointer',
  accentColor: '$ignite500',
})

export const CheckInput = styled('input', {
  appearance: 'none',
  marginTop: '5px',
  width: '119px',
  height: '20',
  borderRadius: '$sm',
  border: '2px solid $gray500',
  backgroundColor: '$gray900',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    borderColor: '$gray300',
  },

  '&:checked': {
    backgroundColor: '$gray100',
    borderColor: '$gray100',
    position: 'relative',

    '&::after': {
      content: '""',
      display: 'block',
      width: 10,
      height: 10,
      backgroundColor: '$gray900',
      borderRadius: 2,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
})
