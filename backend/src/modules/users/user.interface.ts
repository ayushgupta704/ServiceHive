import { UserRole } from '../../shared/enums/user.enum.js';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}
