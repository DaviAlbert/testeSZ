import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { userId } = req.body; // O ID do usuário que está criando o pedido

  // Verifica se o userId foi passado na requisição
  if (!userId) {
    return res.status(400).json({ error: "User ID é obrigatório" });
  }

  try {
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 2. Verificar se o carrinho do usuário existe
    const carrinho = await prisma.carrinho.findUnique({
      where: { idUsuario: userId },
      include: { produtos: true }, // Incluir os produtos do carrinho
    });

    if (!carrinho || carrinho.produtos.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio. Não é possível criar o pedido." });
    }

    // 3. Criar o pedido
    const pedido = await prisma.pedido.create({
      data: {
        user: { connect: { id: userId } },
        produtos: {
          create: carrinho.produtos.map((item) => ({
            produto: { connect: { id: item.idProduto } },
            quantidade: item.quantidade,
          })),
        },
      },
    });

    // 4. Limpar o carrinho após a criação do pedido
    await prisma.carrinho.update({
      where: { id: carrinho.id },
      data: { produtos: { deleteMany: {} } }, // Limpa os produtos do carrinho
    });
    console.log(pedido)

    return res.status(201).json({
      message: "Pedido criado com sucesso!",
      pedido: pedido,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar o pedido",
      details: (error as Error).message,
    });
  }
}
