import { styled } from '@ignite-ui/react'
import { motion } from 'framer-motion'

export const Container = styled('div', {
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
  backgroundColor: '$gray700',
  padding: '10px',
  borderRadius: '8px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '$6',
  width: '100%',
  maxWidth: 1160,
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
})

export const ProductCard = styled('div', {
  backgroundColor: '$gray900',
  padding: '$4',
  borderRadius: '$md',
  textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
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

export const Backdrop = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9,
})

export const CarrinhoContainer = styled('div', {
  background: '$gray800',
  position: 'fixed',
  top: 0,
  right: 0,
  width: '350px',
  height: '100vh',
  padding: '20px',
  boxShadow: '-2px 0px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 10,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
})

export const Fechar = styled('button', {
  fontSize: '24px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  position: 'absolute',
  top: '10px',
  right: '15px',
})

export const Produto = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '15px',
  borderBottom: '1px solid #ddd',
  paddingBottom: '10px',

  '& img': {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    marginRight: '10px',
  },

  '& div': {
    flexGrow: 1,
  },

  '& button': {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
})

export const FinalizarCompra = styled('button', {
  width: '100%',
  padding: '10px',
  background: 'green',
  color: 'white',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
  borderRadius: '5px',

  '&:hover': {
    background: 'darkgreen',
  },
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
  background: '$gray800',
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

export const Nav = styled('nav', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  marginTop: '5px',

  a: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
})

export const Titulo = styled('h2', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  marginTop: '5px',

  a: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
})
