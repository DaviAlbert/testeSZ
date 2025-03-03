import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  try {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { imagens: true },
    })

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    return res.status(200).json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
