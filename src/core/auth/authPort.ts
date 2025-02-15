interface AuthPort {
    retrieveUser(authData: { documento: number | string; }): Promise<any>;
}

export default AuthPort;
