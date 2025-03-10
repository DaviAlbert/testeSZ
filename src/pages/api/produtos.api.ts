import prisma from '../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

// Interface para o formato de erro
interface ErrorResponse {
  error: string
}

// Função para obter todos os produtos direto do banco de dados
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    console.log('Buscando produtos diretamente no banco de dados...')

    // Buscar produtos no banco de dados
    const produtos = await prisma.produto.findMany({
      include: {
        imagens: true,
      },
    })

    if (!produtos || produtos.length === 0) {
      console.log('Nenhum produto encontrado no banco.')
      return res.status(404).json({ error: 'Nenhum produto encontrado' })
    }

    console.log('Produtos encontrados no banco.')

    // 🔹 Convertendo BigInt para Number
    const produtosFormatados = produtos.map((produto) => ({
      ...produto,
      preco: Number(produto.preco), // Se 'preco' for BigInt, converte para Number
      quantidade: Number(produto.quantidade), // Se 'quantidade' for BigInt, converte para Number
    }))

    res.status(200).json(produtosFormatados)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    res
      .status(500)
      .json({ error: `Erro ao buscar produtos: ${error.message || error}` })
  }
}


// Função para buscar um produto específico diretamente do banco de dados
export async function get(id: string, res: NextApiResponse): Promise<void> {
  try {
    console.log(`Buscando produto com ID: ${id} diretamente no banco de dados...`)

    // Buscar um produto pelo ID
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        imagens: true,
      },
    })

    if (!produto) {
      console.log(`Produto com ID: ${id} não encontrado.`)
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    console.log(`Produto com ID: ${id} encontrado no banco.`)
    res.status(200).json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    res
      .status(500)
      .json({ error: `Erro ao buscar produto: ${error.message || error}` } as ErrorResponse)
  }
}
