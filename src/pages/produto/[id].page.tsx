import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Slider from 'react-slick';
import { Container, Image, Button, AddToCartButton, Quantidade, ModalContent, Modal, ModalOverlay } from './style';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '../../componentes/header';
import Footer from '../../componentes/footer';
import { TokenSchema } from '../../componentes/schema/schemas';

interface Produto {
  id: string;
  name: string;
  descricao: string;
  preco: number;
  quantidade: number;
  fotoPrincipal: string;
  imagens: { id: string; url: string }[];
}

interface ProdutoCarrinho {
  id: string;
  name: string;
  quantidade: number;
  preco: number;
}

export default function ProdutoDetalhado() {
  const router = useRouter();
  const { id } = router.query;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [produtosCarrinho, setProdutosCarrinho] = useState<ProdutoCarrinho[]>([]);
  const [username, setUsername] = useState('');
  const [idUser, setId] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const tokenObject = useRef<{ admin?: boolean; id?: string; name?: string }>({});
  const [totalCarrinho, setTotalCarrinho] = useState(0);

  useEffect(() => {
    const tokenFromCookie = Cookies.get('authToken');

    if (tokenFromCookie) {
      try {
        const decodedToken = JSON.parse(decodeURIComponent(tokenFromCookie));
        const parsedToken = TokenSchema.safeParse(decodedToken);

        if (parsedToken.success) {
          tokenObject.current = parsedToken.data;
          setIsLoggedIn(true);
          setId(parsedToken.data.id);
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
    setTotalCarrinho(produtosCarrinho.reduce((acc, produto) => acc + produto.preco * produto.quantidade, 0));
  }, [produtosCarrinho]);

  useEffect(() => {
    if (!id) return;

    const fetchProduto = async () => {
      try {
        const response = await fetch(`/api/procurarProdutos/${id}`);
        if (!response.ok) throw new Error('Produto não encontrado');
        const data: Produto = await response.json();
        setProduto(data);
      } catch (error) {
        console.error(error);
        alert('Erro ao buscar produto');
      }
    };

    fetchProduto();
  }, [id]);

  useEffect(() => {
    const userCookie = Cookies.get('authToken');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setIsLoggedIn(true);
      setUsername(user.name);
      setIsAdmin(user.admin);
    } else {
      router.push('/login');
    }
  }, [router, isAdmin]);

  const setRota = (id: string) => {
    router.push(`/editar/produto/${id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/deletarProduto/${produto?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Produto excluído com sucesso!');
        router.push('/catalogo');
      } else {
        alert('Erro ao excluir o produto.');
      }
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  const handleAddToCart = (produto: Produto) => {
    setSelectedProduct(produto);
    setModalVisible(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;

    const userId = tokenObject.current.id;
    const produtoId = selectedProduct.id;

    try {
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
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao adicionar o produto ao carrinho.');
    }
  };

  if (!produto) return <p>Carregando...</p>;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} userName={username} Itens={produtosCarrinho.length} Admin={isAdmin} />
      <Container>
        <h1>{produto.name}</h1>
        <div style={{ width: '50%', minWidth: '300px', margin: 'auto' }}>
          <Slider {...settings}>
            <div>
              <Image
                src={produto.fotoPrincipal}
                alt={`Imagem principal de ${produto.name}`}
              />
            </div>
            {produto.imagens.map((imagem) => (
              <div key={imagem.id}>
                <Image src={imagem.url} alt={produto.name} />
              </div>
            ))}
          </Slider>
        </div>
        <p><strong>Descrição:</strong> {produto.descricao}</p>
        <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</p>
        <p><strong>Quantidade disponível:</strong> {produto.quantidade}</p>

        <AddToCartButton onClick={() => handleAddToCart(produto)}>
          Adicionar no carrinho
        </AddToCartButton>

        {isAdmin && (
          <div>
            <Button onClick={() => setRota(produto.id)}>Editar</Button>
            <Button onClick={handleDelete}>Excluir</Button>
          </div>
        )}
      </Container>

      {modalVisible && selectedProduct && (
        <ModalOverlay>
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
  );
}
