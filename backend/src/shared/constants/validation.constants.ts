export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Invalid email format',
  PASSWORD_MIN: (min: number) => `Password must be at least ${min} characters`,
  PASSWORD_COMPLEXITY:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  NAME_MIN: (min: number) => `Name must be at least ${min} characters`,
  NAME_MAX: (max: number) => `Name cannot exceed ${max} characters`,
};

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const PASSWORD_MIN_LENGTH = 8;
