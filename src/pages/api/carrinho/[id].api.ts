import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      // Obter os produtos do carrinho do usuário
      const carrinho = await prisma.carrinho.findUnique({
        where: { idUsuario: String(id) }, // Usando o userId da URL
        include: {
          produtos: {
            include: {
              produto: true, // Incluindo as informações do produto
            },
          },
        },
      })

      if (carrinho) {
        // Retorna os produtos e suas quantidades para o carrinho
        const produtosCarrinho = carrinho.produtos.map((item) => ({
          id: item.produto.id,
          name: item.produto.name,
          quantidade: item.quantidade,
          preco: item.produto.preco,
        }))

        return res.status(200).json({ produtos: produtosCarrinho })
      } else {
        return res.status(404).json({ error: 'Carrinho não encontrado' })
      }
    } catch (error) {
      console.error('Erro no backend:', error instanceof Error ? error.message : error)
      return res
        .status(500)
        .json({ error: 'Erro ao buscar produtos do carrinho' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}
