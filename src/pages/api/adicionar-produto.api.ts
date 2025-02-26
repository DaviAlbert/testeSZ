import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { nome, descricao, preco, quantidade, imagens } = req.body

  console.log(req.body)
  if (
    !nome ||
    !descricao ||
    !preco ||
    !quantidade ||
    !imagens ||
    imagens.length === 0
  ) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
  }

  try {
    const produto = await prisma.produto.create({
      data: {
        name: nome,
        descricao,
        preco: parseFloat(preco),
        quantidade: Number(quantidade),
        imagens: {
          create: imagens.map((url: string) => ({ url })),
        },
      },
      include: {
        imagens: true, // Retorna as imagens junto com o produto
      },
    })

    return res
      .status(201)
      .json({ message: 'Produto cadastrado com sucesso!', produto })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return res
      .status(500)
      .json({ error: 'Erro ao criar produto', details: error })
  }
}
