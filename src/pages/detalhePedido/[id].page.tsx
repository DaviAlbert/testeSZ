import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { 
    Container, 
    PedidoDate, 
    PedidoHeader, 
    PedidoInfo, 
    ProdutoImage, 
    ProdutoInfo, 
    ProdutoItem, 
    ProdutoList, 
    ProdutoName, 
    ProdutoPreco, 
    ProdutoQuantidade 
} from './style';
import Header from '../../componentes/header';
import Cookies from 'js-cookie';

interface Produto {
    idProduto: number;
    produto: {
        name: string;
        preco: number;
        fotoPrincipal: string;
    };
    quantidade: number;
}

interface Cliente{
  name: string,
  email: string,
}

interface Pedido {
  id: number;
  created_at: string;
  produtos: Produto[];
  user: Cliente
}

export default function DetalhePedido() {
  const router = useRouter()
  const { id } = router.query
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  const total = pedido?.produtos.reduce((acc, item)=>{
    return acc + item.produto.preco * item.quantidade
  }, 0)

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
    if (!id) return

    const fetchPedido = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/pedidos/${id}`)
        console.log(!response.ok)
        if (!response.ok) {
          throw new Error('Pedido não encontrado')
        }
        const data = await response.json()
        setPedido(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPedido()
  }, [id])

  if (loading) {
    return <p>Carregando...</p>
  }

  if (error) {
    return <p>Erro: {error}</p>
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
      {pedido ? (
        <div>
          <PedidoHeader>ID do Pedido: {pedido.id}</PedidoHeader>
          <PedidoInfo>
            <PedidoDate>Data de criação do Pedido: {new Date(pedido.created_at).toLocaleString()}</PedidoDate>
            <ProdutoPreco><p> Preço total: </p> R${total}</ProdutoPreco>
            <ProdutoPreco><p> Cliente: </p> {pedido.user.name} ({pedido.user.email})</ProdutoPreco>
          </PedidoInfo>

          <ProdutoList>
            {pedido.produtos.map((pedidoProduto) => (
              <ProdutoItem key={pedidoProduto.idProduto}>
                <ProdutoImage src={pedidoProduto.produto.fotoPrincipal} alt={pedidoProduto.produto.name} />
                <ProdutoInfo>
                  <ProdutoName>{pedidoProduto.produto.name}</ProdutoName>
                  <ProdutoPreco>R${pedidoProduto.produto.preco.toFixed(2)}</ProdutoPreco>
                  <ProdutoQuantidade>Qtd: {pedidoProduto.quantidade}</ProdutoQuantidade>
                </ProdutoInfo>
              </ProdutoItem>
            ))}
          </ProdutoList>
        </div>
      ) : (
        <p>Pedido não encontrado</p>
      )}
    </Container>
    </>
  )
}
