import { GetServerSideProps } from 'next'
import prisma from '../../lib/prisma'
import { Produto } from '../catalogo/index.page'
import { Container, Image } from './style'
import React from 'react'
import Slider from 'react-slick'

interface ProdutoDetalhadoProps {
  produto: Produto
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }

  // Buscar o produto pelo ID no banco de dados incluindo as imagens
  const produto = await prisma.produto.findUnique({
    where: { id },
    include: {
      imagens: true, // Incluir as imagens associadas ao produto
    },
  })

  if (!produto) {
    return { notFound: true }
  }

  return {
    props: {
      produto,
    },
  }
}

export default function ProdutoDetalhado({ produto }: ProdutoDetalhadoProps) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Container>
      <h1>{produto.name}</h1>
      <div style={{ width: '30%', minWidth: '200px' }}>
        <Slider {...settings}>
          {produto.imagens.map((imagem, index) => (
            <div key={index}>
              <Image src={imagem.url} alt={produto.name} />
            </div>
          ))}
        </Slider>
      </div>

      <p>{produto.descricao}</p>
      <p>Preço: {produto.preco}</p>
    </Container>
  )
}
