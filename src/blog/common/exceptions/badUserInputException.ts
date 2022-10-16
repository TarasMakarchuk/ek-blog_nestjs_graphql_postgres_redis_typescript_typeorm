import {ApolloError} from "apollo-server-core";
import { errorCodesGql } from "../enums/errorCodesGql";

export class BadUserInputException extends ApolloError {
    constructor(message?: string, status?: string) {
        super(message || `Bad user input`, status || errorCodesGql.BAD_USER_INPUT);
        Object.defineProperty(this, 'name', { value: 'BadUserInputException' });
    }
}
