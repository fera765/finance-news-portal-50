
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  onSuccess: (userData: { email: string; password: string }) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting login with email:', email);
      const loggedInUser = await login(email, password);
      
      // Check if user status is active (this check is redundant with the one in authService,
      // but adding it here as a double-check for security)
      if (loggedInUser.status === "banned") {
        throw new Error("Esta conta foi suspensa. Entre em contato com o suporte.");
      }
      
      toast.success(`Bem-vindo, ${loggedInUser.name}!`);
      
      onSuccess({
        email,
        password
      });
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Falha no login. Verifique suas credenciais.");
      toast.error(error.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Para facilitar o login durante o desenvolvimento
  const loginAsDemo = () => {
    setEmail("demo@example.com");
    setPassword("password123");
  };
  
  const loginAsAdmin = () => {
    setEmail("admin@example.com");
    setPassword("admin123");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          placeholder="seu@email.com" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input 
          id="password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm px-1">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {import.meta.env.DEV && (
        <div className="flex gap-2 text-xs">
          <button 
            type="button" 
            onClick={loginAsDemo} 
            className="text-blue-500 underline"
          >
            Demo User
          </button>
          <button 
            type="button" 
            onClick={loginAsAdmin} 
            className="text-blue-500 underline"
          >
            Admin User
          </button>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : "Entrar"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
