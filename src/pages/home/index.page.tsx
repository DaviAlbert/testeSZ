import { useEffect, useState } from 'react'
import {
  AddToCartButton,
  Container,
  ProductCard,
  ProductImage,
  ProductList,
  Item,
  SearchInput,
  StyledHeaderComponent,
} from './style'
import { useRouter } from 'next/router'

export interface Produto {
  id: string
  name: string
  descricao: string
  preco: string
  imagens: { url: string }[] // Mudança: agora imagens é um array de objetos com a URL
}

export default function Home() {
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [quantidades, setQuantidades] = useState<number[]>([])

  // Carregar produtos da API
  useEffect(() => {
    const fetchProdutos = async () => {
      const response = await fetch('/api/produtos')
      const data = await response.json()
      setProdutos(data)
      setQuantidades(new Array(data.length).fill(1))
    }

    fetchProdutos()
  }, [])

  const handleClickProduto = (id: string) => {
    // Redireciona para a página do produto com o ID
    router.push(`/produtos/${id}`)
  }

  return (
    <Container>
      <StyledHeaderComponent>
        <SearchInput type="text" placeholder="Pesquise por produtos" />
      </StyledHeaderComponent>
      <ProductList>
        {produtos.map((produto, index) => (
          <ProductCard
            key={produto.id}
            onClick={() => handleClickProduto(produto.id)}
          >
            <Item>{produto.name}</Item>
            {/* Exibindo todas as imagens do produto */}
            {produto.imagens.map((imagem, imgIndex) => (
              <ProductImage
                key={imgIndex}
                src={imagem.url || 'https://picsum.photos/200'}
                alt={produto.name}
              />
            ))}
            <Item>{produto.descricao}</Item>
            <Item>Preço: {produto.preco}</Item>

            <Item>{quantidades[index]}</Item>

            <AddToCartButton>Adicionar no carrinho</AddToCartButton>
          </ProductCard>
        ))}
      </ProductList>
    </Container>
  )
}
