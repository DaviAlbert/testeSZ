// api/sendAdminEmail.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const users = await prisma.user.findMany({
      where: { admin: true },
      select: { email: true }, // Retorna apenas os e-mails
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Nenhum usuário encontrado' });
    }

    // Retorna um array de e-mails
    return res.status(200).json({ emails: users.map(user => user.email) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}
