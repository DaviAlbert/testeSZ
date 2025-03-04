import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { LoginSchema } from '../../componentes/schema/schemas'
import { Container, Campo, Label, Input, Button, Button1 } from './style'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = { email, senha }
    const validacao = LoginSchema.safeParse(formData)

    if (!validacao.success) {
      console.error('Erro na validação:', validacao.error)
      setMessage('Erro nos dados de login. Verifique os campos.')
      return
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validacao.data), // Enviando os dados já validados
      })
      if (response.ok) {
        const data = await response.json()

        // Criando cookie com os dados do usuário (expira em 1 dia)
        Cookies.set('authToken', JSON.stringify(data.user), {
          expires: 1,
          path: '/',
        })

        setMessage(`Login bem-sucedido! Bem-vindo, ${data.user.name}`)

        // Redireciona para o catálogo
        router.push('/catalogo')
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </Campo>
        <br />
        <Campo>
          <Label>Senha:</Label>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </Campo>
        <br />
        <Button type="submit">Entrar</Button>
      </form>
      <Link href="/login">
        <Button1>Criar conta</Button1>
      </Link>
      {message && <p>{message}</p>}
    </Container>
  )
}
