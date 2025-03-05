import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  padding: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
})

export const PedidoHeader = styled('h1', {
  fontSize: '$xl',
  fontWeight: 'bold',
  color: '$ignite500',
  marginBottom: '$4',
})

export const PedidoInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  marginTop: '$4',
  padding: '$4',
  backgroundColor: '$gray800',
  borderRadius: '$lg',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
})

export const PedidoDate = styled('span', {
  fontSize: '$md',
  color: '$gray300',
})

export const ProdutoList = styled('ul', {
  listStyle: 'none',
  padding: 0,
  marginTop: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const ProdutoItem = styled('li', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '$gray700',
  padding: '$4',
  borderRadius: '$sm',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background 0.2s',

  '&:hover': {
    backgroundColor: '$gray600',
  },
})

export const ProdutoImage = styled('img', {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '$sm',
  border: '1px solid $gray600',
  marginRight: '$4',
})

export const ProdutoInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const ProdutoName = styled('span', {
  fontWeight: 'bold',
  color: '$gray100',
})

export const ProdutoPreco = styled('span', {
  color: '$gray400',
  display: 'flex',
  fontSize: '$sm',

  p:{
    marginRight: '5px',
    color:'$gray200',
  }
})

export const ProdutoQuantidade = styled('span', {
  color: '$ignite500',
  fontWeight: 'bold',
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
  marginTop: '$6',
  cursor: 'pointer',
  transition: 'background 0.2s',
  
  '&:hover': {
    backgroundColor: '$ignite300',
  },
})
