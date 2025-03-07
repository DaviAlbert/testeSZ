import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Footer from '../../../componentes/footer'
import Header from '../../../componentes/header'
import {
  Container,
  Title,
  Form,
  Campo,
  Label,
  Input,
  Textarea,
  Button,
  ErrorText,
  FileInputWrapper,
  FileInputLabel,
  FileInput,
  FilePreview,
  FileImage,
  FileButton,
} from './style'
import Image from 'next/image'

// Define a estrutura esperada do produto detalhado
interface Produto {
  id: string
  name: string
  descricao: string
  preco: number
  quantidade: number
  fotoPrincipal: string
  imagens: { id: string; url: string }[]
}

export default function EditProduct() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [preco, setPreco] = useState('')
  const [fotoPrincipalBase64, setFotoPrincipalBase64] = useState<string>('') // Foto Principal como Base64
  const [fotosOpcionaisBase64, setFotosOpcionaisBase64] = useState<string[]>([]) // Fotos Opcionais como Base64
  const [loading, setLoading] = useState(false)
  const [produto, setProduto] = useState<Produto | null>(null)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { id } = router.query

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

  // Carregar os dados do produto ao editar
  useEffect(() => {
    if (!id) return

    const fetchProductData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/procurarProdutos/${id}`)
        if (response.ok) {
          const produtoData = await response.json()
          setName(produtoData.name)
          setDescricao(produtoData.descricao)
          setQuantidade(produtoData.quantidade)
          setPreco(produtoData.preco.toString())
          setFotoPrincipalBase64(produtoData.fotoPrincipal)
          setFotosOpcionaisBase64(produtoData.imagens.map((img: { id: string; url: string }) => img.url) || [])
          setProduto(produtoData)
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do produto:', error)
      }finally{
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id])

  // Função para converter imagem para Base64
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

      if (file.size > 5000000) {
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

const handleFotosOpcionaisChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files) {
    const fileArray = Array.from(event.target.files);

    // Verifica se o número total de fotos não excede 3
    if (fotosOpcionaisBase64.length > 3 || fileArray.length > 3) {
      setMessage('Você pode adicionar no máximo 3 fotos opcionais.');
      return; // Não permite adicionar mais fotos
    }

    setMessage(''); // Limpa qualquer mensagem de erro anterior

    try {
      // Converte as novas imagens em base64
      const base64Images = await Promise.all(fileArray.map((file) => convertImageToBase64(file)));

      // Atualiza o estado de fotos com as novas imagens
      setFotosOpcionaisBase64((prevFotos) => {
        const newFotos = [...prevFotos, ...base64Images];

        // Se o número de fotos for superior a 3, removemos a foto mais antiga
        return newFotos.length > 3 ? newFotos.slice(-3) : newFotos;
      });
    } catch (error) {
      console.error('Erro ao converter imagens opcionais para Base64:', error);
    }
  }
};


  // Envio do formulário
  const handleSubmit = async () => {
    if (!produto) return

    const data = {
      name,
      descricao,
      preco,
      quantidade,
      fotoPrincipal: fotoPrincipalBase64,
      fotos: fotosOpcionaisBase64
    }

    try {
      const response = await fetch(`/api/editarProduto/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      console.log(response)

      if (response.ok) {
        const updatedProduto = await response.json()
        setProduto(updatedProduto)
        router.push('/admin')
      } else {
        throw new Error('Erro ao atualizar produto')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar as alterações.')
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
        <Title>Editar Produto</Title>
        <Form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
          <Campo>
            <Label htmlFor="nome">Nome do Produto:</Label>
            <Input
              type="text"
              id="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Campo>

          <Campo>
            <Label htmlFor="descricao">Descrição do Produto:</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </Campo>

          <Campo>
            <Label htmlFor="quantidade">Quantidade:</Label>
            <Input
              type="number"
              id="quantidade"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              min="1"
            />
          </Campo>

          <Campo>
            <Label htmlFor="preco">Preço:</Label>
            <Input
              type="number"
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </Campo>

          <Campo>
          <FileInputWrapper>
          <FileInputLabel htmlFor="fotoPrincipal">Foto Principal:</FileInputLabel>
          <FileButton as="label" htmlFor="fotoPrincipal">
            Selecione a Foto Principal
          </FileButton>
          <FileInput
            type="file"
            id="fotoPrincipal"
            accept=".jpg, .jpeg, .png"
            onChange={handleFotoPrincipalChange}
            />
          </FileInputWrapper>
          {fotoPrincipalBase64 && (
          <Image
            src={fotoPrincipalBase64}
            alt="Foto Principal"
            layout="responsive"
            width={500}
            height={300}
            objectFit="cover"
          />
        )}
      </Campo>

      <Campo>
    <FileInputWrapper>
      <FileInputLabel htmlFor="fotosOpcionais">Fotos Opcionais:</FileInputLabel>
      <FileButton as="label" htmlFor="fotosOpcionais">
        Selecione as Fotos Opcionais
      </FileButton>
      <FileInput
        type="file"
        id="fotosOpcionais"
        accept=".jpg, .jpeg, .png"
        multiple
        onChange={handleFotosOpcionaisChange}
      />
    </FileInputWrapper>

    {fotosOpcionaisBase64.length > 0 && (
      <FilePreview>
        {fotosOpcionaisBase64.map((foto, index) => (
          <FileImage
            key={index}
            src={foto}
            alt={`Foto Opcional ${index + 1}`}
          />
        ))}
      </FilePreview>
    )}
  </Campo>
  {message && <ErrorText>{message}</ErrorText>}

  <Button type="submit" disabled={loading}>
  {loading ? 'Editando...' : 'Salvar Produto'}
  </Button>
        </Form>
  </Container>
  <Footer />
  </>
  )
}
