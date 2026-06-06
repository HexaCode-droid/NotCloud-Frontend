export interface RegisterDto {
  email: string;
  password?: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface VerifyEmailDto {
  email: string;
  code: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  // Nota: Esto puedes ajustarlo si tu backend te devuelve algo distinto en el login (como un access_token)
  access_token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}
