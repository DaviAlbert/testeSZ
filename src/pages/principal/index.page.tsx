import React, { useEffect, useState, useRef } from 'react'
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
  ProdutoInfo,
  QuantidadeContainer,
} from './style'
import Image from 'next/image'
import Header from '../../componentes/header'
import Footer from '../../componentes/footer'
import { TokenSchema } from '../../componentes/schema/schemas'
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
  fotoPrincipal?: string;
  descricao?: string;
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
  const [id, setId] = useState('');
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
          setId(parsedToken.data.id)
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
        const response = await fetch('/api/produtosPrincipal');
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

      // Chama a primeira API para criar o pedido após adicionar o produto ao carrinho
      await fetch('http://localhost:3000/api/pedidos/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id }),
      })

      // Chama a primeira API para criar o pedido após adicionar o produto ao carrinho
      const response = await fetch('/api/sendAdminEmail', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
  
      if (!data || !data.emails || data.emails.length === 0) {
        throw new Error("Nenhum e-mail de admin encontrado.");
      }
  
      const emailPromises = data.emails.map(async (email: string) => {
        return emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            to_name: "Admin",
            from_name: userName || "Usuário Anônimo",
            valor: `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`,
            to_email: email,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
      });
  
      await Promise.all(emailPromises);
  
      // 🔴 NOVA PARTE: Limpar o carrinho no backend
      if (tokenObject.current.id) {
        await fetch('/api/carrinho/limpar', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: tokenObject.current.id }),
        });
      }
  
      // 🔴 NOVA PARTE: Limpar o carrinho no frontend
      setProdutosCarrinho([]);
      alert("Compra finalizada! Seu carrinho foi esvaziado.");
    } catch (error) {
      console.error("❌ Erro ao enviar e-mails:", error);
      alert("Erro ao finalizar compra.");
    }
  }  

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
  
    const userId = tokenObject.current.id;
    const produtoId = selectedProduct.id;
  
    const response = await fetch('/api/carrinho/adicionar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        produtoId,
        quantidade: selectedQuantity,
      }),
    });
  
    if (response.ok) {
      setProdutosCarrinho((prevCarrinho) => {
        const produtoExistente = prevCarrinho.find((p) => p.id === produtoId);
  
        if (produtoExistente) {
          return prevCarrinho.map((p) =>
            p.id === produtoId
              ? { ...p, quantidade: p.quantidade + selectedQuantity }
              : p
          );
        } else {
          return [
            ...prevCarrinho,
            {
              id: selectedProduct.id,
              name: selectedProduct.name,
              quantidade: selectedQuantity,
              preco: selectedProduct.preco,
            },
          ];
        }
      });
  
      setModalVisible(false);
    } else {
      const errorData = await response.json();
      alert(
        `Erro ao adicionar produto ao carrinho: ${errorData.error || 'Erro desconhecido'}`
      );
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
              <CarrinhoContainer className={isCartOpen ? 'open' : 'closed'}>
                <Fechar onClick={toggleCart}>✖</Fechar>
      
                {produtosCarrinho.length > 0 ? (
                  produtosCarrinho.map((produto, index) => (
                    <Produto key={index}>
                    <Image
                      src={produto.fotoPrincipal || '/default-image.jpg'}
                      alt={produto.name}
                      width={100}
                      height={100}
                    />
                    <ProdutoInfo>
                    <h3>{produto.name}</h3>
                    <p>{produto.descricao}</p>
                    <p>R$ {produto.preco.toFixed(2).replace('.', ',')}</p>
    
                    <QuantidadeContainer>
                      <p>Qtd: </p>
                      <QuantidadeCarinho
                        type="number"
                        min="1"
                        max={produtos.find((p) => p.id === produto.id)?.quantidade || 1}
                        value={produto.quantidade}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          const estoqueDisponivel = produtos.find((p) => p.id === produto.id)?.quantidade || 1;
                          if (value > estoqueDisponivel) value = estoqueDisponivel;

                          handleUpdateQuantity(produto.id, value);
                        }}
                      />
                    </QuantidadeContainer>
                  </ProdutoInfo>
                  <button onClick={() => handleRemoveFromCart(produto.id)}>
                    🗑️
                  </button>
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