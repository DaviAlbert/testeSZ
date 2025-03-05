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
  Produto,
  Modal,
  ModalContent,
  ModalOverlay,
  Quantidade,
  Nav,
  Adicionado,
  Backdrop,
  CarrinhoContainer,
  FinalizarCompra,
  Fechar,
  SearchInput,
  QuantidadeCarinho,
} from './style'
import Header from '../../componentes/header'
import Footer from '../../componentes/footer'
import {TokenSchema } from '../../componentes/schema/schemas'
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
  const router = useRouter()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoPesquisa, setProdutoPesquisa] = useState('')
  const [quantidades] = useState<number[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [totalCarrinho, setTotalCarrinho] = useState(0);
  const [userName, setUserName] = useState<string | null>(null)
  const [produtosCarrinho, setProdutosCarrinho] = useState<ProdutoCarrinho[]>(
    [],
  )
  const [isCartOpen, setIsCartOpen] = useState(false)
  const tokenObject = useRef<{ admin?: boolean; id?: string; name?: string }>(
    {},
  )

  useEffect(() => {
    const total = produtosCarrinho.reduce((acc, produto) => {
      return acc + produto.preco * produto.quantidade;
    }, 0);
  
    setTotalCarrinho(total);
  }, [produtosCarrinho]);  

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken')

    if (tokenFromCookie) {
      try {
        const decodedToken = JSON.parse(decodeURIComponent(tokenFromCookie))
        const parsedToken = TokenSchema.safeParse(decodedToken)

        if (parsedToken.success) {
          tokenObject.current = parsedToken.data
          setIsLoggedIn(true)
          setUserName(parsedToken.data.name || 'Usuário')
        } else {
          console.error('Token inválido:', parsedToken.error)
          router.push('/')
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [])

  useEffect(() => {
    if (tokenObject.current.id) {
      const fetchCarrinho = async () => {
        const response = await fetch(`/api/carrinho/${tokenObject.current.id}`)
        const data = await response.json()
        if (data.produtos) {
          setProdutosCarrinho(data.produtos)
        }
      }
      fetchCarrinho()
    }
  }, [tokenObject.current])

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('/api/produtos')
        const data = await response.json()
          const produtosFormatados = data.map((produto) => ({
            ...produto,
            imagens: produto.fotosOpcionais ?? [],
          }));
        
          setProdutos(produtosFormatados);
        
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }
    fetchProdutos()
  }, [])

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
            to_email: email,
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
    router.push(`/produto/${id}`)
  }

  const handleAddToCart = (produto: Produto) => {
    setSelectedProduct(produto)
    setModalVisible(true)
  }

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

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
    console.log(isCartOpen)
  }

  // Filtra os produtos com base no nome, descrição e preço
  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.name.toLowerCase().includes(produtoPesquisa.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(produtoPesquisa.toLowerCase()) ||
      String(produto.preco)
        .toLowerCase()
        .includes(produtoPesquisa.toLowerCase()),
  )

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        toggleCart={toggleCart}
        Itens={produtosCarrinho.length}
        Admin={tokenObject.current.admin ?? false}
      />

      <Nav>
        <a href="/">PRODUTOS</a>
        <SearchInput
          type="text"
          placeholder="Pesquise produtos..."
          value={produtoPesquisa}
          onChange={(e) => setProdutoPesquisa(e.target.value)}
        />
      </Nav>

      {isCartOpen && (
        <>
          <Backdrop onClick={toggleCart} />
          <CarrinhoContainer className={isCartOpen ? 'open' : 'closed'}>
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

      <Container>
        <ProductList>
          {filteredProdutos.map((produto) => (
            <ProductCard key={produto.id}>
              <Item onClick={() => handleClickProduto(produto.id)}>
                {produto.name}
              </Item>
              {produto.fotoPrincipal != null && (
                <ProductImage
                  src={produto.fotoPrincipal} 
                  alt={produto.name}
                />
              )}
              <div onClick={() => handleClickProduto(produto.id)}>
                <Item>{produto.descricao}</Item>
                <Item>Preço: {produto.preco}</Item>
                <Item>Quantidade disponível: {produto.quantidade}</Item>
              </div>
              <AddToCartButton onClick={() => handleAddToCart(produto)}>
                Adicionar no carrinho
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductList>
      </Container>

      {modalVisible && selectedProduct && (
        <ModalOverlay>
          <Modal>
            <ModalContent>
              <h3>{`Escolha a quantidade de ${selectedProduct.name}`}</h3>
              <Quantidade
                type="number"
                min="1"
                max={quantidades[produtos.indexOf(selectedProduct)]}
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              />
              <div>
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
