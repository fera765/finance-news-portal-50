
import Layout from "@/components/Layout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Sobre a Finance News</h1>
        
        <div className="mb-8">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
            alt="Finance News Team" 
            className="w-full h-64 md:h-80 object-cover rounded-lg mb-4"
          />
        </div>
        
        <div className="prose prose-slate max-w-none">
          <h2>Nossa Missão</h2>
          <p>
            Na Finance News, nossa missão é fornecer informações financeiras precisas, oportunas e acessíveis para ajudar nossos leitores a tomar decisões financeiras informadas. Acreditamos que o conhecimento financeiro deve estar ao alcance de todos, não apenas de especialistas do mercado.
          </p>
          
          <h2 className="mt-8">Nossa História</h2>
          <p>
            Fundada em 2015 por um grupo de jornalistas financeiros e analistas de mercado, a Finance News surgiu da necessidade de uma cobertura financeira que fosse ao mesmo tempo detalhada e compreensível para o público geral. Começamos como um pequeno blog e rapidamente crescemos para nos tornarmos uma das fontes mais confiáveis de notícias financeiras no Brasil.
          </p>
          
          <h2 className="mt-8">Nossa Equipe</h2>
          <p>
            Nossa equipe é composta por jornalistas especializados em finanças, analistas de mercado, economistas e especialistas do setor financeiro. Cada membro traz uma perspectiva única e valiosa, garantindo uma cobertura abrangente e diversificada do mundo das finanças.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Jornalismo de Qualidade</h3>
              <p>
                Comprometemo-nos com os mais altos padrões jornalísticos, garantindo que todas as notícias sejam verificadas, precisas e imparciais.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Análise Especializada</h3>
              <p>
                Nossa equipe de analistas oferece insights profundos sobre tendências de mercado, oportunidades de investimento e desenvolvimentos econômicos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Inovação Constante</h3>
              <p>
                Estamos sempre buscando maneiras inovadoras de apresentar informações financeiras, utilizando tecnologia para melhorar a experiência do usuário.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Responsabilidade Social</h3>
              <p>
                Acreditamos em promover a educação financeira e contribuir para uma sociedade financeiramente mais saudável e informada.
              </p>
            </div>
          </div>
          
          <h2 className="mt-8">Nossos Valores</h2>
          <ul>
            <li>Integridade: Mantemos os mais altos padrões éticos em nosso jornalismo.</li>
            <li>Precisão: Verificamos rigorosamente todas as informações antes de publicar.</li>
            <li>Independência: Nosso conteúdo é livre de influências externas.</li>
            <li>Inovação: Buscamos continuamente melhorar nossa cobertura e plataforma.</li>
            <li>Acessibilidade: Tornamos informações financeiras complexas compreensíveis para todos.</li>
          </ul>
          
          <h2 className="mt-8">Entre em Contato</h2>
          <p>
            Temos o prazer de ouvir dos nossos leitores. Se você tiver dúvidas, feedback ou sugestões, não hesite em entrar em contato conosco através da nossa página de <a href="/contact" className="text-finance-700 hover:text-finance-600">Contato</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
