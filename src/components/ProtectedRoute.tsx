
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * Componente para proteger rotas e garantir que apenas usuários autenticados
 * e com as permissões adequadas possam acessar determinadas páginas.
 */
const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Se ainda está carregando o usuário, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não há usuário autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se há roles permitidas especificadas e o usuário não tem a role necessária
  if (allowedRoles.length > 0 && (!user.role || !allowedRoles.includes(user.role))) {
    // Redireciona para a página inicial se não tiver permissão
    return <Navigate to="/" replace />;
  }

  // Se passou por todas as verificações, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
