import { styled, keyframes } from '@ignite-ui/react'

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '$6',
  gap: '$6',
  textAlign:'center',
  maxWidth: '1200px',
  margin: '0 auto',
})

export const SearchInput = styled('input', {
  width: '100%',
  maxWidth: '400px',
  padding: '$3',
  fontSize: '$md',
  borderRadius: '$md',
  border: '1px solid $gray500',
  backgroundColor: '$gray800',
  color: '$gray100',
  transition: 'border-color 0.3s, box-shadow 0.3s',

  '&::placeholder': {
    color: '$gray400',
  },

  '&:focus': {
    borderColor: '$ignite500',
    boxShadow: '0 0 5px rgba(255, 87, 34, 0.6)',
    outline: 'none',
  },
})

export const ProductList = styled('div', {
  backgroundColor: '$gray700',
  padding: '$6',
  borderRadius: '8px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '$6',
  width: '100%',
  maxWidth: '1160px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
})

export const ProductCard = styled('div', {
  backgroundColor: '$gray900',
  padding: '$4',
  borderRadius: '$md',
  textAlign: 'center',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
  width: '100%',
  maxWidth: '300px',
  margin: 'auto',
  transition: 'transform 0.3s, box-shadow 0.3s',

  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
  },
})

export const ProductImage = styled('img', {
  width: '100%',
  height: 'auto',
  borderRadius: '$md',
  marginBottom: '$4',
  cursor: 'pointer',
  transition: 'transform 0.3s',

  '&:hover': {
    transform: 'scale(1.1)',
  },
})

export const Item = styled('div', {
  marginTop: '10px',
  fontSize: '20px',
  color: '$gray300',
  cursor: 'pointer',
  transition: 'color 0.3s',

  '&:hover': {
    color: '$gray100',
  },
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

export const Backdrop = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.6)',
  zIndex: 9,
  backdropFilter: 'blur(3px)',
})

const slideIn = keyframes({
  '0%': { transform: 'translateX(100%)' },
  '100%': { transform: 'translateX(0)' },
});

export const CarrinhoContainer = styled('div', {
  marginTop: '80px',
  background: '$gray800',
  position: 'fixed',
  top: 0,
  right: 0,
  width: '350px',
  height: '86%',
  padding: '20px',
  boxShadow: '-2px 0px 10px rgba(0, 0, 0, 0.2)',
  zIndex: 10,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  animation: `${slideIn} 0.3s ease-out`,
  overflowX: 'hidden',
  borderRadius: '0 0 8px 8px',
});

export const Fechar = styled('button', {
  fontSize: '24px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  position: 'absolute',
  top: '10px',
  right: '15px',
  color: '$gray300',

  '&:hover': {
    color: '$gray100',
  },
})

export const Produto = styled('div', {
  display: 'flex', // Usando flex para alinhar imagem e conteúdo
  alignItems: 'center', // Alinha o conteúdo verticalmente
  marginBottom: '15px',
  borderBottom: '1px solid #ddd',
  paddingBottom: '10px',

  '& img': {
    width: '100px', // Tamanho da imagem à esquerda
    height: '100px', // Tamanho da imagem à esquerda
    objectFit: 'cover', // Garante que a imagem cubra bem o espaço
    marginRight: '20px', // Espaço entre a imagem e o conteúdo
    borderRadius: '$sm',
  },

  '& div': {
    flexGrow: 1, // Faz com que o conteúdo ocupe o restante do espaço
    textAlign: 'left', // Alinha o texto à esquerda
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
});

export const ProdutoInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '10px',

  '& h3': {
    marginBottom: '10px',
    color: '#fff',
  },

  '& p': {
    marginBottom: '5px',
    color: '#fff',
  },

  '& p:last-child': {
    marginBottom: '0',
  },
});

export const FinalizarCompra = styled('button', {
  width: '100%',
  padding: '12px',
  background: 'green',
  color: 'white',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
  borderRadius: '8px',
  fontWeight: 'bold',
  transition: 'background 0.3s',

  '&:hover': {
    background: 'darkgreen',
  },
})

export const QuantidadeContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

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

export const Nav = styled('nav', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  marginTop: '5px',
})

export const Titulo = styled('h2', {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '$gray100',
  textAlign: 'center',
  width: '100%',
  marginTop: '10px',
})

export const QuantidadeCarinho = styled('input', {
  backgroundColor: '$gray600',
  color: '$gray200',
  display: 'flex',
  fontSize: '20px',
  width: '20%',
  textAlign: 'center',
  height: '10%',
  padding: '3px',
  margin: '5px',
  borderRadius: '5px',
  border: 'none',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
})

export const Adicionado = styled('div', {
  display:'flex',
})