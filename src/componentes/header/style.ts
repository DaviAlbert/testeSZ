import { styled } from '@stitches/react'

export const HeaderContainer = styled('header', {
  position: 'fixed',
  width: '100%',
  background: '#1e1e1e',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  top: 0,
  left: 0,
  zIndex: 100,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',

  div: {
    display: 'flex',
  },

  h3: {
    marginTop: '5px',
    fontSize: '32px',

    '&:hover': {
      opacity: '0.5',
    },
  },

  '@media (max-width: 768px)': {
    flexDirection: 'column',
    padding: '25px 30px',
    textAlign: 'center',
    gap: '20px',
  },
})

export const Logo = styled('h1', {
  fontSize: '32px',
  cursor: 'pointer',

  '@media (max-width: 600px)': {
    fontSize: '26px',
  },
})

export const SearchInput = styled('input', {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #888',
  backgroundColor: '#696969',
  color: 'white',
  width: '280px',

  '&::placeholder': {
    color: '#aaa',
  },

  '@media (max-width: 768px)': {
    width: '70%',
  },

  '@media (max-width: 500px)': {
    width: '85%',
  },
})

export const UserSection = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '60px',
  fontSize: '20px',

  div: {
    cursor: 'pointer',
  },

  p: {
    cursor: 'pointer',
  },

  '@media (max-width: 768px)': {
    flexDirection: 'column',
    gap: '15px',
    fontSize: '18px',

    button: {
      width: '100%',
    },
  },

  '@media (max-width: 500px)': {
    fontSize: '16px',
    gap: '20px',
  },
})

export const CartIconContainer = styled('div', {
  position: 'relative',
  cursor: 'pointer',

  '@media (max-width: 600px)': {
    marginTop: '15px',
  },
})

export const CartBadge = styled('span', {
  position: 'absolute',
  top: '-5px',
  right: '-10px',
  background: 'red',
  color: 'white',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const DropdownMenu = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '60px',
  position: 'absolute',
  right: '6%',
  background: '$gray600',
  color: 'black',
  borderRadius: '6px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '12px',
  zIndex: 200,

  variants: {
    isOpen: {
      true: { display: 'block' },
      false: { display: 'none' },
    },
  },

  '@media (max-width: 768px)': {
    top: '26%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
  },
  '@media (max-width: 600px)': {
    top: '28%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
  },
})


export const DropdownItem = styled('button', {
  background: '$ignite500',
  width: '100%',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius: '6px',
  textAlign: 'center',
  fontSize: '18px',
  margin: '5px auto',

  '&:hover': {
    opacity: '0.8',
  },
})

export const LogoHeader = styled('img', {
  width: '45px',
  height: '45px',
  marginRight: '12px',

  '@media (max-width: 600px)': {
    width: '35px',
    height: '35px',
  },
})
