export interface User {
  id: string; // o el tipo que uses para tu ID
  name: string;
  email: string;
  password: string; // Importante: NUNCA guardes contraseñas en texto plano
  roles?: string[];
}
