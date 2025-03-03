import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    const isPasswordValid = await bcrypt.compare(senha, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' })
    }

    return res.status(200).json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar login', details: error })
  }
}
