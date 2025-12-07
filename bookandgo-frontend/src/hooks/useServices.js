import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const fetchServices = async () => {
  const { data } = await api.get('/services');
  return data;
};

export function useServices() {
  return useQuery({ queryKey: ['services'], queryFn: fetchServices });
}
