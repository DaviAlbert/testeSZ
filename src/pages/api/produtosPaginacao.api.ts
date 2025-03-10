import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { pagina = 1, limite = 15 } = req.query

  // Convertendo pagina e limite para inteiros e validando
  const page = parseInt(pagina as string, 10)
  const perPage = parseInt(limite as string, 10)

  if (isNaN(page) || page < 1) {
    return res.status(400).json({ error: 'Parâmetro "pagina" inválido' })
  }

  if (isNaN(perPage) || perPage < 1) {
    return res.status(400).json({ error: 'Parâmetro "limite" inválido' })
  }

  try {
    // Calcular o número de saltos com base na página atual
    const skip = (page - 1) * perPage

    console.log(`Buscando produtos: Página ${page}, Limite ${perPage}, Skip ${skip}`)

    // Obter os produtos com base na página e no limite
    const produtos = await prisma.produto.findMany({
      skip: skip,
      take: perPage,
      orderBy: {
        created_at: 'desc', // Ordenando por data de criação
      },
    })

    // Verificar se produtos foi retornado
    if (!produtos || produtos.length === 0) {
      console.log('Nenhum produto encontrado.')
      return res.status(404).json({ error: 'Nenhum produto encontrado' })
    }

    // Contar o total de produtos
    const totalProducts = await prisma.produto.count()

    // Converter totalProducts para número para evitar BigInt
    const total = Number(totalProducts)

    // Função para limpar os produtos (convertendo Float para string)
    const cleanProdutos = produtos.map((produto) => ({
      ...produto,
      preco: produto.preco.toFixed(2), // Garantir que o preço seja uma string com 2 casas decimais
    }))

    // Retornar os dados dos produtos e o total de produtos
    res.status(200).json({
      produtos: cleanProdutos,
      total, // Certifique-se de que o total seja um número ou string
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    res.status(500).json({ error: `Erro ao buscar produtos: ${error.message || error}` })
  } finally {
    await prisma.$disconnect()
  }
}
