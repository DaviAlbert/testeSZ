import React, { useEffect, useState } from 'react'
import { Container, PedidoInfo, PedidoHeader, Button } from './style'
import Header from '../../componentes/header'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

interface Produto {
  id: string
  preco: number
}

interface Pedido {
  id: string
  produtos: {
    produto: Produto
    quantidade: number
  }[] | null
}

export default function Pedidos() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

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

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/pedidos/procurar')
        if (!response.ok) {
          throw new Error('Falha ao carregar pedidos')
        }
        const data = await response.json()
        setPedidos(data.map((pedido: Pedido) => ({
          ...pedido,
          produtos: pedido.produtos || [],
        })))
      } catch (error) {
        console.log(`Erro: ${error}`)
        setError('Erro ao carregar pedidos')
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  if (loading) return <p>Carregando pedidos...</p>

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
        {error ? <h1>{error}</h1> : <h1>Pedidos</h1>}
        
        {pedidos.map((pedido) => {
          const produtos = pedido.produtos || []
          const quantidadeTotal = produtos.reduce((total, item) => total + item.quantidade, 0)
          const totalPedido = produtos.reduce((total, item) => total + item.produto.preco * item.quantidade, 0)

          return (
            <PedidoInfo key={pedido.id} onClick={() => router.push(`/detalhePedido/${pedido.id}`)}>
              <PedidoHeader>Pedido #{pedido.id}</PedidoHeader>
              <p>Itens: {quantidadeTotal}</p>
              <h3>Total: R${totalPedido.toFixed(2)}</h3>
              <Button>Ver detalhes</Button>
            </PedidoInfo>
          )
        })}
      </Container>
    </>
  )
}
