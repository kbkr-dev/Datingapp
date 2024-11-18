export interface User{
    userName: string;
    token: string;
    gender: string;
    knownAs: string;
    photoUrl?: string;
    roles: string[];
}