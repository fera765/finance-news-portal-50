
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Simulação de oportunidades de emprego
const jobOpenings = [
  {
    id: 1,
    title: "Jornalista Financeiro",
    department: "Editorial",
    location: "São Paulo, SP",
    type: "Integral",
    remote: false,
    description: "Estamos procurando um jornalista financeiro experiente para se juntar à nossa equipe editorial. O candidato ideal terá um histórico comprovado de reportagem sobre mercados financeiros, economia e negócios."
  },
  {
    id: 2,
    title: "Analista de Dados",
    department: "Tecnologia",
    location: "Remoto",
    type: "Integral",
    remote: true,
    description: "Procuramos um analista de dados para interpretar grandes conjuntos de dados financeiros e de mercado, gerando insights acionáveis para nossos leitores e produtos."
  },
  {
    id: 3,
    title: "Gerente de Mídias Sociais",
    department: "Marketing",
    location: "Rio de Janeiro, RJ",
    type: "Integral",
    remote: false,
    description: "Você irá desenvolver e implementar nossa estratégia de mídia social, cultivando a presença da marca e aumentando o engajamento em todas as plataformas sociais."
  },
  {
    id: 4,
    title: "Desenvolvedor Full-Stack",
    department: "Tecnologia",
    location: "Remoto",
    type: "Integral",
    remote: true,
    description: "Estamos procurando um desenvolvedor full-stack para contribuir com nossos projetos digitais, focando em experiências de usuário rápidas e intuitivas em nossas plataformas."
  },
  {
    id: 5,
    title: "Editor Assistente",
    department: "Editorial",
    location: "São Paulo, SP",
    type: "Meio período",
    remote: false,
    description: "Como editor assistente, você trabalhará com nossa equipe editorial para revisar artigos, garantir precisão factual e manter nossos altos padrões de qualidade."
  }
];

// Valores da empresa
const companyValues = [
  {
    title: "Integridade",
    description: "Mantemos os mais altos padrões éticos em nosso jornalismo e em todas as nossas operações empresariais."
  },
  {
    title: "Excelência",
    description: "Buscamos constantemente a excelência em tudo o que fazemos, desde reportagem até desenvolvimento de produtos."
  },
  {
    title: "Inovação",
    description: "Incentivamos a inovação e o pensamento criativo para resolver problemas e melhorar nossos serviços."
  },
  {
    title: "Colaboração",
    description: "Acreditamos que as melhores ideias surgem da colaboração e do trabalho em equipe."
  },
  {
    title: "Diversidade",
    description: "Valorizamos a diversidade de pensamento, experiência e perspectiva em nossa equipe e conteúdo."
  }
];

// Benefícios
const benefits = [
  "Plano de saúde abrangente",
  "Plano odontológico",
  "Vale refeição/alimentação",
  "Horário de trabalho flexível",
  "Política de trabalho remoto",
  "Auxílio educação",
  "Gympass",
  "Programa de bem-estar",
  "Previdência privada",
  "Participação nos lucros",
  "Licença parental estendida",
  "Ambiente de trabalho colaborativo"
];

const CareersPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="h-64 md:h-80 bg-finance-900 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt="Team working together" 
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center text-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Carreiras na Finance News</h1>
            <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
              Junte-se à nossa equipe inovadora e ajude-nos a transformar como as pessoas consomem informações financeiras.
            </p>
          </div>
        </div>
        
        {/* Why Join Us */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Por que se juntar a nós?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Impacto Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Seu trabalho ajudará milhões de pessoas a tomar decisões financeiras informadas. Fazemos a diferença na vida financeira de nossos leitores todos os dias.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Crescimento Profissional</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Oferecemos oportunidades contínuas de desenvolvimento profissional, incluindo treinamentos, mentoria e subsídios para educação.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Cultura Dinâmica</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Nossa cultura valoriza inovação, colaboração e bem-estar. Acreditamos que as melhores ideias vêm de equipes felizes e engajadas.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Nossos Valores</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyValues.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold text-finance-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Benefícios</h2>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-finance-700 mr-2"></div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Job Openings */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Vagas Abertas</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {jobOpenings.map(job => (
              <Card key={job.id} className="overflow-hidden">
                <div className="border-l-4 border-finance-700">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>{job.department} • {job.location}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge>{job.type}</Badge>
                        {job.remote && <Badge variant="outline">Remoto</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{job.description}</p>
                    <div className="flex justify-end">
                      <Link to={`/careers/${job.id}`}>
                        <Button>Ver Detalhes e Aplicar</Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          {/* No Current Openings Section */}
          {jobOpenings.length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Não há vagas abertas no momento</h3>
                <p className="mb-4 text-gray-600">
                  Não encontrou a vaga ideal? Envie seu currículo mesmo assim! Estamos sempre em busca de talentos.
                </p>
                <Button>Envie seu currículo</Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Contact CTA */}
        <div className="bg-finance-50 rounded-lg p-8 mt-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Ainda tem perguntas?</h2>
          <p className="mb-6">Entre em contato com nossa equipe de recrutamento para saber mais sobre oportunidades na Finance News.</p>
          <Link to="/contact">
            <Button variant="outline">Contate-nos</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default CareersPage;
