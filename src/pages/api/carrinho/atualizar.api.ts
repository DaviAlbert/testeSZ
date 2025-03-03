import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { userId, produtoId, quantidade } = req.body;

    if (!userId || !produtoId || quantidade < 1) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    // Verifica se o carrinho existe
    const carrinho = await prisma.carrinho.findUnique({
      where: { idUsuario: userId },
      include: { produtos: true },
    });

    if (!carrinho) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Verifica se o produto já está no carrinho
    const produtoCarrinho = await prisma.carrinhoProduto.findUnique({
      where: { idCarrinho_idProduto: { idCarrinho: carrinho.id, idProduto: produtoId } },
    });

    if (!produtoCarrinho) {
      return res.status(404).json({ error: 'Produto não encontrado no carrinho' });
    }

    // Atualiza a quantidade do produto no carrinho
    await prisma.carrinhoProduto.update({
      where: { idCarrinho_idProduto: { idCarrinho: carrinho.id, idProduto: produtoId } },
      data: { quantidade },
    });

    return res.status(200).json({ message: 'Quantidade atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar a quantidade do produto no carrinho:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
