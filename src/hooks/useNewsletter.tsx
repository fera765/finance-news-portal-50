
import { useState } from 'react';
import { subscribeToNewsletter } from '@/services/newsletterService';
import { toast } from 'sonner';

export function useNewsletter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubscribe = async () => {
    if (!name.trim()) {
      toast.error('Por favor, informe seu nome');
      return;
    }
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor, informe um email válido');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await subscribeToNewsletter(email, name.trim());
      toast.success('Inscrição realizada com sucesso!');
      setEmail('');
      setName('');
    } catch (error: any) {
      if (error.message === 'Este email já está inscrito na newsletter') {
        toast.info(error.message);
      } else {
        toast.error('Ocorreu um erro ao realizar a inscrição. Tente novamente.');
        console.error('Erro na inscrição da newsletter:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    name,
    setName,
    email,
    setEmail,
    isLoading,
    handleSubscribe
  };
}
