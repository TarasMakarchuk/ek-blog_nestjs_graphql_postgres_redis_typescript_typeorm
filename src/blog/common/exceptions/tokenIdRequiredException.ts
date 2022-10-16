import {ApolloError} from "apollo-server-core";
import { errorCodesGql } from "../enums/errorCodesGql";

export class TokenIdRequiredException extends ApolloError {
    constructor(message?: string, status?: string) {
        super(message || 'Token id is required', status || errorCodesGql.BAD_USER_INPUT);
        Object.defineProperty(this, 'name', { value: 'TokenIdRequiredException' });
    }
}
