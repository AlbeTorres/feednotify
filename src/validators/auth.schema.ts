// dto/auth.dto.ts (puedes renombrar a auth.schema.ts si prefieres)
import { z } from 'zod';

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginDtoType = z.infer<typeof LoginDto>;
