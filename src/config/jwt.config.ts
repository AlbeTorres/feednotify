// Debes tener tu clave secreta en una variable de entorno para mayor seguridad.
// Por ejemplo, process.env.JWT_SECRET
// Aquí la definimos directamente para el ejemplo, pero ¡NO LO HAGAS EN PRODUCCIÓN!
export const JWT_SECRET =
  process.env.JWT_SECRET || 'tu_super_secreto_para_login_y_jwt_2025'; // ¡CAMBIA ESTO Y GUÁRDALO DE FORMA SEGURA!
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3600000'; // 1 hora (en milisegundos)

if (
  JWT_SECRET === 'tu_super_secreto_jwt_typescript' &&
  process.env.NODE_ENV !== 'test'
) {
  console.warn(
    'ADVERTENCIA: Estás utilizando la clave JWT secreta predeterminada. ¡Cámbiala en producción y guárdala de forma segura en variables de entorno!'
  );
}
