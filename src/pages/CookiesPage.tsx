
import Layout from "@/components/Layout";

const CookiesPage = () => {
  const lastUpdated = "01 de janeiro de 2025";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Política de Cookies</h1>
        <div className="text-sm text-gray-500 mb-8">
          Última atualização: {lastUpdated}
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="lead">
            Esta Política de Cookies explica como o Finance News utiliza cookies e tecnologias similares para reconhecer você quando visita nosso site. Ela explica o que são essas tecnologias e por que as usamos, além de seus direitos de controlá-las.
          </p>
          
          <h2>O que são cookies?</h2>
          <p>
            Cookies são pequenos arquivos de dados que são colocados no seu dispositivo ou computador quando você visita um site. Os cookies são amplamente utilizados pelos proprietários de sites para fazer seus sites funcionarem, ou funcionarem de maneira mais eficiente, bem como para fornecer informações de relatório.
          </p>
          <p>
            Os cookies definidos pelo proprietário do site (neste caso, Finance News) são chamados de "cookies primários". Os cookies definidos por outras partes que não o proprietário do site são chamados de "cookies de terceiros". Cookies de terceiros permitem que recursos ou funcionalidades de terceiros sejam fornecidos no ou através do site (por exemplo, publicidade, conteúdo interativo e análises).
          </p>
          
          <h2>Por que usamos cookies?</h2>
          <p>
            Usamos cookies primários e de terceiros por vários motivos. Alguns cookies são necessários por razões técnicas para que nosso site funcione, e os chamamos de cookies "essenciais" ou "estritamente necessários". Outros cookies nos permitem rastrear e direcionar os interesses de nossos usuários para aprimorar a experiência em nosso site. Terceiros servem cookies através de nosso site para publicidade, análise e outras finalidades.
          </p>
          
          <h2>Tipos de cookies que usamos</h2>
          
          <h3>Cookies Essenciais</h3>
          <p>
            Esses cookies são estritamente necessários para fornecer serviços disponíveis através do nosso site e para usar alguns de seus recursos, como acesso a áreas seguras. Como esses cookies são estritamente necessários para a entrega do site, você não pode recusá-los sem afetar o funcionamento do nosso site.
          </p>
          <table className="border-collapse border border-gray-300 w-full mt-4 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Nome do Cookie</th>
                <th className="border border-gray-300 p-2">Finalidade</th>
                <th className="border border-gray-300 p-2">Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">auth_token</td>
                <td className="border border-gray-300 p-2">Usado para manter o estado de autenticação do usuário</td>
                <td className="border border-gray-300 p-2">Sessão</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">csrf_token</td>
                <td className="border border-gray-300 p-2">Proteção contra ataques CSRF</td>
                <td className="border border-gray-300 p-2">Sessão</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Cookies de Preferências</h3>
          <p>
            Esses cookies permitem que nosso site lembre escolhas que você faz ao utilizar nosso site, como lembrar suas preferências de idioma ou suas informações de login. A finalidade desses cookies é fornecer a você uma experiência mais pessoal e evitar que você tenha que reinserir suas preferências sempre que visitar nosso site.
          </p>
          <table className="border-collapse border border-gray-300 w-full mt-4 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Nome do Cookie</th>
                <th className="border border-gray-300 p-2">Finalidade</th>
                <th className="border border-gray-300 p-2">Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">theme_preference</td>
                <td className="border border-gray-300 p-2">Armazena preferência de tema claro/escuro</td>
                <td className="border border-gray-300 p-2">1 ano</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">language</td>
                <td className="border border-gray-300 p-2">Armazena a preferência de idioma do usuário</td>
                <td className="border border-gray-300 p-2">1 ano</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Cookies Analíticos e de Desempenho</h3>
          <p>
            Esses cookies nos permitem contar visitas e fontes de tráfego para que possamos medir e melhorar o desempenho do nosso site. Eles nos ajudam a saber quais páginas são as mais ou menos populares e ver como os visitantes navegam pelo site. Todas as informações que esses cookies coletam são agregadas e, portanto, anônimas.
          </p>
          <table className="border-collapse border border-gray-300 w-full mt-4 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Nome do Cookie</th>
                <th className="border border-gray-300 p-2">Finalidade</th>
                <th className="border border-gray-300 p-2">Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">_ga</td>
                <td className="border border-gray-300 p-2">Google Analytics - Distinguir usuários</td>
                <td className="border border-gray-300 p-2">2 anos</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">_gid</td>
                <td className="border border-gray-300 p-2">Google Analytics - Distinguir usuários</td>
                <td className="border border-gray-300 p-2">24 horas</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Cookies de Marketing e Publicidade</h3>
          <p>
            Esses cookies são usados para rastrear visitantes em sites. A intenção é exibir anúncios que sejam relevantes e envolventes para o usuário individual e, portanto, mais valiosos para editores e anunciantes terceirizados.
          </p>
          <table className="border-collapse border border-gray-300 w-full mt-4 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Nome do Cookie</th>
                <th className="border border-gray-300 p-2">Finalidade</th>
                <th className="border border-gray-300 p-2">Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">_fbp</td>
                <td className="border border-gray-300 p-2">Facebook Pixel - Rastreamento para publicidade</td>
                <td className="border border-gray-300 p-2">3 meses</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">ads_prefs</td>
                <td className="border border-gray-300 p-2">Armazena preferências de publicidade</td>
                <td className="border border-gray-300 p-2">1 ano</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Como posso controlar os cookies?</h2>
          <p>
            Você tem o direito de decidir se aceita ou rejeita cookies. Você pode exercer suas preferências de cookies clicando nos links de configurações apropriados em nosso banner de cookies.
          </p>
          <p>
            Você também pode configurar ou alterar os controles do seu navegador para aceitar ou recusar cookies. Se você optar por rejeitar cookies, ainda poderá usar nosso site, embora seu acesso a algumas funcionalidades e áreas de nosso site possa ser restrito. Como os meios pelos quais você pode recusar cookies através dos controles do seu navegador variam de navegador para navegador, você deve visitar o menu de ajuda do seu navegador para obter mais informações.
          </p>
          
          <h2>Atualizações desta Política de Cookies</h2>
          <p>
            Podemos atualizar esta Política de Cookies de tempos em tempos para refletir, por exemplo, mudanças nos cookies que usamos ou por outros motivos operacionais, legais ou regulatórios. Por favor, visite esta Política de Cookies regularmente para se manter informado sobre nosso uso de cookies e tecnologias relacionadas.
          </p>
          <p>
            A data no topo desta Política de Cookies indica quando ela foi atualizada pela última vez.
          </p>
          
          <h2>Entre em Contato</h2>
          <p>
            Se você tiver dúvidas ou comentários sobre esta política de cookies, entre em contato conosco:
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

export default CookiesPage;
