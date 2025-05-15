import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/services/api";

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
    setIsLoading(true);
    
    try {
      // Verificar se o email já existe
      const { data: existingUsers } = await api.get('/users', {
        params: { email }
      });
      
      if (existingUsers.length > 0) {
        toast("Este email já está em uso.");
        setIsLoading(false);
        return;
      }
      
      // Criar novo usuário
      const { data: newUser } = await api.post('/users', {
        name,
        email,
        password,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString()
      });
      
      toast("Sua conta foi criada com sucesso!");
      
      onSuccess({
        email,
        password
      });
      
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast("Ocorreu um erro ao criar sua conta. Tente novamente.");
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
