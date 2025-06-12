export const JWT_SECRET =
  process.env.JWT_SECRET || 'tu_super_secreto_para_login_y_jwt_2025';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3600000';

if (
  JWT_SECRET === 'tu_super_secreto_jwt_typescript' &&
  process.env.NODE_ENV !== 'test'
) {
  console.warn(
    'Warning: You are using a default JWT SECRET KEY. ¡Change it in production and save it in a safely way as an enviroment variable!'
  );
}
