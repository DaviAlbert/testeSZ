import React from "react";
import { 
  Container, 
  Title, 
  Section, 
  SectionTitle, 
  Text, 
  ButtonContainer, 
  AcceptButton,
} from "./style";
import { useRouter } from "next/router";

const TermsAndConditions: React.FC = () => {
    const router = useRouter()
    const voltar = () => {
        router.push('/login')
    }

  return (
    <Container>
      <Title>Termos e Condições</Title>

      <Section>
        <SectionTitle>1. Informações Gerais</SectionTitle>
        <Text>
          1.1. <strong>Loja ficticia</strong> é um e-commerce que vende produtos online.  
          1.2. Estes termos podem ser atualizados sem aviso prévio.
        </Text>
      </Section>

      <Section>
        <SectionTitle>2. Cadastro do Usuário</SectionTitle>
        <Text>
          2.1. O usuário deve fornecer informações corretas ao se cadastrar.  
          2.2. A segurança dos dados de login é de responsabilidade do usuário.  
          2.3. Contas suspeitas de fraude podem ser suspensas.  
        </Text>
      </Section>

      <Section>
        <SectionTitle>3. Compra e Pagamento</SectionTitle>
        <Text>
          3.1. Os preços podem ser alterados sem aviso prévio.  
          3.2. Aceitamos pagamento via cartão de crédito, boleto e Pix.  
          3.3. A compra só é confirmada após aprovação do pagamento.  
        </Text>
      </Section>

      <Section>
        <SectionTitle>4. Entrega e Frete</SectionTitle>
        <Text>
          4.1. O prazo de entrega depende da localidade e modalidade escolhida.  
          4.2. A loja não se responsabiliza por atrasos dos correios ou transportadoras.  
        </Text>
      </Section>

      <Section>
        <SectionTitle>5. Trocas e Devoluções</SectionTitle>
        <Text>
          5.1. O cliente pode solicitar devolução em até <strong>7 dias corridos</strong> após o recebimento.  
          5.2. Produtos devem estar sem uso e na embalagem original.  
          5.3. Produtos com defeito podem ser trocados dentro do prazo de garantia.  
        </Text>
      </Section>

      <Section>
        <SectionTitle>6. Privacidade e Segurança</SectionTitle>
        <Text>
          6.1. Os dados dos clientes são protegidos e não serão compartilhados sem consentimento.  
          6.2. Utilizamos criptografia para garantir a segurança das informações.  
        </Text>
      </Section>

      <Section>
        <SectionTitle>7. Disposições Finais</SectionTitle>
        <Text>
          7.1. Quaisquer disputas serão resolvidas no foro de <strong>Joinville</strong>.  
          7.2. Dúvidas? Contate-nos pelo e-mail: <a href="mailto:davitalbert@email.com">davitalbert@email.com</a>.  
        </Text>
      </Section>

      <ButtonContainer>
        <AcceptButton onClick={voltar}>Aceitar</AcceptButton>
      </ButtonContainer>
    </Container>
  );
};

export default TermsAndConditions;
