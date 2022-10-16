import {ApolloError} from "apollo-server-core";
import { errorCodesGql } from "../enums/errorCodesGql";

export class InvalidCredentialsException extends ApolloError {
    constructor(message?: string, status?: string) {
        super(message || 'Invalid user\'s credentials', status || errorCodesGql.BAD_USER_INPUT);
        Object.defineProperty(this, 'name', { value: 'InvalidCredentialsException' });
    }
}
