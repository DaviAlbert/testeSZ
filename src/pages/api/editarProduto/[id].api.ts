import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { name, descricao, preco, quantidade, fotos, fotoPrincipal } = req.body

      // Atualiza o produto, permitindo alteração da foto principal
      const produtoAtualizado = await prisma.produto.update({
        where: { id: String(id) },
        data: { 
          name, 
          descricao, 
          preco: parseFloat(preco), 
          quantidade,
          fotoPrincipal: fotoPrincipal || undefined, // Atualiza a foto principal se fornecida
        },
      })

      // Se houver novas fotos, atualiza as imagens do produto
      if (fotos && fotos.length > 0) {
        // Deletar as imagens antigas, exceto a foto principal
        await prisma.imagem.deleteMany({
          where: { 
            idProduto: String(id),
          },
        })

        const lastThreeFotos = fotos.slice(-3);
        await prisma.imagem.createMany({
          data: lastThreeFotos.map((fotoUrl: string) => (console.log(fotoUrl), {
            url: fotoUrl,
            idProduto: String(id),
          })),
        })
      }

      // Retorna a resposta com o produto atualizado
      return res.status(200).json({ produto: produtoAtualizado })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao atualizar o produto ou as imagens.' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido.' })
}
