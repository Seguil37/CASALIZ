// src/store/favoriteStore.js
import { create } from 'zustand';
import { favoritesApi } from '../shared/utils/api';
import useAuthStore from './authStore';

const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoriteProjects: [],
  loading: false,
  error: null,
  hasFetched: false,

  fetchFavorites: async (force = false) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== 'client') {
      set({ favorites: [], hasFetched: false });
      return;
    }

    if (get().loading || (get().hasFetched && !force)) return;

    set({ loading: true, error: null });
    try {
      const response = await favoritesApi.list();
      const data = response.data || [];
      const favoriteIds = data.map((item) => item.id).filter(Boolean);
      set({ favorites: favoriteIds, favoriteProjects: data, hasFetched: true });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No se pudieron cargar tus favoritos' });
    } finally {
      set({ loading: false });
    }
  },

  toggleFavorite: async (projectId) => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (!isAuthenticated || user?.role !== 'client') {
      throw new Error('AUTH_REQUIRED');
    }

    const isFavorite = get().favorites.includes(projectId);

    if (isFavorite) {
      await favoritesApi.remove(projectId);
    } else {
      await favoritesApi.add(projectId);
    }

    set((state) => ({
      favorites: isFavorite
        ? state.favorites.filter((id) => id !== projectId)
        : [...new Set([...state.favorites, projectId])],
      favoriteProjects: isFavorite
        ? state.favoriteProjects.filter((project) => project.id !== projectId)
        : state.favoriteProjects,
    }));

    return { is_favorite: !isFavorite };
  },

  reset: () => set({ favorites: [], favoriteProjects: [], hasFetched: false, error: null }),
}));

export default useFavoriteStore;
