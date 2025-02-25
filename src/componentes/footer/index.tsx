import { FooterContainer, Copyright, Address, LogoFooter } from './style'

export default function Footer() {
  return (
    <FooterContainer>
      <LogoFooter src="/logo.png" alt="Logo da Loja" />
      <Address>Endereço da Loja: Rua Exemplo, 123, Cidade, Estado</Address>
      <Copyright>© 2025 Minha Loja. Todos os direitos reservados.</Copyright>
    </FooterContainer>
  )
}
