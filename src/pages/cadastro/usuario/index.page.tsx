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
  Input,
  ProductForm,
  Campo,
  CheckboxContainer,
  CheckboxInput,
  Button,
  CheckInput,
} from './style'

export default function AddProduct() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [imagemBase64, setImagemBase64] = useState<string>('')
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

  // Função para converter imagem em Base64 (somente uma)
  const convertImageToBase64 = (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setImagemBase64(reader.result as string)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const fileType = file.type

      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        convertImageToBase64(file)
      } else {
        alert('Por favor, selecione uma imagem nos formatos JPEG ou PNG.')
        event.target.value = '' // Reseta o campo de input
      }
    } else {
      console.log('Nenhum arquivo selecionado')
    }
  }

  // Validação e envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const usuarioData = {
      name: nome,
      email,
      senha,
      admin,
      telefone,
      imagemBase64,
      nascimento,
    }
    console.log(usuarioData)
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
              <Label>Nome:</Label>
              <Input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Campo>
            <Campo>
              <Label>Email:</Label>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Campo>
            <Campo>
              <Label>Telefone:</Label>
              <Input
                type="text"
                placeholder="Digite seu Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </Campo>
            <Campo>
              <Label>Data De Nascimento:</Label>
              <Input
                type="date"
                placeholder="Digite sua data de nascimento"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
              />
            </Campo>
            <Campo>
              <Label>Senha:</Label>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </Campo>
            <Campo>
              <label htmlFor="imagens">Imagem do Perfil:</label>
              <CheckInput
                type="file"
                id="imagens"
                accept="image/*"
                onChange={handleImageChange}
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
            {message && <p>{message}</p>}
            <div>
              <AddToCartButton type="submit" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar Usuário'}
              </AddToCartButton>
            </div>
          </ProductForm>
        </ProductCard>
      </Container>
      <Footer />
    </>
  )
}
