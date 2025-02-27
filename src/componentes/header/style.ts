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

  div: {
    display: 'flex',
  },

  h3: {
    marginTop: '3px',

    '&:hover': {
      opacity: '0.5',
    },
  },
})

export const Logo = styled('h1', {
  fontSize: '24px',
  cursor: 'pointer',
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

  div: {
    cursor: 'pointer',
  },

  p: {
    cursor: 'pointer',
  },

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
  display: 'flex',
  flexDirection: 'column',
  marginTop: '50px',
  position: 'absolute',
  top: '1%',
  right: '1.5%',
  background: '$gray600',
  color: 'black',
  borderRadius: '5px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  zIndex: 200,

  variants: {
    isOpen: {
      true: { display: 'block' },
      false: { display: 'none' },
    },
  },
})

export const DropdownItem = styled('button', {
  display: 'flex',
  padding: '8px',
  backgroundColor: 'red',
  cursor: 'pointer',
  margin: '5px auto',

  '&:hover': {
    opacity: '0.8',
  },
})

export const LogoHeader = styled('img', {
  width: '30px',
  height: 'auto',
})
