import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    return data;
};

export function useProjects() {
    return useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
}
