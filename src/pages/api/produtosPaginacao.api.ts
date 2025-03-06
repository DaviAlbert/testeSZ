import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { pagina = 1, limite = 15 } = req.query

  // Convertendo pagina e limite para inteiros
  const page = parseInt(pagina as string, 10) || 1
  const perPage = parseInt(limite as string, 10) || 15

  try {
    // Calcular o número de saltos com base na página atual
    const skip = (page - 1) * perPage

    // Obter os produtos com base na página e no limite
    const produtos = await prisma.produto.findMany({
      skip: skip,
      take: perPage,
      orderBy: {
        created_at: 'desc', // Ordenando por data de criação, pode alterar conforme necessário
      },
    })

    // Contar o total de produtos para permitir a paginação total
    const totalProducts = await prisma.produto.count()

    // Retornar os dados dos produtos e o total de produtos
    res.status(200).json({
      produtos,
      total: totalProducts,
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  } finally {
    await prisma.$disconnect()
  }
}
