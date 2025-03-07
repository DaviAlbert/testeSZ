import prisma from '../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

// Interface para o formato de erro
interface ErrorResponse {
  error: string
}

// Exemplo de cache distribuído (no caso aqui, apenas representando a ideia, com Redis ou outro banco distribuído seria o ideal)
const distributedCache: { [key: string]: unknown } = {}

// Função para obter todos os produtos
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    console.log('Verificando no cache distribuído para produtos...')

    // Verificar se os produtos estão em cache
    if (distributedCache['produtos']) {
      console.log('Dados encontrados no cache distribuído.')
      return res.status(200).json(distributedCache['produtos'])
    }

    console.log('Dados não encontrados no cache. Buscando no banco de dados...')

    // Caso os dados não estejam no cache, buscar no banco de dados
    const produtos = await prisma.produto.findMany({
      include: {
        imagens: true,
      },
    })

    if (!produtos || produtos.length === 0) {
      console.log('Nenhum produto encontrado no banco.')
      return res.status(404).json({ error: 'Nenhum produto encontrado' })
    }

    console.log('Dados de produtos encontrados no banco. Armazenando no cache distribuído...')

    // Armazenar os dados no cache distribuído
    distributedCache['produtos'] = produtos

    console.log('Dados de produtos armazenados no cache distribuído.')
    res.status(200).json(produtos)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    res
      .status(500)
      .json({ error: `Erro ao buscar produtos: ${error.message || error}` } as ErrorResponse)
  }
}

// Função de busca de um produto específico com cache distribuído
export async function get(id: string, res: NextApiResponse): Promise<void> {
  try {

    // Verificar se o produto está em cache distribuído
    if (distributedCache[`produto-${id}`]) {
      return res.status(200).json(distributedCache[`produto-${id}`])
    }

    // Caso não tenha no cache, buscar no banco de dados
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        imagens: true,
      },
    })

    if (!produto) {
      console.log(`Produto não encontrado no banco de dados para o ID: ${id}`)
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    console.log(`Produto com ID: ${id} encontrado no banco. Armazenando no cache distribuído...`)

    // Armazenar o produto no cache distribuído
    distributedCache[`produto-${id}`] = produto

    console.log(`Produto com ID: ${id} armazenado no cache distribuído.`)
    res.status(200).json(produto)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    res
      .status(500)
      .json({ error: `Erro ao buscar produto: ${error.message || error}` } as ErrorResponse)
  }
}
