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
  ProductImage,
  UploadButton,
} from './style'

export default function AddProduct() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [preco, setPreco] = useState('')
  const [fotoPrincipalBase64, setFotoPrincipalBase64] = useState<string>('')
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

  // Função para reduzir e converter imagem para Base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  // Foto principal
  const handleFotoPrincipalChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]

      if (file.size > 5000000) { // 5MB limite
        setMessage('A imagem é muito grande! Escolha uma menor que 5MB.')
        return
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setMessage('Somente imagens JPG ou PNG são permitidas!')
        return
      }

      try {
        const base64 = await convertImageToBase64(file)
        setFotoPrincipalBase64(base64)
      } catch (error) {
        console.error('Erro ao converter imagem para Base64:', error)
      }
    }
  }

  // Fotos opcionais
  const handleFotosOpcionaisChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files)

      if (fileArray.length + fotosOpcionaisBase64.length > 3) {
        setMessage('Você pode adicionar no máximo 3 fotos opcionais.')
        return
      }

      setMessage('')

      try {
        const base64Images = await Promise.all(fileArray.map((file) => convertImageToBase64(file)))
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

    const produtoData = {
      name,
      descricao,
      quantidade: Number(quantidade),
      preco: parseFloat(preco),
      fotoPrincipal: fotoPrincipalBase64,
      fotosOpcionais: fotosOpcionaisBase64,
    }
    console.log(produtoData)

    const validacao = ProdutoSchema.safeParse(produtoData)
    console.log(validacao)

    if (!validacao.success) {
      setMessage(validacao.error.errors[0]?.message || 'Erro nos dados do produto.')
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
        setFotoPrincipalBase64('')
        setFotosOpcionaisBase64([])
        setTimeout(() => router.push('/catalogo'), 1000)
      } else {
        const errorData = await response.json()
        console.log(errorData)
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
              <label style={{marginRight: '10px'}} htmlFor="nome">Nome do Produto:</label>
              <SearchInput
                type="text"
                id="nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label style={{marginRight: '10px'}} htmlFor="descricao">Descrição do Produto:</label>
              <SearchInput
                type="text"
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <label style={{marginRight: '10px'}} htmlFor="quantidade">Quantidade:</label>
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
              <label style={{marginRight: '10px'}} htmlFor="preco">Preço:</label>
              <SearchInput
                type="number"
                id="preco"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </Campo>

            <Campo>
              <UploadButton htmlFor="fotoPrincipal">
                📷 Escolher Foto Principal
              </UploadButton>
              <CheckInput
                type="file"
                id="fotoPrincipal"
                accept=".jpg, .jpeg, .png"
                onChange={handleFotoPrincipalChange}
                required
              />
            </Campo>
            {fotoPrincipalBase64 && (
              <ProductImage src={fotoPrincipalBase64} alt="Foto Principal" />
            )}
            <Campo>
              <UploadButton htmlFor="fotosOpcionais">
                📸 Adicionar Fotos Opcionais
              </UploadButton>
              <CheckInput
                type="file"
                id="fotosOpcionais"
                accept=".jpg, .jpeg, .png"
                multiple
                onChange={handleFotosOpcionaisChange}
              />
            </Campo>
            {fotosOpcionaisBase64.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {fotosOpcionaisBase64.map((foto, index) => (
                  <ProductImage key={index} src={foto} alt={`Foto Opcional ${index + 1}`} />
                ))}
              </div>
            )}

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
