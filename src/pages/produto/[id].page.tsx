import { GetServerSideProps } from 'next'
import prisma from '../../lib/prisma'
import { Produto } from '../catalogo/index.page'
import { Container, Image, Button, Input, TextArea } from './style'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

interface ProdutoDetalhadoProps {
  produto: Produto
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }

  const produto = await prisma.produto.findUnique({
    where: { id },
    include: {
      imagens: true,
    },
  })

  if (!produto) {
    return { notFound: true }
  }

  return {
    props: { produto },
  }
}

export default function ProdutoDetalhado({ produto }: ProdutoDetalhadoProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(produto.name)
  const [descricao, setDescricao] = useState(produto.descricao)
  const [preco, setPreco] = useState(produto.preco)
  const router = useRouter()

  useEffect(() => {
    const userCookie = Cookies.get('authToken')
    if (userCookie) {
      const user = JSON.parse(userCookie)
      setIsAdmin(user.admin) // Verifica se o usuário é admin
    }
  }, [])

  // Função para editar o produto
  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/editarProduto/${produto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, descricao, preco }),
      })

      if (response.ok) {
        alert('Produto atualizado com sucesso!')
        setEditando(false)
      } else {
        alert('Erro ao atualizar o produto.')
      }
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error)
    }
  }

  // Função para deletar o produto
  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const response = await fetch(`/api/deletarProduto/${produto.id}`, {
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

  return (
    <Container>
      <h1>{produto.name}</h1>
      <div style={{ width: '30%', minWidth: '200px' }}>
        <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
          {produto.imagens.map((imagem, index) => (
            <div key={index}>
              <Image src={imagem.url} alt={produto.name} />
            </div>
          ))}
        </Slider>
      </div>

      {!editando ? (
        <>
          <p>{produto.descricao}</p>
          <p>Preço: R$ {produto.preco}</p>
        </>
      ) : (
        <>
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
          <TextArea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
          />
          <Input
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Preço"
          />
        </>
      )}

      {/* Exibir botões apenas para administradores */}
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
              <Button onClick={handleEdit} style={{ background: 'green' }}>
                Salvar Alterações
              </Button>
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
