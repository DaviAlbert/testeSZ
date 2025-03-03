import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Container, Title, InfoCard, Grid, Button } from './style'
import Header from '../../componentes/header'

// função principal da página de administrador
export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [userCount, setUserCount] = useState<number | null>(null)
  const [productCount, setProductCount] = useState<number | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  // verificação se o usuário está cadastrado e se ele é um administrador
  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')
    if (tokenFromCookie) {
      try {
        const tokenObject = JSON.parse(decodeURIComponent(tokenFromCookie))
        setIsLoggedIn(true)
        if (tokenObject.admin) {
          setIsAdmin(true)
        } else {
          router.push('/catalogo')
        }
      } catch (error) {
        console.error('Erro ao processar o token:', error)
        router.push('/auth')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  // vefica o número de produtos e usuários cadastrados no banco de dados.
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
