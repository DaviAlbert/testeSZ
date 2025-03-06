import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import { Container, Image, Button, Input } from './style'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Header from '../../componentes/header'
import Footer from '../../componentes/footer'

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  // Busca o produto via API ao carregar a página através do ID
  useEffect(() => {
    if (!id) return

    const fetchProduto = async () => {
      try {
        const response = await fetch(`/api/procurarProdutos/${id}`)
        if (!response.ok) throw new Error('Produto não encontrado')
        const data: Produto = await response.json()
        setProduto(data)
      } catch (error) {
        console.error(error)
        alert('Erro ao buscar produto')
      }
    }

    fetchProduto()
  }, [id])

  // Verifica se o usuário é um adminsitrador
  useEffect(() => {
    const userCookie = Cookies.get('authToken')
    if (userCookie) {
      const user = JSON.parse(userCookie)
      setIsLoggedIn(true)
      setUsername(user.name)
      setIsAdmin(user.admin)

      if(isAdmin){
        router.push('/catalogo')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  const setRota = (id: string) => {
    router.push(`/editar/produto/${id}`)
  }

  // Função para deletar um produto, enviando para a API
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

  // Configuração do Slider para as imanges do produto
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
    <>
      <Header isLoggedIn={isLoggedIn} userName={username} Itens={-1} Admin={isAdmin} />
      <Container>
        <h1>{produto.name}</h1>
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
        <p><strong>Descrição:</strong> {produto.descricao}</p>
        <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</p>
        <p><strong>Quantidade disponível:</strong> {produto.quantidade}</p>

        {isAdmin && (
          <div>
            <Button onClick={() => setRota(produto.id)}>Editar</Button>
            <Button onClick={handleDelete} style={{ background: 'red' }}>
              Excluir
            </Button>
          </div>
        )}
      </Container>
      <Footer />
    </>
  )
}
