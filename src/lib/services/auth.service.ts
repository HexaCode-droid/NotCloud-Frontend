import { api } from './api';
import type {
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponse
} from '$lib/types/auth.type';

function saveAuthToken(token: string) {
  if (typeof document === 'undefined') return;

  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax${secure}`;
}

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post('/auth/register', {
      ...data,
      email: data.email.trim().toLowerCase(),
    });
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post('/auth/login', {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    const token = response.data.access_token;
    if (token) {
      saveAuthToken(token);
    }

    return response.data;
  },

  async verifyEmail(data: VerifyEmailDto): Promise<AuthResponse> {
    const response = await api.post('/auth/verify-email', {
      email: data.email.trim().toLowerCase(),
      code: data.code,
    });

    const token = response.data.access_token;
    if (token) {
      saveAuthToken(token);
    }

    return response.data;
  },

  async forgotPassword(data: ForgotPasswordDto): Promise<AuthResponse> {
    const response = await api.post('/auth/forgot-password', {
      email: data.email.trim().toLowerCase(),
    });
    return response.data;
  },

  async resetPassword(data: ResetPasswordDto): Promise<AuthResponse> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }
};
