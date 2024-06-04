import { AuthStore } from '@/types/auth';
import { create } from 'zustand';

const loadState = () => {
  const storedState = localStorage.getItem('authState');
  return storedState ? JSON.parse(storedState) : {
    user_name: null,
    permissions: [],
    token: null,
  };
};

const saveState = (state: {
  user_name: string | null;
  permissions: string[];
  token: string | null;
}) => {
  localStorage.setItem('authState', JSON.stringify(state));
};

const useAuthStore = create<AuthStore>((set) => ({
  ...loadState(),

  login: (user_name: string, permissions: string[], token: string) => {
    const newState = {
      user_name,
      permissions,
      token,
    };
    set(newState);
    saveState(newState);
  },

  logout: () => {
    const newState = {
      user_name: null,
      permissions: [],
      token: null,
    };
    set(newState);
    saveState(newState);
  },

  updatePermissions: (permissions: string[]) => set((state) => {
    const newState = {
      ...state,
      permissions,
    };
    saveState(newState);
    return newState;
  }),
}));

export default useAuthStore;
