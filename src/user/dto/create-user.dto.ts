import { IToken, IUser } from "./user.dto";

export class CreateUserDto implements IUser {
    userId: string;
    tokens: IToken[];
    permissions: [string];
}
