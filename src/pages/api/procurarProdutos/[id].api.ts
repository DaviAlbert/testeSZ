import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { q } = req.query // Obtém o termo de pesquisa
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Parâmetro de busca inválido' })
    }

    // Converte o termo de pesquisa para Float caso o usuário busque por preço
    const precoBusca = parseFloat(q)

    const produtos = await prisma.produto.findMany({
      where: {
        OR: [
          { name: { contains: q } }, // Busca no nome
          { descricao: { contains: q } }, // Busca na descrição
          isNaN(precoBusca) ? {} : { preco: precoBusca }, // Busca por preço (se for um número válido)
        ],
      },
      include: {
        imagens: true, // Inclui as imagens dos produtos
      },
    })

    res.status(200).json({ produtos })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
