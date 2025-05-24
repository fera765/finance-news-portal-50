
import { api } from './api';

export interface NewsletterSubscription {
  id?: string;
  email: string;
  name: string;
  status: string;
  createdAt: string;
}

export const subscribeToNewsletter = async (email: string, name: string) => {
  // Verificar se o email já está cadastrado
  const { data: existingSubscriptions } = await api.get('/newsletter-subscriptions', {
    params: { email }
  });
  
  if (existingSubscriptions.length > 0) {
    throw new Error('Este email já está inscrito na newsletter');
  }
  
  // Criar nova inscrição
  const { data } = await api.post('/newsletter-subscriptions', {
    email,
    name,
    status: 'active',
    createdAt: new Date().toISOString()
  });
  
  return data;
};

export const unsubscribeFromNewsletter = async (email: string) => {
  // Buscar a inscrição
  const { data: subscriptions } = await api.get('/newsletter-subscriptions', {
    params: { email }
  });
  
  if (subscriptions.length === 0) {
    throw new Error('Este email não está inscrito na newsletter');
  }
  
  // Remover inscrição
  await api.delete(`/newsletter-subscriptions/${subscriptions[0].id}`);
  return true;
};

export const getNewsletterSubscriptions = async (page = 1, limit = 20) => {
  const { data } = await api.get('/newsletter-subscriptions', {
    params: {
      _page: page,
      _limit: limit,
      _sort: 'createdAt',
      _order: 'desc'
    }
  });
  
  return data;
};

export const getNewsletterSubscriptionsCount = async () => {
  const { data } = await api.get('/newsletter-subscriptions');
  return data.length;
};
