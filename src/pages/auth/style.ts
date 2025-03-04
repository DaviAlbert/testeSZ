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
  },
})

export const Campo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const Label = styled('div', {
  borderBottom: '2px solid $gray900',
  width: '35%',
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
  boxShadow: '-2px 0px 10px rgba(0, 0, 0, 0.2)',

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
  border: 'none',
  borderRadius: '$sm',
  fontSize: '$md',
  backgroundColor: 'rgb(120, 149, 182)',
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
  alignItems: 'center',
  gap: '$2',
})

export const CheckboxInput = styled('input', {
  width: 20,
  height: 20,
  cursor: 'pointer',
  accentColor: '$ignite500',
})
