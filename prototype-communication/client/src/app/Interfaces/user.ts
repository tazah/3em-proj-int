export interface User {
    userId?: string;
    email: string;
    userName: string;
    password: string;
    passwordConfirmation: string;
    isConnected: boolean;
}

export interface ImportedUser {
    userId?: string;
    email: string;
    userName: string;
    password?: string;
    passwordConfirmation?: string;
    isConnected: boolean;
}
