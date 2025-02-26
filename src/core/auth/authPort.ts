interface AuthPort {
    retrieveUser(authData: { email: string; }): Promise<any>;
}

export default AuthPort;
