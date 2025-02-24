import { useState } from 'react'
import { Container, Campo, Label, Input, Button, Button1 } from './style'

export default function Cadastro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSenha(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // Aqui você pode adicionar o que acontece quando o formulário for enviado
    console.log('Email:', email)
    console.log('Senha:', senha)
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Campo>
          <Label>Email:</Label>
          <Input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={handleEmailChange}
          />
        </Campo>
        <Campo>
          <Label>Senha:</Label>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={handleSenhaChange}
          />
        </Campo>
        <Button type="submit">Cadastrar</Button>
        <Button1>Criar conta</Button1>
      </form>
    </Container>
  )
}
