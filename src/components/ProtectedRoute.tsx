
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<string>;
  adminOnly?: boolean;
  editorAccess?: boolean;
}

/**
 * Componente para proteger rotas e garantir que apenas usuários autenticados
 * e com as permissões adequadas possam acessar determinadas páginas.
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  adminOnly = false,
  editorAccess = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Se ainda está carregando o usuário, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário autenticado, redireciona para o login
  if (!user) {
    console.log("Acesso negado - Usuário não autenticado", {
      path: location.pathname,
      requiredRoles: allowedRoles
    });
    return <Navigate to="/" state={{ from: location, authRequired: true }} replace />;
  }

  // Verificações específicas de role
  const userRole = user.role || 'user';

  // Se a rota é apenas para admin
  if (adminOnly && userRole !== 'admin') {
    console.log("Acesso negado - Apenas administradores", {
      userRole: userRole,
      path: location.pathname
    });
    toast.error("Acesso restrito a administradores.");
    return <Navigate to="/" replace />;
  }

  // Se a rota permite acesso para editores (apenas artigos)
  if (editorAccess && !['admin', 'editor'].includes(userRole)) {
    console.log("Acesso negado - Permissão insuficiente para editores", {
      userRole: userRole,
      path: location.pathname
    });
    toast.error("Você não tem permissão para acessar esta página.");
    return <Navigate to="/" replace />;
  }

  // Se há roles permitidas especificadas e o usuário não tem a role necessária
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log("Acesso negado - Permissão insuficiente", {
      userRole: userRole,
      requiredRoles: allowedRoles
    });
    toast.error("Você não tem permissão para acessar esta página.");
    return <Navigate to="/" replace />;
  }

  // Se passou por todas as verificações, renderiza o conteúdo protegido
  console.log("Acesso permitido", {
    user: user.id,
    role: userRole,
    path: location.pathname
  });
  return <>{children}</>;
};

export default ProtectedRoute;
