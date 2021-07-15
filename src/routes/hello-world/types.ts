import { z } from 'zod';

export const HelloData = z.object({
  name: z.string(),
});

export type HelloDataType = z.infer<typeof HelloData>;
