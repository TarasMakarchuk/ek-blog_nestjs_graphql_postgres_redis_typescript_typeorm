import {ApolloError} from "apollo-server-core";
import { errorCodesGql } from "../enums/errorCodesGql";

export class CantRegisterWithEmailException extends ApolloError {
    constructor(message?: string, status?: string) {
        super(message || `Can\'t register with this email address`, status || errorCodesGql.BAD_USER_INPUT);
        Object.defineProperty(this, 'name', { value: 'CantRegisterWithEmailException' });
    }
}
