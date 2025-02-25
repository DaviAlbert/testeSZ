import { FaShoppingCart } from 'react-icons/fa'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useState } from 'react'
import {
  HeaderContainer,
  Logo,
  Nav,
  SearchInput,
  UserSection,
  CartIconContainer,
  CartBadge,
  DropdownMenu,
  DropdownItem,
} from './style'

interface HeaderProps {
  isLoggedIn: boolean
  userName: string | null
  toggleCart: () => void
}

export default function Header({
  isLoggedIn,
  userName,
  toggleCart,
}: HeaderProps) {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    Cookies.remove('authToken')
    router.push('/auth')
  }

  return (
    <HeaderContainer>
      <Logo onClick={() => router.push('/')}>Minha Loja</Logo>
      <Nav>
        <a href="/">PRODUTOS</a>
        <SearchInput type="text" placeholder="Pesquise produtos..." />
      </Nav>
      <UserSection>
        {isLoggedIn ? (
          <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {userName} ▼
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={handleLogout}>Sair</DropdownItem>
              </DropdownMenu>
            )}
          </div>
        ) : (
          <button onClick={() => router.push('/login')}>Entrar</button>
        )}

        {isLoggedIn && (
          <CartIconContainer onClick={toggleCart}>
            <FaShoppingCart size={24} />
            <CartBadge>3</CartBadge>
          </CartIconContainer>
        )}
      </UserSection>
    </HeaderContainer>
  )
}
