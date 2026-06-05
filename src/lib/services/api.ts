import axios from 'axios';
import { env } from '$env/dynamic/public';

// Instancia base de Axios configurada
export const api = axios.create({
  baseURL: env.PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Inyectar el token JWT en futuras peticiones privadas a NestJS
api.interceptors.request.use((config) => {
  // Solo se ejecuta en el navegador (cliente)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    const token = match ? match[2] : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
