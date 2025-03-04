import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Verifique se o caminho está correto

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    // Busca o carrinho do usuário
    const carrinho = await prisma.carrinho.findUnique({
      where: { idUsuario: userId },
      include: { produtos: true },
    });

    if (!carrinho) {
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // Deleta todos os produtos associados ao carrinho
    await prisma.carrinhoProduto.deleteMany({
      where: { idCarrinho: carrinho.id },
    });

    return res.status(200).json({ message: 'Carrinho esvaziado com sucesso!' });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    return res.status(500).json({ error: 'Erro ao limpar o carrinho' });
  }
}
