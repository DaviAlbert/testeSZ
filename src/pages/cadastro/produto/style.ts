import { styled } from '@ignite-ui/react'

export const Container = styled('div', {
  marginTop:'100px',
  marginLeft: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '$6',
  gap: '$6',
})

export const Campo = styled('div', {
  marginTop: '20px',
  width: '100%',
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

export const CheckInput = styled('input', {
  display: 'none',
  marginTop: '5px',
  width: '119px',
  height: '20',
  borderRadius: '$sm',
  border: '2px solid $gray500',
  backgroundColor: '$gray900',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',

  '&:hover': {
    borderColor: '$gray300',
  },

  '&:checked': {
    backgroundColor: '$gray100',
    borderColor: '$gray100',
    position: 'relative',

    '&::after': {
      content: '""',
      display: 'block',
      width: 10,
      height: 10,
      backgroundColor: '$gray900',
      borderRadius: 2,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
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
  overflow: 'hidden',
})

export const ProductForm = styled('form', {
  width: '100%',
})

export const ProductImage = styled('img', {
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
  margin: '5px auto',
  border: '2px solid $gray500',
  padding: '5px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',

  '&:hover': {
    transform: 'scale(1.05)',
  },
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
  marginTop: '40px',

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

export const QuantidadeContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

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
    borderRadius: '$sm',
  },

  '& div': {
    flexGrow: 1,
  },

  '& button': {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '$ignite500',

    '&:hover': {
      color: '$ignite300',
    },
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

export const UploadButton = styled('label', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '50%',
  padding: '10px 16px',
  margin: 'auto',
  backgroundColor: '$ignite500',
  color: '$gray100',
  fontSize: '$md',
  fontWeight: 'bold',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.3s ease-in-out',
  boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',

  '&:hover': {
    backgroundColor: '$ignite300',
  },

  '& input': {
    display: 'none',
  },
})
