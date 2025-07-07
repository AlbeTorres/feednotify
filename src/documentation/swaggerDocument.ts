import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

const router = Router();

let swaggerDocument;
try {
  const file = fs.readFileSync('./swagger.yml', 'utf8');
  swaggerDocument = YAML.parse(file);
} catch (error) {
  console.error('Error cargando swagger.yml:', error);
  process.exit(1);
}

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;
