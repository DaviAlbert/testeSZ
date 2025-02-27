import { useState, useEffect } from 'react'
import Footer from '../../../componentes/footer'
import Header from '../../../componentes/header'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { CadastroSchema } from '../../../componentes/schema/schemas'
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
  const [message, setMessage] = useState('')

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

  // Validação e envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const usuarioData = { nome, email, senha, admin }

    // Validar os dados antes de enviar
    const validacao = CadastroSchema.safeParse(usuarioData)

    if (!validacao.success) {
      console.error('Erro na validação:', validacao.error)
      setMessage(validacao.error.errors[0]?.message || 'Erro nos dados.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validacao.data),
      })

      if (response.ok) {
        alert('Usuário adicionado com sucesso!')
        setNome('')
        setEmail('')
        setSenha('')
        setAdmin(false)
        router.push('/catalogo')
      } else {
        const errorData = await response.json()
        setMessage(`Erro: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      setMessage('Erro ao adicionar o usuário. Tente novamente.')
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
        Admin={isAdmin}
      />
      <Container>
        <h2>Adicionar Novo Usuário</h2>
        <ProductCard>
          <ProductForm onSubmit={handleSubmit}>
            <Campo>
              <label htmlFor="nome">Nome:</label>
              <SearchInput
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="email">Email:</label>
              <SearchInput
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="senha">Senha:</label>
              <SearchInput
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
                {loading ? 'Adicionando...' : 'Adicionar Usuário'}
              </AddToCartButton>
            </div>
          </ProductForm>
          {message && <p>{message}</p>}
        </ProductCard>
      </Container>
      <Footer />
    </>
  )
}
