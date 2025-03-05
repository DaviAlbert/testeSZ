import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: any, res: any) {
  try {
    const { id } = req.query;
    console.log(id)

    if (req.method === 'GET') {
      const pedido = await prisma.pedido.findUnique({
        where: {
          id: String(id),
        },
        include: {
          user: true,
          produtos: {
            include: {
              produto: true,
            },
          },
        },
      })

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' })
      }
      
      res.status(200).json(pedido)
    } else {
      res.status(405).json({ message: 'Método não permitido' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar pedido' })
  } finally {
    await prisma.$disconnect()
  }
}
