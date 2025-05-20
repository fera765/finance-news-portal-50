
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { register } from "@/services/authService"; 
import { Loader2 } from "lucide-react";

interface SignupFormProps {
  onSuccess: (userData: { email: string; password: string }) => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const validateForm = () => {
    setErrorMessage(null);
    
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Todos os campos são obrigatórios");
      return false;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return false;
    }
    
    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Digite um email válido");
      return false;
    }
    
    return true;
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting to register with email:', email);
      const newUser = await register({
        name,
        email,
        password
      });
      
      toast.success(`Bem-vindo(a), ${newUser.name}! Sua conta foi criada com sucesso.`);
      
      onSuccess({
        email,
        password
      });
      
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      setErrorMessage(error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          placeholder="Seu Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input 
          id="signup-email" 
          placeholder="seu@email.com" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <Input 
          id="signup-password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <Input 
          id="confirm-password" 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm px-1">
          {errorMessage}
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
              Criando conta...
            </>
          ) : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
