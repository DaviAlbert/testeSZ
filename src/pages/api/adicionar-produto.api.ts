import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { name, descricao, preco, quantidade, fotoPrincipal, fotosOpcionais } = req.body;

  // Verifica se os itens existe antes de salvar no banco de dados
  if (!name || !descricao || !preco || !quantidade || !fotoPrincipal) {
    return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
  }

  if (Array.isArray(fotosOpcionais) && fotosOpcionais.length > 3) {
    return res.status(400).json({ error: "Você pode adicionar no máximo 3 fotos opcionais" });
  }

  try {
    // Criar o produto no banco
    const produto = await prisma.produto.create({
      data: {
        name,
        descricao,
        preco: parseFloat(preco),
        quantidade: Number(quantidade),
        fotoPrincipal,
      },
    });
    // Criar imagens opcionais SE houverem
    if (Array.isArray(fotosOpcionais) && fotosOpcionais.length > 0) {
      // Garantir que todas as imagens sejam strings válidas
      const imagensValidas = fotosOpcionais.filter((foto) => typeof foto === "string");

      console.log("🖼️ Imagens validadas para inserção:", imagensValidas);

      if (imagensValidas.length > 0) {
        // Salvar todas as imagens usando Promise.all para maior eficiência
        await Promise.all(
          imagensValidas.map((url) =>
            prisma.imagem.create({
              data: {
                url,
                idProduto: produto.id, // Associando ao produto criado
              },
            })
          )
        );
      }
    }

    // Buscar o produto novamente com as imagens salvas
    const produtoComImagens = await prisma.produto.findUnique({
      where: { id: produto.id },
      include: { imagens: true },
    });

    console.log("📦 Produto final com imagens:", produtoComImagens);

    return res.status(201).json({
      message: "Produto cadastrado com sucesso!",
      produto: produtoComImagens,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar produto",
      details: (error as Error).message,
    });
  }
}
