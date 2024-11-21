export interface Group{
    name: string;
    connections: Connection[]
}

export interface Connection{
    connectionIds: string;
    username: string;
}