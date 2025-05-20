
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { register } from "@/services/authService"; 

interface SignupFormProps {
  onSuccess: (userData: { email: string; password: string }) => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register({
        name,
        email,
        password
      });
      
      toast.success("Conta criada com sucesso!");
      
      onSuccess({
        email,
        password
      });
      
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error);
      toast.error(error.message || "Ocorreu um erro ao criar sua conta. Tente novamente.");
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
          required
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Criando conta..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
