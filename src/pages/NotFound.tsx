
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-7xl font-bold text-finance-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Página Não Encontrada</h2>
          <p className="text-gray-600 mb-8">
            Não foi possível encontrar a página que você está procurando. A página pode ter sido movida ou excluída.
          </p>
          <Button asChild>
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
