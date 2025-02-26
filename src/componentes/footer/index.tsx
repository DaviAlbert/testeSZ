import { FooterContainer, Copyright, Address, LogoFooter } from './style'
import logo from '../../../assets/logo.png'
console.log(logo)

export default function Footer() {
  return (
    <FooterContainer>
      <div>
        <LogoFooter src={logo.src} alt="Logo da Loja" />
        <h3>SZ soluções</h3>
      </div>
      <Address>
        Endereço da Loja: Rua Rio grande do sul, 385, 4º Andar, Joinville, Santa
        catarina
      </Address>
      <Copyright>
        © {new Date().getFullYear()} Minha Loja. Todos os direitos reservados.
      </Copyright>
    </FooterContainer>
  )
}
