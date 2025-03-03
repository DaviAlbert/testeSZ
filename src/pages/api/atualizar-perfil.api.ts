import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { userId, name, email, telefone, nascimento, foto } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' })
    }

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' })
    }

    // Atualiza os dados do usuário no banco
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, telefone, Nascimento: new Date(nascimento), foto },
    })

    return res
      .status(200)
      .json({ message: 'Perfil atualizado com sucesso!', user: updatedUser })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return res.status(500).json({ error: 'Erro interno no servidor' })
  }
}
