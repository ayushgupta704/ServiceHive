import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

/**
 * Utility to smartly merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely extract error message from unknown error types
 */
export function getErrorMessage(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      // If it's a Zod validation error from the backend, extract the first specific field error
      return data.errors[0].message;
    }
    return data?.message || error.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return typeof error === 'string' ? error : defaultMessage;
}
