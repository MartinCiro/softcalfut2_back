import bcrypt from 'bcryptjs';
import config from '../../../config';

export class PasswordService {
  static encodePassword(password: string): string {
    const saltRounds = config.SALT?.toString() ? parseInt(config.SALT) : 10; 
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  static comparePasswords(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}
