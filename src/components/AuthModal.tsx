
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/components/Layout";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
          id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          avatar: "https://i.pravatar.cc/150?u=admin"
        });
      } else if (email && password) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        
        onSuccess({
          id: "user-1",
          name: name || "John Doe",
          email: email,
          role: "user",
          avatar: `https://i.pravatar.cc/150?u=${email}`
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
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating signup API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (name && email && password) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
        
        onSuccess({
          id: `user-${Date.now()}`,
          name: name,
          email: email,
          role: "user",
          avatar: `https://i.pravatar.cc/150?u=${email}`
        });
      } else {
        toast({
          title: "Signup Failed",
          description: "Please fill all required fields.",
          variant: "destructive"
        });
      }
    }, 1000);
  };
  
  const handleReset = () => {
    setEmail("");
    setPassword("");
    setName("");
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
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Login or create an account to access all features.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
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
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                  id="signup-email" 
                  placeholder="your@email.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
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
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
