import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import FadeIn from 'react-fade-in'
import Cookies from 'js-cookie'
import {
  AddToCartButton,
  Container,
  ProductCard,
  ProductImage,
  ProductList,
  Item,
  Carrinho,
  Produto,
  Modal,
  ModalContent,
  ModalOverlay,
  Quantidade,
} from './style'
import Header from '../../componentes/header'
import Footer from '../../componentes/footer'

export interface Produto {
  id: string
  name: string
  descricao: string
  preco: string
  imagens: { url: string }[]
}

interface ProdutoCarrinho {
  name: string
  quantidade: number
  preco: number
}

export default function Home() {
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [quantidades, setQuantidades] = useState<number[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [produtosCarrinho, setProdutosCarrinho] = useState<ProdutoCarrinho[]>(
    [],
  )
  const [isCartOpen, setIsCartOpen] = useState(false) // Estado para controlar a visibilidade do carrinho
  const tokenObject = useRef<{ admin?: boolean; id?: string; name?: string }>(
    {},
  )

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')

    if (tokenFromCookie) {
      const decodedToken = decodeURIComponent(tokenFromCookie)
      tokenObject.current = JSON.parse(decodedToken)
      console.log(tokenObject)
    }
    if (tokenObject.current.id) {
      setIsLoggedIn(true)
      setUserName(tokenObject.current.name || 'Usuário')
    }
  }, [])

  useEffect(() => {
    if (tokenObject.current.id) {
      const fetchCarrinho = async () => {
        const response = await fetch(`/api/carrinho/${tokenObject.current.id}`)
        const data = await response.json()

        if (data.produtos) {
          setProdutosCarrinho(data.produtos)
        }
      }

      fetchCarrinho()
    }
  }, [tokenObject.current])

  useEffect(() => {
    const fetchProdutos = async () => {
      const response = await fetch('/api/produtos')
      const data = await response.json()
      setProdutos(data)
      setQuantidades(new Array(data.length).fill(1))
    }

    fetchProdutos()
  }, [])

  const handleClickProduto = (id: string) => {
    router.push(`/produto/${id}`)
  }

  const handleAddToCart = (produto: Produto) => {
    setSelectedProduct(produto)
    setModalVisible(true)
  }

  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return
    const userId = tokenObject.current.id

    const response = await fetch('/api/carrinho/adicionar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        produtoId: selectedProduct.id,
        quantidade: selectedQuantity,
      }),
    })

    if (response.ok) {
      alert('Produto adicionado ao carrinho!')
      setModalVisible(false)
    } else {
      const errorData = await response.json()
      alert(
        `Erro ao adicionar produto ao carrinho: ${
          errorData.error || 'Erro desconhecido'
        }`,
      )
    }
  }

  // Função para alternar a visibilidade do carrinho
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        toggleCart={toggleCart}
      />

      {isCartOpen && (
        <FadeIn>
          <Carrinho>
            {produtosCarrinho.length > 0 ? (
              produtosCarrinho.map((produto, index) => (
                <Produto key={index}>
                  <h2 style={{ color: '$gray200', margin: 'auto 0px' }}>
                    {produto.name}
                  </h2>
                  <p style={{ margin: 'auto 0px' }}>
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </p>
                  <p style={{ margin: 'auto 0px' }}>
                    Quantidade: {produto.quantidade}
                  </p>
                </Produto>
              ))
            ) : (
              <p>Seu carrinho está vazio.</p>
            )}
            <AddToCartButton>Comprar</AddToCartButton>
          </Carrinho>
        </FadeIn>
      )}

      <Container>
        <ProductList>
          {produtos.map((produto, index) => (
            <ProductCard key={produto.id}>
              <Item onClick={() => handleClickProduto(produto.id)}>
                {produto.name}
              </Item>
              {produto.imagens.length > 0 && (
                <ProductImage
                  src={produto.imagens[0].url}
                  alt={produto.name}
                  onClick={() => handleClickProduto(produto.id)}
                />
              )}
              <div onClick={() => handleClickProduto(produto.id)}>
                <Item>{produto.descricao}</Item>
                <Item>Preço: {produto.preco}</Item>
                <Item>Quantidade disponível: {quantidades[index]}</Item>
              </div>
              <AddToCartButton onClick={() => handleAddToCart(produto)}>
                Adicionar no carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductList>
      </Container>

      {modalVisible && selectedProduct && (
        <ModalOverlay>
          <Modal>
            <ModalContent>
              <h3>{`Escolha a quantidade de ${selectedProduct.name}`}</h3>
              <Quantidade
                type="number"
                min="1"
                max={quantidades[produtos.indexOf(selectedProduct)]}
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
              />
              <div>
                <AddToCartButton onClick={() => setModalVisible(false)}>
                  Cancelar
                </AddToCartButton>
                <AddToCartButton onClick={handleConfirmAddToCart}>
                  Confirmar
                </AddToCartButton>
              </div>
            </ModalContent>
          </Modal>
        </ModalOverlay>
      )}
      <Footer />
    </>
  )
}
