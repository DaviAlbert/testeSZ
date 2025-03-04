import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  display: 'flex',
  margin: 'auto',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '$6',
  gap: '$6',
})

export const Image = styled('img', {
  maxWidth: '200px',
  maxHeight: '500px',
  borderRadius: '8px',
  margin: 'auto',
})

export const Button = styled('button', {
  textAlign: 'center',
  padding: '$3',
  width: '100%',
  border: 'none',
  borderRadius: '$sm',
  fontSize: '25px',
  backgroundColor: '$ignite500',
  color: '$white',
  marginTop: '$2',
  cursor: 'pointer',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$ignite300',
  },
})

export const TextArea = styled('textarea', {
  width: '100%',
  height: '100px',
  padding: '8px',
  margin: '5px 0',
})

export const Input = styled('input', {
  textAlign: 'center',
  color: '$gray200',
  backgroundColor: '$gray700',
  boxShadow: '-2px 0px 10px rgba(0, 0, 0, 0.2)',
  width: '100%',
  padding: '8px',
  margin: '5px 0',
  resize: 'none',
  boxSizing: 'border-box',
  border: 'none',
  borderRadius: '4px',
  fontSize: '25px',
  outline: 'none',
  '&:focus': {
    borderColor: '#007bff',
  },
})