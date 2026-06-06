import { api } from './api';
import type {
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse
} from '$lib/types/auth.type';

export const authService = {
  
  async register(data: RegisterDto): Promise<AuthResponse> {
    // Hace POST a https://not-cloud-bakend.vercel.app/auth/register
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    // Hace POST a tu backend
    const response = await api.post('/auth/login', data);
    
    // Guardamos el token en una Cookie. Así el hooks.server.ts podrá leerlo en las siguientes recargas.
    // max-age=604800 significa que durará 7 días.
    const token = response.data.access_token;
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict`;
    }
    
    return response.data;
  },
  
  async verifyEmail(data: VerifyEmailDto): Promise<any> {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordDto): Promise<AuthResponse> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordDto): Promise<AuthResponse> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }
};
