import {ApolloError} from "apollo-server-core";
import { errorCodesGql } from "../enums/errorCodesGql";

export class ForbiddenException extends ApolloError {
    constructor(message?: string, status?: string) {
        super(message || 'Forbidden', status || errorCodesGql.FORBIDDEN);
        Object.defineProperty(this, 'name', { value: 'ForbiddenException' });
    }
}
