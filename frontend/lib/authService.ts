import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;    // ← était "token"
  tokenType: string;
  expiresIn: number;
  utilisateur: {          // ← était "user"
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: 'ADMIN' | 'GESTIONNAIRE' | 'EMPLOYE' | 'DEMANDEUR';
    telephone?: string;
    statut: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'DEMANDEUR' | 'EMPLOYE';
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', {
        email: credentials.email,
        motDePasse: credentials.password,  // ← renommer ici
    });
    if (response.data.accessToken) {
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.utilisateur));
}
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};
