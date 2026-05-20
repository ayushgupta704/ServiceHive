import User from '../users/user.model.js';
import type { IUserDocument } from '../users/user.model.js';
import type { RegisterDto } from './auth.interface.js';

class AuthRepository {
  /**
   * Find user by email
   * Used for login and registration check.
   * Returns a hydrated Mongoose document.
   */
  async findByEmail(email: string, includePassword = false): Promise<IUserDocument | null> {
    const query = User.findOne({ email });

    if (includePassword) {
      query.select('+password');
    }

    return query.exec();
  }

  /**
   * Find user by ID
   * Used for /me route and auth middleware.
   * Uses .lean() for performance when no document methods are needed.
   */
  async findById(id: string, useLean = false) {
    const query = User.findById(id);
    return useLean ? query.lean().exec() : query.exec();
  }

  /**
   * Create a new user
   */
  async create(userData: RegisterDto): Promise<IUserDocument> {
    return User.create(userData);
  }

  /**
   * Optimized existence check
   * Returns only the ID if user exists, reducing memory overhead.
   */
  async exists(email: string): Promise<boolean> {
    const user = await User.findOne({ email }).select('_id').lean().exec();
    return !!user;
  }
}

export default new AuthRepository();
