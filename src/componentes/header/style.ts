import { styled } from '@stitches/react'

export const HeaderContainer = styled('header', {
  width: '100%',
  background: '#1e1e1e',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  top: 0,
  left: 0,
  zIndex: 100,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
})

export const Logo = styled('h1', {
  fontSize: '24px',
  cursor: 'pointer',
})

export const Nav = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',

  a: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
})

export const SearchInput = styled('input', {
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #888',
  backgroundColor: '#333',
  color: 'white',
  width: '250px',

  '&::placeholder': {
    color: '#aaa',
  },
})

export const UserSection = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',

  button: {
    background: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
})

export const CartIconContainer = styled('div', {
  position: 'relative',
  cursor: 'pointer',
})

export const CartBadge = styled('span', {
  position: 'absolute',
  top: '-5px',
  right: '-10px',
  background: 'red',
  color: 'white',
  fontSize: '12px',
  fontWeight: 'bold',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const DropdownMenu = styled('div', {
  position: 'absolute',
  top: '50px',
  right: '30px',
  background: 'white',
  color: 'black',
  borderRadius: '5px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  width: '120px',
  display: 'none',
})

export const DropdownItem = styled('div', {
  padding: '8px',
  cursor: 'pointer',

  '&:hover': {
    background: '#f2f2f2',
  },
})
