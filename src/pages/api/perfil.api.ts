import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ error: 'ID do usuário é obrigatório' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
}
