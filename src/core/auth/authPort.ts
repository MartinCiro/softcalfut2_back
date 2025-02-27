export default interface AuthPort {
    retrieveUser(authData: { email: string; }): Promise<any>;
}
