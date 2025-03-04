import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import {
  Container,
  ProfileCard,
  ProfileField,
  EditButton,
  SaveButton,
  Message,
  File,
  Foto,
} from './style'
import Header from '../../componentes/header'
import Footer from '../../componentes/footer'

export default function Perfil() {
  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [foto, setFoto] = useState('')
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Carregar ID do usuário a partir do cookie
  useEffect(() => {
    const token = Cookies.get('authToken')
    if (token) {
      try {
        const userData = JSON.parse(decodeURIComponent(token))
        setUserId(userData.id)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error)
      }
    }
  }, [])

  // Buscar dados do usuário pela API do banco de dados
  useEffect(() => {
    if (userId) {
      fetch(`/api/perfil?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name)
          setEmail(data.email)
          setTelefone(data.telefone)
          const dataFormatada = new Date(data.Nascimento).toISOString().split('T')[0]
          setNascimento(dataFormatada)
          setFoto(data.foto)
          setAdmin(data.admin)
        })
        .catch((error) => console.error('Erro ao buscar perfil:', error))
    }
  }, [userId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setFoto(reader.result as string) // Converte para Base64
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/atualizar-perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name, email, telefone, nascimento, foto }),
    })

    const data = await response.json()

    if (response.ok) {
      setMessage('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } else {
      setMessage(`Erro: ${data.error}`)
    }
  }

  console.log(nascimento)
  return (
    <>
      <Header isLoggedIn={isLoggedIn} userName={name} Itens={-1} Admin={admin} />
      <Container>
        <h2>Perfil</h2>
        <ProfileCard>
          <Foto>
          {foto ? (
            <img
              src={foto}
              alt="Foto de perfil"
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: 10 }}
            />
          ) : (
            <p>Sem foto</p>
          )}

          {isEditing && (
            <File type="file" accept="image/*" onChange={handleFileChange} />
          )}
          </Foto>

          <ProfileField>
            <label>Nome:</label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            ) : (
              <span>{name}</span>
            )}
          </ProfileField>

          <ProfileField>
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <span>{email}</span>
            )}
          </ProfileField>

          <ProfileField>
            <label>Telefone:</label>
            {isEditing ? (
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            ) : (
              <span>{telefone || 'Não informado'}</span>
            )}
          </ProfileField>

          <ProfileField>
            <label>Data de Nascimento:</label>
            {isEditing ? (
              <input
                type="date"
                value={nascimento}
                onChange={(e) => setNascimento(e.target.value)}
              />
            ) : (
              <span>
                {nascimento
                  ? new Date(nascimento).toLocaleDateString()
                  : 'Não informado'}
              </span>
            )}
          </ProfileField>

          {isEditing ? (
            <SaveButton onClick={handleSubmit}>Salvar</SaveButton>
          ) : (
            <EditButton onClick={() => setIsEditing(true)}>
              Editar Perfil
            </EditButton>
          )}

          {message && <Message>{message}</Message>}
        </ProfileCard>
      </Container>
      <Footer />
    </>
  )
}
