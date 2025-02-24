import prisma from '../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

interface ErrorResponse {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    // Buscar todos os produtos incluindo as imagens
    const produtos = await prisma.produto.findMany({
      include: {
        imagens: true, // Incluir as imagens associadas ao produto
      },
    })
    res.status(200).json(produtos)
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erro ao buscar produtos: ${error}` } as ErrorResponse)
  }
}

export async function get(id: string, res: NextApiResponse): Promise<void> {
  try {
    // Buscar um produto específico incluindo as imagens
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        imagens: true, // Incluir as imagens associadas ao produto
      },
    })
    res.status(200).json(produto)
  } catch (error) {
    res
      .status(500)
      .json({ error: `Erro ao buscar produto: ${error}` } as ErrorResponse)
  }
}
