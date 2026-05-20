import { z } from 'zod';
import {
  VALIDATION_MESSAGES,
  PASSWORD_REGEX,
  PASSWORD_MIN_LENGTH,
} from '../../shared/constants/validation.constants.js';

export const registerSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(1, VALIDATION_MESSAGES.REQUIRED('Name'))
        .min(2, VALIDATION_MESSAGES.NAME_MIN(2))
        .max(50, VALIDATION_MESSAGES.NAME_MAX(50))
        .trim(),
      email: z
        .string()
        .min(1, VALIDATION_MESSAGES.REQUIRED('Email'))
        .email(VALIDATION_MESSAGES.INVALID_EMAIL)
        .lowercase()
        .trim(),
      password: z
        .string()
        .min(1, VALIDATION_MESSAGES.REQUIRED('Password'))
        .min(PASSWORD_MIN_LENGTH, VALIDATION_MESSAGES.PASSWORD_MIN(PASSWORD_MIN_LENGTH))
        .regex(PASSWORD_REGEX, VALIDATION_MESSAGES.PASSWORD_COMPLEXITY),
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .min(1, VALIDATION_MESSAGES.REQUIRED('Email'))
        .email(VALIDATION_MESSAGES.INVALID_EMAIL)
        .lowercase()
        .trim(),
      password: z
        .string()
        .min(1, VALIDATION_MESSAGES.REQUIRED('Password')),
    })
    .strict(),
});
