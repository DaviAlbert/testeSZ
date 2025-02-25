import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  marginLeft: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '$6',
  gap: '$6',
})

export const SearchInput = styled('input', {
  width: '100%',
  maxWidth: 400,
  padding: '$2',
  fontSize: '$md',
  borderRadius: '$sm',
  border: '1px solid $gray500',
  backgroundColor: '$gray900',
  color: '$gray100',

  '&::placeholder': {
    color: '$gray400',
  },
})

export const ProductList = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '$6',
  width: '100%',
  maxWidth: 1160,
})

export const ProductCard = styled('div', {
  display: 'flex',
  backgroundColor: '$gray900',
  padding: '$4',
  borderRadius: '$md',
  textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  width: '50%',
  margin: 'auto',
})

export const ProductImage = styled('img', {
  width: '75%',
  height: 'auto',
  borderRadius: '$md',
  marginBottom: '$4',
  marginTop: '10px',
  cursor: 'pointer',
})

export const Item = styled('div', {
  marginTop: '10px',
  fontSize: '20px',
  color: '$gray400',
  cursor: 'pointer',
})

export const AddToCartButton = styled('button', {
  backgroundColor: '$ignite500',
  color: '$gray100',
  padding: '$2 $4',
  fontSize: '$md',
  borderRadius: '$sm',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
  marginTop: '5px',

  '&:hover': {
    backgroundColor: '$ignite300',
  },
})

export const Carrinho = styled('div', {
  backgroundColor: '$gray900',
  position: 'fixed',
  width: '25%',
  height: '75%',
  right: '0',
  borderRadius: '5px 0px 0px 5px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '10px',

  '&:hover': {
    width: '30%',
  },
})

export const Produto = styled('div', {
  backgroundColor: '$gray700',
  display: 'flex',
  width: '90%',
  padding: '10px',
  borderRadius: '8px',
  margin: '10px',
  textAlign: 'justify',
  justifyContent: 'space-between',
})

export const Quantidade = styled('input', {
  backgroundColor: '$gray600',
  display: 'flex',
  width: '30%',
  padding: '10px',
  margin: '5px auto',
  borderRadius: '5px',
  border: 'none',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
})

export const ModalOverlay = styled('div', {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const Modal = styled('div', {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
})

export const ModalContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'center',
})

export const ModalInput = styled('input', {
  width: '100px',
  padding: '8px',
  textAlign: 'center',
})
