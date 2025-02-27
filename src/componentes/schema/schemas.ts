import { z } from 'zod'

// Expressão regular para validar uma string Base64 de imagem
const base64Regex =
  /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/

const imageSchema = z.object({
  url: z
    .string()
    .refine((val) => val.startsWith('http') || base64Regex.test(val), {
      message: 'A imagem deve ser uma URL válida ou um Base64 válido',
    }),
})

// Validação para Produto
export const ProdutoSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome do produto é obrigatório'),
  descricao: z.string(),
  preco: z.number().min(0, 'O preço deve ser um número positivo'),
  quantidade: z
    .number()
    .int()
    .min(0, 'A quantidade deve ser um número inteiro positivo'),
  imagens: z.array(imageSchema),
})

// Validação para Produto no Carrinho
export const ProdutoCarrinhoSchema = z.object({
  name: z.string().min(1),
  quantidade: z.number().int().min(1, 'A quantidade deve ser pelo menos 1'),
  preco: z.number().min(0),
})

// Validação do Token do Usuário
export const TokenSchema = z.object({
  admin: z.boolean(),
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  telefone: z.string().optional(),
  nascimento: z.string().optional(),
})

// Validação do Cadastro de Usuário na página de login
export const CadastroSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  admin: z.boolean().default(false),
  telefone: z
    .string()
    .min(5, 'O telefone deve ter pelo menos 5 caracteres')
    .optional(),
  nascimento: z.string().min(2, 'A data de nascimento é obrigatória'),
  imagemBase64: z.string(),
})

// Validação dos dados de login na página de auth
export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string(),
})
