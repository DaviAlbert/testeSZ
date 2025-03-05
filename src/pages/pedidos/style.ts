import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  padding: '$6',
  display: 'flex',
  gap: '$5',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
})

export const PedidoList = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '$4',
})

export const THead = styled('thead', {
  backgroundColor: '$gray800',
})

export const Th = styled('th', {
  padding: '$3',
  fontSize: '$md',
  color: '$gray100',
  textAlign: 'left',
  borderBottom: '2px solid $gray600',
})

export const TBody = styled('tbody', {})

export const Tr = styled('tr', {
  borderBottom: '1px solid $gray600',
})

export const Td = styled('td', {
  padding: '$3',
  fontSize: '$sm',
  color: '$gray100',
  borderBottom: '1px solid $gray600',
})

export const ProdutoList = styled('ul', {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const ProdutoItem = styled('li', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '$gray700',
  padding: '$2',
  borderRadius: '$sm',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
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
  fontSize: '$sm',
})

export const ProdutoQuantidade = styled('span', {
  color: '$ignite500',
  fontWeight: 'bold',
})

export const PedidoInfo = styled('div', {
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '$gray700',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  marginTop: '$4',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
})

export const PedidoHeader = styled('h2', {
  color: '$ignite500',
  fontSize: '$lg',
  fontWeight: 'bold',
  marginBottom: '$2',
})

export const PedidoDate = styled('span', {
  fontSize: '$sm',
  color: '$gray300',
})

export const ProdutoImage = styled('img', {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '$sm',
  marginRight: '$3',
  border: '1px solid $gray600',
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
  marginTop: '$4',
  cursor: 'pointer',
  transition: 'background 0.2s',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  
  '&:hover': {
    backgroundColor: '$ignite300',
  },
})
