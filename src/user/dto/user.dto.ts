export interface IUser {
    userId: string,
    tokens: IToken[],
    permissions: [string]
}

export interface IToken {
    createdAt: string,
    token: string
    isActive: boolean,
    lastUsed: string
}