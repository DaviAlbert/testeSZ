import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

interface CarrinhoRequest {
  userId: string
  produtoId: string
  quantidade: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { userId, produtoId, quantidade }: CarrinhoRequest = req.body

  try {
    // 1️⃣ Verifica se o usuário existe
    const usuarioExiste = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!usuarioExiste) {
      return res.status(400).json({ error: 'Usuário não encontrado' })
    }

    // 2️⃣ Verifica se o produto existe
    const produtoExiste = await prisma.produto.findUnique({
      where: { id: produtoId },
    })

    if (!produtoExiste) {
      return res.status(400).json({ error: 'Produto não encontrado' })
    }

    // 3️⃣ Verifica se o carrinho já existe
    let carrinho = await prisma.carrinho.findUnique({
      where: { idUsuario: userId },
      include: { produtos: true },
    })

    // 4️⃣ Se o carrinho não existir, criamos um novo
    if (!carrinho) {
      carrinho = await prisma.carrinho.create({
        data: { idUsuario: userId },
      })
    }

    // 5️⃣ Verifica se o produto já está no carrinho
    const carrinhoProduto = await prisma.carrinhoProduto.findUnique({
      where: {
        idCarrinho_idProduto: {
          idCarrinho: carrinho.id,
          idProduto: produtoId,
        },
      },
    })

    if (carrinhoProduto) {
      // Atualiza a quantidade se o produto já está no carrinho
      await prisma.carrinhoProduto.update({
        where: {
          idCarrinho_idProduto: {
            idCarrinho: carrinho.id,
            idProduto: produtoId,
          },
        },
        data: {
          quantidade: carrinhoProduto.quantidade + quantidade,
        },
      })
    } else {
      // Adiciona o produto ao carrinho
      await prisma.carrinhoProduto.create({
        data: {
          idCarrinho: carrinho.id,
          idProduto: produtoId,
          quantidade,
        },
      })
    }

    return res.status(200).json({ message: 'Produto adicionado ao carrinho' })
  } catch (error) {
    console.error('Erro no backend:', error)
    return res
      .status(500)
      .json({ error: 'Erro ao adicionar produto ao carrinho.' })
  }
}
