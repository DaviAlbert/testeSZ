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

  const { name, email, senha, admin, imagemBase64, telefone, nascimento } = req.body

  if (!name || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        admin,
        foto: imagemBase64,
        telefone,
        Nascimento: new Date(nascimento),
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
