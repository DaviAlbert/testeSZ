import { FaShoppingCart } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useState } from 'react'
import logo from '../../../assets/logo.png'
import {
  HeaderContainer,
  UserSection,
  CartIconContainer,
  CartBadge,
  DropdownMenu,
  DropdownItem,
  LogoHeader,
} from './style'

interface HeaderProps {
  isLoggedIn: boolean
  Admin: boolean
  userName: string | null
  toggleCart?: () => void
  Itens: number
}

export default function Header({
  isLoggedIn,
  userName,
  toggleCart,
  Itens,
  Admin,
}: HeaderProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  let catalogo = true

  if (Itens < 0) {
    catalogo = false
  }

  const handleLogout = () => {
    Cookies.remove('authToken')
    router.push('/auth')
  }

  const AdminPage = () => {
    router.push('/admin')
  }

  const PerfilPage = () => {
    router.push('/perfil')
  }

  return (
    <HeaderContainer>
      <div style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
        <LogoHeader src={logo.src} alt="Logo da Loja" />
        <h3>SZ soluções</h3>
      </div>
      <UserSection>
        <p onClick={() => router.push('/catalogo')}>Produtos</p>
        {isLoggedIn ? (
          <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {userName} ▼
            {isDropdownOpen && (
              <DropdownMenu isOpen={isDropdownOpen}>
                {Admin && (
                  <DropdownItem style={{backgroundColor:'rgb(120, 149, 182)'}} onClick={AdminPage}>Administração</DropdownItem>
                )}
                <DropdownItem onClick={PerfilPage}>Perfil</DropdownItem>
                <DropdownItem style={{backgroundColor:'rgb(111, 25, 11)', width: '75%'}} onClick={handleLogout}>Sair</DropdownItem>
              </DropdownMenu>
            )}
          </div>
        ) : (
          <button onClick={() => router.push('/auth')}>Entrar</button>
        )}

        {isLoggedIn && catalogo && (
          <CartIconContainer onClick={toggleCart}>
            <FaShoppingCart size={36} />
            <CartBadge>{Itens}</CartBadge>
          </CartIconContainer>
        )}
      </UserSection>
    </HeaderContainer>
  )
}
