
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { email: string; password: string }) => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("login");
  
  const handleReset = () => {
    setActiveTab("login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleReset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Autenticação</DialogTitle>
          <DialogDescription>
            Faça login ou crie uma conta para acessar todos os recursos.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSuccess={onSuccess} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm onSuccess={onSuccess} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
