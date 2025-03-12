import { PasswordService } from "../service/PasswordService";

export class Usuario {
    private encryptedPassword: string;

    constructor(
        public readonly username: string,
        password: string,
        public readonly id_rol?: number,
        public readonly id_estado?: number
    ) {
        this.encryptedPassword = password;
    }

    getEncryptedPassword(): string {
        return this.encryptedPassword;
    }

    comparePassword(plainPassword: string): boolean {
        return PasswordService.comparePasswords(plainPassword, this.encryptedPassword);
    }
}
