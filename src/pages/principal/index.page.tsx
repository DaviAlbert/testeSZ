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
  Modal,
  ModalContent,
  ModalOverlay,
  Quantidade,
  Titulo,
  FinalizarCompra,
  CarrinhoContainer,
  Fechar,
  Backdrop,
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
  fotoPrincipal: string
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
  const [admin, setAdmin] = useState(false)
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
          setAdmin(true)
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

  const handleAddToCart = (produto: Produto) => {
    setSelectedProduct(produto)
    setModalVisible(true)
  }

  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return

    const validProduto = ProdutoSchema.safeParse(selectedProduct)

    if (!validProduto.success) {
      alert('Erro ao validar o produto!')
      console.error(validProduto.error)
      return
    }

    const userId = tokenObject.current.id

    try {
      const response = await fetch('/api/carrinho/adicionar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          produtoId: validProduto.data.id,
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
    } catch (error) {
      console.error('Erro na requisição:', error)
      alert('Erro ao adicionar produto ao carrinho.')
    }
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  // Ordena os produtos do mais barato para o mais caro e pega os dois primeiros produtos
  const produtosMaisBaratos = [...produtos]
    .sort((a, b) => a.preco - b.preco)
    .slice(0, 2)

  const produtosComMenosQuantidade = [...produtos]
    .sort((a, b) => a.quantidade - b.quantidade)
    .slice(0, 2)

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        toggleCart={toggleCart}
        Itens={produtosCarrinho.length}
        Admin={admin}
      />

      <Titulo>Ofertas especiais:</Titulo>
      <Container>
        <ProductList>
          {produtosMaisBaratos.map((produto) => (
            <ProductCard key={produto.id}>
              <Item onClick={() => handleClickProduto(produto.id)}>
                {produto.name}
              </Item>
              <ProductImage
                src={produto.fotoPrincipal}
                alt={produto.name}
                onClick={() => handleClickProduto(produto.id)}
              />
              <div onClick={() => handleClickProduto(produto.id)}>
                <Item>{produto.descricao}</Item>
                <Item>
                  Preço: R$ {produto.preco.toFixed(2).replace('.', ',')}
                </Item>
                <Item>Quantidade disponível: {produto.quantidade}</Item>
              </div>
              <AddToCartButton onClick={() => handleAddToCart(produto)}>
                Adicionar no carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductList>
      </Container>

      <Titulo>ultimas unidades:</Titulo>
      <Container>
        <ProductList>
          {produtosComMenosQuantidade.map((produto) => (
            <ProductCard key={produto.id}>
              <Item onClick={() => handleClickProduto(produto.id)}>
                {produto.name}
              </Item>
              <ProductImage
                src={produto.fotoPrincipal}
                alt={produto.name}
                onClick={() => handleClickProduto(produto.id)}
              />
              <div onClick={() => handleClickProduto(produto.id)}>
                <Item>{produto.descricao}</Item>
                <Item>
                  Preço: R$ {produto.preco.toFixed(2).replace('.', ',')}
                </Item>
                <Item>Quantidade disponível: {produto.quantidade}</Item>
              </div>
              <AddToCartButton onClick={() => handleAddToCart(produto)}>
                Adicionar no carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductList>
      </Container>

      {isCartOpen && (
        <>
          <Backdrop onClick={toggleCart} />
          <CarrinhoContainer>
            <Fechar onClick={toggleCart}>✖</Fechar>

            {produtosCarrinho.length > 0 ? (
              produtosCarrinho.map((produto, index) => (
                <Produto key={index}>
                  <div>
                    <h3 style={{ color: '#fff', marginBottom: '5px' }}>
                      {produto.name}
                    </h3>
                    <p>R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                    <p>Qtd: {produto.quantidade}</p>
                  </div>
                  <button>🗑️</button>
                </Produto>
              ))
            ) : (
              <p>Seu carrinho está vazio.</p>
            )}

            <FinalizarCompra>Finalizar Compra</FinalizarCompra>
          </CarrinhoContainer>
        </>
      )}

      {modalVisible && selectedProduct && (
        <ModalOverlay style={{ backgroundColor: '$gray800' }}>
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
              <div style={{ display: 'flex', gap: '5px' }}>
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
