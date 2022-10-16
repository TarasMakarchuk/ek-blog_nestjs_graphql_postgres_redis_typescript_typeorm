import {ApolloError} from "apollo-server-core";
import { errorCodesGql } from "../enums/errorCodesGql";

export class UserNotFoundException extends ApolloError {
    constructor(message?: string, status?: string) {
        super(message || 'User is not found', status || errorCodesGql.BAD_USER_INPUT);
        Object.defineProperty(this, 'name', { value: 'UserNotFoundException' });
    }
}
