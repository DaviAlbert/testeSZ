import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Container, Title, InfoCard, Grid, Button } from './style'
import Header from '../../componentes/header'
import { TokenSchema } from '../../componentes/schema/schemas'

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [userCount, setUserCount] = useState<number | null>(null)
  const [productCount, setProductCount] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const tokenObject = useRef<{ admin?: boolean; id?: string; name?: string }>(
    {},
  )
  const router = useRouter()

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')
    if (tokenFromCookie) {
      try {
        const tokenObject = JSON.parse(decodeURIComponent(tokenFromCookie))

        if (tokenObject.admin) {
          setIsAdmin(true)
        } else {
          router.push('/catalogo')
        }
      } catch (error) {
        console.error('Erro ao processar o token:', error)
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((data) => {
          setUserCount(data.totalUsers)
          setProductCount(data.totalProducts)
        })
        .catch((error) => console.error('Erro ao buscar dados:', error))
    }
  }, [isAdmin])

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')

    if (tokenFromCookie) {
      try {
        const decodedToken = JSON.parse(decodeURIComponent(tokenFromCookie))
        const parsedToken = TokenSchema.safeParse(decodedToken)

        if (parsedToken.success) {
          tokenObject.current = parsedToken.data
          setIsLoggedIn(true)
          setUserName(parsedToken.data.name || 'Usuário')
        } else {
          console.error('Token inválido:', parsedToken.error)
          router.push('/')
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [])

  if (!isAdmin) {
    return <p>Carregando...</p>
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
        <Title>Painel Administrativo</Title>
        <Grid>
          <InfoCard>
            <h3> Usuários cadastrados</h3>
            <p>{userCount !== null ? userCount : 'Carregando...'}</p>
          </InfoCard>
          <InfoCard>
            <h3>Produtos no catálogo</h3>
            <p>{productCount !== null ? productCount : 'Carregando...'}</p>
          </InfoCard>
        </Grid>
        <Button onClick={() => (window.location.href = 'cadastro/usuario')}>
          Criar Usuário
        </Button>
        <Button onClick={() => (window.location.href = 'cadastro/produto')}>
          Criar Produto
        </Button>
      </Container>
    </>
  )
}
