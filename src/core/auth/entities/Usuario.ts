import { PasswordService } from "../service/PasswordService";

export class Usuario {
    private encryptedPassword: string;

    constructor(
        public readonly email: string,
        password: string,
        public readonly id_rol?: number,
        public readonly status?: number,
        isEncrypted: boolean = false 
    ) {
        this.encryptedPassword = isEncrypted ? password : PasswordService.encodePassword(password);
    }

    getEncryptedPassword(): string {
        return this.encryptedPassword;
    }

    comparePassword(plainPassword: string): boolean {
        return PasswordService.comparePasswords(plainPassword, this.encryptedPassword);
    }
}
