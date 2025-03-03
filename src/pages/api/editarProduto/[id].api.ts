import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { name, descricao, preco } = req.body

      const produtoAtualizado = await prisma.produto.update({
        where: { id: String(id) },
        data: { name, descricao, preco: parseFloat(preco) },
      })

      return res.status(200).json(produtoAtualizado)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar o produto.' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' })
}
