import { z } from 'zod';

export const riskLevelSchema = z.enum(['alto', 'medio', 'bajo']);
export const semaphoreSchema = z.enum(['rojo', 'amarillo', 'verde']);
export const urgencySchema = z.enum(['alta', 'media', 'baja']);

export const legalResponseSchema = z.object({
  diagnostico: z.string().min(1),
  derechos: z.array(z.string()),
  plazos: z.array(
    z.object({
      descripcion: z.string(),
      fechaLimite: z.string().optional(),
      urgencia: urgencySchema,
    }),
  ),
  riesgo: z.object({
    nivel: riskLevelSchema,
    score: z.number().min(0).max(10),
    semaforo: semaphoreSchema,
  }),
  accionesRecomendadas: z.array(
    z.object({
      prioridad: z.number().int().min(1),
      accion: z.string(),
      plazo: z.string().optional(),
    }),
  ),
  legislacionCitada: z.array(
    z.object({
      norma: z.string(),
      articulo: z.string(),
      texto: z.string(),
      url: z.string().url().optional(),
    }),
  ),
  jurisprudencia: z.array(
    z.object({
      tribunal: z.string(),
      sentencia: z.string(),
      fecha: z.string(),
      resumen: z.string(),
    }),
  ),
  confidenceScore: z.number().min(0).max(1),
  disclaimer: z.string(),
  irac: z.object({
    issue: z.string(),
    rule: z.string(),
    application: z.string(),
    conclusion: z.string(),
  }),
});

export type LegalResponse = z.infer<typeof legalResponseSchema>;