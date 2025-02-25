import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import {
  Container,
  Campo,
  Label,
  Input,
  Button,
  Button1,
  CheckboxContainer,
  CheckboxInput,
} from './style'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [admin, setAdmin] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nome, email, senha, admin }),
      })

      if (response.ok) {
        const data = await response.json()

        const token = JSON.stringify(data.user)
        console.log('Token recebido:', token)

        Cookies.set('authToken', token, { expires: 1 })

        console.log('Cadastro realizado com sucesso!')
        router.push('http://localhost:3000/')
      } else {
        console.log('Erro na resposta do servidor', response.statusText)
      }
    } catch (error) {
      console.log(`Erro ao conectar com o servidor: ${error}`)
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Campo>
          <Label>Nome:</Label>
          <Input
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Campo>
        <Campo>
          <Label>Email:</Label>
          <Input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Campo>
        <Campo>
          <Label>Senha:</Label>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </Campo>
        <CheckboxContainer>
          <CheckboxInput
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
          />
          <Label>Admin</Label>
        </CheckboxContainer>
        <Button type="submit">Cadastrar</Button>
        <Button1>Criar conta</Button1>
      </form>
    </Container>
  )
}
