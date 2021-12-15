import { IToken, IUser } from '../../user/dto/user.dto'

export interface IJwtToken {
    permissions: [string];
    iat: number;
    exp: number;
    sub: string;
}