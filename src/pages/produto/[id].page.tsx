import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import { Container, Image, Button, Input, TextArea } from './style'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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

export default function ProdutoDetalhado() {
  const router = useRouter()
  const { id } = router.query
  const [produto, setProduto] = useState<Produto | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editando, setEditando] = useState(false)
  const [name, setName] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState(0)

  // Buscar produto via API ao carregar a página
  useEffect(() => {
    if (!id) return

    const fetchProduto = async () => {
      try {
        const response = await fetch(`/api/procurarProdutos/${id}`)
        if (!response.ok) throw new Error('Produto não encontrado')
        const data: Produto = await response.json()
        setProduto(data)
        setName(data.name)
        setDescricao(data.descricao)
        setPreco(data.preco)
      } catch (error) {
        console.error(error)
        alert('Erro ao buscar produto')
      }
    }

    fetchProduto()
  }, [id])

  // Verificação de admin
  useEffect(() => {
    const userCookie = Cookies.get('authToken')
    if (userCookie) {
      const user = JSON.parse(userCookie)
      setIsAdmin(user.admin)
    } else {
      alert('Token não encontrado, faça login.')
      router.push('/login')
    }
  }, [])

  // Função para deletar um produto
  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const response = await fetch(`/api/deletarProduto/${produto?.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Produto excluído com sucesso!')
        router.push('/catalogo')
      } else {
        alert('Erro ao excluir o produto.')
      }
    } catch (error) {
      console.error('Erro ao excluir o produto:', error)
    }
  }

  // Configuração do Slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  }

  if (!produto) return <p>Carregando...</p>

  return (
    <Container>
      <h1>{produto.name}</h1>

      {/* Slider com imagens */}
      <div style={{ width: '50%', minWidth: '300px', margin: 'auto' }}>
        <Slider {...settings}>
          <div>
            <Image
              src={produto.fotoPrincipal}
              alt={`Imagem principal de ${produto.name}`}
            />
          </div>
          {produto.imagens.map((imagem) => (
            <div key={imagem.id}>
              <Image src={imagem.url} alt={produto.name} />
            </div>
          ))}
        </Slider>
      </div>

      {!editando ? (
        <>
          <p>
            <strong>Descrição:</strong> {produto.descricao}
          </p>
          <p>
            <strong>Preço:</strong> R$ {produto.preco.toFixed(2)}
          </p>
          <p>
            <strong>Quantidade disponível:</strong> {produto.quantidade}
          </p>
        </>
      ) : (
        <>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <TextArea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
          />
          <Input
            type="number"
            value={preco}
            onChange={(e) => setPreco(Number(e.target.value))}
            placeholder="Preço"
          />
        </>
      )}

      {isAdmin && (
        <div>
          {!editando ? (
            <>
              <Button onClick={() => setEditando(true)}>Editar</Button>
              <Button onClick={handleDelete} style={{ background: 'red' }}>
                Excluir
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setEditando(false)}
                style={{ background: 'gray' }}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      )}
    </Container>
  )
}
