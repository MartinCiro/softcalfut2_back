export default interface AuthPort {
    retrieveUser(authData: { documento: string; }): Promise<any>;
}
