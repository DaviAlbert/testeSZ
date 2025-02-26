import { FaShoppingCart } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useState } from 'react'
import logo from '../../../assets/logo.png'
import {
  HeaderContainer,
  Logo,
  UserSection,
  CartIconContainer,
  CartBadge,
  DropdownMenu,
  DropdownItem,
  LogoHeader,
} from './style'

interface HeaderProps {
  isLoggedIn: boolean
  userName: string | null
  toggleCart: () => void
  Itens: number
}

export default function Header({
  isLoggedIn,
  userName,
  toggleCart,
  Itens,
}: HeaderProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  let catalogo = true

  if (Itens <= 0) {
    catalogo = false
  }

  const handleLogout = () => {
    Cookies.remove('authToken')
    router.push('/auth')
  }

  return (
    <HeaderContainer>
      <div onClick={() => router.push('/')}>
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
                <DropdownItem onClick={handleLogout}>Sair</DropdownItem>
              </DropdownMenu>
            )}
          </div>
        ) : (
          <button onClick={() => router.push('/login')}>Entrar</button>
        )}

        {isLoggedIn && catalogo && (
          <CartIconContainer onClick={toggleCart}>
            <FaShoppingCart size={24} />
            <CartBadge>{Itens}</CartBadge>
          </CartIconContainer>
        )}
      </UserSection>
    </HeaderContainer>
  )
}
