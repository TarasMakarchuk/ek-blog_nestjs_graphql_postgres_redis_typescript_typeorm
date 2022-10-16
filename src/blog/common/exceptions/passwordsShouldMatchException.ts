import {ApolloError} from "apollo-server-core";
import { errorCodesGql } from "../enums/errorCodesGql";

export class PasswordsShouldMatchException extends ApolloError {
    constructor(message?: string, status?: string) {
        super(message || 'Passwords should match', status || errorCodesGql.BAD_USER_INPUT);
        Object.defineProperty(this, 'name', { value: 'PasswordsShouldMatchException' });
    }
}
