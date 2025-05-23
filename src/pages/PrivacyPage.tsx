
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  const lastUpdated = "01 de janeiro de 2025";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Política de Privacidade</h1>
        <div className="text-sm text-gray-500 mb-8">
          Última atualização: {lastUpdated}
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="lead">
            A Finance News valoriza sua privacidade e está comprometida em proteger suas informações pessoais. Esta Política de Privacidade explica como coletamos, usamos e protegemos seus dados ao utilizar nosso site e serviços.
          </p>
          
          <h2>1. Informações que Coletamos</h2>
          <p>
            Podemos coletar os seguintes tipos de informações:
          </p>
          <h3>1.1. Informações Fornecidas por Você</h3>
          <p>
            Quando você se registra em nossa plataforma, assina nossa newsletter, comenta em artigos ou interage de outras formas com nosso site, podemos coletar:
          </p>
          <ul>
            <li>Nome e sobrenome</li>
            <li>Endereço de e-mail</li>
            <li>Informações de perfil (como foto e biografia)</li>
            <li>Preferências de conteúdo</li>
            <li>Comentários e contribuições</li>
          </ul>
          
          <h3>1.2. Informações Coletadas Automaticamente</h3>
          <p>
            Quando você visita nosso site, podemos coletar automaticamente:
          </p>
          <ul>
            <li>Endereço IP</li>
            <li>Tipo de navegador e dispositivo</li>
            <li>Páginas visualizadas e tempo gasto no site</li>
            <li>Termos de pesquisa utilizados</li>
            <li>Padrões de clique e interações com o site</li>
          </ul>
          
          <h2>2. Como Usamos Suas Informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Fornecer, personalizar e melhorar nossos serviços</li>
            <li>Processar e gerenciar sua conta de usuário</li>
            <li>Enviar comunicações relacionadas ao serviço</li>
            <li>Enviar newsletters e atualizações, caso você tenha optado por recebê-las</li>
            <li>Analisar padrões de uso para melhorar a experiência do usuário</li>
            <li>Detectar e prevenir fraudes e abusos</li>
            <li>Cumprir obrigações legais</li>
          </ul>
          
          <h2>3. Cookies e Tecnologias Semelhantes</h2>
          <p>
            Utilizamos cookies e tecnologias semelhantes para coletar informações sobre seu comportamento de navegação e preferências. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador. Para mais informações, consulte nossa <Link to="/cookies" className="text-finance-700 hover:text-finance-600">Política de Cookies</Link>.
          </p>
          
          <h2>4. Compartilhamento de Informações</h2>
          <p>
            Podemos compartilhar suas informações com:
          </p>
          <ul>
            <li>Prestadores de serviços que nos ajudam a operar nosso site</li>
            <li>Parceiros de análise e publicidade</li>
            <li>Autoridades legais quando exigido por lei</li>
          </ul>
          <p>
            Não vendemos seus dados pessoais a terceiros.
          </p>
          
          <h2>5. Segurança de Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
          </p>
          
          <h2>6. Seus Direitos de Privacidade</h2>
          <p>
            Dependendo da sua localização, você pode ter os seguintes direitos:
          </p>
          <ul>
            <li>Acessar e receber uma cópia de suas informações pessoais</li>
            <li>Retificar informações imprecisas</li>
            <li>Solicitar a exclusão de seus dados pessoais</li>
            <li>Restringir ou opor-se ao processamento de seus dados</li>
            <li>Portabilidade de dados</li>
            <li>Retirar o consentimento a qualquer momento</li>
          </ul>
          <p>
            Para exercer esses direitos, entre em contato conosco através dos detalhes fornecidos no final desta política.
          </p>
          
          <h2>7. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja necessário ou permitido por lei.
          </p>
          
          <h2>8. Crianças</h2>
          <p>
            Nossos serviços não são direcionados a menores de 18 anos, e não coletamos intencionalmente informações pessoais de crianças. Se você acredita que coletamos informações de um menor, entre em contato conosco imediatamente.
          </p>
          
          <h2>9. Transferências Internacionais</h2>
          <p>
            Suas informações podem ser transferidas e mantidas em servidores localizados fora do seu país de residência, onde as leis de proteção de dados podem diferir. Tomamos medidas para garantir que seus dados permaneçam protegidos de acordo com esta política.
          </p>
          
          <h2>10. Alterações à Política de Privacidade</h2>
          <p>
            Podemos atualizar esta política periodicamente. A versão mais recente será publicada em nosso site com a data da última atualização. Recomendamos que você revise esta política regularmente.
          </p>
          
          <h2>11. Entre em Contato</h2>
          <p>
            Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de tratamento de dados, entre em contato conosco:
          </p>
          <p>
            E-mail: privacy@financenews.com<br />
            Endereço: Avenida Paulista, 1000, São Paulo - SP<br />
            Telefone: (11) 5555-1234
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
