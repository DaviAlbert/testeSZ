import prisma from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

// Interface para o formato de erro
interface ErrorResponse {
  error: string
}

// Cache distribuído para pedidos
const distributedCache: { [key: string]: any } = {}

// Função para buscar todos os pedidos
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    console.log('Verificando no cache distribuído para pedidos...')

    // Verificar se os pedidos estão em cache
    if (distributedCache['pedidos']) {
      console.log('Dados encontrados no cache distribuído.')
      return res.status(200).json(distributedCache['pedidos'])
    }

    console.log('Dados não encontrados no cache. Buscando no banco de dados...')

    // Caso os dados não estejam no cache, buscar no banco de dados
    const pedidos = await prisma.pedido.findMany({
      include: {
        produtos: {
          include: {
            produto: true, // Incluir os dados do produto
          },
        },
      },
    })

    if (!pedidos || pedidos.length === 0) {
      console.log('Nenhum pedido encontrado no banco.')
      return res.status(404).json({ error: 'Nenhum pedido encontrado' })
    }

    console.log('Dados de pedidos encontrados no banco. Armazenando no cache distribuído...')

    // Armazenar os dados no cache distribuído
    distributedCache['pedidos'] = pedidos

    console.log('Dados de pedidos armazenados no cache distribuído.')
    res.status(200).json(pedidos)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    res.status(500).json({
      error: `Erro ao buscar pedidos: ${error.message || error}`,
    } as ErrorResponse)
  }
}

// Função de busca de um pedido específico com cache distribuído
export async function get(id: string, res: NextApiResponse): Promise<void> {
  try {
    // Verificar se o pedido está em cache distribuído
    if (distributedCache[`pedido-${id}`]) {
      return res.status(200).json(distributedCache[`pedido-${id}`])
    }

    // Caso não tenha no cache, buscar no banco de dados
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        produtos: {
          include: {
            produto: true, // Incluir os dados do produto
          },
        },
      },
    })

    if (!pedido) {
      console.log(`Pedido não encontrado no banco de dados para o ID: ${id}`)
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    console.log(`Pedido com ID: ${id} encontrado no banco. Armazenando no cache distribuído...`)

    // Armazenar o pedido no cache distribuído
    distributedCache[`pedido-${id}`] = pedido

    console.log(`Pedido com ID: ${id} armazenado no cache distribuído.`)
    res.status(200).json(pedido)
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    res.status(500).json({
      error: `Erro ao buscar pedido: ${error.message || error}`,
    } as ErrorResponse)
  }
}
