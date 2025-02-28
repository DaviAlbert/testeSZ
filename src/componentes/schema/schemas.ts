import { z } from 'zod'

// Validação para verificar se uma imagem está em base 64 ou URL válida
const base64Regex =
  /^data:image\/(png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/

const imageSchema = z.object({
  url: z
    .string()
    .refine((val) => val.startsWith('http') || base64Regex.test(val), {
      message: 'A imagem deve ser uma URL válida ou um Base64 válido',
    }),
})

// ✅ Validação para cadastro de Produto
export const ProdutoSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'O nome do produto é obrigatório'),
  descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  preco: z.number().min(0.01, 'O preço deve ser maior que zero'),
  quantidade: z.number().int().min(1, 'A quantidade deve ser pelo menos 1'),

  fotoPrincipal: z
    .string()
    .refine((val) => val.startsWith('http') || base64Regex.test(val), {
      message: 'A foto principal deve ser uma URL válida ou um Base64 válido',
    }),

  fotosOpcionais: z
    .array(imageSchema)
    .max(3, 'Máximo de 3 fotos opcionais')
    .optional(),
})

// ✅ Validação para adicionar Produto ao Carrinho
export const ProdutoCarrinhoSchema = z.object({
  name: z.string().min(1, 'O name do produto é obrigatório'),
  quantidade: z.number().int().min(1, 'A quantidade deve ser pelo menos 1'),
  preco: z.number().min(0, 'O preço deve ser um número positivo'),
})

// ✅ Validação da criação de Token do Usuário
export const TokenSchema = z.object({
  admin: z.boolean(),
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  telefone: z.string().optional(),
  nascimento: z.string().optional(),
})

// ✅ Validação do Cadastro de Usuário na página de login
export const CadastroSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  admin: z.boolean().default(false),
  telefone: z.string().optional(),
  nascimento: z.string().min(2, 'A data de nascimento é obrigatória'),
  imagemBase64: z
    .string()
    .refine((val) => base64Regex.test(val), {
      message: 'A imagem deve ser um Base64 válido',
    })
    .optional(),
})

// ✅ Validação dos dados de autenticação de usuário na página de auth
export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string(),
})
