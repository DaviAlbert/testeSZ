import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Container, Title, Grid, Button } from './style'
import Header from '../../componentes/header'
import DataTable from 'react-data-table-component'

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [userCount, setUserCount] = useState<number | null>(null)
  const [productCount, setProductCount] = useState<number | null>(null)
  const [products, setProducts] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(15) // Padrão de 15 itens por página
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  // Verificação se o usuário está logado e se ele é um administrador
  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')
    if (tokenFromCookie) {
      try {
        const tokenObject = JSON.parse(decodeURIComponent(tokenFromCookie))
        setIsLoggedIn(true)
        if (tokenObject.admin) {
          setIsAdmin(true)
          setUserName(tokenObject.name)
        } else {
          router.push('/catalogo')
        }
      } catch (error) {
        alert(`Token incompatível: ${error}`)
        router.push('/auth')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  // Carregar o número de produtos e usuários cadastrados
  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((data) => {
          setUserCount(data.totalUsers)
          setProductCount(data.totalProducts)
        })
        .catch((error) => console.error('Erro ao buscar dados:', error))

      // Carregar os produtos
      fetch(`/api/produtosPaginacao?pagina=${currentPage}&limite=${itemsPerPage}`)
        .then((res) => res.json())
        .then((data) => {
          setProductCount(data.total)
          setProducts(data.produtos)
        })
        .catch((error) => console.error('Erro ao buscar produtos:', error))
    }
  }, [isAdmin, currentPage, itemsPerPage])

  // Funções para editar e excluir produtos
  const handleEditProduct = (productId: string) => {
    router.push(`/editar/produto/${productId}`)
  }

  const handleDeleteProduct = (productId: string) => {
    const confirmDelete = window.confirm('Tem certeza de que deseja excluir este produto?')
    if (confirmDelete) {
      fetch(`/api/deletarProduto/${productId}`, {
        method: 'DELETE',
      })
        .then(() => {
          // Atualizar a lista de produtos após a exclusão
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
          )
        })
        .catch((error) => console.error('Erro ao excluir produto:', error))
    }
  }

  // Configuração da grid datatable dos produtos
  const columns = [
    {
      name: 'Nome',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Preço',
      selector: (row) => {
        const preco = parseFloat(row.preco);
        if (isNaN(preco)) {
          return 'R$ 0,00'; // Caso o preço não seja um número, retorna '0,00'
        }
        return `R$ ${preco.toFixed(2).replace('.', ',')}`; // Aplica o formato corretamente
      },
      sortable: true,
    },
    {
      name: 'Ações',
      cell: (row) => (
        <div>
          <Button onClick={() => handleEditProduct(row.id)}>Editar</Button>
          <Button style={{ marginBottom: '15px', backgroundColor:'#864040' }} onClick={() => handleDeleteProduct(row.id)}>
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  // Função para mudar a quantidade de itens por página
  const handleItemsPerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage)
    setCurrentPage(1)
  }

  // Função para navegar entre as páginas
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const customStyles = {
    table: {
      style: {
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '0px',
        border: 'none',
        overflow: 'hidden',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#2f2f2f',
        color: '#fff',
      },
    },
    rows: {
      style: {
        backgroundColor: '#3c3c3c',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#585858',
        },
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        fontSize: '16px',
      },
    },
    pagination: {
      style: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
        backgroundColor: '#3c3c3c',
        color: '#fff',
        borderRadius: '0 0 8px 8px',
        marginTop: '-10px',
      },
    },
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} userName={userName} toggleCart={() => {}} Itens={-1} Admin={isAdmin} />
      <div style={{margin: 'auto', display:'flex', justifyContent:'center', gap:'10px', marginBottom:'20px'}}>
        <Button onClick={() => (window.location.href = 'cadastro/usuario')}>Criar Usuário</Button>
        <Button onClick={() => (window.location.href = 'cadastro/produto')}>Criar Produto</Button>
      </div>
      <Container>
        <Title>Painel Administrativo</Title>
        <Grid>
          <div style={{backgroundColor: '#292931', padding:'10px', borderRadius:'8px'}}>
            <h3>Usuários cadastrados</h3>
            <p>{userCount !== null ? userCount : 'Carregando...'}</p>
          </div>
          <div style={{backgroundColor: '#292931', padding:'10px', borderRadius:'8px'}}>
            <h3>Produtos no catálogo</h3>
            <p>{productCount !== null ? productCount : 'Carregando...'}</p>
          </div>
        </Grid>
        <DataTable
          columns={columns}
          data={products}
          pagination
          paginationPerPage={itemsPerPage}
          paginationRowsPerPageOptions={[15, 50, 100]}
          onChangeRowsPerPage={handleItemsPerPageChange}
          onChangePage={handlePageChange}
          paginationServer
          paginationTotalRows={productCount || 0}
          highlightOnHover
          customStyles={customStyles}
        />
      </Container>
    </>
  )
}
