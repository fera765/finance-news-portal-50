
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const TermsPage = () => {
  const lastUpdated = "01 de janeiro de 2025";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Termos de Serviço</h1>
        <div className="text-sm text-gray-500 mb-8">
          Última atualização: {lastUpdated}
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="lead">
            Bem-vindo ao Finance News. Ao acessar e usar nosso site, você concorda com estes termos de serviço. Por favor, leia-os com atenção antes de usar nosso site.
          </p>
          
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou usar o Finance News, você concorda em ficar vinculado por estes Termos de Serviço e todas as leis e regulamentos aplicáveis. Se você não concorda com algum destes termos, está proibido de usar ou acessar este site.
          </p>
          
          <h2>2. Uso do Site</h2>
          <p>
            O conteúdo do Finance News é fornecido apenas para fins informativos gerais. Não constitui aconselhamento financeiro, de investimento ou profissional. Você não deve confiar exclusivamente nas informações apresentadas aqui para tomar decisões financeiras ou de investimento.
          </p>
          <p>
            Você concorda em usar este site apenas para fins legais e de maneira que não infrinja os direitos de, restrinja ou iniba o uso e aproveitamento deste site por qualquer terceiro.
          </p>
          
          <h2>3. Precisão do Conteúdo</h2>
          <p>
            Embora nos esforcemos para fornecer informações precisas e atualizadas, não garantimos a precisão, integridade ou adequação das informações e materiais encontrados neste site. O mercado financeiro é volátil e sujeito a mudanças rápidas, e as informações podem não refletir as condições atuais do mercado.
          </p>
          
          <h2>4. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo, incluindo textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, são propriedade do Finance News ou de seus fornecedores de conteúdo e são protegidos por leis de direitos autorais brasileiras e internacionais.
          </p>
          
          <h2>5. Restrições de Uso</h2>
          <p>
            Você não pode reproduzir, duplicar, copiar, vender, revender ou explorar qualquer parte do Finance News para qualquer finalidade comercial sem nossa expressa autorização por escrito. Isso inclui:
          </p>
          <ul>
            <li>Uso de data mining, robôs ou métodos similares de coleta de dados</li>
            <li>Republicação de material do site</li>
            <li>Modificação ou criação de trabalhos derivados</li>
            <li>Remoção de quaisquer avisos de direitos autorais ou propriedade</li>
          </ul>
          
          <h2>6. Contas de Usuário</h2>
          <p>
            Alguns recursos do nosso site podem exigir registro ou criação de uma conta. Você é responsável por manter a confidencialidade de sua conta e senha e por restringir o acesso ao seu computador. Você concorda em aceitar responsabilidade por todas as atividades que ocorrem em sua conta.
          </p>
          
          <h2>7. Comentários e Contribuições</h2>
          <p>
            Ao enviar comentários ou contribuições para o site, você concede ao Finance News o direito perpétuo, irrevogável e livre de royalties de usar, reproduzir, modificar, adaptar, publicar, traduzir, distribuir e exibir tal conteúdo em qualquer mídia.
          </p>
          <p>
            Você concorda em não enviar conteúdo que seja ilegal, abusivo, ameaçador, difamatório, obsceno, invasivo à privacidade de terceiros, ou de outra forma objetável.
          </p>
          
          <h2>8. Links para Sites de Terceiros</h2>
          <p>
            Nosso site pode conter links para sites de terceiros que não são de propriedade ou controlados pelo Finance News. Não temos controle e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de sites de terceiros.
          </p>
          
          <h2>9. Limitação de Responsabilidade</h2>
          <p>
            O Finance News não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou incapacidade de usar nossos serviços, incluindo mas não limitado a danos por perda de lucros, dados ou outros intangíveis, mesmo se tivermos sido avisados da possibilidade de tais danos.
          </p>
          
          <h2>10. Indenização</h2>
          <p>
            Você concorda em indenizar e isentar o Finance News, seus diretores, funcionários e agentes de qualquer reclamação, responsabilidade, danos, perdas e despesas, incluindo honorários advocatícios razoáveis, decorrentes de sua violação destes Termos de Serviço ou uso deste site.
          </p>
          
          <h2>11. Alterações nos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. Seu uso continuado do site após quaisquer alterações constitui sua aceitação dos novos termos.
          </p>
          
          <h2>12. Lei Aplicável</h2>
          <p>
            Estes termos serão regidos e interpretados de acordo com as leis do Brasil, sem dar efeito a quaisquer princípios de conflitos de leis.
          </p>
          
          <h2>13. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre estes Termos de Serviço, entre em contato conosco através da nossa <Link to="/contact" className="text-finance-700 hover:text-finance-600">página de contato</Link>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
