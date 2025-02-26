import { useState, useEffect } from 'react'
import Footer from '../../../componentes/footer'
import Header from '../../../componentes/header'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import {
  AddToCartButton,
  Container,
  Label,
  ProductCard,
  SearchInput,
  ProductForm,
  Campo,
  CheckboxContainer,
  CheckboxInput,
} from './style'

export default function AddProduct() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // Verificar autenticação e permissão de admin
  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')
    if (tokenFromCookie) {
      try {
        const decodedToken = decodeURIComponent(tokenFromCookie)
        const tokenObject = JSON.parse(decodedToken)

        if (tokenObject.admin) {
          setIsAdmin(true)
        } else {
          router.push('/catalogo')
        }
        if (tokenObject.id) {
          setIsLoggedIn(true)
          setUserName(tokenObject.name || 'Usuário')
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error)
      }
    } else {
      router.push('/login')
    }
  }, [router])

  // Envio do formulário para o banckend, na rota 'api/cadastro'
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setLoading(true)

    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nome, email, senha, admin }),
      })
      console.log(response)

      if (response.ok) {
        alert('Usuario adicionado com sucesso!')
        setNome('')
        setEmail('')
        setSenha('')
        setAdmin(false)
        router.push('/catalogo')
      } else {
        const errorData = await response.json()
        alert(`Erro: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      alert('Erro ao adicionar o usuario. Tente novamente.')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        toggleCart={() => {}}
        Itens={-1}
      />
      <Container>
        <h2>Adicionar Novo Produto</h2>
        <ProductCard>
          <ProductForm onSubmit={handleSubmit}>
            <Campo>
              <label htmlFor="nome">Nome do Produto:</label>
              <SearchInput
                type="text"
                id="nome"
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="email">Email:</label>
              <SearchInput
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="senha">Senha:</label>
              <SearchInput
                type="number"
                id="senha"
                onChange={(e) => setSenha(e.target.value)}
                min="1"
                required
              />
            </Campo>

            <CheckboxContainer>
              <CheckboxInput
                type="checkbox"
                checked={admin}
                onChange={(e) => setAdmin(e.target.checked)}
              />
              <Label>Admin</Label>
            </CheckboxContainer>

            <div>
              <AddToCartButton type="submit" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar Usuario'}
              </AddToCartButton>
            </div>
          </ProductForm>
        </ProductCard>
      </Container>
      <Footer />
    </>
  )
}
