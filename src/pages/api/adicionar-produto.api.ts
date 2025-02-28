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

  const { name, descricao, preco, quantidade, fotoPrincipal, fotosOpcionais } =
    req.body

  // Validações antes de salvar no banco de dados
  if (!name || !descricao || !preco || !quantidade || !fotoPrincipal) {
    return res
      .status(400)
      .json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
  }

  if (fotosOpcionais && fotosOpcionais.length > 3) {
    return res
      .status(400)
      .json({ error: 'Você pode adicionar no máximo 3 fotos opcionais' })
  }

  try {
    const produto = await prisma.produto.create({
      data: {
        name,
        descricao,
        preco: parseFloat(preco),
        quantidade: Number(quantidade),
        fotoPrincipal,
        imagens: {
          create: fotosOpcionais
            ? fotosOpcionais.map((url: string) => ({ url }))
            : [],
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
