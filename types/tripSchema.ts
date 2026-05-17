import { z } from 'zod';

export const tripSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        3,
        'Title must be at least 3 characters'
      )
      .max(
        60,
        'Title must be at most 60 characters'
      ),

    destination: z
      .string()
      .trim()
      .min(
        1,
        'Destination is required'
      )
      .max(80),

    date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,

        'Use YYYY-MM-DD format'
         )
      .refine((value) => {
    const date =
      new Date(value);

    return (
      !isNaN(
        date.getTime()
      ) &&
      value ===
        date
          .toISOString()
          .split('T')[0]
    );
  }, 'Invalid calendar date'),

    rating: z
      .number()
      .int()
      .min(
        1,
        'Rate at least 1 star'
      )
      .max(5),

    imageUri:
      z.string().optional(),

    galleryUris:
      z
        .array(z.string())
        .optional(),
  });

export type TripFormData =
  z.infer<
    typeof tripSchema
  >;