import { useState, useEffect } from 'react'
import Footer from '../../../componentes/footer'
import Header from '../../../componentes/header'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
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

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [preco, setPreco] = useState('')
  const [imagens, setImagens] = useState<File[]>([])
  const [imagensBase64, setImagensBase64] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // Verificar autenticação e permissão de admin
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

  // Converter as imagens enviadas pelo usuário para Base64
  const convertImagesToBase64 = (files: FileList) => {
    const fileArray = Array.from(files)
    setImagens(fileArray)

    const promises = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
      })
    })

    Promise.all(promises).then((base64Images) => {
      setImagensBase64(base64Images)
    })
  }

  // Pega as imagens inseridas pelo usuario e envia par 'convertImagesToBase64'
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      convertImagesToBase64(event.target.files)
    }
  }

  // Envio do formulário para o banckend, na rota 'api/adicionar-produto'
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setLoading(true)

    const produtoData = {
      nome,
      descricao,
      quantidade,
      preco,
      imagens: imagensBase64,
    }

    try {
      const response = await fetch('/api/adicionar-produto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoData),
      })

      if (response.ok) {
        alert('Produto adicionado com sucesso!')
        setNome('')
        setDescricao('')
        setQuantidade(1)
        setPreco('')
        setImagens([])
        setImagensBase64([])
        router.push('/catalogo')
      } else {
        const errorData = await response.json()
        alert(`Erro: ${errorData.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      alert('Erro ao adicionar produto. Tente novamente.')
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
                value={nome}
                onChange={(e) => setNome(e.target.value)}
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
              <label htmlFor="imagens">Imagens do Produto:</label>
              <CheckInput
                type="file"
                id="imagens"
                accept="image/*"
                multiple // Permite múltiplas imagens
                onChange={handleImageChange}
                required
              />
            </Campo>

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
