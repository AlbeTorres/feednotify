export interface JwtPayload {
  id: string; // o string, dependiendo de tu ID de usuario
  email: string;
  role?: string; // Opcional, si usas roles
  // Cualquier otra información que quieras incluir en el payload
}
