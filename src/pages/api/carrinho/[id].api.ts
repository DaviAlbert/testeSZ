import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID de usuário inválido' })
  }

  if (req.method === 'GET') {
    try {
      // Obter o carrinho do usuário, buscando pelo idUsuario
      const carrinho = await prisma.carrinho.findUnique({
        where: { idUsuario: id }, // Usando o id do usuário diretamente
        include: {
          produtos: {
            include: {
              produto: true, // Incluindo as informações do produto
            },
          },
        },
      })

      if (carrinho) {
        // Mapeia os produtos do carrinho, incluindo a descrição e foto principal
        const produtosCarrinho = carrinho.produtos.map((item) => ({
          id: item.produto.id,
          name: item.produto.name,
          quantidade: item.quantidade,
          preco: item.produto.preco,
          descricao: item.produto.descricao,  // Incluindo a descrição
          fotoPrincipal: item.produto.fotoPrincipal, // Incluindo a foto principal
        }))

        return res.status(200).json({ produtos: produtosCarrinho })
      } else {
        return res.status(404).json({ error: 'Carrinho não encontrado' })
      }
    } catch (error) {
      console.error('Erro no backend:', error instanceof Error ? error.message : error)
      return res.status(500).json({ error: 'Erro ao buscar produtos do carrinho' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}
