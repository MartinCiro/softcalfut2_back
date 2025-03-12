export default interface AuthPort {
    retrieveUser(authData: { id: string; }): Promise<any>;
}
