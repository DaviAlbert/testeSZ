import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import FadeIn from 'react-fade-in'
import Cookies from 'js-cookie'
import { z } from 'zod'
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
  Nav,
  SearchInput,
} from './style'
import Header from '../../componentes/header'
import Footer from '../../componentes/footer'
import { ProdutoSchema, TokenSchema } from '../../componentes/schema/schemas'

export interface Produto {
  id: string
  name: string
  descricao: string
  preco: number
  quantidade: number
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
  const [produtoPesquisa, setProdutoPesquisa] = useState('')
  const [quantidades, setQuantidades] = useState<number[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [produtosCarrinho, setProdutosCarrinho] = useState<ProdutoCarrinho[]>(
    [],
  )
  const [isCartOpen, setIsCartOpen] = useState(false)
  const tokenObject = useRef<{ admin?: boolean; id?: string; name?: string }>(
    {},
  )

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')

    if (tokenFromCookie) {
      try {
        const decodedToken = JSON.parse(decodeURIComponent(tokenFromCookie))
        const parsedToken = TokenSchema.safeParse(decodedToken)

        if (parsedToken.success) {
          tokenObject.current = parsedToken.data
          setIsLoggedIn(true)
          setUserName(parsedToken.data.name || 'Usuário')
        } else {
          console.error('Token inválido:', parsedToken.error)
          router.push('/')
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error)
        router.push('/')
      }
    } else {
      router.push('/')
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
      try {
        const response = await fetch('/api/produtos')
        const data = await response.json()

        const parsedProdutos = z.array(ProdutoSchema).safeParse(data)

        if (parsedProdutos.success) {
          setProdutos(parsedProdutos.data)
          setQuantidades(
            parsedProdutos.data.map((produto) => produto.quantidade),
          )
        } else {
          console.error('Erro ao validar produtos:', parsedProdutos.error)
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }
    fetchProdutos()
  }, [])

  const handleClickProduto = (id: string) => {
    router.push(`/produto/${id}`)
  }

  const AdicionarProduto = () => {
    router.push(`/cadastro/produto`)
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

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  // Filtra os produtos com base no nome, descrição e preço
  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.name.toLowerCase().includes(produtoPesquisa.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(produtoPesquisa.toLowerCase()) ||
      String(produto.preco)
        .toLowerCase()
        .includes(produtoPesquisa.toLowerCase()),
  )

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        toggleCart={toggleCart}
        Itens={produtosCarrinho.length}
        Admin={tokenObject.current.admin ?? false}
      />

      <Nav>
        <a href="/">PRODUTOS</a>
        <SearchInput
          type="text"
          placeholder="Pesquise produtos..."
          value={produtoPesquisa}
          onChange={(e) => setProdutoPesquisa(e.target.value)}
        />
      </Nav>

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
          {filteredProdutos.map((produto, index) => (
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
                <Item>Quantidade disponível: {produto.quantidade}</Item>
              </div>
              <AddToCartButton onClick={() => handleAddToCart(produto)}>
                Adicionar no carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductList>
        {tokenObject.current.admin ?? (
          <AddToCartButton onClick={() => AdicionarProduto()}>
            Criar novo Produto
          </AddToCartButton>
        )}
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
