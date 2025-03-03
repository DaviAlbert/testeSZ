import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { userId, produtoId } = req.body;

    if (!userId || !produtoId) {
      return res.status(400).json({ error: 'Usuário ou Produto não informado' });
    }

    // Buscar o carrinho do usuário
    const carrinho = await prisma.carrinho.findFirst({
      where: { idUsuario: userId },
      include: { produtos: true },
    });

    if (!carrinho) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Verificar se o produto está no carrinho
    const produtoNoCarrinho = carrinho.produtos.find((p) => String(p.idProduto) === String(produtoId));

    if (!produtoNoCarrinho) {
      return res.status(404).json({ error: 'Produto não está no carrinho' });
    }

    // Remover o produto do carrinho
    await prisma.carrinhoProduto.delete({
      where: {
        idCarrinho_idProduto: {
          idCarrinho: carrinho.id, // Certifique-se de que 'carrinho.id' está correto
          idProduto: produtoId,
        },
      },
    });

    return res.status(200).json({ message: 'Produto removido do carrinho' });
  } catch (error) {
    console.error('Erro ao remover produto do carrinho:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
