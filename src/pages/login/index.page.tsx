import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { CadastroSchema } from '../../componentes/schema/schemas' // Importando o schema de validação
import {
  Container,
  Campo,
  Label,
  Input,
  Button,
  Button1,
  CheckboxContainer,
  CheckboxInput,
  CheckInput,
} from './style'

export default function Cadastro() {
  const [name, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [admin, setAdmin] = useState(false)
  const [imagemBase64, setImagemBase64] = useState<string>('')
  const router = useRouter()

  // Função para converter imagem em Base64 (somente uma)
  const convertImageToBase64 = (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setImagemBase64(reader.result as string)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const fileType = file.type

      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        convertImageToBase64(file)
      } else {
        alert('Por favor, selecione uma imagem nos formatos JPEG ou PNG.')
        event.target.value = '' // Reseta o campo de input
      }
    } else {
      console.log('Nenhum arquivo selecionado')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!nascimento.trim()) {
      alert('A data de nascimento é obrigatória!')
      return
    }

    if (!imagemBase64) {
      alert('Por favor, adicione uma imagem válida!')
      return
    }

    const formData = {
      name,
      email,
      senha,
      admin,
      telefone: telefone || '',
      nascimento: nascimento || '',
      imagemBase64: imagemBase64 || '',
    }

    const validacao = CadastroSchema.safeParse(formData)

    if (!validacao.success) {
      console.error('Erro na validação:', validacao.error)
      alert('Erro nos dados de cadastro. Verifique os campos.')
      return
    }

    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validacao.data),
      })

      if (response.ok) {
        const data = await response.json()
        Cookies.set('imagem', data.user.foto)
        Cookies.set(
          'authToken',
          JSON.stringify({
            id: data.user.id,
            admin: data.user.admin,
            email: data.user.email,
            name: data.user.name,
            telefone: data.user.telefone,
          }),
          { expires: 1 },
        )

        setTimeout(() => {
          router.push('/')
        }, 100)
      } else {
        console.log('Erro na resposta do servidor', response)
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
            value={name}
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
          <Label>Telefone:</Label>
          <Input
            type="text"
            placeholder="Digite seu Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </Campo>
        <Campo>
          <Label>Data De Nascimento:</Label>
          <Input
            type="date"
            placeholder="Digite sua data de nascimento"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
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
        <Campo>
          <label htmlFor="imagens">Imagem do Perfil:</label>
          <CheckInput
            type="file"
            id="imagens"
            accept="image/*"
            onChange={handleImageChange}
            required
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
      </form>
      <Button1 onClick={() => router.push('/auth')}>Ir para Login</Button1>
    </Container>
  )
}
