import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { name, descricao, preco, quantidade, fotoPrincipal, fotosOpcionais } = req.body;

  if (!name || !descricao || !preco || !quantidade || !fotoPrincipal) {
    return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
  }

  if (preco <= 0 || isNaN(preco)) {
    return res.status(400).json({ error: "O preço deve ser um número válido maior que zero." });
  }
  if (quantidade <= 0 || isNaN(quantidade)) {
    return res.status(400).json({ error: "A quantidade deve ser um número válido maior que zero." });
  }

  if (Array.isArray(fotosOpcionais) && fotosOpcionais.length > 3) {
    return res.status(400).json({ error: "Você pode adicionar no máximo 3 fotos opcionais." });
  }

  try {
    const precoFormatado = parseFloat(preco).toFixed(2);
    const produto = await prisma.produto.create({
      data: {
        name,
        descricao,
        preco: parseFloat(precoFormatado),
        quantidade: Number(quantidade),
        fotoPrincipal,
      },
    });

    if (Array.isArray(fotosOpcionais) && fotosOpcionais.length > 0) {
      const imagensValidas = fotosOpcionais.filter((foto) => typeof foto === "string");

      if (imagensValidas.length > 0) {
        await Promise.all(
          imagensValidas.map((url) =>
            prisma.imagem.create({
              data: {
                url,
                idProduto: produto.id,
              },
            })
          )
        );
      }
    }

    return res.status(201).json({message: "Produto cadastrado com sucesso!"});
  } catch (error) {

    return res.status(500).json({
      error: "Erro ao criar produto",
      details: error
    });
  }
}
