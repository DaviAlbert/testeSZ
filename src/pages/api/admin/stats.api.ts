import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

interface ErrorResponse {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const authToken = req.cookies.authToken

    if (!authToken) {
      res.status(401).json({ error: 'Não autorizado' } as ErrorResponse)
      return
    }

    const user = JSON.parse(decodeURIComponent(authToken))

    if (!user.admin) {
      res.status(403).json({ error: 'Acesso negado' } as ErrorResponse)
      return
    }

    const totalUsers = await prisma.user.count()
    const totalProducts = await prisma.produto.count()

    res.status(200).json({ totalUsers, totalProducts })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res
      .status(500)
      .json({ error: `Erro interno do servidor: ${error}` } as ErrorResponse)
  }
}
