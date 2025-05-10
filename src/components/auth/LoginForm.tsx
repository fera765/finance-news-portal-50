
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onSuccess: (userData: { email: string; password: string }) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating login API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock login validation
      if (email === "admin@example.com" && password === "admin") {
        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        });
        
        onSuccess({
          email: "admin@example.com",
          password: "admin"
        });
      } else if (email && password) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        onSuccess({
          email: email,
          password: password
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          placeholder="your@email.com" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
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
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
      
      <div className="text-sm text-center text-muted-foreground">
        <p className="mt-2">Demo accounts:</p>
        <p>Admin: admin@example.com / admin</p>
        <p>User: user@example.com / user</p>
      </div>
    </form>
  );
};

export default LoginForm;
