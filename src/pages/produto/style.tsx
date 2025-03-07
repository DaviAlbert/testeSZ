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

export const ModalOverlay = styled('div', {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backdropFilter: 'blur(3px)',
})

export const Modal = styled('div', {
  background: '$gray800',
  padding: '20px',
  borderRadius: '8px',
  width: '320px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
})

export const ModalContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'center',
})

export const ModalInput = styled('input', {
  width: '120px',
  padding: '10px',
  textAlign: 'center',
  borderRadius: '5px',
  border: '1px solid $gray500',
})

export const AddToCartButton = styled('button', {
  backgroundColor: '$ignite500',
  color: '$gray100',
  padding: '$3 $5',
  fontSize: '$md',
  borderRadius: '$md',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.2s',
  marginTop: '5px',

  '&:hover': {
    backgroundColor: '$ignite300',
    transform: 'scale(1.05)',
  },
})

export const Quantidade = styled('input', {
  backgroundColor: '$gray600',
  display: 'flex',
  width: '50px',
  padding: '10px',
  margin: '5px auto',
  borderRadius: '5px',
  border: 'none',
  textAlign: 'center',
  fontSize: '$md',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
})