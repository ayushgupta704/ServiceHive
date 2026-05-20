import bcrypt from 'bcryptjs';
import { AppError } from '../../core/errors/AppError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../core/utils/jwt.js';
import { AUTH_MESSAGES } from '../../shared/constants/auth.constants.js';
import authRepository from './auth.repository.js';
import type {
  RegisterDto,
  LoginDto,
  AuthResponse,
  AuthUserResponse,
  AuthTokens,
} from './auth.interface.js';
import type { IUserDocument } from '../users/user.model.js';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const isUserExists = await authRepository.exists(userData.email);
    if (isUserExists) {
      throw new AppError(AUTH_MESSAGES.USER_EXISTS, 400);
    }

    const user = await authRepository.create(userData);
    const tokens = this.generateAuthTokens(user);

    return this.buildAuthResponse(user, tokens);
  }

  /**
   * Login a user
   */
  async login(loginData: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Find user with password
    const user = await authRepository.findByEmail(email, true);

    // Timing attack protection: Always hash even if user not found
    // We create a dummy hash if user doesn't exist
    const dummyHash = '$2a$10$K9RPWb9S/E.D.vJ1M.Q.GuWbB6.1WbB6.1WbB6.1WbB6.1WbB6.1';
    const isValid = user ? await user.comparePassword(password) : await bcrypt.compare(password, dummyHash);

    if (!user || !isValid) {
      throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const tokens = this.generateAuthTokens(user);
    return this.buildAuthResponse(user, tokens);
  }

  /**
   * Get current user details
   */
  async getMe(userId: string): Promise<AuthUserResponse> {
    const user = await authRepository.findById(userId, true);

    if (!user) {
      throw new AppError(AUTH_MESSAGES.NOT_FOUND, 404);
    }

    // Since findById with useLean: true returns a plain object
    return user as unknown as AuthUserResponse;
  }

  /**
   * Refresh auth tokens
   */
  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    const decoded = verifyRefreshToken(refreshToken);
    
    // We don't use lean here because generateAuthTokens expects an IUserDocument
    // to access ._id.toString() and .toJSON(). We will fetch the actual document.
    const user = await authRepository.findById(decoded.id, false) as IUserDocument;
    
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists', 401);
    }

    const tokens = this.generateAuthTokens(user);
    return this.buildAuthResponse(user, tokens);
  }

  /**
   * Helper: Generate both Access and Refresh tokens
   */
  private generateAuthTokens(user: IUserDocument): AuthTokens {
    const userId = user._id.toString();
    
    return {
      accessToken: generateAccessToken({ id: userId, role: user.role }),
      refreshToken: generateRefreshToken({ id: userId }),
    };
  }

  /**
   * Helper: Standardize auth response structure
   */
  private buildAuthResponse(user: IUserDocument, tokens: AuthTokens): AuthResponse {
    return {
      user: user.toJSON() as AuthUserResponse,
      tokens,
    };
  }
}

export default new AuthService();
