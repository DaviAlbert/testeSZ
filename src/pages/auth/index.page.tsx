import { useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Campo, Label, Input, Button, Button1 } from './style'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
  }

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSenha(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`Login bem-sucedido! Bem-vindo, ${data.user.name}`)
        router.push('http://localhost:3000/')
      } else {
        const errorData = await response.json()
        setMessage(`Erro: ${errorData.error}`)
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.')
      console.error(error)
    }
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
        <Button type="submit">Entrar</Button>
      </form>
      <Link href="/login">
        <Button1>Criar conta</Button1>
      </Link>
      {message && <p>{message}</p>}
    </Container>
  )
}
