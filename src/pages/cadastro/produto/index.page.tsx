import { useState, useEffect } from 'react'
import Footer from '../../../componentes/footer'
import Header from '../../../componentes/header'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { AddToCartButton, Container, Item, ProductCard, SearchInput } from './style'

export default function AddProduct() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [preco, setPreco] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)

  const router = useRouter()

  // Função para verificar se o usuário é admin
  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')
    if (tokenFromCookie) {
      const decodedToken = decodeURIComponent(tokenFromCookie)
      const tokenObject = JSON.parse(decodedToken)

      if (tokenObject.admin) {
        setIsAdmin(true)
      }

      if (tokenObject.id) {
        setIsLoggedIn(true)
        setUserName(tokenObject.name || 'Usuário')
      }
    } else {
      router.push('/login') // Redireciona para login caso não esteja logado
    }
  }, [router])

  // Função para lidar com a mudança da foto
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImagem(event.target.files[0])
    }
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Garantir que todos os campos obrigatórios estejam preenchidos
    if (!nome || !quantidade || !preco || !imagem) {
      alert('Todos os campos devem ser preenchidos!')
      return
    }

    const formData = new FormData()
    formData.append('nome', nome)
    formData.append('quantidade', quantidade.toString())
    formData.append('preco', preco)
    formData.append('imagem', imagem)

    // Enviar os dados para a API (backend)
    const response = await fetch('/api/adicionar-produto', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      alert('Produto adicionado com sucesso!')
      // Após adicionar o produto, pode redirecionar para a lista de produtos ou limpar o formulário
      setNome('')
      setQuantidade(1)
      setPreco('')
      setImagem(null)
      router.push('/produtos') // Redireciona para a lista de produtos
    } else {
      const errorData = await response.json()
      alert(`Erro: ${errorData.error || 'Erro desconhecido'}`)
    }
  }

  // Se não for admin ou não estiver logado, redireciona ou exibe mensagem
  if (!isLoggedIn) {
    return <p>Você precisa estar logado para acessar essa página.</p>
  }

  if (!isAdmin) {
    return <p>Você não tem permissão para acessar esta página.</p>
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} userName={userName} toggleCart={() => {}} />
      <Container>
        <h2>Adicionar Novo Produto</h2>
        <ProductCard>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome">Nome do Produto:</label>
            <SearchInput
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="quantidade">Quantidade:</label>
            <SearchInput
              type="number"
              id="quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="preco">Preço:</label>
            <SearchInput
              type="text"
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="imagem">Imagem do Produto:</label>
            <SearchInput
              type="file"
              id="imagem"
              onChange={handleImageChange}
              required
            />
          </div>
          <div>
            <AddToCartButton type="submit">Adicionar Produto</AddToCartButton>
          </div>
        </form>
      </ProductCard>
      </Container>
      <Footer />
    </>
  )
}
