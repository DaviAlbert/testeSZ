import { useState, useEffect } from 'react'
import Footer from '../../../componentes/footer'
import Header from '../../../componentes/header'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { ProdutoSchema } from '../../../componentes/schema/schemas'
import {
  AddToCartButton,
  Container,
  CheckInput,
  ProductCard,
  SearchInput,
  ProductForm,
  Campo,
} from './style'

export default function AddProduct() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [preco, setPreco] = useState('')
  const [fotoPrincipal, setFotoPrincipal] = useState<File | null>(null)
  const [fotoPrincipalBase64, setFotoPrincipalBase64] = useState<string | null>(
    null,
  )
  const [fotosOpcionais, setFotosOpcionais] = useState<File[]>([])
  const [fotosOpcionaisBase64, setFotosOpcionaisBase64] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')
    if (tokenFromCookie) {
      try {
        const decodedToken = decodeURIComponent(tokenFromCookie)
        const tokenObject = JSON.parse(decodedToken)

        if (tokenObject.admin) setIsAdmin(true)
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

  // Função para converter imagem para Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Foto principal
  const handleFotoPrincipalChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setFotoPrincipal(file)

      try {
        const base64 = await convertToBase64(file)
        setFotoPrincipalBase64(base64)
      } catch (error) {
        console.error('Erro ao converter imagem para Base64:', error)
      }
    }
  }

  // Fotos opcionais
  const handleFotosOpcionaisChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files)

      if (fileArray.length + fotosOpcionais.length > 3) {
        setMessage('Você pode adicionar no máximo 3 fotos opcionais.')
        return
      }

      setMessage('')

      try {
        const base64Images = await Promise.all(
          fileArray.map((file) => convertToBase64(file)),
        )
        setFotosOpcionais([...fotosOpcionais, ...fileArray])
        setFotosOpcionaisBase64([...fotosOpcionaisBase64, ...base64Images])
      } catch (error) {
        console.error('Erro ao converter imagens opcionais para Base64:', error)
      }
    }
  }

  // Envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    if (!fotoPrincipalBase64) {
      setMessage('A foto principal é obrigatória.')
      setLoading(false)
      return
    }

    const imagensArray = [
      { url: fotoPrincipalBase64 },
      ...fotosOpcionaisBase64.map((foto) => ({ url: foto })),
    ]

    const produtoData = {
      name,
      descricao,
      quantidade: Number(quantidade),
      preco: parseFloat(preco),
      fotoPrincipal: fotoPrincipalBase64,
      fotosOpcionais: fotosOpcionaisBase64.map((foto) => ({ url: foto })),
    }

    const validacao = ProdutoSchema.safeParse(produtoData)

    console.log(validacao)
    if (!validacao.success) {
      setMessage(
        validacao.error.errors[0]?.message ||
          'Erro nos dados do produto. Verifique os campos.',
      )
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/adicionar-produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validacao.data),
      })

      if (response.ok) {
        setMessage('Produto adicionado com sucesso!')
        setName('')
        setDescricao('')
        setQuantidade(1)
        setPreco('')
        setFotoPrincipal(null)
        setFotoPrincipalBase64(null)
        setFotosOpcionais([])
        setFotosOpcionaisBase64([])
        setTimeout(() => router.push('/catalogo'), 1000)
      } else {
        const errorData = await response.json()
        setMessage(`Erro: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor. Tente novamente.')
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
        <h2>Adicionar Novo Produto</h2>
        <ProductCard>
          <ProductForm onSubmit={handleSubmit}>
            <Campo>
              <label htmlFor="nome">Nome do Produto:</label>
              <SearchInput
                type="text"
                id="nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="descricao">Descrição do Produto:</label>
              <SearchInput
                type="text"
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="quantidade">Quantidade:</label>
              <SearchInput
                type="number"
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min="1"
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="preco">Preço:</label>
              <SearchInput
                type="number"
                id="preco"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="fotoPrincipal">Foto Principal:</label>
              <CheckInput
                type="file"
                id="fotoPrincipal"
                accept="image/*"
                onChange={handleFotoPrincipalChange}
                required
              />
            </Campo>

            <Campo>
              <label htmlFor="fotosOpcionais">Fotos Opcionais (Máx: 3):</label>
              <CheckInput
                type="file"
                id="fotosOpcionais"
                accept="image/*"
                multiple
                onChange={handleFotosOpcionaisChange}
              />
            </Campo>

            {message && (
              <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>
            )}

            <div>
              <AddToCartButton type="submit" disabled={loading}>
                {loading ? 'Adicionando...' : 'Adicionar Produto'}
              </AddToCartButton>
            </div>
          </ProductForm>
        </ProductCard>
      </Container>
      <Footer />
    </>
  )
}
