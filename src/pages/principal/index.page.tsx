import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import {
  AddToCartButton,
  Container,
  ProductCard,
  ProductImage,
  ProductList,
  Item,
  Modal,
  ModalContent,
  QuantidadeCarinho,
  ModalOverlay,
  Quantidade,
  Titulo,
  FinalizarCompra,
  CarrinhoContainer,
  Adicionado,
  Fechar,
  Backdrop,
  Produto,
} from './style'
import Header from '../../componentes/header'
import Footer from '../../componentes/footer'
import { ProdutoSchema, TokenSchema } from '../../componentes/schema/schemas'
import emailjs from "@emailjs/browser";

export interface Produto {
  imagens: any;
  name: string;
  descricao: string;
  preco: number;
  quantidade: number;
  id: string;
  fotoPrincipal?: string;
  fotosOpcionais?: { url: string }[];
}
interface ProdutoCarrinho {
  id: string;
  name: string;
  quantidade: number;
  preco: number;
}

export default function Home() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [totalCarrinho, setTotalCarrinho] = useState(0);
  const [quantidades] = useState<number[]>([])
  const [userName, setUserName] = useState<string | null>(null);
  const [produtosCarrinho, setProdutosCarrinho] = useState<ProdutoCarrinho[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const tokenObject = useRef<{ admin?: boolean; id?: string; name?: string }>({});

  useEffect(() => {
    setTotalCarrinho(produtosCarrinho.reduce((acc, produto) => acc + produto.preco * produto.quantidade, 0));
  }, [produtosCarrinho]);

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken');

    if (tokenFromCookie) {
      try {
        const decodedToken = JSON.parse(decodeURIComponent(tokenFromCookie));
        const parsedToken = TokenSchema.safeParse(decodedToken);

        if (parsedToken.success) {
          tokenObject.current = parsedToken.data;
          setIsLoggedIn(true);
          setAdmin(!!parsedToken.data.admin);
          setUserName(parsedToken.data.name || 'Usuário');
        } else {
          console.error('Token inválido:', parsedToken.error);
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !tokenObject.current.id) return;

    const fetchCarrinho = async () => {
      try {
        const response = await fetch(`/api/carrinho/${tokenObject.current.id}`);
        if (!response.ok) throw new Error('Erro ao buscar carrinho');
        
        const data = await response.json();
        if (data.produtos) {
          setProdutosCarrinho(data.produtos);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCarrinho();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('/api/produtos');
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  const sendOrderEmail = async () => {
    try {
      // Chama a API para pegar todos os e-mails dos administradores
      const response = await fetch('/api/sendAdminEmail', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      const data = await response.json();
  
      // Verifica se a API retornou os e-mails corretamente
      if (!data || !data.emails || data.emails.length === 0) {
        throw new Error("Nenhum e-mail de admin encontrado.");
      }
  
      // Envia um e-mail para cada administrador encontrado
      const emailPromises = data.emails.map(async (email: string) => {
        return emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            to_name: "Admin",
            from_name: userName || "Usuário Anônimo",
            valor: `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`,
            to_email: email, // Envia para cada e-mail individualmente
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
      });
  
      // Aguarda o envio de todos os e-mails
      await Promise.all(emailPromises);
  
      console.log("✅ Emails enviados com sucesso!");
      alert("E-mails enviados com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao enviar e-mails:", error);
      alert("Erro ao enviar e-mails.");
    }
  };  

  const handleRemoveFromCart = async (produtoId: string) => {
    if (!tokenObject.current.id) return;

    try {
      const response = await fetch('/api/carrinho/remover', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: tokenObject.current.id, produtoId }),
      });

      if (response.ok) {
        setProdutosCarrinho((prev) => prev.filter((p) => p.id !== produtoId));
        alert('Produto removido do carrinho!');
      } else {
        const errorData = await response.json();
        alert(`Erro ao remover produto: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao remover produto do carrinho.');
    }
  };

  const handleClickProduto = (id: string) => {
    router.push(`/produto/${id}`);
  };

  const handleAddToCart = (produto: Produto) => {
    setSelectedProduct(produto);
    setModalVisible(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;

    const validProduto = ProdutoSchema.safeParse(selectedProduct);
    if (!validProduto.success) {
      alert('Erro ao validar o produto!');
      console.error(validProduto.error);
      return;
    }

    if (!tokenObject.current.id) return;

    try {
      const response = await fetch('/api/carrinho/adicionar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: tokenObject.current.id,
          produtoId: validProduto.data.id,
          quantidade: selectedQuantity,
        }),
      });

      if (response.ok) {
        alert('Produto adicionado ao carrinho!');
        setModalVisible(false);
      } else {
        const errorData = await response.json();
        alert(`Erro ao adicionar produto ao carrinho: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao adicionar produto ao carrinho.');
    }
  };

  const handleUpdateQuantity = async (produtoId: string, novaQuantidade: number) => {
    if (!tokenObject.current.id) return;
  
    try {
      const response = await fetch('/api/carrinho/atualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: tokenObject.current.id,
          produtoId,
          quantidade: novaQuantidade,
        }),
      });
  
      if (response.ok) {
        setProdutosCarrinho((prev) =>
          prev.map((produto) =>
            produto.id === produtoId ? { ...produto, quantidade: novaQuantidade } : produto
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar quantidade: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao atualizar a quantidade do produto.');
    }
  }  

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Ordena os produtos do mais barato para o mais caro e pega os dois primeiros produtos
  const produtosMaisBaratos = [...produtos]
    .sort((a, b) => a.preco - b.preco)
    .slice(0, 2)

  const produtosComMenosQuantidade = [...produtos]
    .sort((a, b) => a.quantidade - b.quantidade)
    .slice(0, 2)

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        toggleCart={toggleCart}
        Itens={produtosCarrinho.length}
        Admin={admin}
      />

      <Titulo>Ofertas especiais:</Titulo>
      <Container>
        <ProductList>
          {produtosMaisBaratos.map((produto) => (
            <ProductCard key={produto.id}>
              <Item onClick={() => handleClickProduto(produto.id)}>
                {produto.name}
              </Item>
              <ProductImage
                src={produto.fotoPrincipal}
                alt={produto.name}
                onClick={() => handleClickProduto(produto.id)}
              />
              <div onClick={() => handleClickProduto(produto.id)}>
                <Item>{produto.descricao}</Item>
                <Item>
                  Preço: R$ {produto.preco.toFixed(2).replace('.', ',')}
                </Item>
                <Item>Quantidade disponível: {produto.quantidade}</Item>
              </div>
              <AddToCartButton onClick={() => handleAddToCart(produto)}>
                Adicionar no carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductList>
      </Container>

      <Titulo>ultimas unidades:</Titulo>
      <Container>
        <ProductList>
          {produtosComMenosQuantidade.map((produto) => (
            <ProductCard key={produto.id}>
              <Item onClick={() => handleClickProduto(produto.id)}>
                {produto.name}
              </Item>
              <ProductImage
                src={produto.fotoPrincipal}
                alt={produto.name}
                onClick={() => handleClickProduto(produto.id)}
              />
              <div onClick={() => handleClickProduto(produto.id)}>
                <Item>{produto.descricao}</Item>
                <Item>
                  Preço: R$ {produto.preco.toFixed(2).replace('.', ',')}
                </Item>
                <Item>Quantidade disponível: {produto.quantidade}</Item>
              </div>
              <AddToCartButton onClick={() => handleAddToCart(produto)}>
                Adicionar no carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductList>
      </Container>

      {isCartOpen && (
        <>
          <Backdrop onClick={toggleCart} />
          <CarrinhoContainer>
            <Fechar onClick={toggleCart}>✖</Fechar>

            {produtosCarrinho.length > 0 ? (
              produtosCarrinho.map((produto, index) => (
                <Produto key={index}>
                  <div>
                    <h3 style={{ color: '#fff', marginBottom: '5px' }}>
                      {produto.name}
                    </h3>
                    <p>R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
                    <Adicionado>
                    <p>Qtd: </p>
                    <QuantidadeCarinho
                      type="number"
                      min="1"
                      max={quantidades[produtos.indexOf(selectedProduct!)]}
                      value={produto.quantidade}
                      onChange={(e) => handleUpdateQuantity(produto.id, Number(e.target.value))}
                    />
                    </Adicionado>
                  </div>
                  <button onClick={() => handleRemoveFromCart(produto.id)}>🗑️</button>
                </Produto>
              ))
            ) : (
              <p>Seu carrinho está vazio.</p>
            )}
            <h3>Total: R$ {totalCarrinho.toFixed(2).replace('.', ',')}</h3>
            <FinalizarCompra onClick={sendOrderEmail}>Finalizar Compra</FinalizarCompra>
          </CarrinhoContainer>
        </>
      )}

      {modalVisible && selectedProduct && (
        <ModalOverlay style={{ backgroundColor: '$gray800' }}>
          <Modal>
            <ModalContent>
              <h3>{`Escolha a quantidade de ${selectedProduct.name}`}</h3>
              <Quantidade
                type="number"
                min="1"
                max={selectedProduct.quantidade}
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', gap: '5px' }}>
                <AddToCartButton onClick={() => setModalVisible(false)}>
                  Cancelar
                </AddToCartButton>
                <AddToCartButton onClick={handleConfirmAddToCart}>
                  Confirmar
                </AddToCartButton>
              </div>
            </ModalContent>
          </Modal>
        </ModalOverlay>
      )}
      <Footer />
    </>
  )
}
