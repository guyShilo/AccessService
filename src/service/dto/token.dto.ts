import { IToken, IUser } from '../../user/dto/user.dto'

export interface IJwtToken extends IUser {
    userId: string;
    token: IToken;
    permissions: [string];
    iat: number;
    exp: number;
    sub: string;
}