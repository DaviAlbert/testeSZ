import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { name, email, senha, admin } = req.body

  if (!name || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: senha,
        admin,
      },
    })

    return res
      .status(201)
      .json({ message: 'Usuário cadastrado com sucesso!', user })
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro ao criar usuário', details: error })
  }
}
