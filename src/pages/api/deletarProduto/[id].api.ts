import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      await prisma.produto.delete({
        where: { id: String(id) },
      })
      return res.status(200).json({ message: 'Produto excluído com sucesso!' })
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Erro ao excluir o produto: ${error}` })
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' })
}
