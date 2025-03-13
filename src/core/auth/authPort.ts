export default interface AuthPort {
    retrieveUser(authData: { username: string; }): Promise<any>;
}
