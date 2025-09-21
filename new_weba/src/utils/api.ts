
export interface LinkData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  visits: number;
  createdAt: string;
  shortened?: string;
}

export interface VisitData {
  date: string;
  visits: number;
}

export interface LocationData {
  country: string;
  regions: {
    [region: string]: {
      [city: string]: number;
    };
  };
}

export interface MetricsResponse {
  visits: number;
  locations: LocationData[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

interface ApiLinkData {
  shortened: string;
  original_url?: string;
  url?: string;
  short_url?: string;
  visits?: number;
  created_at?: string;
}

const API_BASE_URL = 'http://186.195.216.145:2020';

// Gerenciar token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Função para lidar com respostas de erro de autenticação
const handleAuthError = (error: any): void => {
  if (error.message.includes("authorization token is missing") || 
      error.message.includes("invalid token") || 
      error.message.includes("token expired")) {
    removeAuthToken();
    window.location.href = "/";
  }
};

export const apiService = {
  // Autenticação
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao fazer login');
    }

    const data = await response.json();
    setAuthToken(data.data.token);
    return data;
  },

  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao criar conta');
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data;
  },

  logout(): void {
    removeAuthToken();
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },

  async createLink(originalUrl: string, params?: string): Promise<LinkData> {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          url: originalUrl,
          ...(params && { params })
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(errorText || 'Erro ao gerar link');
        handleAuthError(error);
        throw error;
      }

      const data = await response.json();

      console.log('Resposta da API:', data);

      const shortUrl = data?.data?.url;

      if (!shortUrl) {
        throw new Error('A API não retornou a URL encurtada.');
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        originalUrl,
        shortUrl,
        visits: 0, // novo, então 0 visitas
        createdAt: new Date().toISOString().split('T')[0],
        shortened: shortUrl.replace(`${API_BASE_URL}/`, ''), // opcional, para ter só o final
      };
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  },
  // Métricas gerais
  async getLinks(): Promise<LinkData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/all`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        const errorObj = new Error(error || 'Erro ao carregar links');
        handleAuthError(errorObj);
        throw errorObj;
      }

      const result = await response.json();
      console.log('RESULTADO RECEBIDO:', result);

      const urls = result?.data?.metrics?.urls;

      if (!Array.isArray(urls)) {
        console.warn('Formato inesperado: urls não é um array', urls);
        return [];
      }

      return urls.map((item): LinkData => ({
        id: item.shortened || Math.random().toString(36).substr(2, 9),
        originalUrl: '',  // Não veio na resposta, ajuste se precisar.
        shortUrl: `${API_BASE_URL}/${item.shortened}`,
        visits: parseInt(item.visits, 10) || 0,
        createdAt: item.created_at
          ? new Date(item.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        shortened: item.shortened,
      }));
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  },

  // Buscar link específico
  async getLink(id: string): Promise<LinkData | null> {
    try {
      const links = await this.getLinks();
      return links.find(link => link.id === id || link.shortened === id) || null;
    } catch (error: any) {
      console.error('Erro ao buscar link:', error);
      handleAuthError(error);
      return null;
    }
  },

  // Métricas de link específico
  async getLinkMetrics(shortened: string): Promise<MetricsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/${shortened}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        const errorObj = new Error(error || 'Erro ao carregar métricas');
        handleAuthError(errorObj);
        throw errorObj;
      }

      const data = await response.json();
      return {
        visits: data.visits || 0,
        locations: data.locations || [],
      };
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  },

  // Dados de visitas para gráfico (simulado baseado nas métricas reais)
  async getVisitsData(): Promise<VisitData[]> {
    try {
      const links = await this.getLinks();
      const totalVisits = links.reduce((sum, link) => sum + link.visits, 0);
      
      // Gerar dados simulados baseados no total real
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          visits: Math.floor((totalVisits / 7) + Math.random() * 20),
        };
      });
      
      return last7Days;
    } catch (error: any) {
      console.error('Erro ao gerar dados de visitas:', error);
      handleAuthError(error);
      return [];
    }
  },

  // Estatísticas gerais
  async getStats() {
    try {
      const links = await this.getLinks();
      const totalLinks = links.length;
      const totalVisits = links.reduce((sum, link) => sum + link.visits, 0);
      const mostVisitedLink = links.reduce((prev, current) => 
        (prev.visits > current.visits) ? prev : current, links[0]
      );
      
      return {
        totalLinks,
        totalVisits,
        mostVisitedLink,
      };
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
      handleAuthError(error);
      return {
        totalLinks: 0,
        totalVisits: 0,
        mostVisitedLink: null,
      };
    }
  },
};
